import _ from 'lodash'
import { logout } from '../modules/auth'
import { mascotSplash } from '../modules/backend'
import { MASCOT_STATUS } from './enums'

/**
 * Fires a LOGOUT action if Auth error occurs.
 */
export function authErrorLogout() {
    return ({ dispatch }) => (next) => (action) => {
        const responseStatus = _.get(action, 'payload.response.status', false)
        if ( responseStatus && responseStatus === 401 ) {
            dispatch(logout(_.get(action, 'payload.response.data.message', 'Auth error. You have been logged out.')))
            return next(action)
        } else if ( responseStatus && responseStatus === 400 ) {
            console.log('response ' + responseStatus)
            dispatch(mascotSplash({
                status: MASCOT_STATUS.QUESTION.key,
                message: _.get(action, 'payload.response.data.message', 'Auth error. Invalid credentials.')
            }, 7))
            return next(action)
        }

        return next(action)
    }
}