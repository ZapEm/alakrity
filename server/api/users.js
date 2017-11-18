import bcrypt from 'bcrypt-nodejs'
import { merge as _merge } from 'lodash/object'
import * as rethink from '../api/service/rethink'

//const NONE = 0;
//const ADMIN = 9;
const USER = 1


export function addUser(req, res) {
    if ( !req.body.userID || !req.body.password || req.body.password.length < 6 ) {
        res.status(400)
        res.json({
            message: !req.body.userID ? 'Username can\'t be empty!' : 'Password has to be at least 6 characters long.',
            error: 'Invalid credentials'
        })
    } else {
        rethink.find('users', req.body.userID)
               .then(user => {
                   if ( user ) {
                       res.status(400)
                       res.json({ message: 'Sorry, that name is already in use.',
                           error: 'User exists'})
                   } else {
                       bcrypt.hash(req.body.password, null, null, function (err, hash) {
                           if ( err ) {
                               console.log('ERROR:', err)
                               res.status(500)
                               res.json({ message: err.toString(), error: err, user: req.body })
                           } else {
                               rethink.save('users', { id: req.body.userID, password: hash, permission: USER })
                                      .then((response) => res.json(_merge(response, { message: 'User ' + response.id + ' was successfully created.' })))
                                      .catch(err => {
                                          console.log(err)
                                          res.status(400)
                                          res.json({ message: err.toString(), error: err, user: req.body })
                                      })
                           }
                       })
                   }
               })
               .catch(err => {
                   console.log(err)
                   res.status(400)
                   res.json({ message: err.toString(), error: err,})
               })
    }
}

export function editUser(req, res) {
    rethink.edit('users', res.locals.decoded.id, req.body)
           .then((user) => res.json(user))
           .catch(err => {
               res.status(400)
               res.json({ error: err, user: req.body })
           })
}

export function removeUser(req, res) {
    rethink.remove('users', req.params.id)
           .then((user) => res.json(user))
           .catch(err => {
               res.status(400)
               res.json({ error: err, user: req.body })
           })
}