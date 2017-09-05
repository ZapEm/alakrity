import Immutable from 'immutable'
import { merge as _merge } from 'lodash/object'
import moment from 'moment'
import xss from 'xss'
import { REJECTED_NAME as FAILURE, RESOLVED_NAME as SUCCESS } from '../utils/constants'
import fetch from '../utils/fetcher'
import newId from '../utils/newId'

import { LOGIN, LOGOUT } from './auth'


// action types:
const LOAD = 'alakrity/projects/LOAD'
const CREATE = 'alakrity/projects/CREATE'
const EDIT = 'alakrity/projects/EDIT'
const REMOVE = 'alakrity/projects/REMOVE'
const SET_CURRENT_ID = 'alakrity/projects/SET_CURRENT_ID'

// action creators:

export function loadProjects() {
    return {
        type: LOAD,
        meta: {
            promise: fetch.get('projects'),
            optimist: false
        }
    }
}

export function createProject(projectInput) {
    projectInput.title = xss(projectInput.title)
    projectInput.created = moment()

    return {
        type: CREATE,
        payload: _merge({}, projectInput, { id: newId('TmpProjectID_') /*tempID(projectInput.created)*/ }),
        meta: {
            promise: fetch.post('projects', { data: projectInput }),
            optimist: true
        }
    }
}

export function editProject(projectInput) {
    if ( Immutable.Map.isMap(projectInput) ) {
        projectInput = projectInput.toJS()
    }

    projectInput.title = xss(projectInput.title)
    projectInput = _merge({}, projectInput, { lastEdited: moment() })

    if ( !projectInput.id || projectInput.id.startsWith('TEMP_ID_') ) {
        return {
            type: EDIT + FAILURE,
            payload: new Error('Can\'t edit project, it has not been saved on the server yet.')
        }
    }

    return {
        type: EDIT,
        payload: projectInput,
        meta: {
            promise: fetch.post('projects', { id: projectInput.id, data: projectInput }),
            optimist: true
        }
    }
}

export function removeProject(id) {

    if ( !id || id.startsWith('TEMP_ID_') ) {
        return {
            type: REMOVE + FAILURE,
            payload: new Error('Can\'t remove project, it has not been saved on the server yet.')
        }
    }

    return {
        type: REMOVE,
        payload: id,
        meta: {
            promise: fetch.delete('projects', { id: id }),
            optimist: true
        }
    }
}

export function setCurrentProjectID(id) {
    return {
        type: SET_CURRENT_ID,
        payload: id
    }
}


// REDUCER:
const initialState = Immutable.fromJS({
    isWorking: false,
    currentProjectID: '',
    projectList: []
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case LOAD:
            return state.set('isWorking', true)

        case CREATE:
            return state.set('projectList', state.get('projectList').push(Immutable.Map(action.payload)))
                        .set('isWorking', true)

        case EDIT:
            return state.set('projectList', state.get('projectList').map(project =>
                            (project.get('id') === action.payload.id) ? project.merge(action.payload) : project))
                        .set('isWorking', true)

        case REMOVE:
            return state.set('projectList', state.get('projectList').filterNot(project => project.get('id') === action.payload))
                        .set('isWorking', true)

        case SET_CURRENT_ID:
            return state.set('currentProjectID', action.payload)

        case LOAD + SUCCESS:
            return state.set('projectList', Immutable.fromJS((action.payload.data !== '') ? action.payload.data : []))
                        .set('isWorking', false)

        case EDIT + SUCCESS:
        case REMOVE + SUCCESS:
            return state.set('isWorking', false)

        case CREATE + SUCCESS:
            return ((state.getIn(['projectList', -1, 'id']) === action.meta.payload.id)
                ? state.setIn(['projectList', -1, 'id'], action.payload.data.id)
                :
                    state.set('projectList', state.get('projectList').map((task) => ((task.get('id') === action.meta.payload.id)
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
            return state.set('projectList', Immutable.fromJS(action.payload.data.projects))

        case LOGIN + FAILURE:
        case LOGOUT:
            return state.set('projectList', Immutable.fromJS([]))

        default:
            return state
    }
}