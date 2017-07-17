import * as rethink from './service/rethink'
import handleError from './utils/handleError'


export function listTimetables(req, res) {
    rethink.findIndexed('timetables', res.locals.decoded.id, 'userID')
           .then((timetables) => res.json(timetables.map((timetable) => (
               {
                   id: timetable.id,
                   title: timetable.title
               }
           ))))
           .catch(err => handleError(res, err, 400))
}

export function getTimetable(req, res) {
    rethink.find('timetables', req.params.id)
           .then((timetable) => res.json(timetable))
           .catch(err => handleError(res, err, 400))
}

export function addTimetable(req, res) {
    const timetable = { ...req.body, userID: res.locals.decoded.id }
    rethink.save('timetables', timetable)
           .then((timetable) => res.json(timetable))
           .catch(err => handleError(res, err, 400))
}

export function saveTimetable(req, res) {
    const timetable = { ...req.body, userID: res.locals.decoded.id }
    rethink.edit('timetables', req.params.id, timetable)
           .then((timetable) => res.json(timetable))
           .catch(err => handleError(res, err, 400))
}

export function removeTimetable(req, res) {
    rethink.remove('timetables', req.params.id)
           .then((resp) => res.json(resp))
           .catch(err => handleError(res, err, 400))
}




