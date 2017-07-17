import * as React from 'react'

export default class CreateAccount extends React.Component {

    static propTypes = {
        createUser: React.PropTypes.func.isRequired,
        errorMessage: React.PropTypes.string
    }

    handleSubmit() {
        this.props.createUser({
            userID: this.refs.username.value.trim(),
            password: this.refs.password.value.trim()
        })
    }

    render() {
        const { errorMessage } = this.props

        return (
            <form onSubmit={() => this.handleSubmit()}>
                <input type="text" ref="username" className="form-control" placeholder="Username"/>
                <input type="password" ref="password" className="form-control" placeholder="Password"/>
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
