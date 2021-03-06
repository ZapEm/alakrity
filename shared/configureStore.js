import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux'
import { applyMiddleware, compose, createStore } from 'redux'
import optimistPromiseMiddleware from 'redux-optimist-promise'
import thunkMiddleware from 'redux-thunk'
import DevTools from '../shared/containers/devTools'
import reducer from '../shared/modules/reducer'
import { REJECTED_NAME, RESOLVED_NAME } from './utils/constants'
import * as myMiddlewares from './utils/middlewares'


export default function configureStore(baseHistory, initialState, isServer = false) {

    let enhancer = compose(
        applyMiddleware(
            routerMiddleware(baseHistory),
            thunkMiddleware,
            optimistPromiseMiddleware(
                {
                    resolvedName: RESOLVED_NAME,
                    rejectedName: REJECTED_NAME,
                    throwOnReject: false
                }
            ),
            myMiddlewares.authErrorLogout()
        )
    )

    if ( process.env.NODE_ENV !== 'production' ) {
        if ( !isServer ) {
            const { createLogger } = require('redux-logger')
            const loggerMiddleware = createLogger({
                level: 'info',
                collapsed: true
            })

            enhancer = compose(
                applyMiddleware(
                    routerMiddleware(baseHistory),
                    thunkMiddleware,
                    optimistPromiseMiddleware(
                        {
                            resolvedName: RESOLVED_NAME,
                            rejectedName: REJECTED_NAME,
                            throwOnReject: false
                        }
                    ),
                    loggerMiddleware,
                    myMiddlewares.authErrorLogout()),
                DevTools.instrument()
            )
        } else {
            enhancer = compose(
                applyMiddleware(
                    routerMiddleware(baseHistory),
                    thunkMiddleware,
                    optimistPromiseMiddleware(
                        {
                            resolvedName: RESOLVED_NAME,
                            rejectedName: REJECTED_NAME,
                            throwOnReject: false
                        }
                    ),
                    myMiddlewares.authErrorLogout()),
                DevTools.instrument()
            )
        }
    }

    const store = createStore(
        reducer,
        initialState,
        enhancer
    )

    const history = syncHistoryWithStore(baseHistory, store)

    return { store, history }
}