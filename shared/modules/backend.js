import * as Immutable from 'immutable'
import { ReminderModal } from '../components/misc/Modals/Modals'
import { REJECTED_NAME as FAILURE, RESOLVED_NAME as SUCCESS } from '../utils/constants'
import { MASCOT_STATUS, TASK_STATUS } from '../utils/enums'
import { LOGIN, LOGOUT } from './auth'


/**
 * Action Types:
 * */

const SET_TIME = 'alakrity/backend/SET_TIME'
const ADD_MODAL = 'alakrity/backend/ADD_MODAL'
const REMOVE_MODAL = 'alakrity/backend/REMOVE_MODAL'
const UPDATE_UPCOMING_TASKS = 'alakrity/backend/UPDATE_UPCOMING_TASKS'
const SET_MASCOT = 'alakrity/backend/SET_MASCOT'

/**
 * Action Creators:
 * */

export function setCurrentTime(time) {
    return {
        type: SET_TIME,
        payload: time
    }
}

export function addModal(modal) {
    return {
        type: ADD_MODAL,
        payload: modal
    }
}

export function setMascotStatus(mascotStatus = MASCOT_STATUS.IDLE) {

    if ( !MASCOT_STATUS[mascotStatus] ) {
        console.warn('INVALID MASCOT STATUS')
        mascotStatus = MASCOT_STATUS.IDLE
    }

    return {
        type: SET_MASCOT,
        payload: mascotStatus
    }
}

export function getUpcomingTasks(taskList, time, lookahead = 10, initial = false) {
    if ( taskList ) {

        const lookAheadDate = new Date(time.getTime() + (lookahead * 3600000))
        taskList = taskList.filter((task) => {
            if ( task.get('status') && TASK_STATUS.SCHEDULED !== task.get('status') ) {
                return false
            }
            const startTime = new Date(task.get('start'))
            return ( startTime >= time && startTime < lookAheadDate)
        })

        // create an OrderedMap in taskList order, with task.id as key and Modal-obj as value
        const modals = Immutable.OrderedMap(taskList.map((task) => [task.get('id'), new ReminderModal(task)]))

        return {
            type: UPDATE_UPCOMING_TASKS,
            payload: modals,
            ...initial && { meta: { initial: true } }
        }
    }
}

export function removeModal(modal) {
    return {
        type: REMOVE_MODAL,
        payload: modal.id
    }
}


/**
 * Thunks:
 */

export function updateModals(time = false, initial = false) {
    return (dispatch, getState) => {
        const taskList = getState().tasks.get('taskList')
        time = time ? time
            : getState().backend.get('time') ? getState().backend.get('time')
                   : new Date()

        return dispatch(getUpcomingTasks(taskList, time, 10, initial))
    }
}

/**
 * Reducer:
 * */
const initialState = Immutable.fromJS({
    mascotStatus: MASCOT_STATUS.HI,
    time: false,
    modalsOM: Immutable.OrderedMap()
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_TIME:
            return state.set('time', action.payload)

        case UPDATE_UPCOMING_TASKS:
            if ( action.meta && action.meta.initial ) {
                return state.set('modalsOM', action.payload)
            }
            return state.withMutations((state) =>
                state.set('modalsOM', action.payload)
                     .set('mascotStatus', (action.payload.first() ?
                                           action.payload.first().type :
                                           MASCOT_STATUS.IDLE))
            )

        case ADD_MODAL:
            return state.withMutations((state) => state.set('modalsOM', state.get('modalsOM').merge(action.payload)))

        case REMOVE_MODAL:
            return state.deleteIn(['modalsOM', action.payload])

        case SET_MASCOT:
            return state.set('mascotStatus', action.payload)

        case LOGIN + SUCCESS:
            return state.set('mascotStatus', MASCOT_STATUS.HI)

        case LOGIN + FAILURE:
            return state.set('mascotStatus', MASCOT_STATUS.DENIED)

        case LOGOUT:
            return state.set('mascotStatus', MASCOT_STATUS.BYE)

        default:
            return state
    }
}