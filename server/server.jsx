import bodyParser from 'body-parser'
import config from 'config'
import express from 'express'
import * as fs from 'fs'
import * as http from 'http'
import * as https from 'https'
import * as Immutable from 'immutable'
import jwt from 'jsonwebtoken'
import * as path from 'path'

import React from 'react'
import cookie from 'react-cookie'
import * as ReactDOMServer from 'react-dom/server'
import { Provider } from 'react-redux'
import { createMemoryHistory, match, RouterContext } from 'react-router'
import { resetIdCounter } from 'react-tabs'
import transit from 'transit-immutable-js'
import configureStore from '../shared/configureStore'
import DevTools from '../shared/containers/devTools'
import routes from '../shared/routes'
import getRouters from './api/routes'
import { serverGetInitial } from './api/utils/serverQueries'


const isDev = (process.env.NODE_ENV !== 'production')

const app = express()

const server = (config.get('express.protocol').toString() === 'https') ?
               https.createServer({
                   key: fs.readFileSync((isDev) ? './tls/dev/localhost.key' : './tls/alakrity.key'),
                   cert: fs.readFileSync((isDev) ? './tls/dev/localhost.crt' : './tls/alakrity.crt')
               }, app) :
               http.createServer(app)


const port = config.get('express.port') || 3000
console.log('ENVIRONMENT =', process.env.NODE_ENV)
console.log('Protocol =', config.get('express.protocol'))

if ( isDev ) {

    require('./../webpack.dev.js').default(app)
}
app.use(express.static(path.join(__dirname, '../dist')))

app.set('views', path.join(__dirname, '../shared', 'views'))

app.set('view engine', 'ejs')
/**
 * Server middleware
 */
app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())
/**
 * API Endpoints
 */
const { router, routerWithAuth } = getRouters(express)
app.use('/api/0/', router)
app.use('/api/0/', routerWithAuth)
console.info('## Api Endpoints Created...')


app.use((req, res) => {
    cookie.plugToRequest(req, res)

    let user, userID, message
    try {
        user = jwt.verify(cookie.load('auth'), config.get('auth.jwtSecret'))
        userID = user.id
        message = 'ok.'
    }
    catch (err) {
        user = false
        userID = false
        if ( err === jwt.TokenExpiredError ) {
            message = err.message + ' at: ' + err.expiredAt
        }
        else if ( err === jwt.JsonWebTokenError ) {
            message = err.message
        }
        else {
            message = 'Cookie not found or expired! ' + err.message
        }

        console.log('##', message)
    }

    serverGetInitial(userID).then(response => {
                                // response = [ currentTimetable, [timetableList...], [tasks...], [projects...] ]
                                // console.log(response);
                                const prelimState = {
                                    auth: Immutable.fromJS(
                                        {
                                            message: message,
                                            isWorking: false,
                                            isAuthenticated: !!user,
                                            user: user || 'No Auth Token!'
                                        }
                                    ),
                                    tasks: Immutable.fromJS(
                                        {
                                            isWorking: false,
                                            taskList: response[2] || []
                                        }
                                    ),
                                    timetables: Immutable.fromJS(
                                        {
                                            isWorking: false,
                                            isSaved: true,
                                            editMode: false,
                                            currentProjectID: '',
                                            timetableList: response[1] || [],
                                            timetable: response[0] || {}
                                        }
                                    ),
                                    projects: Immutable.fromJS(
                                        {
                                            isWorking: false,
                                            projectList: response[3] || []
                                        }
                                    )
                                }

                                const serverHistory = createMemoryHistory(req.url)
                                const { store } = configureStore(serverHistory, prelimState, true)

                                match({ routes: routes, location: req.url }, (err, redirectLocation, renderProps) => {
                                    if ( err ) {
                                        console.error(err)
                                        return res.status(500).end('Internal server error')
                                    }

                                    if ( !renderProps ) return res.status(404).end('Not found.')
                                    const devTools = (isDev) ? <DevTools/> : null


                                    if ( redirectLocation ) {
                                        console.info('## Redirecting to...', redirectLocation)
                                        res.redirect(redirectLocation)
                                        return
                                    }


                                    // reset id counter for react-tabs
                                    resetIdCounter()
                                    // Render the component to a string
                                    let html = ReactDOMServer.renderToString(
                                        <Provider store={store}>
                                            <div>
                                                {isDev && <div className="debug"><p>## SERVER ##</p></div>}
                                                <RouterContext {...renderProps} />
                                                {devTools}
                                            </div>
                                        </Provider>
                                    )

                                    const clientConfig = JSON.stringify(transit.toJSON(config.get('client')))

                                    // Send the rendered page back to the client with the initial state
                                    const initialStateTransit = JSON.stringify(transit.toJSON(store.getState()))
                                    res.render('index', {
                                        isProd: (!isDev),
                                        html: html,
                                        config: clientConfig,
                                        initialState: initialStateTransit
                                    })
                                })
                            })
                            .catch(err => {
                                console.log(err)
                            })
})


if ( isDev ) {
    server.listen(port, () =>
        console.log('Development server listening on:', port)
    )
} else {
    server.listen(port, '0.0.0.0', () =>
        console.log('Production server listening on:', port)
    )
}

export default app
