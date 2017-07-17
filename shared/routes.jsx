import React from 'react'
import { IndexRoute, Route } from 'react-router'
import { UserIsAuthenticated, UserIsNotAuthenticated } from './authwrappers'

import AppRoot from './containers/AppRoot'
import Login from './containers/Login'
import Tasks from './containers/Tasks'
import Timetable from './containers/Timetable'

export default (
    <Route name="app" component={AppRoot} path="/">
        <IndexRoute name="Timetable" component={UserIsAuthenticated(Timetable)}/>
        <Route name="Tasks" path="tasks" component={UserIsAuthenticated(Tasks)}/>
        <Route name="Login" path="login" component={UserIsNotAuthenticated(Login)}/>
    </Route>
)