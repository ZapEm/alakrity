import * as Immutable from 'immutable'


/**
 * Action Types:
 * */

const SET_TIME = 'alakrity/backend/SET_TIME'
const ADD_MODAL = 'alakrity/backend/ADD_MODAL'
const REMOVE_MODAL = 'alakrity/backend/REMOVE_MODAL'

/**
 * Action Creators:
 * */

export function setTime(time) {
    return {
        type: SET_TIME,
        payload: time
    }
}

export function addModal(modal) {
    return {
        type: ADD_MODAL,
        payload: modal
    }
}

export function removeModal(index) {
    return {
        type: REMOVE_MODAL,
        payload: index
    }
}


/**
 * Reducer:
 * */
const initialState = Immutable.fromJS({
    time: false,
    modalList: Immutable.List()
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_TIME:
            return state.set('time', action.payload)

        case ADD_MODAL:
            return state.withMutations((state) => state.set('modalList', state.get('modalList').push(action.payload)))

        case REMOVE_MODAL:
            return state.deleteIn(['modalList', action.payload])

        default:
            return state
    }
}