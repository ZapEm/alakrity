import { routerActions } from 'react-router-redux'
import { UserAuthWrapper } from 'redux-auth-wrapper'
import Loading from '../components/misc/Spinner'

// Redirects to /login by default
export const UserIsAuthenticated = UserAuthWrapper({
    authSelector: state => state.auth, // how to get the user state
    authenticatingSelector: state => state.auth.get('isWorking'),
    predicate: auth => auth.get('isAuthenticated'),
    LoadingComponent: Loading,
    redirectAction: routerActions.replace, // the redux action to dispatch for redirect
    wrapperDisplayName: 'UserIsAuthenticated' // a nice name for this auth check
})

export const UserIsNotAuthenticated = UserAuthWrapper({
    authSelector: state => state.auth,
    redirectAction: routerActions.replace,
    wrapperDisplayName: 'UserIsNotAuthenticated',
    // Want to redirect the user when they are done loading and authenticated
    predicate: auth => auth.get('isAuthenticated') === false && auth.get('isWorking') === false,
    failureRedirectPath: (state, ownProps) => {
        return (ownProps && ownProps.location.query.redirect) ? ownProps.location.query.redirect : '/'
    },
    allowRedirectBack: false
})
