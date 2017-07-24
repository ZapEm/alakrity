import React from 'react'
import { IndexRoute, Route } from 'react-router'
import { UserIsAuthenticated, UserIsNotAuthenticated } from './authwrappers'

import AppRoot from './containers/AppRoot'
import Login from './containers/Login'
import Tasks from './containers/Tasks'
import Projects from './containers/Projects'
import Timetable from './containers/Timetable'

export default (
    <Route name="app" component={AppRoot} path="/">
        <IndexRoute name="Timetable" component={UserIsAuthenticated(Timetable)}/>
        <Route name="Tasks" path="tasks" component={UserIsAuthenticated(Tasks)}/>
        <Route name="Projects" path="projects" component={UserIsAuthenticated(Projects)}/>
        <Route name="Login" path="login" component={UserIsNotAuthenticated(Login)}/>
    </Route>
)