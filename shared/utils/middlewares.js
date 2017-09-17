import _ from 'lodash'
import { logout } from '../modules/auth'

/**
 * Fires a LOGOUT action if Auth error occurs.
 */
export function authErrorLogout() {
    return ({ dispatch }) => (next) => (action) => {
        if ( _.get(action, 'payload.response.status', false) === 401 ) {
            console.error('# AUTH ERROR! Logging out.')
            dispatch(logout())
            return next(action)
        }
        return next(action)
    }
}

/**
 * Records data to be used for statistics.
 */
export function statisticsRecorder() {
    return ({ dispatch }) => (next) => (action) => {
        if ( _.get(action, 'type', false) === 401 ) {
            console.error('# AUTH ERROR! Logging out.')
            dispatch(logout())
            return next(action)
        }
        return next(action)
    }
}

const recordingActionsMap = {
    ['']: ''
}