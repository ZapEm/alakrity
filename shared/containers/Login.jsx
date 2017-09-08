import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AuthForm from '../components/auth/AuthForm'
import * as authActions from '../modules/auth'


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
                    <div className="welcome w3-card-4 w3-padding w3-border w3-border-theme w3-round-large">
                        <h2 className="w3-text-theme w3-center">Alakrity Week Scheduler</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis blandit vehicula sem ac
                            porttitor. Ut id ligula velit. Donec arcu eros, consequat non nunc eget, aliquet dictum
                            felis. Sed eget libero quis libero consectetur dictum sed eget justo. </p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis blandit vehicula sem ac
                            porttitor. Ut id ligula velit. Donec arcu eros, consequat non nunc eget, aliquet dictum
                            felis. Sed eget libero quis libero consectetur dictum sed eget justo. </p>
                    </div>
                </div>
                <div id="sidebar" className="col sidebar">
                    <div className="login-sidebar w3-card-4 w3-padding w3-border w3-border-theme w3-round-large">
                        <AuthForm
                            authActions={bindActionCreators(authActions, dispatch)}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
