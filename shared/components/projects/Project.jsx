import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import TasksList from '../tasks/TasksList'


export default class Project extends React.Component {

    static propTypes = {
        colors: React.PropTypes.array.isRequired,
        project: ImmutablePropTypes.map.isRequired,
        projectList: ImmutablePropTypes.list.isRequired,
        taskList: ImmutablePropTypes.list.isRequired,
        taskActions: React.PropTypes.object.isRequired
    }

    render() {
        const { project, projectList, taskList, taskActions } = this.props
        return <div
            className="project"
        >
            {/*<div>*/}
                {/*{project.get('title')}*/}
            {/*</div>*/}
            <TasksList
                projectList={projectList}
                taskActions={taskActions}
                taskList={taskList}
            />
        </div>
    }
}