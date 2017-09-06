import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import tinycolor from 'tinycolor2'
import { DANGER_LEVELS } from '../../utils/constants'
import IconButton from '../misc/IconButton'
import ProjectEdit from './ProjectEdit'


export default class Project extends React.Component {

    static propTypes = {
        project: ImmutablePropTypes.map.isRequired,
        projectActions: PropTypes.objectOf(PropTypes.func), // required if editable is true!
        editable: PropTypes.bool,
        editing: PropTypes.bool
    }

    static defaultPropTypes = {
        editable: false,
        editing: false
    }

    constructor(props) {
        super(props)
        this.state = {
            editing: this.props.editing
        }
    }

    handleEditClick(e) {
        e.preventDefault()
        if ( this.props.editable ) {
            this.setState({ editing: true })
        }
    }


    handleSave(project) {
        this.props.projectActions.editProject(project)
        this.setState({ editing: false })
    }

    handleCancel() {
        this.setState({ editing: false })
    }


    render() {
        const { project, editable, projectActions } = this.props

        const style = {
            backgroundColor: project.get('color'),
            border: 'solid 1px ' + tinycolor(project.get('color')).brighten(-35)
        }

        let element
        if ( this.state.editing ) {

            element = <ProjectEdit
                onSubmit={::this.handleSave}
                onCancel={::this.handleCancel}
                project={project}
                style={style}
            />
        } else {
            element = <div
                className="project w3-card w3-padding w3-round-large w3-display-container"
                style={style}
            >
                <h4 className="project-title w3-large w3-center">
                    {project.get('title')}
                </h4>
                <p>{project.get('description')}</p>
                <div className="task-item-buttons w3-display-hover w3-display-topright">
                    {editable &&
                    <IconButton
                        iconName={'edit'}
                        onClick={::this.handleEditClick}
                    />
                    }
                    {editable &&
                    <IconButton
                        iconName={'delete_forever'}
                        onClick={() => projectActions.removeProject(project.get('id'))}
                        dangerLevel={DANGER_LEVELS.DANGER}
                    />
                    }
                </div>
            </div>
        }

        return element
    }
}