import PropTypes from 'prop-types'
import React from 'react'

export default class CreateAccount extends React.Component {

    static propTypes = {
        createUser: PropTypes.func.isRequired,
        errorMessage: PropTypes.string
    }

    handleSubmit() {
        this.props.createUser({
            userID: this.userRef.value.trim(),
            password: this.pwRef.value.trim()
        })
    }

    render() {
        const { errorMessage } = this.props

        return (
            <form onSubmit={() => this.handleSubmit()}>
                <input type="text" ref={userRef => this.userRef = userRef} className="form-control" placeholder="Username"/>
                <input type="password" ref={pwRef => this.pwRef = pwRef} className="form-control" placeholder="Password"/>
                <button className="btn btn-primary">
                    Create Account
                </button>

                {errorMessage &&
                <p> {errorMessage} </p>
                }
            </form>
        )
    }
}
