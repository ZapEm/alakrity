import { REJECTED_NAME as FAILURE, RESOLVED_NAME as SUCCESS } from '/utils/constants'
import * as Immutable from 'immutable'
import * as _ from 'lodash/object'
import moment from 'moment'
import { SPECIAL_PROJECTS } from '../utils/constants'
import { STATISTIC_TYPES } from '../utils/enums'
import fetch from '../utils/fetcher'
import {
    getMapFromList, getMascotSplash, getProjectFromTask, getProjectWeekProgress, SPLASH_TYPES
} from '../utils/helpers'
import * as backendActions from './backend'
//import { ReminderModal } from '../components/misc/Modals/Modals'


/**
 * Action Types:
 * */

const LOAD = 'alakrity/statistics/LOAD'
const RECORD = 'alakrity/statistics/RECORD'
const REMOVE = 'alakrity/statistics/REMOVE'
const LOAD_GLOBAL = 'alakrity/statistics/LOAD_GLOBAL'
const BEGIN_TASK = 'alakrity/statistics/BEGIN_TASK'

/**
 * Action Creators:
 * */

export function loadStatistics() {
    return {
        type: LOAD,
        meta: {
            promise: fetch.get('statistics'),
            optimist: false
        }
    }
}

export function loadGlobalStatistics() {
    return {
        type: LOAD_GLOBAL,
        meta: {
            promise: fetch.get('globalstatistics'),
            optimist: false
        }
    }
}

export function recordStatistic(statistic) {
    return {
        type: RECORD,
        payload: statistic,
        meta: {
            promise: fetch.post('statistics', { data: statistic }),
            optimist: false
        }
    }
}


export function removeStatistic(id) {
    return {
        type: REMOVE,
        payload: id,
        meta: {
            promise: fetch.delete('statistics', { id: id }),
            optimist: false
        }
    }
}


/**
 * Thunks:
 * */

export function recordBeginTask(task, { started, isOver = false }) {
    return (dispatch) => {
        started = moment.isMoment(started) ? started : moment(started)

        const weekDate = started.clone().startOf('isoWeek')
        const startDelay = started.diff(moment(task.start), 'minutes')

        return Promise.all([
            dispatch(recordStatistic(
                {
                    type: STATISTIC_TYPES.TASK,
                    weekDate: weekDate,

                    id: (task.repeating ? weekDate.format('YYYY-WW_') : '') + task.id,
                    started: started,
                    startDelay: startDelay,
                    ...task.snooze !== 'none' && { snoozed: task.snooze },
                    task: _.pick(task, ['id', 'projectID', 'start', 'duration', 'title', 'repeating', 'special'])

                }
            )),
            (!isOver) ? [dispatch(backendActions.mascotSplash(getMascotSplash(SPLASH_TYPES.BEGIN, {
                startDelay: startDelay
            })))] : null
        ])
    }
}


export function recordCompleteTask(task, { rating, isOver = false }) {
    const completeDelay = moment(task.completed).diff(moment(task.start).add(task.duration, 'minutes'), 'minutes')
    const weekDate = task.completed.clone().startOf('isoWeek')

    return (dispatch, getState) => {

        const project = getProjectFromTask(task, getState().projects.get('projectList'))
        const progress = getProjectWeekProgress(project, getState().tasks.get('taskList'), task)

        let message = false
        if(progress){
            message = `You are ${progress.percentTimeDone}% done with the work for project ${project.get('title')} this week! (Task ${progress.count.done} of ${progress.count.total})`
        }

        return Promise.all([
            dispatch(recordStatistic(
                {
                    type: STATISTIC_TYPES.TASK,
                    id: (task.repeating ? weekDate.format('YYYY-WW_') : '') + task.id,
                    completed: task.completed,
                    rating: rating ? rating : false,
                    extended: task.extend ? task.extend : false,
                    completeDelay: completeDelay,
                    ...getCoverage(task.started, task.completed, task.projectID, getState().timetables.getIn(['timetable',
                                                                                                              'projectPeriods']))
                }
            )),
            dispatch(backendActions.mascotSplash(getMascotSplash((!isOver) ? SPLASH_TYPES.COMPLETED : SPLASH_TYPES.OVER, {
                completeDelay: completeDelay,
                startDelay: task.startDelay,
                rating: rating,
                message: message
            })))
        ])
    }
}

