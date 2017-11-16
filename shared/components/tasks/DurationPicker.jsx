import classNames from 'classnames'
import PropTypes from 'prop-types'
import * as React from 'react'

export default class DurationPicker extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        classNameElements: PropTypes.string,
        min: PropTypes.number,
        max: PropTypes.number,
        defaultValue: PropTypes.number,
        value: PropTypes.number,
        step: PropTypes.number,
        group: PropTypes.number,
        onChange: PropTypes.func.isRequired,
        mapper: PropTypes.func
    }

    static defaultProps = {
        className: '',
        classNameElements: '',
        min: 0,
        max: 10,
        step: 1,
        group: 1,
        value: 5,
        onChange: (value) => value,
        mapper: (value) => value
    }


    handleElementClick(value) {
        if ( value !== this.props.value ) {
            this.props.onChange(value)
            //this.setState({ currentValue: value })
        }
    }

    handleKeyDown(e) {
        // ArrowUp
        if ( e.keyCode === 40 || e.keyCode === 39 ) {
            e.preventDefault()
            if ( this.props.value + this.props.step <= this.props.max ) {
                this.props.onChange(this.props.value + this.props.step)
            }

        }
        // ArrowDown
        if ( e.keyCode === 38 || e.keyCode === 37 ) {
            e.preventDefault()
            if ( this.props.value - this.props.step >= this.props.min ) {
                this.props.onChange(this.props.value - this.props.step)
            }
        }
    }

    render() {
        const { className, classNameElements, min, max, step, group, mapper, value: currentValue } = this.props

        let elements = []
        for ( let value = min; value <= max; value += step ) {
            const elementGroup = 'duration-element-' + ((value / step) % group)

            elements.push(
                <div
                    className={classNames('duration-picker-element', elementGroup, classNameElements, {
                        'selected': currentValue === value,
                        'lower': currentValue > value
                    })}
                    onClick={() => this.handleElementClick(value)}
                    key={value}
                >
                    <span className="duration-picker-element-label">{mapper(value)}</span>
                </div>
            )
        }


        return <div className={'duration-picker ' + className} tabIndex={0} onKeyDownCapture={::this.handleKeyDown}>
            {elements}
        </div>
    }
}