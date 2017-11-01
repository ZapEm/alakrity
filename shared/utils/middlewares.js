import _ from 'lodash'
import { logout } from '../modules/auth'

/**
 * Fires a LOGOUT action if Auth error occurs.
 */
export function authErrorLogout() {
    return ({ dispatch }) => (next) => (action) => {
        if ( _.get(action, 'payload.response.status', false) === 401 ) {
            console.error('# AUTH ERROR! Logging out.')
            dispatch(logout('Auth Error'))
            return next(action)
        }
        return next(action)
    }
}