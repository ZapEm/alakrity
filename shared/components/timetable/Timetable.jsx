import moment from 'moment'
import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import momentPropTypes from 'react-moment-proptypes'
import ContentDnD from './parts/ContentDnD'
import HeaderRow from './parts/HeaderRow'
import TimeColumn from './parts/TimeColumn'
import { getProjectColorMap } from '../../utils/helpers'
import TimetableControls from './TimetableControls'


export default class Timetable extends React.Component {

    static propTypes = {
        date: React.PropTypes.oneOfType([momentPropTypes.momentObj,
                                         React.PropTypes.instanceOf(Date)]).isRequired,
        tasks: ImmutablePropTypes.list,
        projectList: ImmutablePropTypes.list.isRequired,
        taskActions: React.PropTypes.objectOf(React.PropTypes.func).isRequired,
        editMode: React.PropTypes.bool.isRequired,
        timetableActions: React.PropTypes.object.isRequired,
        timetables: ImmutablePropTypes.map.isRequired,
        time: React.PropTypes.instanceOf(Date)
    }

    constructor(props) {
        super(props)
        this.state = { projectColorMap: undefined }
    }

    componentWillMount() {
        this.setState({ projectColorMap: getProjectColorMap(this.props.projectList) })
    }


    render() {
        const { date, tasks, taskActions, editMode, timetableActions, timetables, time } = this.props
        const momentDate = moment.isMoment(date) ? date : moment(date)

        return (
            <div className={(editMode ? 'tt-edit-mode ' : '') + 'tt-timetable w3-border-theme w3-card-4'}
            >
                <TimetableControls
                    timetableActions={timetableActions}
                    momentDate={momentDate}
                    editMode={editMode}
                    timetableTitle={timetables.getIn(['timetable', 'title'])}
                />
                <HeaderRow
                    momentDate={momentDate}
                />
                <div className="tt-body">
                    <TimeColumn
                        timetable={timetables.get('timetable')}
                        time={time}
                    />
                    <ContentDnD
                        editMode={editMode}
                        timetables={timetables}
                        projectColorMap={this.state.projectColorMap}
                        momentDate={momentDate}
                        tasks={tasks}
                        taskActions={taskActions}
                        changeSlotProjectID={timetableActions.changeSlotProjectID}
                    />
                </div>
            </div>
        )
    }
}