import PropTypes from 'prop-types'
import React from 'react'


export default class Logout extends React.Component {
    static propTypes = {
        onLogoutClick: PropTypes.func.isRequired
    }

    handleLogout(e){
        e.preventDefault()
        this.props.onLogoutClick()
    }

    render() {
        return (
            <a
                className="w3-hover-theme w3-bar-item w3-center no-underline"
                href=""
                onClick={::this.handleLogout}
            >
                Logout
            </a>
        )
    }
}