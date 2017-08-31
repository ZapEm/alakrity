import * as React from 'react'
import { DANGER_LEVELS } from '../../utils/constants'

export default class LabeledIconButton extends React.Component {

    static propTypes = {
        iconName: React.PropTypes.string.isRequired,
        tooltip: React.PropTypes.string,
        label: React.PropTypes.string.isRequired,
        disabled: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]),
        onClick: React.PropTypes.func,
        dangerLevel: React.PropTypes.string,
        style: React.PropTypes.object
    }

    render() {
        const { iconName, label, onClick, style = {}, disabled = false, tooltip = '' } = this.props
        let { dangerLevel } = this.props

        dangerLevel = (typeof dangerLevel === 'object' && dangerLevel.both) ? dangerLevel.both :
                      (typeof dangerLevel === 'string') ? dangerLevel :
                      DANGER_LEVELS.DEFAULT.both

        style.backgroundColor = 'rgba(255,255,255,0.8)'
        style.border = '1px solid'
        if ( disabled ) {
            style.cursor = 'help'
        }

        let button = <button
            className={'labeled-icon-button w3-round ' + (!disabled ? dangerLevel : DANGER_LEVELS.DISABLED.both + ' disabled')}
            style={style}
            onClick={onClick}
            disabled={disabled}
            title={!disabled ? tooltip : disabled}
        >
            <i className="material-icons labeled-icon-button-icon">{iconName}</i>
            <span className="labeled-icon-button-label">{label}</span>

        </button>

        return (button)

    }
}