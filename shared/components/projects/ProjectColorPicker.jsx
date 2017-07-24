import * as React from 'react'
import newId from '../../utils/newId'


export default class ProjectColorPicker extends React.Component {

    static propTypes = {
        colors: React.PropTypes.array.isRequired,
        setColor: React.PropTypes.func.isRequired,
        label: React.PropTypes.string
    }

    constructor(props) {
        super(props)
        this.state = {
            isActive: false,
            pickedColor: 0
        }
    }

    componentWillMount(){
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
        this.props.setColor(this.props.colors[+e.target.value])
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

    // Doesn't play nice with onfocus/onblur
    // toggle(e){
    //     e.preventDefault()
    //     if(this.colorPicker === document.activeElement){
    //         this.colorPicker.blur()
    //     }
    // }


    render() {
        const { colors, label } = this.props

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
                        backgroundColor: colors[this.state.pickedColor]
                    }
                }
            />
            <div
                className={`project-color-picker-content w3-dropdown-content w3-card-2
                w3-round w3-border w3-border-theme ${this.state.isActive ? 'w3-show' : ''}`}>
                {colorButtons}
            </div>
        </div>
    }
}