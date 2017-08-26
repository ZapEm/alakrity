import moment from 'moment'
import * as React from 'react'
import { DropTarget } from 'react-dnd'
import ImmutablePropTypes from 'react-immutable-proptypes'
import momentPropTypes from 'react-moment-proptypes'
import { DndTypes } from '../../../utils/enums'
import { getTargetDate } from '../../dnd/dndFunctions'
import CustomDragLayer from '../../dnd/TimetableDragLayer'
import Column from './Column'

let contentTarget = {
    drop(props, monitor) {
        let sco = monitor.getSourceClientOffset()
        return { droppedAt: getTargetDate(sco) }
    }
}

function collectTarget(connect) {
    return {
        connectDropTarget: connect.dropTarget()
    }
}


@DropTarget(DndTypes.TASK, contentTarget, collectTarget)
export default class ContentDnD extends React.Component {

    static propTypes = {
        editMode: React.PropTypes.bool.isRequired,
        timetables: ImmutablePropTypes.map.isRequired,
        momentDate: momentPropTypes.momentObj.isRequired,
        tasks: ImmutablePropTypes.list,
        projectColorMap: ImmutablePropTypes.map.isRequired,
        taskActions: React.PropTypes.objectOf(React.PropTypes.func).isRequired,
        changeSlotProjectID: React.PropTypes.func.isRequired,
        connectDropTarget: React.PropTypes.func
    }

    static contextTypes = {
        dragDropManager: React.PropTypes.object
    }

    render() {
        const {
            editMode, momentDate, timetables, tasks, taskActions, connectDropTarget,
            changeSlotProjectID, projectColorMap
        } = this.props

        let momentDayDate = momentDate.clone().isoWeekday(1) // calculate this weeks mondays date from any day of the week.
        let columns = []
        for ( let i = 0; i < 7; i++ ) {
            const dayTasks = tasks.filter((task) => (moment(task.get('start')).isSame(momentDayDate, 'day')))
            columns.push(<Column key={i}
                                 editMode={editMode}
                                 timetables={timetables}
                                 momentDayDate={momentDayDate.clone()}
                                 dayTasks={dayTasks}
                                 projectColorMap={projectColorMap}
                                 taskActions={taskActions}
                                 changeSlotProjectID={changeSlotProjectID}
            />)
            momentDayDate.add(1, 'days')
        }

        return connectDropTarget(
            <div
                className="tt-content-dnd"
                style={editMode ? {cursor: 'pointer'} : null}
                id="tt-content-dnd">
                <CustomDragLayer
                    snapToGrid={true}
                    projectColorMap={projectColorMap}
                />
                {columns}
            </div>
        )
    }
}