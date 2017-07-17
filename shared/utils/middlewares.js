import _ from 'lodash'
import { logout } from '../modules/auth'

/**
 * Fires a LOGOUT action if Auth error occurs.
 */
export function authErrorLogout() {
    return ({ dispatch }) => (next) => (action) => {
        if ( _.get(action, 'payload.response.status', false) === 401 ) {
            console.error('#+++# FOUND:', action.payload.response)
            dispatch(logout())
            return next(action)
        }
        return next(action)
    }
}