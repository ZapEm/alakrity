import * as React from 'react'
import { DANGER_LEVELS } from '../../utils/constants'
import newId from '../../utils/newId'

export default class IconButton extends React.Component {

    static propTypes = {
        iconName: React.PropTypes.string.isRequired,
        formID: React.PropTypes.string,
        tooltip: React.PropTypes.string,
        label: React.PropTypes.string,
        disabled: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]),
        onClick: React.PropTypes.func,
        dangerLevel: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
        style: React.PropTypes.object
    }

    render() {
        const { iconName, formID, label, onClick, style = {}, disabled = false, tooltip = '' } = this.props
        let { dangerLevel } = this.props

        dangerLevel = (typeof dangerLevel === 'object' && dangerLevel.both) ? dangerLevel.both :
                      (typeof dangerLevel === 'string') ? dangerLevel :
                      DANGER_LEVELS.DEFAULT.both

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
            form={formID}
            className={'material-icons icon-button w3-round ' + (!disabled ? dangerLevel : DANGER_LEVELS.DISABLED.both + ' disabled')}
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