import { routerActions } from 'react-router-redux'
import locationHelperBuilder from 'redux-auth-wrapper/history3/locationHelper'
import { connectedReduxRedirect as UserAuthWrapper } from 'redux-auth-wrapper/history3/redirect'

import Loading from '../components/misc/Spinner'


const locationHelper = locationHelperBuilder({})

// Redirects to /login by default
export const UserIsAuthenticated = UserAuthWrapper(
    {
        wrapperDisplayName: 'UserIsAuthenticated', // a nice name for this auth check,
        redirectPath: '/login',
        authenticatedSelector: state => state.auth.get('isAuthenticated'),
        authenticatingSelector: state => state.auth.get('isWorking'),
        LoadingComponent: Loading,
        redirectAction: routerActions.replace // the redux action to dispatch for redirect
    }
)

export const UserIsNotAuthenticated = UserAuthWrapper(
    {
        wrapperDisplayName: 'UserIsNotAuthenticated',
        redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
        redirectAction: routerActions.replace,
        authenticatedSelector: state => state.auth.get('isAuthenticated') === false && state.auth.get('isWorking') === false,
        allowRedirectBack: false
    }
)
