import { RESOLVED_NAME as SUCCESS } from '/utils/constants'
import * as Immutable from 'immutable'
import * as _ from 'lodash/object'
import moment from 'moment'
import { compileUser } from '../functions/compileStatistics'
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

    return (dispatch) => {
        return Promise.all([
            dispatch(recordStatistic(
                {
                    type: STATISTIC_TYPES.TASK,
                    id: task.id,
                    completed: time,
                    rating: rating ? rating : false,
                    extended: task.extend ? task.extend : false,
                    completeDelay: completeDelay
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
            return state.set('userStatistics', compileUser(action.payload.data))

        case LOAD_GLOBAL + SUCCESS:
            return state.set('globalStatistics', Immutable.fromJS(action.payload.data))

        default:
            return state
    }
}

