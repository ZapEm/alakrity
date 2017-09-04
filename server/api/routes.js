import * as auth from './auth'
import * as projects from './projects'
import * as tasks from './tasks'
import * as timetables from './timetables'
import * as users from './users'
import * as settings from './settings'
// import { Router } from 'express'
import { authMiddleware } from './utils/authentication'

export default function getRouters(express) {

    let router = express.Router()
    let routerWithAuth = express.Router()
    routerWithAuth.use('*', authMiddleware)

    router.post('/auth/', auth.login)

    router.post('/users', users.addUser)
    routerWithAuth.delete('/user', users.removeUser) //TODO
    routerWithAuth.post('/user', users.editUser)

    routerWithAuth.post('/settings', settings.editSettings)

    routerWithAuth.get('/tasks', tasks.getTasks)
    routerWithAuth.post('/tasks', tasks.addTask)
    routerWithAuth.post('/tasks/:id', tasks.editTask)
    routerWithAuth.delete('/tasks/:id', tasks.removeTask)

    routerWithAuth.get('/projects', projects.getProjects)
    routerWithAuth.post('/projects', projects.addProject)
    routerWithAuth.post('/projects/:id', projects.editProject)
    routerWithAuth.delete('/projects/:id', projects.removeProject)

    routerWithAuth.get('/timetables', timetables.listTimetables)
    routerWithAuth.get('/timetables/:id', timetables.getTimetable)
    routerWithAuth.post('/timetables', timetables.addTimetable)
    routerWithAuth.post('/timetables/:id', timetables.saveTimetable)
    routerWithAuth.delete('/timetables/:id', timetables.removeTimetable)

    return { router, routerWithAuth }
}