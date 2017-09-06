import Immutable from 'immutable'
import * as _ from 'lodash/object'
import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { DEFAULT_PROJECT, thaw } from '../../utils/defaultValues'
import newId from '../../utils/newId'
import ProjectColorPicker from './ProjectColorPicker'

export default class ProjectForm extends React.Component {

    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        project: ImmutablePropTypes.map
    }

    static defaultProps = {
        project: Immutable.fromJS(thaw(DEFAULT_PROJECT))
    }

    constructor(props) {
        super(props)
        this.state = {
            formID: newId('project-form_'),
            errors: [],
            project: this.props.project
        }
    }

    handleSubmit(e) {
        e.preventDefault()
        let errors = []
        if ( this.state.project.get('title').length === 0 ) {
            errors.push('You have not entered a project name!')
        }
        if ( errors.length > 0 ) {
            this.setState(_.merge({}, this.state, { errors: errors }))
        } else {
            this.props.onSubmit(this.state.project)
            this.setState({
                errors: [],
                project: this.props.project
            })
        }
    }

    handleColorPick(color) {
        this.setState(({ project }) => ({
                project: project.set('color', color),
                style: {
                    backgroundColor: color,
                    border: 'solid 1px ' + tinycolor(color).brighten(-35)
                }
            })
        )
    }

    handleTitleChange(e) {
        e.preventDefault()
        this.setState(_.merge({}, this.state, { project: this.state.project.set('title', e.target.value) }))
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
        const { project } = this.props

        return <form
            className="project-edit w3-container w3-card-2 w3-round-large w3-border w3-border-theme w3-leftbar w3-rightbar"
            onSubmit={::this.handleSubmit}>

            <label htmlFor={this.state.formID + '_title'}>Name</label>

            <input
                id={this.state.formID + '_title'}
                type="text"
                className="w3-input"
                placeholder="Project Name"
                value={this.state.project.get('title')}
                onChange={::this.handleTitleChange}
            />

            <label htmlFor={this.state.formID + '_title'}>Description</label>

            <input
                id={this.state.formID + '_description'}
                type="text"
                className="w3-input"
                placeholder="Project Description (optional)"
                value={this.state.project.get('description')}
                onChange={::this.handleTitleChange}
            />

            <ProjectColorPicker
                currentColor={this.state.project.get('color')}
                label={'Color'}
                setColor={::this.handleColorPick}
            />
            <button className="w3-btn-floating">
                {project.size ? 'Create' : 'Save'}
            </button>
            {this.displayErrors(this.state.errors)}
        </form>
    }
}
