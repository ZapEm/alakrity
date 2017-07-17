import moment from 'moment'
import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import momentPropTypes from 'react-moment-proptypes'
import ContentDnD from './parts/ContentDnD'
import HeaderRow from './parts/HeaderRow'
import TimeColumn from './parts/TimeColumn'


export default class Timetable extends React.Component {

    static propTypes = {
        date: React.PropTypes.oneOfType([momentPropTypes.momentObj,
                                         React.PropTypes.instanceOf(Date)]).isRequired,
        tasks: ImmutablePropTypes.list,
        projectList: ImmutablePropTypes.list.isRequired,
        taskActions: React.PropTypes.objectOf(React.PropTypes.func).isRequired,
        editMode: React.PropTypes.bool.isRequired,
        timetableActions: React.PropTypes.object.isRequired,
        timetables: ImmutablePropTypes.map.isRequired
    }

    render() {
        const { date, tasks, projectList, taskActions, editMode, timetableActions, timetables } = this.props
        const momentDate = moment.isMoment(date) ? date : moment(date)

        return (
            <div className={ editMode ? 'tt-timetable w3-border-theme w3-card-4 tt-edit-mode' :
                             'tt-timetable w3-border-theme w3-card-4' }>
                <HeaderRow
                    momentDate={momentDate}
                    enterEditMode={timetableActions.enterEditMode}
                />
                <div className="tt-body">
                    <TimeColumn
                        timetable={timetables.get('timetable')}
                    />
                    <ContentDnD
                        editMode={editMode}
                        timetables={timetables}
                        momentDate={momentDate}
                        tasks={tasks}
                        projectList={projectList}
                        taskActions={taskActions}
                        changeSlotProjectNr={timetableActions.changeSlotProjectNr}
                    />
                </div>
            </div>
        )
    }
}