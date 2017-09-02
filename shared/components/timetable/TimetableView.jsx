import * as Immutable from 'immutable'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Timetable from './Timetable'

// import Task from '../tasks/Task';


export default class TimetableView extends React.Component {

    static propTypes = {
        tasks: ImmutablePropTypes.map,
        projectList: ImmutablePropTypes.list.isRequired,
        taskActions: PropTypes.objectOf(PropTypes.func).isRequired,
        editMode: PropTypes.bool.isRequired,
        timetables: ImmutablePropTypes.map.isRequired,
        timetableActions: PropTypes.objectOf(PropTypes.func).isRequired,
        userSettings: PropTypes.object.isRequired,
        time: PropTypes.instanceOf(Date)
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