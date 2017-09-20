import PropTypes from 'prop-types'
import React from 'react'
import tinycolor from 'tinycolor2'
import { PROJECT_COLORS } from '../../utils/constants'
import newId from '../../utils/newId'


export default class ProjectColorPicker extends React.Component {

    static propTypes = {
        currentColor: PropTypes.string,
        setColor: PropTypes.func.isRequired,
        label: PropTypes.string
    }

    static defaultProps = {
        currentColor: PROJECT_COLORS[0]
    }

    constructor(props) {
        super(props)

        const colorIndex = PROJECT_COLORS.indexOf(this.props.currentColor)
        this.state = {
            isActive: false,
            pickedColor: colorIndex !== -1 ? colorIndex : 0
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
                    className={'w3-btn w3-round project-color-picker-option' + (i === this.state.pickedColor ?
                                                                                ' tt-tco-selected' : '')}
                    value={i}
                    onMouseDown={::this.handleColorClick}
                    style={
                        {
                            backgroundColor: PROJECT_COLORS[i],
                            border: ('solid 1px ' + tinycolor(PROJECT_COLORS[i]).brighten(-35))
                        }
                    }
                />
            )
        }
        return <div className="project-color-picker">
            <div className="project-color-picker-item"><label>{label}</label>
                <div
                    id={this.id}
                    ref={ref => this.colorPicker = ref}
                    tabIndex={0}
                    onClick={e => e.preventDefault()}
                    onFocus={::this.expand}
                    onBlur={::this.collapse}
                    className={'w3-btn w3-dropdown-click w3-round project-color-picker-option'}
                    style={
                        {
                            backgroundColor: tinycolor(PROJECT_COLORS[this.state.pickedColor]).brighten(10),
                            border: ('solid 1px ' + tinycolor(PROJECT_COLORS[this.state.pickedColor]).brighten(-35)),
                            display: !this.state.isActive ? 'block' : 'hidden'
                        }
                    }
                />
                <div
                    className={`project-color-picker-content w3-dropdown-content w3-card-2 w3-round ${this.state.isActive ?
                                                                                                      'w3-show-inline-block' :
                                                                                                      ''}`}
                    style={{
                        //backgroundColor: tinycolor(PROJECT_COLORS[this.state.pickedColor]).brighten(10),
                        border: ('solid 1px ' + tinycolor(PROJECT_COLORS[this.state.pickedColor]).brighten(-35))
                    }}
                >
                    <div
                        className="project-color-picker-grid"
                    >
                        {colorButtons}
                    </div>
                </div>
            </div>
        </div>
    }
}