import * as React from 'react'

export default class Icon extends React.Component {

    static propTypes = {
        iconName: React.PropTypes.string.isRequired,
        style: React.PropTypes.object
    }

    render() {
        const { iconName, style = {} } = this.props
        return <i className="material-icons w3-text-theme" style={style}>
            { iconName }
        </i>
    }
}