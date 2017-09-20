import * as _ from 'lodash/object'
import PropTypes from 'prop-types'
import * as React from 'react'
import { PROJECT_TYPES } from '../../utils/enums'

export default class ProjectTypeSelector extends React.Component {

    static propTypes = {
        typeKey: PropTypes.string,
        style: PropTypes.object,
        onSelect: PropTypes.func.isRequired
    }

    static defaultProps = {
        typeKey: PROJECT_TYPES.DEFAULT.key
    }

    constructor(props) {
        super(props)
        this.state = {
            open: false,
            type: PROJECT_TYPES[this.props.typeKey]
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ type: PROJECT_TYPES[nextProps.typeKey] })
    }

    handleClick(e) {
        e.preventDefault()
        this.setState({ open: true })
    }

    handleSelect(e) {
        e.preventDefault()
        this.props.onSelect(e.target.dataset.id)
        this.typeButton.blur()
    }

    handleBlur(e) {
        e.preventDefault()
        this.setState({ open: false })
    }

    render() {
        const { style } = this.props
        const { type } = this.state

        const inlineStyle = _.merge({}, {
            placeSelf: 'flex-end',
            margin: '0',
            height: '32px',
            width: '32px'
        }, style)

        const typeOptions = Object.entries(PROJECT_TYPES).map(([key, typeOption]) => (
                <li
                    className="project-type-option"
                    key={key}
                    data-id={key}
                    onMouseDown={::this.handleSelect}
                >
                    <div className="material-icons project-type-option-icon"
                         style={{ color: style.color ? style.color : 'black' }}>
                        {typeOption.icon}
                    </div>
                    <div
                        className="project-type-option-text"
                    >
                        {typeOption.name}
                    </div>
                </li>
            )
        )


        return <div className="project-type-selector">
            <label>
                Type
                <div
                    className="material-icons w3-btn w3-round project-type-button"
                    ref={ref => this.typeButton = ref}
                    style={inlineStyle}
                    onClick={e => e.preventDefault()}
                    onFocus={::this.handleClick}
                    onBlur={::this.handleBlur}
                    tabIndex={0}
                >
                    {type.icon}
                </div>
            </label>
            <ul
                className="project-type-content w3-card w3-border w3-round-large"
                style={{ ...this.state.open && { display: 'block' } }}
            >
                {typeOptions}
            </ul>
        </div>
    }
}