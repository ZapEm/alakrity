import * as _ from 'lodash/object'
import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import tinycolor from 'tinycolor2'
import newId from '../../utils/newId'
import LabeledIconButton from '../misc/LabeledIconButton'
import ProjectColorPicker from './ProjectColorPicker'
import { TASK_TYPES } from '../../utils/constants'

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
                style: _.merge({}, style, {
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
            className="project-form project w3-padding w3-card w3-display-container w3-round-large"
            onSubmit={::this.handleSubmit}
            style={style}
        >

            <label>
                Project Name
                <input
                    ref={ref => this.titleInput = ref}
                    type="text"
                    className="project-input w3-input w3-round w3-border"
                    style={{ border: this.state.style.border }}
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
                    rows="3"
                    className="project-description-area project-input w3-input w3-round w3-border"
                    style={{ border: this.state.style.border }}
                    placeholder="(Optional)"
                    value={this.state.project.get('description')}
                    onChange={::this.handleInputChange}
                />
            </label>

            <ProjectColorPicker
                currentColor={this.state.project.get('color')}
                label={'Color'}
                setColor={::this.handleColorPick}
            />

            <label>Default Task Type
                <select className="w3-select" name="option">
                    <option value={TASK_TYPES.standard}>Standard</option>
                    <option value={TASK_TYPES.oneTime}>Appointment</option>
                    <option value={TASK_TYPES.repeating}>Repeating</option>
                </select>
            </label>

            {this.displayErrors(this.state.errors)}

            <div className={'w3-display-bottomright w3-padding'}>
                <LabeledIconButton
                    iconName={'done'}
                    label={'Save'}
                />
            </div>
        </form>
    }
}
