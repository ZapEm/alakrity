import React from 'react'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Navbar from '../components/misc/Navbar'
import { logout } from '../modules/auth'
import { checkWorking } from '../utils/stateChecks'


@connect(state => ({
    isWorking: checkWorking(state),
    isAuthenticated: state.auth.get('isAuthenticated'),
    message: state.auth.get('message') || '',
    currentPath: state.routing.locationBeforeTransitions.pathname || '/'
}))
@DragDropContext(HTML5Backend)
export default class AppRoot extends React.Component {

    static propTypes = {
        children: React.PropTypes.node.isRequired,
        isWorking: React.PropTypes.bool,
        isAuthenticated: React.PropTypes.bool,
        message: React.PropTypes.string,
        dispatch: React.PropTypes.func,
        currentPath: React.PropTypes.string
    }

    static childContextTypes = {
        dragDropManager: React.PropTypes.object
    }

    render() {
        const { isWorking, isAuthenticated, message, dispatch, currentPath } = this.props
        return (
            <div id="app-view" className="main-app">
                <Navbar
                    isAuthenticated={isAuthenticated}
                    isWorking={isWorking}
                    message={message}
                    currentPath={currentPath}
                    logout={bindActionCreators(logout, dispatch)}
                />
                {/*<CustomDragLayer*/}
                    {/*snapToGrid={true}/>*/}
                {this.props.children}

            </div>
        )
    }
}