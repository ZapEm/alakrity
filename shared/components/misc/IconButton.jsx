import * as React from 'react'
import newId from '../../utils/newId'

export default class IconButton extends React.Component {

    static propTypes = {
        iconName: React.PropTypes.string.isRequired,
        tooltip: React.PropTypes.string,
        label: React.PropTypes.string,
        disabled: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]),
        onClick: React.PropTypes.func,
        dangerLevel: React.PropTypes.string,
        style: React.PropTypes.object
    }

    render() {
        const { iconName, label, onClick, style = {}, dangerLevel = 'default', disabled = false, tooltip = '' } = this.props
        const extraClassNames =
            {
                'default': 'w3-text-theme w3-hover-theme',
                'warn': 'w3-text-deep-orange w3-hover-deep-orange',
                'danger': 'w3-text-pink w3-hover-pink',
                'disabled': 'w3-text-gray'
            }


        style.backgroundColor = 'rgba(255,255,255,0.8)'
        style.border = '1px solid'
        if ( disabled ) {
            style.cursor = 'help'
        }

        let id = ''
        if ( label ) {
            id = newId('IconButton_')
        }

        let button = <button
            className={'material-icons icon-button w3-round ' + (extraClassNames[!disabled ?
                                                                                 dangerLevel :
                                                                                 'disabled'] || 'w3-text-theme')}
            id={id}
            style={style}
            onClick={onClick}
            disabled={disabled}
            title={!disabled ? tooltip : disabled}
        >
            {iconName}
        </button>


        return (label
            ? <div className="icon-button-wrapper">
                    <label
                        title={!disabled ? tooltip : disabled}
                        className="icon-button-label"
                        htmlFor={id}>{label}
                    </label>
                    {button}
                </div>
            : button)

    }
}