import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'
import optimist from 'redux-optimist'
import auth from './auth'
import projects from './projects'
import tasks from './tasks'
import timer from './timer'
import timetables from './timetables'


export default optimist(combineReducers(
    {
        routing: routerReducer,
        auth,
        timetables,
        projects,
        tasks,
        timer
    }
))