import PropTypes from 'prop-types'
import * as React from 'react'
import IconButton from '../misc/IconButton'
import CreateAccount from './CreateAccount'
import Login from './Login'

export default class AuthForm extends React.Component {

    static propTypes = {
        authActions: PropTypes.objectOf(PropTypes.func).isRequired
    }

    constructor() {
        super()
        this.state = {
            display: 'login'
        }
    }

    handleToggle(e) {
        e.preventDefault()
        this.setState({ display: this.state.display === 'login' ? 'create' : 'login' })
    }

    render() {
        const { authActions } = this.props

        return (this.state.display === 'login') ?
               <div className="auth-form">
                   <h3 className="w3-text-theme">Please log in</h3>
                   <Login
                       login={authActions.login}
                   />
                   <div className="w3-border-bottom w3-border-theme w3-padding"/>
                   <div className="auth-form-right">
                       <IconButton
                           label="Need an account?"
                           iconName="forward"
                           onClick={::this.handleToggle}
                       />
                   </div>
               </div>
            :
               <div className="auth-form">
                   <h3 className="w3-text-theme">Create new account</h3>
                   <CreateAccount
                       createUser={authActions.createUser}
                   />
                   <div className="w3-border-bottom w3-border-theme w3-padding"/>
                   <div className="auth-form-right">
                       <IconButton
                           label="Got an account?"
                           iconName="forward"
                           onClick={::this.handleToggle}
                       /></div>

               </div>
    }
}