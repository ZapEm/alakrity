import * as Immutable from 'immutable'


/**
 * Action Types:
 * */

const SET_TIME = 'alakrity/backend/SET_TIME'
const SET_MODAL = 'alakrity/backend/SET_MODAL'
const ClOSE_MODAL = 'alakrity/backend/CLOSE_MODAL'

/**
 * Action Creators:
 * */

export function setTime(time) {
    return {
        type: SET_TIME,
        payload: time
    }
}

export function setModal(task) {
    return {
        type: SET_MODAL,
        payload: task
    }
}

export function closeModal() {
    return {
        type: SET_MODAL
    }
}


/**
 * Reducer:
 * */
const initialState = Immutable.fromJS({
    time: false,
    modal: false
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_TIME:
            return state.set('time', action.payload)

        case SET_MODAL:
            return state.set('modal', action.payload)

        case ClOSE_MODAL:
            return state.set('modal', false)

        default:
            return state
    }
}