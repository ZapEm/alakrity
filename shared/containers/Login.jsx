import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CreateAccountForm from '../components/auth/CreateAccount'
import LoginForm from '../components/auth/Login'
import { createUser, login } from '../modules/auth'
// import { checkWorking }         from '../utils/stateChecks';
// import ImmutablePropTypes           from 'react-immutable-proptypes';

//state => ({
// auth: state.auth,
// tasks: state.tasks,
// isWorking: checkWorking(state),
// isAuthenticated: state.auth.get('isAuthenticated')})


@connect()
export default class Login extends React.Component {

    static propTypes = {
        // auth: ImmutablePropTypes.map,
        // tasks: ImmutablePropTypes.map,
        // isWorking: React.PropTypes.bool,
        // isAuthenticated: React.PropTypes.bool,
        dispatch: React.PropTypes.func
    }


    render() {
        const { dispatch } = this.props
        return (
            <div className="react-container">
                <div className="login-form">
                    <span>Please log in...</span>
                    <LoginForm
                        login={ bindActionCreators(login, dispatch) }
                    />
                    <CreateAccountForm
                        createUser={ bindActionCreators(createUser, dispatch) }
                    />
                </div>
            </div>
        )
    }
}
