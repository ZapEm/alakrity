import * as React from 'react'
import PropTypes from 'prop-types'

export default class DummyButton extends React.Component {

    static propTypes = {
        icon: PropTypes.string,
        label: PropTypes.string
    }

    render() {
        const { icon, label } = this.props
        return <button
            className="labeled-icon-button w3-border w3-border-theme w3-text-theme w3-round dummy-button"
        >
            <i className="material-icons labeled-icon-button-icon">{icon}</i>
            <span className="labeled-icon-button-label">{label}</span>
        </button>
    }
}