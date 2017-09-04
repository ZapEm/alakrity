import PropTypes from 'prop-types'
import React from 'react'
import newId from '../../utils/newId'
import { PROJECT_COLORS } from '../../utils/constants'


export default class ProjectColorPicker extends React.Component {

    static propTypes = {
        colors: PropTypes.array.isRequired,
        setColor: PropTypes.func.isRequired,
        label: PropTypes.string
    }

    constructor(props) {
        super(props)
        this.state = {
            isActive: false,
            pickedColor: 0
        }
    }

    componentWillMount() {
        this.id = newId('color_')
    }

    handleColorClick(e) {
        e.preventDefault()
        this.setState(
            {
                pickedColor: +e.target.value,
                isActive: false
            }
        )
        this.props.setColor(PROJECT_COLORS[+e.target.value])
        // convoluted way to un-focus the color picker button to close the drawer.
        this.colorPicker.blur()
    }

    expand(e) {
        e.preventDefault()
        this.setState({ isActive: true })
    }

    collapse(e) {
        e.preventDefault()
        this.setState({ isActive: false })
    }

    render() {
        const { label } = this.props

        let colorButtons = []
        for ( let i = 0; i < PROJECT_COLORS.length; i++ ) {
            colorButtons.push(
                <button
                    key={'color_' + i}
                    className={'w3-btn w3-round tt-toolbar-color-option' + (i === this.state.pickedColor ?
                                                                            ' tt-tco-selected' : '')}
                    value={i}
                    onMouseDown={::this.handleColorClick}
                    style={
                        {
                            backgroundColor: PROJECT_COLORS[i]
                        }
                    }
                />
            )
        }
        return <div className="project-color-picker">
            <label htmlFor={this.id}>{label}</label><br/>
            <button
                id={this.id}
                ref={(button) => this.colorPicker = button}
                tabIndex={0}
                onClick={e => e.preventDefault()}
                onFocus={::this.expand}
                onBlur={::this.collapse}
                className="w3-btn w3-round tt-toolbar-color-option w3-dropdown-click"
                style={
                    {
                        backgroundColor: PROJECT_COLORS[this.state.pickedColor]
                    }
                }
            />
            <div
                className={`project-color-picker-content w3-dropdown-content w3-card-2
                w3-round w3-border w3-border-theme ${this.state.isActive ? 'w3-show-inline-block' : ''}`}>
                {colorButtons}
            </div>
        </div>
    }
}