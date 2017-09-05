import * as _ from 'lodash/object'
import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import tinycolor from 'tinycolor2'
import newId from '../../utils/newId'
import ProjectColorPicker from './ProjectColorPicker'

export default class ProjectEdit extends React.Component {

    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        project: ImmutablePropTypes.map.isRequired,
        style: PropTypes.object
    }

    constructor(props) {
        super(props)
        this.state = {
            formID: newId('pjt-edit_'),
            errors: [],
            project: this.props.project,
            style: this.props.style
        }
    }

    handleColorPick(color) {
        this.setState(({ project, style }) => ({
                project: project.set('color', color),
                style: _.merge(style, {
                    backgroundColor: color,
                    borderColor: tinycolor(color).brighten(-35)
                })
            })
        )
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
                errors: []
            })
        }
    }

    handleInputChange(e) {
        e.preventDefault()
        this.setState(_.merge({}, this.state, {
            project: this.state.project.merge(
                {
                    title: this.titleInput.value,
                    description: this.descriptionInput.value
                }
            )
        }))
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
        const { style } = this.state

        return <form
            className="project-form task-form project w3-card-2 w3-display-container w3-card-2 w3-round-large"
            onSubmit={::this.handleSubmit}
            style={style}
        >

            <label>
                Name
                <input
                    ref={ref => this.titleInput = ref}
                    type="text"
                    className="w3-input w3-round w3-border"
                    style={{border: this.state.style.border}}
                    placeholder="Project Name"
                    value={this.state.project.get('title')}
                    onChange={::this.handleInputChange}
                />
            </label>

            <label>
                Description
                <textarea
                    id={this.state.formID + '_description'}
                    ref={ref => this.descriptionInput = ref}
                    type="text"
                    className="w3-input w3-round w3-border"
                    style={{border: this.state.style.border}}
                    placeholder="Project Description (optional)"
                    value={this.state.project.get('description')}
                    onChange={::this.handleInputChange}
                />
            </label>

            <ProjectColorPicker
                currentColor={this.state.project.get('color')}
                label={'Color'}
                setColor={::this.handleColorPick}
            />

            <button className="w3-btn-floating">
                {'Save'}
            </button>
            {this.displayErrors(this.state.errors)}
        </form>
    }
}
