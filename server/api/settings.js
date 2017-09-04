import * as rethink from '../api/service/rethink'


export function editSettings(req, res) {
    const data = { settings: req.body }
    console.log('Editing users', res.locals.decoded.id, data)
    rethink.edit('users', res.locals.decoded.id, { settings: req.body })
           .then((response) => res.json(response))
           .catch(err => {
               res.status(400)
               res.json({ error: err, settings: req.body })
           })
}