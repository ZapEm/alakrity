import * as Immutable from 'immutable'
import * as _ from 'lodash/object'
import { STATISTIC_TYPES } from '../utils/enums'
import fetch from '../utils/fetcher'
import moment from 'moment'
import { RESOLVED_NAME as SUCCESS } from '/utils/constants'
import { compileUser } from '../functions/compileStatistics'
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

export function recordBeginTask(task, { started }) {
    return (dispatch) => {
        started = moment.isMoment(started) ? started : moment(started)
        started = started.isValid() ? started : moment()

        const weekDate = started.startOf('isoWeek')
        return dispatch(recordStatistic(
            {
                type: STATISTIC_TYPES.TASK,
                weekDate: weekDate,

                id: (task.repeating ? weekDate.format('YYYY-WW_') : '') + task.id,
                started: started,
                startDelay: moment(task.start).diff(started, 'minutes'),
                ...task.snooze !== 'none' && { snoozed: task.snooze },
                task: _.pick(task, ['id', 'projectID', 'start', 'duration', 'title', 'repeating', 'special']),

            }
        ))
    }
}


export function recordCompleteTask(task, { time, rating }) {
    return (dispatch) => {
        return dispatch(recordStatistic(
            {
                type: STATISTIC_TYPES.TASK,
                id: task.id,
                completed: time,
                rating: rating ? rating : false,
                extended: task.extend ? task.extend : false,
                completeDelay: moment(task.start).add(task.duration, 'minutes').diff(time, 'minutes')
            }
        ))
    }
}

export function removeRecordedTask(task) {
    return (dispatch) => {
        return dispatch(removeStatistic((task.repeating ? moment(task.started).startOf('isoWeek').format('YYYY-WW_') : '') + task.id))
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