import axios from 'axios'
//import * as _ from 'lodash/object'
//import { client } from 'config'
import jwt from 'jsonwebtoken'
import cookie from 'react-cookie'
import transit from 'transit-immutable-js'

// Set default values for requests on server and client:
axios.defaults.timeout = 5000

let apiCfg = {}
if ( typeof window === 'undefined' ) {
    // const config = require('config')
    // apiCfg = client
    apiCfg = {
        protocol: 'http',
        host: 'localhost',
        port: 3000,
        api: '/api/0/'
    }
} else {
    apiCfg = transit.fromJSON(window.__CONFIG__).api
}
// const apiCfg = client.get('api')

//console.log(apiCfg, `${apiCfg.protocol}://${apiCfg.host}:${apiCfg.port}${apiCfg.api}`)
axios.defaults.baseURL = `${apiCfg.protocol}://${apiCfg.host}:${apiCfg.port}${apiCfg.api}`

// if ( typeof window === 'undefined' ) {
//     // const serverCfg = config.get('express');
//     // axios.defaults.baseURL = 'http://' + serverCfg.get('host') + ':' + serverCfg.get('port') + serverCfg.get('api');
//     axios.defaults.baseURL = 'http://localhost:3000/api/0/'
// } else {
//     api = transit.fromJSON(window.__CONFIG__).api
//     axios.defaults.baseURL = `${apiCfg.protocol}://${apiCfg.host}:${apiCfg.port}${apiCfg.api}`
// }

const methods = ['get', 'post', 'delete']

class ApiFetcher {
    constructor() {
        methods.forEach((method) =>
            this[method] = (path, { id, data, params } = {}) => {

                const token = cookie.load('auth') || null

                if ( id ) {
                    path = path + '/' + id
                }
                return axios(Object.assign(
                    {
                        url: path,
                        method
                    },
                    params ? { params } : null,
                    data ? { data } : null,
                    token ? { headers: { Authorization: 'Bearer ' + token } } : null,
                    {
                        // Use default behaviour "parse into object" first.
                        transformResponse: axios.defaults.transformResponse.concat((data) => {
                            if ( data && data.auth_token ) {
                                const token = data.auth_token
                                delete data.auth_token
                                cookie.save('auth', token, { expires: new Date(jwt.decode(token).exp * 1000) })
                                console.log('---+ auth cookie renewed +---')
                            }
                            return data
                        })
                    }
                    )
                )
            }
        )
    }
}

export default new ApiFetcher()