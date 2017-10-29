import Immutable from 'immutable'
import * as _ from 'lodash/object'
import { merge as _merge } from 'lodash/object'
import moment from 'moment'
import xss from 'xss'
import { REJECTED_NAME as FAILURE, RESOLVED_NAME as SUCCESS } from '../utils/constants'
import { TASK_STATUS } from '../utils/enums'
import fetch from '../utils/fetcher'
import { dayTasksFilter, getTaskDayFilter, taskDayFilters } from '../utils/helpers'
import newId from '../utils/newId'
import { LOGIN, LOGOUT } from './auth'
import { REMOVE as REMOVE_PROJECT } from './projects'

import * as backendActions from './backend'
import { updateModals } from './backend'
import * as statistics from './statistics'
import { removeRecordedTask } from './statistics'


// action types:

const LOAD = 'alakrity/tasks/LOAD'
export const CREATE = 'alakrity/tasks/CREATE'
export const QUICK_ADD = 'alakrity/tasks/QUICK_ADD'
export const EDIT = 'alakrity/tasks/EDIT'
export const REMOVE = 'alakrity/tasks/REMOVE'
export const BEGIN = 'alakrity/tasks/BEGIN'


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

    if ( Immutable.Map.isMap(taskInput) ) {
        console.log('was Map')
        taskInput = taskInput.toJS()
    }

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

export function quickAddTask(project, repeating = false) {
    if ( !Immutable.Map.isMap(project) ) {project = Immutable.Map(project)}

    const taskInput = {
        text: '',
        projectID: project.get('id'),
        repeating: repeating,
        special: false,
        created: moment(),
        status: !repeating ? TASK_STATUS.DEFAULT.key : {},
        duration: 120,
        start: null
    }

    return {
        type: QUICK_ADD,
        payload: _merge({
            id: newId('TEMP_ID_'),
            editing: true
        }, taskInput),
        meta: {
            promise: fetch.post('tasks', { data: taskInput }),
            optimist: true
        }
    }
}

