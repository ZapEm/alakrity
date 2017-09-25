import { fromJS, List, OrderedMap } from 'immutable'
import moment from 'moment'
import { getTaskModal } from '../components/misc/modals/Modals'
import { MASCOT_STATUS, TASK_STATUS } from '../utils/enums'
import { getTaskStatus } from '../utils/helpers'


/**
 * Action Types:
 * */

const SET_TIME = 'alakrity/backend/SET_TIME'
const ADD_MODAL = 'alakrity/backend/ADD_MODAL'
const REMOVE_MODAL = 'alakrity/backend/REMOVE_MODAL'
const UPDATE_UPCOMING_TASKS = 'alakrity/backend/UPDATE_UPCOMING_TASKS'
const SET_MASCOT = 'alakrity/backend/SET_MASCOT'
const SEND_NOTIFICATION = 'alakrity/backend/SEND_NOTIFICATION'

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

export function setMascotStatus(mascotStatus = MASCOT_STATUS.IDLE, setOverride = false) {

    if ( !MASCOT_STATUS[mascotStatus] && !setOverride ) {
        console.warn('INVALID MASCOT STATUS')
        mascotStatus = MASCOT_STATUS.IDLE
    }

    return {
        type: SET_MASCOT,
        payload: mascotStatus,
        meta: { override: setOverride }
    }
}

export function getUpcomingTasks(taskList, time, lookaheadMinutes = 5, initial = false) {
    if ( taskList ) {
        const checkMoment = moment(time).add(lookaheadMinutes, 'minutes')
        const thisWeek = moment(time).startOf('isoWeek')

        let groupedTasks = taskList.filter(task =>
                                       (
                                           [
                                               TASK_STATUS.ACTIVE.key,
                                               TASK_STATUS.SCHEDULED.key,
                                               TASK_STATUS.SNOOZED.key
                                           ].indexOf(getTaskStatus(task, thisWeek)) !== -1))
                                   .groupBy(task => getTaskStatus(task, thisWeek))

        groupedTasks = groupedTasks.withMutations(
            groupedTasks => {
                groupedTasks.update(TASK_STATUS.SCHEDULED.key, list => list ? list.filter(task => {
                    const start = moment(task.get('start'))
                    return start.isSameOrBefore(checkMoment)
                }) : List())
                groupedTasks.update(TASK_STATUS.SNOOZED.key, list => list ? list.filter(task => {
                    const snoozedStart = moment(task.get('start'))
                        .add(task.has('snooze') ? task.get('snooze') : 0, 'minutes')
                    return snoozedStart.isSameOrBefore(checkMoment)
                }) : List())
                groupedTasks.update(TASK_STATUS.ACTIVE.key, list => list ? list.filter(task => {
                    const end = moment(task.get('start')).add(task.get('duration'), 'minutes')
                    return end.isSameOrBefore(checkMoment)
                }) : List())
            })

        const modals = OrderedMap()
            .concat(groupedTasks.get(TASK_STATUS.SCHEDULED.key)
                                .map(task => ((modal) => [modal.id, modal])(getTaskModal(task, thisWeek))))
            .concat(groupedTasks.get(TASK_STATUS.SNOOZED.key)
                                .map(task => ((modal) => [modal.id, modal])(getTaskModal(task, thisWeek))))
            .concat(groupedTasks.get(TASK_STATUS.ACTIVE.key)
                                .map(task => ((modal) => [modal.id, modal])(getTaskModal(task, thisWeek))))
            .sortBy(modal => modal.date,
                (date1, date2) => {
                    if ( date1.isBefore(date2) ) { return -1 }
                    if ( date1.isAfter(date2) ) { return 1 }
                    if ( date1.isSame(date2) ) { return 0 }
                })

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

        //const mascotStatus = getState().backend.get('mascotStatus')
        return (initial)
            ? Promise.all([
                dispatch(getUpcomingTasks(taskList, time, 5, initial)),
                dispatch(mascotSplash(MASCOT_STATUS.HI, 5))
            ])
            : dispatch(getUpcomingTasks(taskList, time, 5, initial))
    }
}

export function mascotSplash(mascotStatus, seconds = 5) {
    return (dispatch) => {

        setTimeout(() => dispatch(setMascotStatus(false, true)), seconds * 1000)

        return dispatch(setMascotStatus(mascotStatus, true))
    }
}


/**
 * Reducer:
 * */
const initialState = fromJS({
    mascotStatus: MASCOT_STATUS.IDLE,
    mascotStatusOverride: false,
    time: false,
    modalsOM: OrderedMap()
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_TIME:
            return state.set('time', action.payload)

        case UPDATE_UPCOMING_TASKS:
            if ( action.meta && action.meta.initial ) {
                return state.set('modalsOM', action.payload)
            }
            return state.set('modalsOM', action.payload)

        case ADD_MODAL:
            return state.set('modalsOM', state.get('modalsOM').merge(action.payload))

        case REMOVE_MODAL:
            return state.deleteIn(['modalsOM', action.payload])

        case SET_MASCOT:
            return state.set(action.meta.override ? 'mascotStatusOverride' : 'mascotStatus', action.payload)

        default:
            return state
    }
}

// const taskGroups = {
//     [TASK_STATUS.SCHEDULED]: 'remind',
//     [TASK_STATUS.WAITING]: 'remind',
//     [TASK_STATUS.ACTIVE]: 'active',
//     [TASK_STATUS.DONE]: 'ignore',
//     [TASK_STATUS.SNOOZED]: 'snoozed'
// }