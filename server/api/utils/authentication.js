import config from 'config'
import jwt from 'jsonwebtoken'
import ms from 'ms'

const cfg = config.get('auth')


export function verifyRequest(req, callback) {
    if ( req.headers.authorization ) {
        jwt.verify(req.headers.authorization.split(' ')[1], cfg.get('jwtSecret'), callback) // remove "Bearer " part
    } else {
        callback(new jwt.JsonWebTokenError('No Authorization Header.'))
    }
}

function refreshOldTokens(res, decoded) {
    if ( decoded.iat + 3600 < (Date.now() / 1000) ) {
        decoded.exp = Math.floor((Date.now() + ms(cfg.get('jwtExpiresIn'))) / 1000)
        console.log('token stale for', (Date.now() / 1000) - (decoded.iat + 3600), 'seconds.')
        delete decoded.iat

        // changes the "send json" function to inject the token before send
        const oldResJson = res.json
        res.json = (data) => {
            data.auth_token = jwt.sign(decoded, cfg.get('jwtSecret'))
            res.json = oldResJson
            res.json(data)
        }
     }
}


/**
 *  request authentication middleware
 **/
export function authMiddleware(req, res, next) {
    verifyRequest(req, (err, decoded) => {
            if ( !err && decoded ) {
                refreshOldTokens(res, decoded)
                res.locals.decoded = decoded
                next()
            } else {
                res.status(401)
                res.json({ error: err })
            }
        }
    )
}