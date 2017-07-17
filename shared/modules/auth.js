import * as Immutable from 'immutable'
import { omit as _omit, merge as _merge } from 'lodash/object'
import moment from 'moment'
import cookie from 'react-cookie'
import xss from 'xss'
import { REJECTED_NAME as FAILURE, RESOLVED_NAME as SUCCESS } from '../utils/constants'
import fetch from '../utils/fetcher'
import * as jwt from 'jsonwebtoken'


/**
 * Action Types:
 * */
export const LOGIN = 'alakrity/auth/LOGIN'
export const LOGOUT = 'alakrity/auth/LOGOUT'
const LOAD_AUTH_COOKIE = 'alakrity/auth/LOAD_AUTH_COOKIE'
const CREATE_USER = 'alakrity/auth/CREATE_USER'
const EDIT_USER = 'alakrity/auth/EDIT_USER'
const REMOVE_USER = 'alakrity/auth/REMOVE_USER'


/**
 * Action Creators:
 * */

export function createUser(userInput) {
    const user = {
        userID: xss(userInput.userID),
        password: xss(userInput.password),
        created: moment()
    }

    return {
        type: CREATE_USER,
        payload: _omit(user, 'password'),
        meta: {
            promise: fetch.post('users', { data: user }),
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
            return state.withMutations(state => {
                    state.set('message', '')
                         .set('isAuthenticated', true)
                         .set('user', Immutable.fromJS(action.payload.user))
                         .set('isWorking', false)
                }
            )


        case LOGIN + FAILURE:
            return state.withMutations(state => {
                    state.set('message', 'Login failed: ' + action.payload.message || 'An Error occurred.')
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