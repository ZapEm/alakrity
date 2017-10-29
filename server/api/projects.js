import * as dbService from './service/rethink'
import handleError from './utils/handleError'


export function getProjects(req, res) {
    dbService.findIndexed('projects', res.locals.decoded.id, 'userID')
             .then((projects) => res.json(projects))
             .catch(err => handleError(res, err, 400))
}

export function addProject(req, res) {
    const project = { ...req.body, userID: res.locals.decoded.id }
    dbService.save('projects', project)
             .then((project) => res.json(project))
             .catch(err => handleError(res, err, 400))
}

export function editProject(req, res) {
    const project = { ...req.body, userID: res.locals.decoded.id }
    dbService.edit('projects', req.params.id, project)
             .then((project) => res.json(project))
             .catch(err => handleError(res, err, 400))
}

export function removeProject(req, res) {
    dbService.removeProject(req.params.id)
             .then((resp) => res.json(resp))
             .catch(err => handleError(res, err, 400))
}


