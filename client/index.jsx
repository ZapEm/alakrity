import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { browserHistory, Router } from 'react-router'
import transit from 'transit-immutable-js'


import configureStore from '../shared/configureStore'
import DevTools from '../shared/containers/devTools'
import routes from '../shared/routes'

import '../shared/static/favicon.ico'
import '../shared/static/main.styl'


// hydrate initial state from transmitted state
const transitState = transit.fromJSON(window.__INITIAL_STATE__)
const { store, history } = configureStore(browserHistory, transitState)

const isDev = process.env.NODE_ENV !== 'production'
const devTools = (isDev) ? <DevTools/> : null



render(
    <Provider store={store}>
        <div>
            {isDev && <div className="debug"><p>## CLIENT ##</p></div>}
            <Router history={history}>{routes}</Router>
            {devTools}
        </div>
    </Provider>,
    document.getElementById('app-index')
)
