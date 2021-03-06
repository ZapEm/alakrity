import axios from 'axios'
import jwt from 'jsonwebtoken'
import cookie from 'react-cookie'

// Set default values for requests on server and client:
axios.defaults.timeout = 5000


let apiCfg = {}
if ( typeof window === 'undefined' ) {
    apiCfg = require('config').get('express')
    axios.defaults.baseURL = `${apiCfg.protocol}://${apiCfg.host}:${apiCfg.port}${apiCfg.api}`
} else {
    apiCfg = require('config') // via webpack alias and config/client.json file
    axios.defaults.baseURL = apiCfg.apiUrl
}

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
