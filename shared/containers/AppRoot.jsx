import PropTypes from 'prop-types'
import React from 'react'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Clock from '../components/backend/Clock'
import ModalComponent from '../components/misc/Modals/ModalComponent'
import Navbar from '../components/misc/Navbar'
import { logout } from '../modules/auth'
import * as backendActions from '../modules/backend'
import { checkWorking } from '../utils/stateChecks'


@DragDropContext(HTML5Backend)
@connect(state => ({
    isWorking: checkWorking(state),
    isAuthenticated: state.auth.get('isAuthenticated'),
    message: state.auth.get('message') || '',
    backend: state.backend,
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
        currentPath: PropTypes.string
    }

    static childContextTypes = {
        dragDropManager: PropTypes.object,
        storeSubscription: PropTypes.any
    }

    render() {
        const { isWorking, isAuthenticated, message, dispatch, currentPath, backend, taskList, projectList } = this.props
        return (<div id="app-view" className="main-app">


                {isAuthenticated && <ModalComponent
                    modalsOM={backend.get('modalsOM')}
                    projectList={projectList}
                    backendActions={bindActionCreators(backendActions, dispatch)}
                />}
                <Navbar
                    isAuthenticated={isAuthenticated}
                    isWorking={isWorking}
                    message={message}
                    currentPath={currentPath}
                    logout={bindActionCreators(logout, dispatch)}
                />
                {isAuthenticated && <Clock
                    taskList={taskList}
                    backendActions={bindActionCreators(backendActions, dispatch)}
                />}

                {this.props.children}

            </div>

        )
    }
}
