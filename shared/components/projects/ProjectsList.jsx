import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Project from './Project'

export default class ProjectsList extends React.Component {

    static propTypes = {
        projectList: ImmutablePropTypes.list.isRequired
    }

    render() {
        const { projectList } = this.props

        let projectElements

        if ( projectList.size > 0 ) {
            projectElements = projectList.map((project) =>
                <li
                    key={project.get('id')}
                    className={'project-list-item'}
                >
                    <Project
                        // key={project.get('id')}
                        project={project}
                        editable={true}
                    />
                </li>
            )
        } else {
            projectElements = <li key={'noProjectsItem'}>
                {'Please create a project!'}
            </li>
        }

        return <ul className="projects-list">
            {projectElements}
        </ul>
    }
}