import moment from 'moment'
import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Timetable from './Timetable'
import * as Immutable from 'immutable'

// import Task from '../tasks/Task';


export default class TimetableView extends React.Component {

    static propTypes = {
        tasks: ImmutablePropTypes.map,
        projectList: ImmutablePropTypes.list.isRequired,
        taskActions: React.PropTypes.objectOf(React.PropTypes.func).isRequired,
        editMode: React.PropTypes.bool.isRequired,
        timetables: ImmutablePropTypes.map.isRequired,
        timetableActions: React.PropTypes.objectOf(React.PropTypes.func).isRequired,
        userSettings: React.PropTypes.object.isRequired,
        time: React.PropTypes.instanceOf(Date)
    }

    render() {

        const { taskActions, tasks, projectList, timetables, timetableActions, editMode, userSettings, time } = this.props
        const taskList = !editMode ? tasks.get('taskList') : Immutable.List()

        const date = timetables.get('currentWeek') || moment()

        return (
            <Timetable
                date={date}
                tasks={taskList}
                projectList={projectList}
                taskActions={taskActions}
                editMode={editMode}
                timetableActions={timetableActions}
                timetables={timetables}
                userSettings={userSettings}
                time={time}
            />
        )
    }
}