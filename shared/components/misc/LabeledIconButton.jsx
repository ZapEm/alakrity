import * as _ from 'lodash/object'
import PropTypes from 'prop-types'
import React from 'react'
import { DANGER_LEVELS } from '../../utils/constants'

export default class LabeledIconButton extends React.Component {

    static propTypes = {
        iconName: PropTypes.string.isRequired,
        tooltip: PropTypes.string,
        label: PropTypes.string.isRequired,
        disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        onClick: PropTypes.func,
        dangerLevel: PropTypes.string,
        style: PropTypes.object,
        noSubmit: PropTypes.bool
    }

    static defaultProps = {
        disabled: false,
        noSubmit: false,
        style: {},
        tooltip: ''
    }

    render() {
        const { iconName, label, onClick, disabled, tooltip, noSubmit, style: oldStyle } = this.props
        let { dangerLevel } = this.props

        dangerLevel = (typeof dangerLevel === 'object' && dangerLevel.both) ? dangerLevel.both :
                      (typeof dangerLevel === 'string') ? dangerLevel :
                      DANGER_LEVELS.DEFAULT.both

        //style.backgroundColor = 'rgba(255,255,255,1)'
        const style = _.merge({}, oldStyle, {
            border: '1px solid',
            ...disabled && { cursor: 'help' }
        })

        let button = <button
            type={noSubmit ? 'button' : 'submit'}
            className={'labeled-icon-button w3-round ' + (!disabled ? dangerLevel :
                                                          DANGER_LEVELS.DISABLED.both + ' disabled')}
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