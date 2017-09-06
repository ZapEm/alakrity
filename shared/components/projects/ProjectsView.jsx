import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { PROJECT_COLORS } from '../../utils/constants'
import ProjectFrom from './ProjectForm'
import ProjectsList from './ProjectsList'

export default class ProjectsView extends React.Component {

    static propTypes = {
        projects: ImmutablePropTypes.map.isRequired,
        tasks: ImmutablePropTypes.map.isRequired,
        taskActions: PropTypes.object.isRequired,
        projectActions: PropTypes.objectOf(PropTypes.func).isRequired
    }

    constructor(props) {
        super(props)
        this.state = { tabIndex: 0 }
    }

    render() {
        const { projects, projectActions } = this.props

        return (
            <div className="projects-view w3-card-4 w3-padding w3-round-large w3-border w3-border-theme">
                <ProjectsList
                    projectList={projects.get('projectList')}
                    projectActions={projectActions}
                />
            </div>
        )

    }
}