import * as Immutable from 'immutable'
//import { ReminderModal } from '../components/misc/Modals/Modals'


/**
 * Action Types:
 * */

const SET_TIME = 'alakrity/backend/SET_TIME'
const ADD_MODAL = 'alakrity/backend/ADD_MODAL'
const REMOVE_MODAL = 'alakrity/backend/REMOVE_MODAL'
const UPDATE_UPCOMING_TASKS = 'alakrity/backend/UPDATE_UPCOMING_TASKS'

/**
 * Action Creators:
 * */

export function record(time) {
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

export function updateUpcomingTasks(taskList, time, lookahead = 10) {
    if ( taskList ) {

        const lookAheadDate = new Date(time.getTime() + (lookahead * 3600000))
        taskList = taskList.filter((task) => {
            const startTime = new Date(task.get('start'))
            return ( startTime >= time && startTime < lookAheadDate)
        })

        // create an OrderedMap in taskList order, with task.id as key and Modal-obj as value
        const modals = Immutable.OrderedMap(taskList.map((task) => [task.get('id'), new ReminderModal(task)]))

        return {
            type: UPDATE_UPCOMING_TASKS,
            payload: modals
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
 * Reducer:
 * */
const initialState = Immutable.fromJS({
    time: false,
    modalsOM: Immutable.OrderedMap()
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_TIME:
            return state.set('time', action.payload)

        case UPDATE_UPCOMING_TASKS:
        case ADD_MODAL:
            return state.withMutations((state) => state.set('modalsOM', state.get('modalsOM').merge(action.payload)))

        case REMOVE_MODAL:
            return state.deleteIn(['modalsOM', action.payload])

        default:
            return state
    }
}