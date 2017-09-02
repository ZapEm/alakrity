import * as Immutable from 'immutable'


/**
 * Action Types:
 * */


/**
 * Action Creators:
 * */


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

        default:
            return state
    }
}