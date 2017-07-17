import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ProjectsView from '../components/projects/ProjectsView'
import TaskForm from '../components/tasks/TaskForm'
import * as TaskActions from '../modules/tasks'
import * as ProjectActions from '../modules/projects'


@connect(state => ({
    auth: state.auth,
    tasks: state.tasks,
    projects: state.projects,
    isAuthenticated: state.auth.get('isAuthenticated')
}))
export default class Tasks extends React.Component {

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
                        <TaskForm
                            onSubmit={bindActionCreators(TaskActions.createTask, dispatch)}
                            textLabel="Enter new task name"
                            editing={false}
                            projectList={projects.get('projectList')}
                        />
                        <ProjectsView
                            tasks={tasks}
                            projects={projects}
                            projectActions={bindActionCreators(ProjectActions, dispatch)}
                            taskActions={bindActionCreators(TaskActions, dispatch)}
                        />
                        {/*<TasksList
                         taskList={tasks.get('taskList')}
                         draggable={false}
                         taskActions={bindActionCreators(TaskActions, dispatch)}
                         />*/}

                    </div>
                    <div className="col px900">
                    </div>
                </div>
            </div>
        )
    }
}