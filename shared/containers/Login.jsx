import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AuthForm from '../components/auth/AuthForm'
import MascotContainer from '../components/misc/mascot/MascotContainer'
import NotificationPermissionRequester from '../components/misc/NotificationPermissionRequester'
import * as authActions from '../modules/auth'
import { MASCOT_STATUS } from '../utils/enums'


@connect()
export default class Login extends React.Component {

    static propTypes = {
        dispatch: PropTypes.func
    }


    render() {
        const { dispatch } = this.props
        return (
            <div className="row">
                <div className="col px900">
                    <div className="welcome w3-card-4 w3-padding w3-border w3-border-theme w3-round-large"
                         style={{ minHeight: '600px' }}
                    >
                        <div className="w3-padding">
                            <h2 className="w3-text-theme w3-center">Alakrity Week Scheduler</h2>
                            <p>
                                Welcome to the alpha version of the Alakrity Week Scheduler.
                                This web application was created as part of my thesis at the Paderborn University.
                                It is intended as a tool to help you manage a demanding project with all your other
                                responsibilities.

                                Be aware that this is only a prototype/alpha version. This means that you will come
                                across some parts that will not have been fully fleshed out yet and you might encounter
                                some bugs. I&apos;m pretty sure I caught most of the bad ones though. Try a reload if
                                something breaks.
                            </p>
                            <p>
                                You are free to use and play around with this application. But, although I am hopeful, I
                                can not promise that your data will be around for ever, or that the service won&apos;t
                                ever break down. Thank you for your understanding. </p>
                            <p>
                                A manual with a detailed description Alakrity and its features can be found by
                                clicking the <a
                                href="javascript:window.open('/manual', 'Alakrity Manual', 'toolbar=no,status=no,menubar=no,left=0,top=100,width=1200,height=800')"
                                className="material-icons w3-text-theme no-underline"
                                style={{ transform: 'translateY(5px)' }}>help_outline</a> icon at the top right corner.
                            </p>
                            <NotificationPermissionRequester/>
                        </div>
                        <p className="w3-tiny w3-display-bottommiddle">This website uses cookies for
                            authentication purposes only.</p>
                    </div>
                </div>
                <div id="sidebar" className="col sidebar">
                    <div className="login-sidebar w3-card-4 w3-padding w3-border w3-border-theme w3-round-large">
                        <MascotContainer replaceStatus={MASCOT_STATUS.IDLE}/>
                        <AuthForm
                            authActions={bindActionCreators(authActions, dispatch)}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
