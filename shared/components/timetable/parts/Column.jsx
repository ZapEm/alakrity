import moment from 'moment'
import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import momentPropTypes from 'react-moment-proptypes'
import TaskItem from '../../tasks/Task'
import Timeslot from './Timeslot'


export default class Column extends React.Component {
    static propTypes = {
        editMode: React.PropTypes.bool.isRequired,
        timetables: ImmutablePropTypes.map.isRequired,
        momentDayDate: momentPropTypes.momentObj.isRequired,
        dayTasks: ImmutablePropTypes.list,
        projectList: ImmutablePropTypes.list.isRequired,
        taskActions: React.PropTypes.objectOf(React.PropTypes.func).isRequired,
        changeSlotProjectNr: React.PropTypes.func.isRequired
    }


    render() {
        const { editMode, timetables, dayTasks, projectList, taskActions, changeSlotProjectNr, momentDayDate } = this.props

        const timetable = timetables.get('timetable')
        const dayNr = momentDayDate.isoWeekday() - 1
        const startOfDay = momentDayDate.startOf('day')

        const start = timetable.get('start')
        const end = timetable.get('end')
        const steps = timetable.get('steps') || 1
        let timeslots = []
        for ( let hour = start; hour < end; hour++ ) {
            let slots = []
            for ( let step = 0; step < steps; step++ ) {
                slots.push(<Timeslot
                    key={hour + '_' + step}
                    editMode={editMode}
                    dateTime={startOfDay.clone().add({ hours: hour, minutes: step * 60 / steps })}
                    position={{ day: dayNr, slot: hour * steps + step, steps: steps }}
                    workPeriods={timetable.get('workPeriods')}
                    newProjectNr={timetables.get('projectNr')}
                    changeSlotProjectNr={changeSlotProjectNr}
                />)
            }
            timeslots.push(<div key={'group_' + hour} className="tt-timeslot-group"> { slots } </div>)
        }

        let taskItems = [], k2 = 0
        for ( let task of dayTasks ) {
            const momentTaskStart = moment(task.get('start'))
            const positionStyle = {
                top: 3 * (momentTaskStart.hour() - start + momentTaskStart.minute() / 60) + 'rem',
                height: task.get('duration') / 20 + 'rem',
                width: '112px'
            }
            taskItems.push(
                <TaskItem
                    key={'task_' + k2++}
                    task={task}
                    projectList={projectList}
                    draggable={true}
                    taskActions={taskActions}
                    liWrapper={
                        {
                            className: 'tt-task-item',
                            style: positionStyle
                        }
                    }/>)
        }
        return <div className="tt-column">
            { timeslots }
            { (taskItems !== []) ? <ul> { taskItems } </ul> : '' }
        </div>
    }
}