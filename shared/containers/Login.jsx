import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AuthForm from '../components/auth/AuthForm'
import * as authActions from '../modules/auth'
import MascotContainer from '../components/misc/mascot/MascotContainer'
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
                        style={{minHeight: '600px'}}
                    >
                        <h2 className="w3-text-theme w3-center">Alakrity Week Scheduler</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis blandit vehicula sem ac
                            porttitor. Ut id ligula velit. Donec arcu eros, consequat non nunc eget, aliquet dictum
                            felis. Sed eget libero quis libero consectetur dictum sed eget justo. </p>
                        <p className="w3-tiny w3-display-bottommiddle">This website uses cookies, but only for authentication purposes.</p>
                    </div>
                </div>
                <div id="sidebar" className="col sidebar">
                    <div className="login-sidebar w3-card-4 w3-padding w3-border w3-border-theme w3-round-large">
                        <MascotContainer />
                        <AuthForm
                            authActions={bindActionCreators(authActions, dispatch)}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
