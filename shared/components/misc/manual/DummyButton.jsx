import * as React from 'react'
import PropTypes from 'prop-types'

export default class DummyButton extends React.Component {

    static propTypes = {
        icon: PropTypes.string,
        label: PropTypes.string
    }

    render() {
        const { icon, label } = this.props

        if(label){
            return <button
                className="labeled-icon-button w3-border w3-border-theme w3-text-theme w3-round dummy-label-button"
            >
                <i className="material-icons labeled-icon-button-icon">{icon}</i>
                <span className="labeled-icon-button-label">{label}</span>
            </button>
        }

        return <button
            className="material-icons icon-button w3-round w3-border w3-border-theme w3-text-theme dummy-button"
        >
            {icon}
        </button>
    }
}