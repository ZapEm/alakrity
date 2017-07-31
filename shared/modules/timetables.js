import * as Immutable from 'immutable'
import moment from 'moment'
import xss from 'xss'
import { REJECTED_NAME as FAILURE, RESOLVED_NAME as SUCCESS } from '../utils/constants'
import fetch from '../utils/fetcher'

import { LOGIN, LOGOUT } from './auth'

// action types:
const EDIT_MODE = 'alakrity/timetable/EDIT_MODE'
const CHANGE_TABLE = 'alakrity/timetable/CHANGE'
const CHANGE_SLOT_PROJECT_ID = 'alakrity/timetable/CHANGE_SLOT_PROJECT_ID'
const SET_CURRENT_PROJECT = 'alakrity/timetable/SET_CURRENT_PROJECT'

const LIST = 'alakrity/timetable/LIST'
const LOAD = 'alakrity/timetable/LOAD'
const CREATE = 'alakrity/timetable/CREATE'
const SAVE = 'alakrity/timetable/SAVE'

const REMOVE = 'alakrity/timetable/REMOVE'

// action creators:

export function changeTimetable(timetableInput = {}) {
    if ( timetableInput.title ) {
        timetableInput.title = xss(timetableInput.title)
    }
    return {
        type: CHANGE_TABLE,
        payload: timetableInput
    }
}
export function changeSlotProjectID(slotInput) {
    return {
        type: CHANGE_SLOT_PROJECT_ID,
        payload: slotInput
    }
}

export function enterEditMode() {
    return {
        type: EDIT_MODE
    }
}

export function setCurrentProject(projectID = '') {
    return {
        type: SET_CURRENT_PROJECT,
        payload: projectID
    }
}

export function listTimetables() {
    return {
        type: LIST,
        meta: {
            promise: fetch.get('timetables'),
            optimist: false
        }
    }
}
export function loadTimetable(id) {
    return {
        type: LOAD,
        meta: {
            promise: fetch.get('timetables', { id: id }),
            optimist: false
        }
    }
}

export function createTimetable(timetableInput) {
    timetableInput.title = xss(timetableInput.title)
    timetableInput.created = moment()

    return {
        type: CREATE,
        payload: timetableInput,
        meta: {
            promise: fetch.post('timetables', { data: timetableInput }),
            optimist: false
        }
    }
}

export function saveTimetable(timetableInput) {
    timetableInput.title = xss(timetableInput.title)
    timetableInput.lastEdited = moment()

    return {
        type: SAVE,
        payload: timetableInput,
        meta: {
            promise: fetch.post('timetables', { id: timetableInput.id, data: timetableInput }),
            optimist: true
        }
    }
}

export function removeTimetable(id) {
    return {
        type: REMOVE,
        payload: id,
        meta: {
            promise: fetch.delete('timetables', { id: id }),
            optimist: true
        }
    }
}

// REDUCER:
const initialState = Immutable.Map({
    isWorking: false,
    isSaved: true,
    editMode: false,
    currentProject: '',
    timetableList: Immutable.List(),
    timetable: Immutable.Map()
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case CHANGE_TABLE:
            return state.withMutations(state => {
                    state.update('timetable', timetable => timetable.mergeDeep(Immutable.fromJS(action.payload)))
                         .set('isSaved', false)
                }
            )

        case CHANGE_SLOT_PROJECT_ID:
            return state.setIn(['timetable', 'workPeriods', 'selection', action.payload.day, action.payload.slot],
                action.payload.projectID)

        case EDIT_MODE:
            return state.set('editMode', !state.get('editMode')) //TODO: remove toggling!

        case SET_CURRENT_PROJECT:
            return state.set('currentProject', action.payload)

        case LIST:
        case LOAD:
        case CREATE:
            return state.set('isWorking', true)

        case SAVE:
            return state.withMutations(state => {
                    state.set('timetable', Immutable.fromJS(action.payload))
                         .update('timetableList', list => list.map(
                             (item) => (item.get('id') === action.payload.id) ? Immutable.Map(
                                 {
                                     title: action.payload.title,
                                     id: action.payload.id
                                 }
                             ) : item
                             )
                         )
                         .set('isWorking', true)
                }
            )

        case REMOVE:
            return state.withMutations(state => {
                    state.set('timetable', Immutable.Map())
                         .set('isWorking', true)
                }
            )


        case LIST + SUCCESS:
            return state.withMutations(state => {
                    state.set('timetableList', Immutable.List(action.payload.data))
                         .set('isWorking', false)
                }
            )

        case LOAD + SUCCESS:
            return state.withMutations(state => {
                    state.set('timetable', Immutable.fromJS(action.payload.data))
                         .set('isWorking', false)
                }
            )

        case CREATE + SUCCESS:
            return state.withMutations(state => {
                    state.set('timetable', Immutable.fromJS(action.payload.data))
                         .update('timetableList', list => list.push(Immutable.Map(
                             {
                                 title: action.payload.data.title,
                                 id: action.payload.data.id
                             }
                         )))
                         .set('isSaved', true)
                         .set('isWorking', false)
                }
            )

        case SAVE + SUCCESS:
        case REMOVE + SUCCESS:
            return state.withMutations(state => {
                    state.set('editMode', false)
                         .set('isSaved', true)
                         .set('isWorking', false)
                }
            )


        case CREATE + FAILURE:
        case LOAD + FAILURE:
        case SAVE + FAILURE:
        case REMOVE + FAILURE:
            console.log('Error in Action', action.type, '>>>', action.payload)
            return state.set('isWorking', false)

        case LOGIN + SUCCESS:
            return state.withMutations(state => {
                    state.set('timetable', Immutable.fromJS(action.payload.data.timetable))
                         .set('timetableList', Immutable.fromJS(action.payload.data.timetableList))
                }
            )

        case LOGIN + FAILURE:
        case LOGOUT:
            return state.merge(initialState)


        default:
            return state
    }
}