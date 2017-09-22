import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ModalComponent from '../components/misc/modals/ModalComponent'
import Navbar from '../components/misc/Navbar'
import { logout } from '../modules/auth'
import * as backendActions from '../modules/backend'
import * as settingsActions from '../modules/settings'
import * as taskActions from '../modules/tasks'

import configureNotifications from '../utils/configureNotifications'
import { checkWorking } from '../utils/stateChecks'


@DragDropContext(HTML5Backend)
@connect(state => ({
    isWorking: checkWorking(state),
    isAuthenticated: state.auth.get('isAuthenticated'),
    message: state.auth.get('message') || '',
    backend: state.backend,
    settings: state.settings,
    taskList: state.tasks.get('taskList'),
    projectList: state.projects.get('projectList'),
    currentPath: state.routing.locationBeforeTransitions.pathname || '/'
}))
export default class AppRoot extends React.Component {

    static propTypes = {
        children: PropTypes.node.isRequired,
        isWorking: PropTypes.bool,
        isAuthenticated: PropTypes.bool,
        message: PropTypes.string,
        backend: ImmutablePropTypes.map,
        taskList: ImmutablePropTypes.list,
        projectList: ImmutablePropTypes.list,
        dispatch: PropTypes.func,
        currentPath: PropTypes.string,
        settings: ImmutablePropTypes.map
    }

    static childContextTypes = {
        dragDropManager: PropTypes.object,
        storeSubscription: PropTypes.any
    }


    render() {
        const { isWorking, isAuthenticated, message, dispatch, currentPath, backend, taskList, projectList, settings } = this.props

        // set global moment locale
        moment.locale(settings.get('locale'))
        console.log('pre', moment.locale())
        if ( settings.get('locale') === 'de' ) {
            require('moment/locale/de')
            if ( moment.locale() === 'en' ) {
                moment.locale('de')
                console.log('...!')
            }
        }
        console.log('post', moment.locale())


        //configureNotifications(bindActionCreators(settingsActions, dispatch))


        return (
            <div id="app-view">
                {isAuthenticated && <ModalComponent
                    settings={settings}
                    modalsOM={backend.get('modalsOM')}
                    projectList={projectList}
                    backendActions={bindActionCreators(backendActions, dispatch)}
                    taskActions={bindActionCreators(taskActions, dispatch)}
                />}
                <Navbar
                    isAuthenticated={isAuthenticated}
                    isWorking={isWorking}
                    message={message}
                    currentPath={currentPath}
                    logout={bindActionCreators(logout, dispatch)}
                    taskList={taskList}
                    backendActions={bindActionCreators(backendActions, dispatch)}
                />
                <div id="main-view">{this.props.children}</div>
            </div>
        )
    }
}