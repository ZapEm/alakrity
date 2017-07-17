import * as React from 'react'


export default class Logout extends React.Component {
    static propTypes = {
        onLogoutClick: React.PropTypes.func.isRequired
    }

    render() {
        const { onLogoutClick } = this.props

        return (
            <button onClick={() => onLogoutClick()} className="w3-btn w3-theme-d4">
                Logout
            </button>
        )
    }
}