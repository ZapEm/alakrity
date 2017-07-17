import * as React from 'react'
import { Link } from 'react-router'
import LogoutButton from '../auth/Logout'
import Spinner from './Spinner'


export default class Navbar extends React.Component {
    static propTypes = {
        isWorking: React.PropTypes.bool,
        isAuthenticated: React.PropTypes.bool.isRequired,
        message: React.PropTypes.string,
        logout: React.PropTypes.func.isRequired,
        currentPath: React.PropTypes.string
    }

    static contextTypes = {
        router: React.PropTypes.object
    }

    constructor(props, context) {
        super(props, context)
    }

    render() {
        const { isWorking, isAuthenticated, message, logout, currentPath } = this.props
        return (
            <nav className="w3-row w3-top" style={{ maxWidth: '1200px' }}>
                <div className="w3-bar w3-large w3-theme-d1">
                    { isAuthenticated
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
                           >Tasks</Link>
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
                        <LogoutButton onLogoutClick={ logout }/>
                    </div>}
                    <div className="w3-right w3-medium">
                        <Spinner status={isWorking ? 'WORKING' : isAuthenticated ? 'IDLE' : 'WARNING'}/>
                    </div>
                    {message &&
                    <div className="w3-right">
                        <div className="w3-right navbar-message w3-animate-opacity">{message}</div>
                    </div>}
                </div>
            </nav>
        )
    }
}