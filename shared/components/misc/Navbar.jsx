import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router'
import LogoutButton from '../auth/Logout'
import Clock from '../backend/Clock'


export default class Navbar extends React.Component {
    static propTypes = {
        isWorking: PropTypes.bool,
        isAuthenticated: PropTypes.bool.isRequired,
        message: PropTypes.string,
        logout: PropTypes.func.isRequired,
        currentPath: PropTypes.string,
        taskList: ImmutablePropTypes.list.isRequired,
        backendActions: PropTypes.objectOf(PropTypes.func).isRequired,
        userID: PropTypes.string
    }

    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props, context) {
        super(props, context)
    }

    render() {
        const { isAuthenticated, logout, currentPath, userID } = this.props
        const style = { width: '15%' }

        return (
            <div className="w3-row w3-top w3-theme-l4 w3-card">
                <nav id="navbar" style={{ maxWidth: '1200px' }}>
                    <div className="w3-bar w3-large w3-theme-d1">
                        {isAuthenticated
                            ? [<Link
                                   key={'timetable'} style={style}
                                   className={(currentPath === '/' ? 'w3-theme-l1' :
                                               'w3-hover-theme') + ' navbar-button w3-bar-item w3-center no-underline'}
                                   to={'/'}
                               >Timetable</Link>,
                               <Link
                                   key={'tasks'} style={style}
                                   className={(currentPath === '/tasks' ? 'w3-theme-l1' :
                                               'w3-hover-theme') + ' navbar-button w3-bar-item w3-center no-underline'}
                                   to={'/tasks'}
                               >Tasks</Link>,
                               <Link
                                   key={'projects'} style={style}
                                   className={(currentPath === '/projects' ? 'w3-theme-l1' :
                                               'w3-hover-theme') + ' navbar-button w3-bar-item w3-center no-underline'}
                                   to={'/projects'}
                               >Projects</Link>,
                               <Link
                                   key={'statistics'} style={style}
                                   className={(currentPath === '/statistics' ? 'w3-theme-l1' :
                                               'w3-hover-theme') + ' navbar-button w3-bar-item w3-center no-underline'}
                                   to={'/statistics'}
                               >Statistics</Link>
                            ] :
                         <Link
                             key={'login'} style={style}
                             className={(currentPath === '/login' ? 'w3-theme-l1' :
                                         'w3-hover-theme') + ' navbar-button w3-bar-item w3-center no-underline'}
                             to={'/login'}
                         >Login</Link>
                        }


                        <Link
                            to={'/manual'}
                            onClick={(e) => {
                                e.preventDefault()
                                const manualPath = '/manual' + ((currentPath !== '/login') ? (currentPath === '/') ? '#manual-chapter-timetable' : currentPath.replace('/', '#manual-chapter-') : '')
                                window.open(manualPath, 'Alakrity Manual', 'toolbar=no,scrollbars=yes,status=no,menubar=no,left=0,top=100,width=1234,height=800')
                            }}
                            className="material-icons w3-hover-theme navbar-button no-underline w3-right navbar-help-icon"
                        >help_outline</Link>

                        {isAuthenticated &&
                        <div className="w3-right">
                            <LogoutButton onLogoutClick={logout}/>
                        </div>}

                        {userID &&
                        <div
                            className="material-icons navbar-user-icon w3-right"
                            title={'Logged in as "' + userID + '"'}
                        >face</div>
                        }

                        {isAuthenticated &&
                        <div className="navbar-clock-wrapper">
                            <Clock/>
                        </div>}
                    </div>
                </nav>
            </div>
        )
    }
}