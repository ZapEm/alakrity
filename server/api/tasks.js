import * as rethink from './service/rethink'
import handleError from './utils/handleError'

/**
 * Api function(s) to call the DB. Authentication is handled by middleware beforehand.
 * The decoded token can be found in res.locals.decoded
 * @param req
 * @param res
 */

export function getTasks(req, res) {
    rethink.findIndexed('tasks', res.locals.decoded.id, 'userID')
           .then((tasks) => res.json(tasks))
           .catch(err => handleError(res, err, 400))
}

export function addTask(req, res) {
    const task = { ...req.body, userID: res.locals.decoded.id }
    rethink.save('tasks', task)
           .then((task) => res.json(task))
           .catch(err => handleError(res, err, 400))
}

export function editTask(req, res) {
    const task = { ...req.body, userID: res.locals.decoded.id }
    rethink.edit('tasks', req.params.id, task)
           .then((task) => res.json(task))
           .catch(err => handleError(res, err, 400))
}

export function removeTask(req, res) {
    rethink.remove('tasks', req.params.id)
           .then((resp) => res.json(resp))
           .catch(err => handleError(res, err, 400))
}




