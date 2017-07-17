import * as React from 'react'


export default class ProjectColorPicker extends React.Component {

    static propTypes = {
        colors: React.PropTypes.array.isRequired,
        setColor: React.PropTypes.func.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            isActive: false,
            pickedColor: 0
        }
    }

    handleColorClick(e) {
        e.preventDefault()
        this.setState(
            {
                pickedColor: +e.target.value,
                isActive: false
            }
        )
        this.props.setColor(+e.target.value)
        // convoluted way to un-focus the color picker button to close the drawer.
        e.target.parentNode.parentNode.firstChild.blur()
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
        const { colors } = this.props

        let colorButtons = []
        for ( let i = 0; i < colors.length; i++ ) {
            colorButtons.push(
                <button
                    key={'color_' + i}
                    className={'w3-btn w3-round tt-toolbar-color-option' + (i === this.state.pickedColor ?
                                                                            ' tt-tco-selected' : '')}
                    value={i}
                    onMouseDown={::this.handleColorClick}
                    style={
                        {
                            backgroundColor: colors[i]
                        }
                    }
                />
            )
        }
        return <div className="project-color-picker w3-dropdown-click">
            <button
                tabIndex={0}
                onClick={e => e.preventDefault()}
                onFocus={::this.expand}
                onBlur={::this.collapse}
                className="w3-btn w3-round tt-toolbar-color-option"
                style={
                    {
                        backgroundColor: colors[this.state.pickedColor]
                    }
                }
            />
            <div className={`project-color-picker-content w3-dropdown-content w3-card-2 ${this.state.isActive ?
                                                                                          'w3-show' : ''}`}>
                { colorButtons }
            </div>
        </div>
    }
}