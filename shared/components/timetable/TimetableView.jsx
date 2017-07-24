import moment from 'moment'
import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Timetable from './Timetable'

// import Task from '../tasks/Task';


export default class TimetableView extends React.Component {

    static propTypes = {
        tasks: ImmutablePropTypes.map,
        projectList: ImmutablePropTypes.list.isRequired,
        taskActions: React.PropTypes.objectOf(React.PropTypes.func).isRequired,
        editMode: React.PropTypes.bool.isRequired,
        timetables: ImmutablePropTypes.map.isRequired,
        timetableActions: React.PropTypes.objectOf(React.PropTypes.func).isRequired,
        userSettings: React.PropTypes.object.isRequired
    }

    render() {

        const { taskActions, tasks, projectList, timetables, timetableActions, editMode, userSettings } = this.props
        const taskList = tasks.get('taskList')

        return (
            <Timetable
                date={moment()}
                tasks={taskList}
                projectList={projectList}
                taskActions={taskActions}
                editMode={editMode}
                timetableActions={timetableActions}
                timetables={timetables}
                userSettings={userSettings}
            />
        )
    }
}