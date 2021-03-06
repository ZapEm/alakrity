import classNames from 'classnames'
import * as _ from 'lodash/object'
import PropTypes from 'prop-types'
import React from 'react'
import { DANGER_LEVELS } from '../../utils/constants'
import newId from '../../utils/newId'

export default class IconButton extends React.Component {

    static propTypes = {
        iconName: PropTypes.string.isRequired,
        formID: PropTypes.string,
        tooltip: PropTypes.string,
        label: PropTypes.string,
        disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        onClick: PropTypes.func,
        dangerLevel: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        style: PropTypes.object,
        unarmedDangerLevel: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        unarmedIconName: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        noSubmit: PropTypes.bool
    }


    static defaultProps = {
        unarmedDangerLevel: false,
        unarmedIconName: false,
        noSubmit: false,
        disabled: false,
        tooltip: '',
        style: {}
    }

    constructor(props) {
        super(props)
        this.state = {
            staged: !!this.props.unarmedDangerLevel,
            armed: false
        }
    }

    handleClick(e) {
        if ( !this.timeOut ) {
            if ( this.props.unarmedDangerLevel && !this.state.armed ) {
                this.timeOut = true
                e.preventDefault()
                this.setState({ armed: true })
                setTimeout(() => {
                    this.timeOut = false
                }, 400)
            } else {
                if ( this.props.onClick ) {
                    this.props.onClick(e)
                }
                this.setState({ armed: false })
            }
        }
    }

    handleBlur(e) {
        e.preventDefault()
        this.setState({ armed: false })
    }

    render() {
        const {
            iconName, formID, label, unarmedDangerLevel, unarmedIconName,
            style: oldStyle, dangerLevel: oldDangerLevel, disabled, tooltip, noSubmit
        } = this.props
        const { staged, armed } = this.state

        const dangerLevel = (typeof oldDangerLevel === 'object' && oldDangerLevel.both) ? oldDangerLevel.both :
                            (typeof oldDangerLevel === 'string') ? oldDangerLevel :
                            DANGER_LEVELS.DEFAULT.both


        const style = _.merge({}, oldStyle, {
            border: '1px solid',
            ...disabled && { cursor: 'help' }
        })

        let id = ''
        if ( label ) {
            id = newId('IconButton_')
        }

        let button = <button
            type={noSubmit ? 'button' : 'submit'}
            form={formID}
            className={classNames('material-icons', 'icon-button w3-round',
                {
                    [DANGER_LEVELS.DISABLED.both]: disabled,
                    'disabled': disabled,
                    [unarmedDangerLevel]: !disabled && staged && !armed,
                    [dangerLevel]: !disabled && (!staged || armed),
                    'animate-arming': !disabled && staged && armed
                })
            }
            id={id}
            style={style}
            onClick={::this.handleClick}
            onBlur={::this.handleBlur}
            disabled={disabled}
            title={!disabled ? tooltip : disabled}
        >
            {(!staged || !unarmedIconName || armed) ? iconName : unarmedIconName}
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