export function removeRecordedTask(task) {
    return (dispatch) => {
        return dispatch(removeStatistic((task.repeating ? moment(task.started).startOf('isoWeek').format('YYYY-WW_') :
                                         '') + task.id))
    }
}

/**
 * Reducer:
 * */
const initialState = Immutable.fromJS({
    userStatistics: {},
    globalStatistics: {},
    isWorkingMap: {
        load: false,
        loadGlobal: false
    }
})

export default function reducer(state = initialState, action) {
    switch (action.type) {

        case LOAD:
            return state.setIn(['isWorkingMap', 'load'], true)

        case LOAD_GLOBAL:
            return state.setIn(['isWorkingMap', 'load'], true)

        case LOAD + SUCCESS:
            return state.setIn(['isWorkingMap', 'load'], false)
                        .set('userStatistics', Immutable.fromJS(action.payload.data))

        case LOAD_GLOBAL + SUCCESS:
            return state.setIn(['isWorkingMap', 'loadGlobal'], false)
                        .set('globalStatistics', Immutable.fromJS(action.payload.data))

        case LOAD + FAILURE:
            return state.setIn(['isWorkingMap', 'load'], false)

        case LOAD_GLOBAL + FAILURE:
            return state.setIn(['isWorkingMap', 'loadGlobal'], false)

        default:
            return state
    }
}


/**
 * Helpers:
 * */


/**
 * Computes the time a task was worked on in Project or Buffer periods - in minutes.
 * @param started
 * @param completed
 * @param projectID
 * @param projectPeriods from state.timetables.get('timetable')
 * @returns {{timeInProject: number, timeInBuffer: number}}
 */
function getCoverage(started, completed, projectID, projectPeriods) {
    started = moment(started).startOf('minute')
    completed = moment(completed).startOf('minute')

    let periodProjectID
    let coveredTimes = {
        timeInProject: 0,
        timeInBuffer: 0
    }

    let current = started.clone().startOf('hour').add((started.minutes() >= 30 ? 30 : 0), 'minutes')
    for ( current; current.isBefore(completed); current.add(30, 'minutes') ) {
        periodProjectID = momentToProjectID(current, projectPeriods)

        // select were to add the worked time. Has to match the count Object.
        const coverType = (periodProjectID === projectID)
            ? 'timeInProject'
            : (periodProjectID === SPECIAL_PROJECTS._BUFFER.key)
                              ? 'timeInBuffer'
                              : false

        if ( coverType !== false ) {
            const startedToCurrent = started.diff(current, 'minutes')
            const completedFromCurrent = completed.diff(current, 'minutes')

            if ( 0 < startedToCurrent && startedToCurrent < 30 && 0 < completedFromCurrent && completedFromCurrent < 30 ) {
                // whole task worked inside one slot
                coveredTimes[coverType] += completed.diff(started, 'minutes')
            } else if ( 0 < startedToCurrent && startedToCurrent < 30 ) {
                // started after slot start
                coveredTimes[coverType] += (30 - startedToCurrent)
            } else if ( 0 < completedFromCurrent && completedFromCurrent < 30 ) {
                // completed before slot end
                coveredTimes[coverType] += completedFromCurrent
            } else {
                // fully filling slot
                coveredTimes[coverType] += 30
            }
        }
    }
    return coveredTimes
}


function momentToProjectID(m, projectPeriods) {
    const day = m.isoWeekday() - 1
    const slot = m.hours() * 2 + Math.floor(m.minutes() / 30) // only for 2 step timetables

    return projectPeriods.get('selection').toJS()[day][slot]
}