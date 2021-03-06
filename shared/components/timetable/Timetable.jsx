import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import momentPropTypes from 'react-moment-proptypes'
import { getProjectColorMap } from '../../utils/helpers'
import ContentDnD from './parts/ContentDnD'
import HeaderRow from './parts/HeaderRow'
import TimeColumn from './parts/TimeColumn'
import TimetableControls from './TimetableControls'


export default class Timetable extends React.Component {

    static propTypes = {
        date: PropTypes.oneOfType([momentPropTypes.momentObj,
                                   PropTypes.instanceOf(Date)]).isRequired,
        tasks: ImmutablePropTypes.list,
        projectList: ImmutablePropTypes.list.isRequired,
        taskActions: PropTypes.objectOf(PropTypes.func).isRequired,
        editMode: PropTypes.bool.isRequired,
        timetableActions: PropTypes.object.isRequired,
        settingsActions: PropTypes.object.isRequired,
        timetables: ImmutablePropTypes.map.isRequired,
        settings: ImmutablePropTypes.map.isRequired,
        time: PropTypes.instanceOf(Date),
        projectColorMap: ImmutablePropTypes.map.isRequired
    }

    // constructor(props) {
    //     super(props)
    //     this.state = { projectColorMap: undefined }
    // }
    //
    // componentWillMount() {
    //     this.setState({ projectColorMap: getProjectColorMap(this.props.projectList) })
    // }


    render() {
        const { date, tasks, taskActions, editMode, timetableActions, settingsActions, timetables, settings, time, projectColorMap } = this.props
        let momentDate = moment.isMoment(date) ? date : moment(date)
        const locale = settings.get('locale')
        momentDate = momentDate.locale(locale)

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
                    editMode={editMode}
                    locale={locale}
                    settingsActions={settingsActions}
                />
                <div className="tt-body">
                    <TimeColumn
                        timetable={timetables.get('timetable')}
                        time={time}
                        locale={locale}
                    />
                    <ContentDnD
                        editMode={editMode}
                        timetables={timetables}
                        projectColorMap={projectColorMap}
                        momentDate={momentDate}
                        tasks={tasks}
                        taskActions={taskActions}
                        changeSlotProjectID={timetableActions.changeSlotProjectID}
                        locale={locale}
                    />
                </div>
            </div>
        )
    }
}