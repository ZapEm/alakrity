import bcrypt from 'bcrypt-nodejs'
import config from 'config'
import jwt from 'jsonwebtoken'
import _omit from 'lodash/omit'
import * as rethink from '../api/service/rethink'

const cfg = config.get('auth')


function createToken(user) {
    const userNoPw = _omit(user, 'password')
    return {
        userNoPw,
        token: jwt.sign(
            userNoPw,
            cfg.get('jwtSecret'),
            { expiresIn: cfg.get('jwtExpiresIn') }
        )
    }
}

export function login(req, res) {

    if ( !req.body.userID || !req.body.password ) {
        res.status(400)
        res.json({ message: 'Username or password is missing.' })

    }
    else {
        rethink.find('users', req.body.userID)
               .then((user) => {
                   if ( !user ) {
                       res.status(401)
                       res.json({ message: 'Wrong username or password.' })
                   }
                   else {
                       bcrypt.compare(req.body.password, user.password, (err, isSame) => {
                           if ( isSame ) {
                               Promise.all(
                                   [
                                       rethink.findIndexed('tasks', req.body.userID, 'userID'),
                                       rethink.findIndexed('projects', req.body.userID, 'userID'),
                                       (user.currentTimetable) ?
                                       rethink.find('timetables', user.currentTimetable) :
                                       rethink.findLastIndexed('timetables', req.body.userID, 'userID'),
                                       rethink.findIndexedWithFields('timetables', req.body.userID, 'userID', ['id',
                                                                                                               'title'])
                                   ]
                               ).then(responses => {
                                   const { userNoPw, token } = createToken(user)
                                   res.status(200)
                                   res.json(
                                       {
                                           user: userNoPw,
                                           auth_token: token,
                                           data: {
                                               tasks: responses[0] || [],
                                               projects: responses[1] || [],
                                               timetable: responses[2] || {},
                                               timetableList: responses[3] || []
                                           }
                                       }
                                   )
                               })
                           }
                           else {
                               res.status(401)
                               res.json({ message: 'Wrong username or password.' })
                           }
                       })
                   }
               })
               .catch(err => {
                   res.status(400)
                   res.json({
                       message: err.toString(),
                       error: err
                   })
               })
    }
}