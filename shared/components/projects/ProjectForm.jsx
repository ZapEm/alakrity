import Immutable from 'immutable'
import * as _ from 'lodash/object'
import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import newId from '../../utils/newId'
import ProjectColorPicker from './ProjectColorPicker'
import { TASK_TYPES } from '../../utils/constants'

export default class ProjectForm extends React.Component {

    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        project: ImmutablePropTypes.map
    }

    static defaultProps = {
        project: Immutable.fromJS(
            {
                title: '',
                color: '#FFFFFF',
                defaultTaskType: TASK_TYPES.standard,
                tracked: true
            }
        )
    }

    constructor(props) {
        super(props)
        this.state = {
            errors: [],
            project: this.props.project.toJSON()
        }
    }

    componentWillMount() {
        this.id = newId('project-form_')
    }

    handleSubmit(e) {
        e.preventDefault()
        let errors = []
        if ( this.state.project.title.length === 0 ) {
            errors.push('You have not entered a project name!')
        }
        if ( errors.length > 0 ) {
            this.setState(_.merge({}, this.state, { errors: errors }))
        } else {
            this.props.onSubmit(this.state.project)
            this.setState({
                errors: [],
                project: this.props.project.toJSON()
            })
        }
    }

    handleTitleChange(e) {
        e.preventDefault()
        this.setState(_.merge({}, this.state, { project: { title: e.target.value } }))
    }

    /**
     * Creates an array of html elements from an error list
     * @param errors {Array} array of strings with error messages
     * @returns {Array}
     */
    displayErrors(errors = []) {
        let errorElements = []
        for ( let [index, error] of errors.entries() ) {
            errorElements.push(<span className="input-error" key={'error_' + index}>{error}</span>)
        }
        return errorElements
    }

    render() {
        const { project, colors } = this.props

        return <form
            className="project-form w3-container w3-card-2 w3-round-large w3-border w3-border-theme w3-leftbar w3-rightbar"
            onSubmit={::this.handleSubmit}>

            <label htmlFor={this.id + '_title'}>Name</label>

            <input
                id={this.id + '_title'}
                type="text"
                className="w3-input"
                placeholder="Project Name"
                value={this.state.project.title}
                onChange={::this.handleTitleChange}
            />

            <ProjectColorPicker
                label={'Color'}
                setColor={(c) => this.setState(_.merge({}, this.state, { project: { color: c } }))}
                colors={colors}
            />
            <button className="w3-btn-floating">
                {project ? 'Create' : 'Save'}
            </button>
            {this.displayErrors(this.state.errors)}
        </form>
    }
}
