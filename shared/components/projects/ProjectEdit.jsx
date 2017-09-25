import * as _ from 'lodash/object'
import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import tinycolor from 'tinycolor2'
import { TASK_TYPES } from '../../utils/constants'
import newId from '../../utils/newId'
import LabeledIconButton from '../misc/LabeledIconButton'
import ProjectColorPicker from './ProjectColorPicker'
import ProjectTypeSelector from './ProjectTypeSelector'

export default class ProjectEdit extends React.Component {

    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        project: ImmutablePropTypes.map.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            formID: newId('pjt-edit_'),
            errors: [],
            project: this.props.project
        }
    }

    handleColorPick(color) {
        this.setState(({ project }) => ({
                project: project.set('color', color)
            })
        )
    }

    handleSelect(e) {
        e.preventDefault()
        this.setState({
            project: this.state.project.set('defaultTaskType', +e.target.value)
        })
    }

    handleTypeSelect(typeKey){
        this.setState(({ project }) => ({
            project: project.set('type', typeKey)
        })
        )
    }

    handleSubmit(e) {
        e.preventDefault()
        this.props.onSubmit(this.state.project.set('id', this.props.project.get('id')))

    }

    handleCancel(e) {
        e.preventDefault()
        this.props.onCancel()
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

    render() {
        const color = this.state.project.get('color')
        const darkColor = tinycolor(color).brighten(-35)

        const style = {
            backgroundColor: color,
            border: 'solid 1px ' + darkColor
        }

        return <form
            className="project-edit project w3-padding w3-card w3-display-container w3-round-large"
            onSubmit={::this.handleSubmit}
            style={style}
        >

            <div className="project-line">
                <label>
                    Project Name
                    <input
                        ref={ref => this.titleInput = ref}
                        autoFocus="autofocus"
                        type="text"
                        className="project-input w3-input w3-round"
                        style={{ border: style.border }}
                        placeholder="Project Name"
                        value={this.state.project.get('title')}
                        onChange={::this.handleInputChange}
                        required={'required'}
                    />
                </label>
                <ProjectTypeSelector
                    style={{ color: darkColor, border: style.border }}
                    typeKey={this.state.project.get('type')}
                    onSelect={::this.handleTypeSelect}
                />
            </div>

            <div className="project-line w3-display-container">
                <div/>
                <ProjectColorPicker
                    currentColor={this.state.project.get('color')}
                    label={'Color'}
                    setColor={::this.handleColorPick}
                />
            </div>

            <label>
                Description
                <textarea
                    id={this.state.formID + '_description'}
                    ref={ref => this.descriptionInput = ref}
                    type="text"
                    rows="3"
                    className="project-description-area project-input w3-input w3-round"
                    style={{ border: style.border }}
                    placeholder="(Optional)"
                    value={this.state.project.get('description')}
                    onChange={::this.handleInputChange}
                />
            </label>

            <div className={'w3-display-bottomright w3-padding'}>
                <LabeledIconButton
                    iconName={'done'}
                    label={'Save'}
                    onClick={::this.handleSubmit}
                />
            </div>
            <div className="w3-display-bottomleft w3-padding">
                <LabeledIconButton
                    iconName={'clear'}
                    label={'Cancel'}
                    onClick={::this.handleCancel}
                />
            </div>
        </form>
    }
}
