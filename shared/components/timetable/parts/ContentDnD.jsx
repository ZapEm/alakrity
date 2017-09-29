import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { DropTarget } from 'react-dnd'
import ImmutablePropTypes from 'react-immutable-proptypes'
import momentPropTypes from 'react-moment-proptypes'
import { DndTypes } from '/utils/enums'
import { getTargetDate } from '../../dnd/dndFunctions'
import CustomDragLayer from '../../dnd/TimetableDragLayer'
import Column from './Column'
import { dayTasksFilter } from '/utils/helpers'

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
        editMode: PropTypes.bool.isRequired,
        timetables: ImmutablePropTypes.map.isRequired,
        momentDate: momentPropTypes.momentObj.isRequired,
        tasks: ImmutablePropTypes.list,
        projectColorMap: ImmutablePropTypes.map.isRequired,
        taskActions: PropTypes.objectOf(PropTypes.func).isRequired,
        changeSlotProjectID: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func,
        locale: PropTypes.string.isRequired
    }

    static contextTypes = {
        dragDropManager: PropTypes.object
    }

    render() {
        const {
            editMode, momentDate, timetables, tasks, taskActions, connectDropTarget,
            changeSlotProjectID, projectColorMap, locale
        } = this.props

        let momentDayDate = momentDate.clone().isoWeekday(1) // calculate this weeks mondays date from any day of the week.
        let columns = []
        for ( let i = 0; i < 7; i++ ) {
            const dayTasks = tasks.filter(task => dayTasksFilter(task, momentDayDate))
            columns.push(<Column key={i}
                                 editMode={editMode}
                                 locale={locale}
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
                style={editMode ? { cursor: 'pointer' } : null}
                id="tt-content-dnd">
                <CustomDragLayer
                    snapToGrid={true}
                    projectColorMap={projectColorMap}
                    locale={locale}
                />
                {columns}
            </div>
        )
    }
}