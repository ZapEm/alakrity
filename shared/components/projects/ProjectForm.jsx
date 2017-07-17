import Immutable from 'immutable'
import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ProjectColorPicker from './ProjectColorPicker'

export default class ProjectForm extends React.Component {

    static propTypes = {
        onSubmit: React.PropTypes.func.isRequired,
        project: ImmutablePropTypes.map,
        colors: React.PropTypes.array.isRequired
    }

    static defaultProps = {
        project: Immutable.fromJS(
            {
                title: '',
                color: 0
            }
        )
    }

    constructor(props) {
        super(props)
        this.state = props.project.toJSON()
    }


    handleSubmit(e) {
        e.preventDefault()
        this.props.onSubmit(this.state)
    }

    handleTitleChange(e) {
        e.preventDefault()
        this.setState(
            {
                title: e.target.value
            }
        )
    }

    render() {
        const { project, colors } = this.props
        return <form className="project-form" onSubmit={::this.handleSubmit}>
            <input
                type="text"
                className="project-form"
                placeholder="Project Name"
                onChange={::this.handleTitleChange}
            />
            <ProjectColorPicker
                setColor={(c) => this.setState({ color: c })}
                colors={colors}
            />
            <button>
                { project ? 'Create' : 'Save' }
            </button>
        </form>
    }
}
