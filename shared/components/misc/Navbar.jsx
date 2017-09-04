import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router'
import LogoutButton from '../auth/Logout'
import Spinner from './Spinner'
import Clock from '../backend/Clock'
import ImmutablePropTypes from 'react-immutable-proptypes'


export default class Navbar extends React.Component {
    static propTypes = {
        isWorking: PropTypes.bool,
        isAuthenticated: PropTypes.bool.isRequired,
        message: PropTypes.string,
        logout: PropTypes.func.isRequired,
        currentPath: PropTypes.string,
        taskList: ImmutablePropTypes.list.isRequired,
        backendActions: PropTypes.objectOf(PropTypes.func).isRequired
    }

    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props, context) {
        super(props, context)
    }

    render() {
        const { isWorking, isAuthenticated, message, logout, currentPath, taskList, backendActions } = this.props
        return (
            <div className="w3-row w3-top w3-theme-l4">
                <nav id="navbar" style={{ maxWidth: '1200px' }}>
                    <div className="w3-bar w3-large w3-theme-d1">
                        {isAuthenticated
                            ? [<Link
                                   key={'timetable'} style={{ width: '15%' }}
                                   className={(currentPath === '/' ? 'w3-theme-l1' :
                                               'w3-hover-theme') + ' w3-bar-item w3-center no-underline'}
                                   to={'/'}
                               >Timetable</Link>,
                               <Link
                                   key={'tasks'} style={{ width: '15%' }}
                                   className={(currentPath === '/tasks' ? 'w3-theme-l1' :
                                               'w3-hover-theme') + ' w3-bar-item w3-center no-underline'}
                                   to={'/tasks'}
                               >Tasks</Link>,
                               <Link
                                   key={'projects'} style={{ width: '15%' }}
                                   className={(currentPath === '/projects' ? 'w3-theme-l1' :
                                               'w3-hover-theme') + ' w3-bar-item w3-center no-underline'}
                                   to={'/projects'}
                               >Projects</Link>
                            ] :
                         <Link
                             key={'login'} style={{ width: '15%' }}
                             className={(currentPath === '/login' ? 'w3-theme-l1' :
                                         'w3-hover-theme') + ' w3-bar-item w3-center no-underline'}
                             to={'/login'}
                         >Login</Link>
                        }

                        {isAuthenticated &&
                        <div className="w3-right">
                            <LogoutButton onLogoutClick={logout}/>
                        </div>}

                        {process.env.NODE_ENV !== 'production' &&
                        <div className="w3-right w3-medium">
                            <Spinner status={isWorking ? 'WORKING' : isAuthenticated ? 'IDLE' : 'WARNING'}/>
                        </div>}

                        {isAuthenticated &&
                        <div className="w3-right">
                            <Clock
                                taskList={taskList}
                                backendActions={backendActions}
                            />
                        </div>}

                        {message && process.env.NODE_ENV !== 'production' &&
                        <div className="w3-right">
                            <div className="w3-right navbar-message w3-animate-opacity">{message}</div>
                        </div>}
                    </div>
                </nav>
            </div>
        )
    }
}