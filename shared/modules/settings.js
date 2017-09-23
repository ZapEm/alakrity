import * as Immutable from 'immutable'
import { isEmpty } from 'lodash/lang'
import {
    DEFAULT_SETTINGS, LOCALE_STRINGS, REJECTED_NAME as FAILURE, RESOLVED_NAME as SUCCESS
} from '../utils/constants'
import fetch from '../utils/fetcher'
import { LOGIN, LOGOUT } from './auth'


/**
 * Action Types:
 * */

const SAVE = 'alakrity/settings/SAVE'
const LOAD = 'alakrity/settings/LOAD'


/**
 * Action Creators:
 * */

export function saveSettings(settings) {
    if ( Immutable.Map.isMap(settings) ) {
        settings = settings.toJS()

    }
    if ( settings.locale && !LOCALE_STRINGS[settings.locale] ) {
        throw new Error(settings.locale + ' is not a valid key of LOCALE_STRING')
    }

    settings.isDefault = false


    return {
        type: SAVE,
        payload: settings,
        meta: {
            promise: fetch.post('settings', { data: settings }),
            optimist: true
        }
    }
}


/**
 * Reducer:
 * */
const initialState = Immutable.fromJS(DEFAULT_SETTINGS)

export default function reducer(state = initialState, action) {
    switch (action.type) {

        case SAVE:
            return state.merge(action.payload)

        case SAVE + SUCCESS:
            return state

        case SAVE + FAILURE:
            console.log('Error in Action', action.type, '>>>', action.payload)
            return state


        case LOGIN + SUCCESS:
            return (action.payload.user && !isEmpty(action.payload.user.settings))
                ? state.merge(action.payload.user.settings)
                : state

        case LOGIN + FAILURE:
        case LOGOUT:
            return Immutable.fromJS(DEFAULT_SETTINGS)

        default:
            return state
    }
}