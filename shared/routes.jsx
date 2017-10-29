import React from 'react'
import { IndexRoute, Route } from 'react-router'
import { UserIsAuthenticated, UserIsNotAuthenticated } from './authwrappers'

import AppRoot from './containers/AppRoot'
import Login from './containers/Login'
import Projects from './containers/Projects'
import Tasks from './containers/Tasks'
import Timetable from './containers/Timetable'
import Statistics from './containers/Statistics'
import Manual from './containers/Manual'

export default (
    [<Route key="app" name="app" component={AppRoot} path="/">
        <IndexRoute name="Timetable" component={UserIsAuthenticated(Timetable)}/>
        <Route name="Tasks" path="tasks" component={UserIsAuthenticated(Tasks)}/>
        <Route name="Projects" path="projects" component={UserIsAuthenticated(Projects)}/>
        <Route name="Statistics" path="statistics" component={UserIsAuthenticated(Statistics)}/>
        <Route name="Login" path="login" component={UserIsNotAuthenticated(Login)}/>
    </Route>,
    <Route key="popup" name="Alakrity Manual" path="manual" component={Manual}/>]
)