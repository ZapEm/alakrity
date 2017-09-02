import * as _ from 'lodash/object'
import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { PROJECT_COLORS } from '../../utils/constants'
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
            errors: [],
            project: this.props.project.toJSON()
        }
    }

    componentWillMount() {
        this.id = newId('pjt-edit_')
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
                errors: []
                //project: this.props.project.toJSON()
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
        const { style } = this.props

        return <form
            className="project-formtask-form project w3-card-2 w3-display-container w3-card-2 w3-round-large"
            onSubmit={::this.handleSubmit}
            style={style}
        >

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
                colors={PROJECT_COLORS}
            />
            <button className="w3-btn-floating">
                {'Save'}
            </button>
            {this.displayErrors(this.state.errors)}
        </form>
    }
}
