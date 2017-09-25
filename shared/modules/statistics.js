import * as Immutable from 'immutable'
import * as _ from 'lodash/object'
import { STATISTIC_TYPES } from '../utils/enums'
import fetch from '../utils/fetcher'
import moment from 'moment'
//import { ReminderModal } from '../components/misc/Modals/Modals'


/**
 * Action Types:
 * */

const LOAD = 'alakrity/statistics/LOAD'
const RECORD = 'alakrity/statistics/RECORD'
const REMOVE = 'alakrity/statistics/REMOVE'
const LOAD_GLOBAL = 'alakrity/statistics/LOAD'
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

export function recordBeginTask(task) {
    return (dispatch) => {
        const weekDate = moment(task.started).startOf('isoWeek')
        return dispatch(recordStatistic(
            {
                type: STATISTIC_TYPES.TASK,
                weekDate: weekDate,

                id: (task.repeating ? weekDate.format('YYYY-WW_') : '') + task.id,
                task: _.pick(task, ['id', 'projectID', 'start', 'duration', 'title', 'repeating', 'special']),
                started: task.started
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
                rating: rating ? rating : false
            }
        ))
    }
}

/**
 * Reducer:
 * */
const initialState = Immutable.fromJS({
    tasks: {
        number: 0
    }
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case BEGIN_TASK:
            return state.set('tasks', action.payload)

        default:
            return state
    }
}