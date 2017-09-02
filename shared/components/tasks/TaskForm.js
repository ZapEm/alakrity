import PropTypes from 'prop-types'
import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import IconButton from '../misc/IconButton'


export default class TaskForm extends React.Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        task: ImmutablePropTypes.map,
        textLabel: PropTypes.string,
        editing: PropTypes.bool,
        projectList: ImmutablePropTypes.list.isRequired
    }

    constructor(props) {
        super(props)
        if ( this.props.hasOwnProperty('task') ) {
            this.state = {
                errors: [],
                text: this.props.task.get('text') || '',
                repeating: this.props.task.get('repeating') || false,
                start: this.props.task.get('start') || null,
                duration: this.props.task.get('duration') || 120,
                projectID: this.props.task.get('projectID') || 'none'
            }
        } else {
            this.state = {
                errors: [],
                text: '',
                repeating: false,
                start: null,
                duration: 120,
                projectID: 'none'
            }
        }

    }

    handleSubmit(e) {
        e.preventDefault()
        let errors = []

        // console.log(e, this.state);

        if ( this.state.text.length === 0 ) {
            errors.push('You have not entered a task name!')
        }

        if ( errors && errors.length > 0 ) {
            this.setState({ errors: errors })
        } else {
            this.props.onSubmit({
                id: this.props.editing ? this.props.task.get('id') : undefined,
                text: this.state.text,
                repeating: this.state.repeating,
                start: this.state.start,
                duration: this.state.duration,
                projectID: this.state.projectID
            })
            this.setState({ text: '' })
        }
    }

    handleTextChange(e) {
        this.setState({ text: e.target.value })
    }

    handleDurationChange(e) {
        this.setState({ duration: e.target.value })
    }

    handleSelectProject(e) {
        this.setState({ projectID: e.target.value })
    }


    render() {
        const { editing, textLabel, projectList } = this.props
        let saveText = (editing) ? 'done' : 'add_box'

        const disabled = (projectList.size === 0) ? 'A project needs to be created first.' : false
        let projectSelectOptions = []
        if ( !disabled ) {
            for ( let project of projectList ) {
                projectSelectOptions.push(
                    <option key={project.get('id')}
                            value={project.get('id')}
                    >{project.get('title')}</option>
                )
            }
        } else {
            projectSelectOptions.push(
                <option key={'noProject'}
                        value={'noProject'}
                        selected
                        disabled>{'Create a project first'}</option>
            )
        }


        return (
            <form
                onSubmit={::this.handleSubmit}
                className="task-form w3-container w3-card-2 w3-round-large w3-border w3-border-theme w3-leftbar w3-rightbar"
            >
                <input
                    className="w3-input"
                    type="text"
                    placeholder={textLabel}
                    value={this.state.text}
                    onChange={::this.handleTextChange}
                    disabled={disabled}
                />
                <select
                    onChange={::this.handleSelectProject}
                    className={'w3-select w3-right' + (disabled ? ' w3-text-gray' : '')}
                    name="option"
                    style={{
                        padding: '8px 4px'
                    }}
                    disabled={disabled}
                >
                    {projectSelectOptions}
                </select>


                <input
                    className="w3-input"
                    type="range"
                    step={30}
                    min={30}
                    max={240}
                    value={this.state.duration}
                    onChange={::this.handleDurationChange}
                    disabled={disabled}
                />
                <span>{this.state.duration}</span>
                <IconButton
                    iconName={saveText}
                    disabled={disabled}
                />
            </form>
        )
    }
}