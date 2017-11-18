import PropTypes from 'prop-types'
import React from 'react'
import LabeledIconButton from '../misc/LabeledIconButton'

export default class CreateAccount extends React.Component {

    static propTypes = {
        createUser: PropTypes.func.isRequired,
        errorMessage: PropTypes.string,
        toggle: PropTypes.func.isRequired
    }

    handleSubmit(e) {
        e.preventDefault()

        this.props.createUser({
                userID: this.userRef.value.trim(),
                password: this.pwRef.value.trim()
            })
    }

    render() {
        const { errorMessage } = this.props

        return (
            <form
                className="auth-form-create"
                onSubmit={::this.handleSubmit}
            >
                <input
                    className="auth-form-input w3-input"
                    type="text"
                    ref={userRef => this.userRef = userRef}
                    placeholder="Username"
                    autoFocus
                    required
                />
                <input
                    className="auth-form-input w3-input"
                    type="password"
                    ref={pwRef => this.pwRef = pwRef}
                    placeholder="Password"
                    required
                />

                <div className="auth-form-right">
                    <LabeledIconButton
                        style={{
                            marginLeft: 'auto',
                            marginRight: 0
                        }}
                        label="Create Account"
                        iconName="person_add"
                        onClick={::this.handleSubmit}
                    />
                </div>
                {errorMessage &&
                <p> {errorMessage} </p>
                }
            </form>
        )
    }
}
