import { RESOLVED_NAME as SUCCESS } from '/utils/constants'
import * as Immutable from 'immutable'
import * as _ from 'lodash/object'
import moment from 'moment'
import { SPECIAL_PROJECTS } from '../utils/constants'
import { STATISTIC_TYPES } from '../utils/enums'
import fetch from '../utils/fetcher'
import { getMascotSplash, SPLASH_TYPES } from '../utils/helpers'
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


export function recordCompleteTask(task, { time, rating }) {
    const completeDelay = moment(time).diff(moment(task.start).add(task.duration, 'minutes'), 'minutes')
    const weekDate = time.clone().startOf('isoWeek')

    return (dispatch) => {
        return Promise.all([
            dispatch(recordStatistic(
                {
                    type: STATISTIC_TYPES.TASK,
                    id: (task.repeating ? weekDate.format('YYYY-WW_') : '') + task.id,
                    completed: time,
                    rating: rating ? rating : false,
                    extended: task.extend ? task.extend : false,
                    completeDelay: completeDelay,
                    timeInProject: 0,
                    timeInBuffer: 0
                }
            )),
            dispatch(backendActions.mascotSplash(getMascotSplash(SPLASH_TYPES.COMPLETED, {
                completeDelay: completeDelay,
                rating: rating
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
    globalStatistics: {}
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case LOAD + SUCCESS:
            console.log(action.payload.data)
            return state.set('userStatistics', Immutable.fromJS(action.payload.data))

        case LOAD_GLOBAL + SUCCESS:
            return state.set('globalStatistics', Immutable.fromJS(action.payload.data))

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
 * @param projectPeriods
 * @returns {{inProject: number, inBuffer: number}}
 */
function getCoverage(started, completed, projectID, projectPeriods) {
    started = moment(started).startOf('minute')
    completed = moment(completed).startOf('minute')

    let periodProjectID
    let count = {
        inProject: 0,
        inBuffer: 0
    }

    let current = started.clone().startOf('hour').add((started.minutes() >= 30 ? 30 : 0), 'minutes')
    for ( current; current.isBefore(completed); current.add(30, 'minutes') ) {
        periodProjectID = momentToProjectID(current, projectPeriods)

        const coverType = (projectID === periodProjectID)
            ? 'inProject'
            : (projectID === SPECIAL_PROJECTS.BUFFER.key)
                              ? 'inBuffer'
                              : false

        if ( coverType !== false ) {
            if ( started.diff(current, 'minutes') < 30 && completed.diff(current, 'minutes') < 30 ) {
                count[coverType] += completed.diff(started, 'minutes')
            } else if ( started.diff(current, 'minutes') < 30 ) {
                count[coverType] += (30 - started.diff(current, 'minutes'))
            } else if ( completed.diff(current, 'minutes') < 30 ) {
                count[coverType] += (completed.diff(current, 'minutes'))
            } else {
                count[coverType] += 30
            }
        }
    }

    return count
}


function momentToProjectID(m, projectPeriods) {
    const day = m.isoWeekday() - 1
    const slot = m.hours() * 2 + Math.floor(m.minutes() / 30) // only for 2 step timetables

    return projectPeriods.selection[day][slot]
}