import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ProjectsView from '../components/projects/ProjectsView'
import * as ProjectActions from '../modules/projects'
import * as TaskActions from '../modules/tasks'
import ProjectsSidebar from '../components/projects/ProjectsSidebar'


@connect(state => ({
    auth: state.auth,
    tasks: state.tasks,
    projects: state.projects,
    settings: state.settings,
    isAuthenticated: state.auth.get('isAuthenticated')
}))
export default class Projects extends React.Component {

    static propTypes = {
        auth: ImmutablePropTypes.map,
        tasks: ImmutablePropTypes.map,
        projects: ImmutablePropTypes.map,
        isAuthenticated: PropTypes.bool,
        settings: ImmutablePropTypes.map,
        dispatch: PropTypes.func
    }

    render() {
        const { tasks, projects, dispatch } = this.props

        return (
            <div className="react-container">
                <div className="row">
                    <div className="col px900">
                        <ProjectsView
                            tasks={tasks}
                            projects={projects}
                            projectActions={bindActionCreators(ProjectActions, dispatch)}
                            taskActions={bindActionCreators(TaskActions, dispatch)}
                        />

                    </div>
                    <div id="sidebar" className="col sidebar">
                        <ProjectsSidebar
                            projectActions={bindActionCreators(ProjectActions, dispatch)}
                            projectList={projects.get('projectList')}
                        />
                    </div>
                </div>
            </div>
        )
    }
}