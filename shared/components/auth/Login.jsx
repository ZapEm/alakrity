import * as React from 'react'

export default class Login extends React.Component {

    static propTypes = {
        login: React.PropTypes.func.isRequired,
        errorMessage: React.PropTypes.string
    }

    handleSubmit(e) {
        e.preventDefault()
        this.props.login(this.username.value.trim(), this.password.value.trim())
    }

    render() {

        return (
            <form onSubmit={::this.handleSubmit}>
                <input type="text" ref={username => this.username = username} className="form-control" placeholder="Username" autoFocus/>
                <input type="password" ref={password => this.password = password} className="form-control" placeholder="Password"/>
                <button className="btn btn-primary">
                    Login
                </button>
            </form>
        )
    }
}
