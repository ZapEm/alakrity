import { fromJS, List } from 'immutable'
import moment from 'moment'
import { getTaskModal } from '../components/misc/modals/Modals'
import { MASCOT_STATUS, projectToMascotStatusMap, TASK_STATUS } from '../utils/enums'
import { getMascotStatusFromProjectType, getProjectTypeFromTask, getTaskStatus } from '../utils/helpers'


/**
 * Action Types:
 * */

const SET_TIME = 'alakrity/backend/SET_TIME'
const ADD_MODAL = 'alakrity/backend/ADD_MODAL'
const REMOVE_MODAL = 'alakrity/backend/REMOVE_MODAL'
export const UPDATE_UPCOMING_TASKS = 'alakrity/backend/UPDATE_UPCOMING_TASKS'
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

export function getUpcomingTasks(taskList, time, lookaheadMinutes = 0, initial = false) {
    return (dispatch, getState) => {
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

            // snatch Project Type for MascotStatus before filtering active tasks!
            const projectType = getProjectTypeFromTask(groupedTasks.has(TASK_STATUS.ACTIVE.key) && groupedTasks.get(TASK_STATUS.ACTIVE.key).size > 0
                ? groupedTasks.get(TASK_STATUS.ACTIVE.key).first() : false, getState().projects.get('projectList'))
            // ------

            groupedTasks = groupedTasks.withMutations(
                groupedTasks => {
                    groupedTasks.update(TASK_STATUS.SCHEDULED.key, list => list ? list.filter(task => {
                        const start = moment(task.get('start'))
                        return start.isSameOrBefore(checkMoment)
                    }) : List())
                    groupedTasks.update(TASK_STATUS.SNOOZED.key, list => list ? list.filter(task => {
                        const snoozedStart = moment(task.get('start'))
                            .add(task.get('snooze') ? task.get('snooze') : 0, 'minutes')
                        return snoozedStart.isSameOrBefore(time)
                    }) : List())
                    groupedTasks.update(TASK_STATUS.ACTIVE.key, list => list ? list.filter(task => {
                        const end = moment(task.get('start'))
                            .add(task.get('duration') + (task.get('extend') ? task.get('extend') : 0), 'minutes')
                        return end.isSameOrBefore(checkMoment)
                    }) : List())
                })

            const modals = List()
                .concat(groupedTasks.get(TASK_STATUS.SCHEDULED.key)
                                    .map(task => getTaskModal(task, thisWeek, time)))
                .concat(groupedTasks.get(TASK_STATUS.SNOOZED.key)
                                    .map(task => getTaskModal(task, thisWeek, time)))
                .concat(groupedTasks.get(TASK_STATUS.ACTIVE.key)
                                    .map(task => getTaskModal(task, thisWeek, time)))
                .sortBy(modal => modal.date,
                    (date1, date2) => {
                        if ( date1.isBefore(date2) ) { return -1 }
                        if ( date1.isAfter(date2) ) { return 1 }
                        if ( date1.isSame(date2) ) { return 0 }
                    })



            return Promise.all([
                dispatch({
                    type: UPDATE_UPCOMING_TASKS,
                    payload: {
                        modalsList: modals
                    },
                    ...initial && { meta: { initial: true } }
                }),
                dispatch(setMascotStatus(getMascotStatusFromProjectType(projectType)))
            ])
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
                dispatch(getUpcomingTasks(taskList, time, 0, initial)),
                dispatch(mascotSplash(MASCOT_STATUS.HI, 5))
            ])
            : dispatch(getUpcomingTasks(taskList, time, 0, initial))
    }
}

export function mascotSplash(mascotStatus, seconds = 7) {
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
    modalsList: List()
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_TIME:
            return state.set('time', action.payload)

        case UPDATE_UPCOMING_TASKS:
            // if ( action.meta && action.meta.initial ) {
            //     return state.set('modalsList', action.payload.modals)
            // }
            return state.set('modalsList', action.payload.modalsList)

        case ADD_MODAL:
            return state.set('modalsList', state.get('modalsList').push(action.payload))

        case REMOVE_MODAL:
            return (index => {
                return index !== -1
                    ? state.deleteIn(['modalsList', index])
                    : state
            })(state.get('modalsList').findIndex(modal => modal.id === action.payload))

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