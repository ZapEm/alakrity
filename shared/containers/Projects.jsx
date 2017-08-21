import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ProjectsView from '../components/projects/ProjectsView'
import * as TaskActions from '../modules/tasks'
import * as ProjectActions from '../modules/projects'


@connect(state => ({
    auth: state.auth,
    tasks: state.tasks,
    projects: state.projects,
    isAuthenticated: state.auth.get('isAuthenticated')
}))
export default class Projects extends React.Component {

    static propTypes = {
        auth: ImmutablePropTypes.map,
        tasks: ImmutablePropTypes.map,
        projects: ImmutablePropTypes.map,
        isAuthenticated: React.PropTypes.bool,
        dispatch: React.PropTypes.func
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
                    <div className="col px300">
                    </div>
                </div>
            </div>
        )
    }
}