import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TaskForm from '../components/tasks/TaskForm'
import TasksList from '../components/tasks/TasksList'
import * as TaskActions from '../modules/tasks'


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
        isAuthenticated: PropTypes.bool,
        dispatch: PropTypes.func
    }

    render() {
        const { tasks, projects, dispatch } = this.props
        const projectList = projects.get('projectList')

        return (
            <div className="react-container">
                <div className="row">
                    <div className="col px900">
                        <TasksList
                            taskList={tasks.get('taskList')}
                            projectList={projectList}
                            draggable={false}
                            taskActions={bindActionCreators(TaskActions, dispatch)}
                        />

                    </div>
                    <div className="col px300">
                        <TaskForm
                            onSubmit={bindActionCreators(TaskActions.createTask, dispatch)}
                            textLabel="Enter new task name"
                            editing={false}
                            projectList={projectList}
                        />
                    </div>
                </div>
            </div>
        )
    }
}