import * as Immutable from 'immutable'
import { omit as _omit, merge as _merge } from 'lodash/object'
import moment from 'moment'
import xss from 'xss'
import { REJECTED_NAME as FAILURE, RESOLVED_NAME as SUCCESS } from '../utils/constants'
import fetch from '../utils/fetcher'


/**
 * Action Types:
 * */

const ADD_PROJECT = 'alakrity/user/ADD_PROJECT'
const REMOVE_PROJECT = 'alakrity/user/REMOVE_PROJECT'
const EDIT_PROJECT = 'alakrity/user/EDIT_PROJECT'



/**
 * Action Creators:
 * */

export function addProject(projectInput = {}) {
    if (projectInput.title) { projectInput.title = xss(projectInput.title) }
    projectInput.created = moment()

    return {
        type: ADD_PROJECT,
        payload: projectInput,
        meta: {
            promise: fetch.post('user/project', { data: projectInput }),
            optimist: false
        }
    }
}

export function editUser(userInput) {
    if ( userInput.password ) {
        userInput.password = xss(userInput.password)
    }

    const user = _merge(userInput, { lastEdited: moment() })

    return {
        type: EDIT_USER,
        payload: _omit(user, 'password'),
        meta: {
            promise: fetch.post('users', { id: user.userID, data: user }),
            optimist: false
        }
    }
}

export function removeUser(userID) {
    return {
        type: REMOVE_USER,
        payload: userID,
        meta: {
            promise: fetch.delete('users', { id: userID }),
            optimist: true
        }
    }
}

export function login(username = '', password = '') {
    username = xss(username)
    password = xss(password)
    return {
        type: LOGIN,
        meta: {
            promise: fetch.post('auth',
                {
                    data: {
                        userID: username,
                        password: password
                    }
                }
            ).then(response => response.data),
            optimist: false
        }
    }
}

export function logout() {
    return {
        type: LOGOUT
    }
}


export function loadAuthCookie() {
    return {
        type: LOAD_AUTH_COOKIE
    }
}


/**
 * Reducer:
 * */
const initialState = Immutable.fromJS({
    message: '',
    isWorking: false,
    isAuthenticated: false,
    user: false
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case CREATE_USER:
        case EDIT_USER:
        case REMOVE_USER:
            return state.set('isWorking', true)

        case LOGIN:
            return state.set('isWorking', true)

        case LOGOUT:
            cookie.remove('auth')
            return state.withMutations(state => {
                    state
                        .set('isAuthenticated', false)
                        .set('user', false)
                }
            )

        case CREATE_USER + SUCCESS:
        case EDIT_USER + SUCCESS:
        case REMOVE_USER + SUCCESS:
            return state.withMutations(state => {
                    state.set('user', action.payload.data)
                         .set('message', action.payload.data.message)
                         .set('isWorking', false)
                }
            )

        case LOGIN + SUCCESS:
            cookie.save('auth', action.payload, { expires: new Date(action.payload.expires) })
            return state.withMutations(state => {
                    state.set('message', '')
                         .set('isAuthenticated', true)
                         .set('user', Immutable.fromJS(action.payload.user))
                         .set('isWorking', false)
                }
            )


        case LOGIN + FAILURE:
            return state.withMutations(state => {
                    state.set('message', 'Login failed: ' + action.payload.response.data.message || 'An Error occurred.')
                         .set('isAuthenticated', false)
                         .set('user', false)
                         .set('isWorking', false)
                }
            )


        case LOAD_AUTH_COOKIE:
            return state.set('user', cookie.load('auth') || false)

        default:
            return state
    }
}