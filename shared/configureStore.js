import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux'
import { applyMiddleware, compose, createStore } from 'redux'
import createLogger from 'redux-logger'
import optimistPromiseMiddleware from 'redux-optimist-promise'
import DevTools from '../shared/containers/devTools'
import reducer from '../shared/modules/reducer'
import { REJECTED_NAME, RESOLVED_NAME } from './utils/constants'
import * as myMiddlewares from './utils/middlewares'


export default function configureStore(baseHistory, initialState, isServer = false) {

    let enhancer = compose(
        applyMiddleware(routerMiddleware(baseHistory), optimistPromiseMiddleware(RESOLVED_NAME, REJECTED_NAME), myMiddlewares.authErrorLogout())
    )

    if ( process.env.NODE_ENV !== 'production' ) {
        if ( !isServer ) {
            const loggerMiddleware = createLogger({
                level: 'info',
                collapsed: true
            })

            enhancer = compose(
                applyMiddleware(loggerMiddleware, routerMiddleware(baseHistory), optimistPromiseMiddleware(RESOLVED_NAME, REJECTED_NAME), myMiddlewares.authErrorLogout()),
                DevTools.instrument()
            )
        } else {
            enhancer = compose(
                applyMiddleware(routerMiddleware(baseHistory), optimistPromiseMiddleware(RESOLVED_NAME, REJECTED_NAME), myMiddlewares.authErrorLogout()),
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