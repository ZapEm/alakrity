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
import * as taskActions from '../modules/tasks'

import { checkWorking } from '../utils/stateChecks'


@DragDropContext(HTML5Backend)
@connect(state => ({
    isWorking: checkWorking(state),
    isAuthenticated: state.auth.get('isAuthenticated'),
    message: state.auth.get('message') || '',
    settings: state.settings,
    taskList: state.tasks.get('taskList'),
    currentPath: state.routing.locationBeforeTransitions.pathname || '/'
}))
export default class AppRoot extends React.Component {

    static propTypes = {
        children: PropTypes.node.isRequired,
        isWorking: PropTypes.bool,
        isAuthenticated: PropTypes.bool,
        message: PropTypes.string,
        taskList: ImmutablePropTypes.list,
        dispatch: PropTypes.func,
        currentPath: PropTypes.string,
        settings: ImmutablePropTypes.map
    }

    static childContextTypes = {
        dragDropManager: PropTypes.object,
        storeSubscription: PropTypes.any
    }


    render() {
        const { isWorking, isAuthenticated, message, dispatch, currentPath, taskList, settings } = this.props

        // set global moment locale
        moment.locale(settings.get('locale'))
        if ( settings.get('locale') === 'de' ) {
            require('moment/locale/de')
        }

        return (
            <div id="app-view">
                {isAuthenticated && <ModalComponent/>}
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