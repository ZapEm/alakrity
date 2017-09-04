import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Project from './Project'

export default class ProjectsList extends React.Component {

    static propTypes = {
        projectList: ImmutablePropTypes.list.isRequired,
        projectActions: PropTypes.objectOf(PropTypes.func)
    }

    render() {
        const { projectList, projectActions } = this.props

        let projectElements
        if ( projectList.size > 0 ) {
            projectElements = projectList.map((project, index) =>
                <li
                    key={'pjt_li_' + index}
                    className={'project-list-item' + ((index + 1) % 3 === 0 ? ' project-list-item-3rd' : '')}
                >
                    <Project
                        value={project.get('id')}
                        project={project}
                        editable={true}
                        projectActions={projectActions}
                    />
                </li>
            )
        } else {
            projectElements = <li key={'noProjectsItem'}>
                {'Please create a project!'}
            </li>
        }

        return <ul className="projects-list w3-card-4 w3-padding w3-round-large w3-border w3-border-theme w3-margin-top">
            {projectElements}
        </ul>
    }
}