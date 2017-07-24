import * as Immutable from 'immutable'
import { merge as _merge } from 'lodash/object'
import moment from 'moment'
import xss from 'xss'
import { REJECTED_NAME as FAILURE, RESOLVED_NAME as SUCCESS } from '../utils/constants'
import fetch from '../utils/fetcher'
//import { generateTempIDfromDate as tempID } from '../utils/tempID'

import { LOGIN, LOGOUT } from './auth'
import newId from '../utils/newId'

// action types:
const LOAD = 'alakrity/tasks/LOAD'
const CREATE = 'alakrity/tasks/CREATE'
const EDIT = 'alakrity/tasks/EDIT'
const REMOVE = 'alakrity/tasks/REMOVE'

// action creators:

export function loadTasks() {
    return {
        type: LOAD,
        meta: {
            promise: fetch.get('tasks'),
            optimist: false
        }
    }
}

export function createTask(taskInput) {

    taskInput.text = xss(taskInput.text)
    taskInput.created = moment()

    return {
        type: CREATE,
        payload: _merge({ id: newId('TEMP_ID_') /*tempID(taskInput.created)*/ }, taskInput),
        meta: {
            promise: fetch.post('tasks', { data: taskInput }),
            optimist: true
        }
    }
}

export function editTask(taskInput) {

    taskInput.text = xss(taskInput.text)
    taskInput = _merge({}, taskInput, { lastEdited: moment() })

    if ( !taskInput.id || taskInput.id.startsWith('TEMP_ID_') ) {
        return {
            type: EDIT + FAILURE,
            payload: new Error('Can\'t edit task, it has not been saved on the server yet.')
        }
    }

    return {
        type: EDIT,
        payload: taskInput,
        meta: {
            promise: fetch.post('tasks', { id: taskInput.id, data: taskInput }),
            optimist: true
        }
    }
}

export function removeTask(id) {

    if ( !id || id.startsWith('TEMP_ID_') ) {
        return {
            type: REMOVE + FAILURE,
            payload: new Error('Can\'t remove task, it has not been saved on the server yet.')
        }
    }

    return {
        type: REMOVE,
        payload: id,
        meta: {
            promise: fetch.delete('tasks', { id: id }),
            optimist: true
        }
    }
}


// REDUCER:
const initialState = Immutable.fromJS({
    isWorking: false,
    taskList: []
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case LOAD:
            return state.set('isWorking', true)

        case CREATE:
            return state.set('taskList', state.get('taskList').push(Immutable.Map(action.payload)))
                        .set('isWorking', true)

        case EDIT:
            return state.set('taskList', state.get('taskList').map(task =>
                            (task.get('id') === action.payload.id) ? task.merge(action.payload) : task))
                        .set('isWorking', true)

        case REMOVE:
            return state.set('taskList', state.get('taskList').filterNot(task => task.get('id') === action.payload))
                        .set('isWorking', true)


        case LOAD + SUCCESS:
            return state.set('taskList', Immutable.fromJS((action.payload.data !== '') ? action.payload.data : []))
                        .set('isWorking', false)

        case EDIT + SUCCESS:
        case REMOVE + SUCCESS:
            return state.set('isWorking', false)

        case CREATE + SUCCESS:
            return ((state.getIn(['taskList', -1, 'id']) === action.meta.payload.id)
                ? state.setIn(['taskList', -1, 'id'], action.payload.data.id)
                : state.set('taskList', state.get('taskList').map((task) => ((task.get('id') === action.meta.payload.id)
                    ? Immutable.Map(action.payload.data)
                    : task))))
                .set('isWorking', false)


        case LOAD + FAILURE:
        case CREATE + FAILURE:
        case EDIT + FAILURE:
        case REMOVE + FAILURE:
            console.log('Error in Action', action.type, '>>>', action.payload)
            return state.set('isWorking', false)

        case LOGIN + SUCCESS:
            return state.set('taskList', Immutable.fromJS(action.payload.data.tasks))

        case LOGIN + FAILURE:
        case LOGOUT:
            return state.set('taskList', Immutable.fromJS([]))

        default:
            return state
    }
}