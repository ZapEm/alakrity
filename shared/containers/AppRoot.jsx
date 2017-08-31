import React from 'react'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Navbar from '../components/misc/Navbar'
import { logout } from '../modules/auth'
import { checkWorking } from '../utils/stateChecks'
import Modal from '../components/misc/Modal'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import Clock from '../components/backend/Clock'
import * as backendActions from '../modules/backend'

@connect(state => ({
    isWorking: checkWorking(state),
    isAuthenticated: state.auth.get('isAuthenticated'),
    message: state.auth.get('message') || '',
    backend: state.backend,
    taskList: state.tasks.get('taskList'),
    projectList: state.projects.get('projectList'),
    currentPath: state.routing.locationBeforeTransitions.pathname || '/'
}))
@DragDropContext(HTML5Backend)
export default class AppRoot extends React.Component {

    static propTypes = {
        children: React.PropTypes.node.isRequired,
        isWorking: React.PropTypes.bool,
        isAuthenticated: React.PropTypes.bool,
        message: React.PropTypes.string,
        backend: ImmutablePropTypes.map,
        taskList: ImmutablePropTypes.list,
        projectList: ImmutablePropTypes.list,
        dispatch: React.PropTypes.func,
        currentPath: React.PropTypes.string
    }

    static childContextTypes = {
        dragDropManager: React.PropTypes.object
    }

    render() {
        const { isWorking, isAuthenticated, message, dispatch, currentPath, backend, taskList, projectList } = this.props
        return (
            <div id="app-view" className="main-app">
                <Modal
                    task={backend.get('modal')}
                    projectList={projectList}
                    backendActions={bindActionCreators(backendActions, dispatch)}
                />
                <Navbar
                    isAuthenticated={isAuthenticated}
                    isWorking={isWorking}
                    message={message}
                    currentPath={currentPath}
                    logout={bindActionCreators(logout, dispatch)}
                />
                <Clock
                    taskList={taskList}
                    backendActions={bindActionCreators(backendActions, dispatch)}
                />

                {this.props.children}

            </div>
        )
    }
}