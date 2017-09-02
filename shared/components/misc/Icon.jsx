import PropTypes from 'prop-types'
import React from 'react'

export default class Icon extends React.Component {

    static propTypes = {
        iconName: PropTypes.string.isRequired,
        style: PropTypes.object
    }

    render() {
        const { iconName, style = {} } = this.props
        return <i className="material-icons w3-text-theme" style={style}>
            {iconName}
        </i>
    }
}