import * as React from 'react'

export default class Login extends React.Component {

    static propTypes = {
        login: React.PropTypes.func.isRequired,
        errorMessage: React.PropTypes.string
    }

    handleSubmit() {
        this.props.login(this.refs.username.value.trim(), this.refs.password.value.trim())
    }

    render() {

        return (
            <form onSubmit={::this.handleSubmit}>
                <input type="text" ref="username" className="form-control" placeholder="Username"/>
                <input type="password" ref="password" className="form-control" placeholder="Password"/>
                <button className="btn btn-primary">
                    Login
                </button>
            </form>
        )
    }
}
