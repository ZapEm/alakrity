import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'
import optimist from 'redux-optimist'
import auth from './auth'
import tasks from './tasks'
import timetables from './timetables'
import projects from './projects'


export default optimist(combineReducers(
    {
        routing: routerReducer,
        auth,
        timetables,
        projects,
        tasks
    }
))