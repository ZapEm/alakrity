import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import tinycolor from 'tinycolor2'
import { DANGER_LEVELS } from '../../utils/constants'
import { PROJECT_TYPES } from '../../utils/enums'
import IconButton from '../misc/IconButton'
import MilestonesComponent from './Milestones/MilestonesComponent'
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
            editing: this.props.editing,
            managingMilestones: false
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
        this.setState({
            editing: false,
            managingMilestones: false
        })
    }

    handleSaveMilestones(milestones) {
        this.props.projectActions.editProject(this.props.project.set('milestones', milestones))
        //this.setState({ managingMilestones: false })
    }

    handleManageMilestonesToggle() {
        this.setState({ managingMilestones: !this.state.managingMilestones })
    }


    handleCancel() {
        this.setState({
            editing: false,
            managingMilestones: false
        })
    }

    handleRemove() {
        if ( confirm('Are you sure you want to permanently delete the project "' + this.props.project.get('title') + '" (and all its Tasks)?') ) {
            this.props.projectActions.removeProject(this.props.project.get('id'))
        }
    }


    render() {
        const { project, editable } = this.props

        const darkColor = tinycolor(project.get('color')).brighten(-35)

        const style = {
            backgroundColor: project.get('color'),
            border: 'solid 1px ' + darkColor
        }

        const projectType = project.has('type') ? PROJECT_TYPES[project.get('type')] : PROJECT_TYPES.DEFAULT


        if ( this.state.editing ) {

            return <ProjectEdit
                onSubmit={::this.handleSave}
                onCancel={::this.handleCancel}
                project={project}
                style={style}
            />
        }

        return <div
            className="project w3-card w3-padding w3-round-large w3-display-container"
            style={style}
        >
        <div className="w3-topleft w3-margin-top">
                <div
                    className="material-icons project-type-icon"
                    title={'Project Type: ' + projectType.name}
                    style={{ color: darkColor }}
                >
                    {projectType.icon}
                </div>
                <div className="project-title w3-large w3-show-inline-block">
                    {project.get('title')}
                </div>
            </div>

            {!this.state.managingMilestones && <p className="project-description">{project.get('description')}</p>}

            <MilestonesComponent
                project={project}
                managing={this.state.managingMilestones}
                onSave={::this.handleSaveMilestones}
                onManageToggle={::this.handleManageMilestonesToggle}
            />

            {editable && !this.state.managingMilestones &&
            <div className="project-item-buttons w3-display-hover w3-display-topright">
                <IconButton
                    iconName={'edit'}
                    style={{
                        float: 'right',
                        marginLeft: '16px'
                    }}
                    onClick={::this.handleEditClick}
                />
                <IconButton
                    iconName={'check_circle'}
                    style={{ float: 'right' }}
                    onClick={::this.handleRemove}
                    dangerLevel={DANGER_LEVELS.DANGER}
                    unarmedDangerLevel={DANGER_LEVELS.WARN.hover}
                    unarmedIconName={'delete_forever'}
                />
            </div>}
        </div>
    }
}