export function editTask(taskInput) {
    if ( Immutable.Map.isMap(taskInput) ) {
        taskInput = taskInput.toJS()
    }

    taskInput.text = xss(taskInput.text)
    taskInput = _merge({}, taskInput, { lastEdited: moment() })
    delete taskInput.editing

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


// thunks (meta actions):

export function editTaskStart(newTask) {
    return (dispatch, getState) => {
        const newStart = moment(newTask.start)
        const newEnd = newStart.clone().add(newTask.duration, 'm')

        if ( !newTask.repeating ) {
            newTask.status = computeTaskStatus(newTask, newStart)
        } else {
            if ( typeof newTask.status === 'string' ) {
                newTask.status = {}
            }
            newTask.status[moment().startOf('isoWeek')] = computeTaskStatus(newTask, newStart)
        }

        const sameDayTasks = (getState().timetables.get('editMode')) ?
                             getState().tasks.get('taskList').filter((task) => (
                                 task.get('repeating') && dayTasksFilter(task, newStart)
                             )) :
                             getState().tasks.get('taskList').filter((task) => (dayTasksFilter(task, newStart)))

        const found = sameDayTasks.find(
            (task) => {
                const taskStart = moment(task.get('start'))
                const taskEnd = taskStart.clone().add(task.get('duration'), 'm')

                return (
                    (task.get('id') !== newTask.id) &&
                    (newStart.isBetween(taskStart, taskEnd, 'm', '()') || newEnd.isBetween(taskStart, taskEnd, 'm', '()'))
                )
            },
            null, // context
            false // default, if nothing is found
        )
        if ( !found ) {
            return dispatch(editTask(newTask))
        }
    }
}

export function rescheduleTask(task, started = false) {
    if ( Immutable.Map.isMap(task) ) {
        task = task.toJS()
    }
    return (dispatch) => {
        const updatedTask = _.merge({}, task, {
            start: null,
            status: task.repeating
                ? { [moment().startOf('isoWeek')]: TASK_STATUS.DEFAULT.key }
                : TASK_STATUS.DEFAULT.key,
            started: false,
            completed: false,
            snooze: false,
            extend: false
        })

        return started
            ? Promise.all([
                dispatch(editTask(updatedTask)),
                dispatch(removeRecordedTask(task)),
                dispatch(updateModals())])
            : Promise.all([
                dispatch(editTask(updatedTask)),
                dispatch(updateModals())])
    }

}

export function beginTask(task) {

    if ( Immutable.Map.isMap(task) ) {
        task = task.toJS()
    }

    return (dispatch) => {

        task = _merge({}, task, {
            status: task.repeating
                ? { [moment().startOf('isoWeek')]: TASK_STATUS.ACTIVE.key }
                : TASK_STATUS.ACTIVE.key,
            started: moment()
        })

        return dispatch(editTask(task))
            .then(Promise.all([
                    dispatch(backendActions.updateModals()),
                    dispatch(statistics.recordBeginTask(task, { started: task.started }))
                ])
            )

    }
}

export function snoozeTask(task, snoozeMinutes = 15) {

    if ( Immutable.Map.isMap(task) ) {
        task = task.toJS()
    }

    return (dispatch) => {

        task = _merge({}, task, {
            status: task.repeating
                ? { [moment().startOf('isoWeek')]: TASK_STATUS.SNOOZED.key }
                : TASK_STATUS.SNOOZED.key,
            snooze: task.snooze ? 0 + task.snooze + snoozeMinutes : snoozeMinutes
        })

        return dispatch(editTask(task))
            .then(dispatch(backendActions.updateModals()))
    }
}

export function extendTask(task, extendMinutes = 15) {

    if ( Immutable.Map.isMap(task) ) {
        task = task.toJS()
    }

    return (dispatch) => {

        task = _merge({}, task, {
            extend: task.extend ? 0 + task.extend + extendMinutes : extendMinutes
        })

        return dispatch(editTask(task))
            .then(dispatch(backendActions.updateModals()))
    }
}

export function confirmOverTask(task, { rating, completed, started }) {
    if ( Immutable.Map.isMap(task) ) {
        task = task.toJS()
    }

    task = _merge({}, task, {
        started: started,
        completed: completed,
        status: task.repeating
            ? { [moment().startOf('isoWeek')]: TASK_STATUS.DONE.key }
            : TASK_STATUS.DONE.key
    })


    return (dispatch, getState) => {
        return dispatch(editTask(task)).then(Promise.all([
            dispatch(backendActions.updateModals()),
            dispatch(statistics.recordBeginTask(task, { started: started, isOver: true }))
                .then(dispatch(statistics.recordCompleteTask(task, { rating: rating })))
        ]))
    }
}

export function removeOverTask(task) {
    return (dispatch) => {
        return dispatch(removeTask(Immutable.Map.isMap(task) ? task.get('id') : task.id))
            .then(dispatch(backendActions.updateModals()))
    }

}

export function completeTask(task, options = { rating: false }) {

    if ( Immutable.Map.isMap(task) ) {
        task = task.toJS()
    }

    return (dispatch, getState) => {

        task = _merge({}, task, {
            completed: moment(),
            status: task.repeating
                ? { [moment().startOf('isoWeek')]: TASK_STATUS.DONE.key }
                : TASK_STATUS.DONE.key
        })

        return dispatch(editTask(task))
            .then(Promise.all([
                    dispatch(backendActions.updateModals()),
                    dispatch(statistics.recordCompleteTask(task, options))
                ])
            )
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
        case QUICK_ADD:
            return state.set('taskList', state.get('taskList').push(Immutable.Map(action.payload)))
                        .set('isWorking', true)

        case EDIT:
            return state.set('taskList', state.get('taskList').map(task =>
                            (task.get('id') === action.payload.id) ? task.merge(action.payload).delete('editing') : task))
                        .set('isWorking', true)

        case REMOVE:
            return state.set('taskList', state.get('taskList').filterNot(task => task.get('id') === action.payload))
                        .set('isWorking', true)

        case REMOVE_PROJECT:
            return state.set('taskList', state.get('taskList').filterNot(task => task.get('projectID') === action.payload))


        case LOAD + SUCCESS:
            return state.set('taskList', Immutable.fromJS((action.payload.data !== '') ? action.payload.data : []))
                        .set('isWorking', false)

        case EDIT + SUCCESS:
        case REMOVE + SUCCESS:
            return state.set('isWorking', false)

        case CREATE + SUCCESS:
        case QUICK_ADD + SUCCESS:
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

function computeTaskStatus(newTask, newStart) {

    const thisWeek = moment().startOf('isoWeek')

    if ( !newTask.repeating ) {
        //Schedule task if appropriate
        if ( (!newTask.status || newTask.status === TASK_STATUS.DEFAULT.key) ) {
            // if ( newStart.isAfter() ) {
            return TASK_STATUS.SCHEDULED.key
            // } else {
            //     return (confirm('You are trying to schedule a task in the past. ' +
            //         'This will cause you to miss its start time. \n\n' +
            //         'Do you want to mark the task as done to avoid this?')) ?
            //            TASK_STATUS.DONE.key :
            //            TASK_STATUS.SCHEDULED.key
            // }
        }
    } else {
        //Schedule repeating task if appropriate
        if ( (!newTask.status || !newTask.status[thisWeek] !== TASK_STATUS.DEFAULT.key) ) {
            // if ( newStart.isAfter() ) {
            return TASK_STATUS.SCHEDULED.key
            // } else {
            //     return (confirm('You are trying to schedule a task in the past. ' +
            //         'This will cause you to miss its start time. \n\n' +
            //         'Do you want to mark the task as done to avoid this?')) ?
            //            TASK_STATUS.DONE.key :
            //            TASK_STATUS.SCHEDULED.key
            // }
        }
    }


//default
    return newTask.status && typeof newTask.status === 'string' ? newTask.status : TASK_STATUS.DEFAULT.key
}