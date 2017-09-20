import PropTypes from 'prop-types'
import React from 'react'
import LabeledIconButton from '../misc/LabeledIconButton'


export default class Login extends React.Component {

    static propTypes = {
        login: PropTypes.func.isRequired,
        errorMessage: PropTypes.string
    }

    handleSubmit(e) {
        e.preventDefault()
        this.props.login(this.username.value.trim(), this.password.value.trim())
    }

    render() {

        return (
            <form
                className="auth-form-login"
                onSubmit={::this.handleSubmit}
            >
                <input
                    className="auth-form-input w3-input"
                    type="text"
                    ref={username => this.username = username}
                    placeholder="Username"
                    autoFocus
                    required
                />
                <input
                    className="auth-form-input w3-input"
                    type="password"
                    ref={password => this.password = password}
                    placeholder="Password"
                    required
                />
                <div className="auth-form-right">
                    <LabeledIconButton
                        style={{
                            marginLeft: 'auto',
                            marginRight: 0
                        }}
                        label="Login"
                        iconName="lock_open"
                        //onClick={::this.handleSubmit}
                    />
                </div>
            </form>
        )
    }
}
