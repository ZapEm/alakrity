import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TaskForm from '../components/tasks/TaskForm'
import TasksList from '../components/tasks/TasksList'
import * as TaskActions from '../modules/tasks'
import TasksView from '../components/tasks/TasksView'


@connect(state => ({
    auth: state.auth,
    tasks: state.tasks,
    projects: state.projects,
    settings: state.settings,
    isAuthenticated: state.auth.get('isAuthenticated')
}))
export default class Tasks extends React.Component {

    static propTypes = {
        auth: ImmutablePropTypes.map,
        tasks: ImmutablePropTypes.map,
        projects: ImmutablePropTypes.map,
        settings: ImmutablePropTypes.map,
        isAuthenticated: PropTypes.bool,
        dispatch: PropTypes.func
    }

    render() {
        const { tasks, projects, dispatch, settings } = this.props
        const projectList = projects.get('projectList')
        const locale = settings.get('locale')

        return (
            <div className="react-container">
                <div className="row">
                    <div className="col px900">
                        <TasksView
                            locale={locale}
                            taskActions={bindActionCreators(TaskActions, dispatch)}
                            taskList={tasks.get('taskList')}
                            projectList={projectList}
                        />
                    </div>
                    <div id="sidebar" className="col sidebar">
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