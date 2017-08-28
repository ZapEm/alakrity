import * as Immutable from 'immutable'


/**
 * Action Types:
 * */

const SET_TIME = 'alakrity/user/ADD_PROJECT'


/**
 * Action Creators:
 * */

export function setTime(time) {

    return {
        type: SET_TIME,
        payload: time
    }
}


/**
 * Reducer:
 * */
const initialState = Immutable.fromJS({
    time: false
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_TIME:
            return state.set('time', action.payload)


        default:
            return state
    }
}