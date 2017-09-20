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

// import '../shared/static/png/hi.png'
// import '../shared/static/png/idle1.png'
// import '../shared/static/png/nap.png'
// import '../shared/static/png/sleep.png'
// import '../shared/static/png/bye.png'
// import '../shared/static/png/denied.png'
// import '../shared/static/png/idea.png'
// import '../shared/static/png/statistics.png'
// import '../shared/static/png/idle2.png'
// import '../shared/static/png/goodwork.png'
// import '../shared/static/png/stress.png'
// import '../shared/static/png/angry.png'
// import '../shared/static/png/back.png'
// import '../shared/static/png/clean.png'
// import '../shared/static/png/cook.png'
// import '../shared/static/png/fix.png'
// import '../shared/static/png/sorry.png'
// import '../shared/static/png/sport1.png'
// import '../shared/static/png/sport2.png'
// import '../shared/static/png/sport3.png'
// import '../shared/static/png/sport4.png'
// import '../shared/static/png/work.png'
// import '../shared/static/png/tired.png'
// import '../shared/static/png/sweep.png'
// import '../shared/static/png/thankyou.png'
// import '../shared/static/png/wakeup.png'





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
