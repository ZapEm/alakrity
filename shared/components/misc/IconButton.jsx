import * as React from 'react'

export default class IconButton extends React.Component {

    static propTypes = {
        iconName: React.PropTypes.string.isRequired,
        tooltip: React.PropTypes.string,
        disabled: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]),
        onClick: React.PropTypes.func,
        dangerLevel: React.PropTypes.string,
        style: React.PropTypes.object
    }

    render() {
        const { iconName, onClick, style = {}, dangerLevel = 'default', disabled = false, tooltip = '' } = this.props
        const extraClassNames =
            {
                'default': 'w3-text-theme w3-hover-theme',
                'warn': 'w3-text-deep-orange w3-hover-deep-orange',
                'danger': 'w3-text-pink w3-hover-pink',
                'disabled': 'w3-text-gray'
            }

        if (disabled){
            style.cursor = 'help'
            //style.backgroundColor = 'rgb(84, 84, 84)'
        }

        return (
            <button
                className={'material-icons icon-button w3-round icon-button-disabled ' + (extraClassNames[!disabled ? dangerLevel : 'disabled'] || 'w3-text-theme')}
                style={style}
                onClick={onClick}
                disabled={disabled}
                title={!disabled ? tooltip : disabled }
            >
                {iconName}
            </button>
        )
    }
}