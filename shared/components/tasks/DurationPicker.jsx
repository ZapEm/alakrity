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
        onChange: (value) => value,
        mapper: (value) => value
    }

    constructor(props) {
        super(props)
        this.state = {
            currentValue: this.props.hasOwnProperty('defaultValue') ? this.props.defaultValue : this.props.min
        }
    }

    handleElementClick(value) {
        if(value !== this.state.currentValue){
            this.props.onChange(value)
            this.setState({ currentValue: value })
        }
    }

    render() {
        const { className, classNameElements, min, max, step, group, mapper } = this.props
        const { currentValue } = this.state

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


        return <div className={'duration-picker ' + className}>
            {elements}
        </div>
    }
}