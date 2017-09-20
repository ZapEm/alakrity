import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spinner from '../components/misc/Spinner'
import TasksSidebarView from '../components/tasks/TasksSidebarView'
import EditTimetableForm from '../components/timetable/TimetableEditSidebar'
import TimetableView from '../components/timetable/TimetableView'
import * as SettingsActions from '../modules/settings'
import * as TaskActions from '../modules/tasks'
import * as TimetableActions from '../modules/timetables'
import { TASK_TYPES } from '../utils/constants'
import { DEFAULT_TIMETABLE, thaw } from '../utils/defaultValues'
import { getProjectColorMap } from '../utils/helpers'


@connect(state => ({
    auth: state.auth,
    tasks: state.tasks,
    projects: state.projects,
    timetables: state.timetables,
    backend: state.backend,
    settings: state.settings,
    isAuthenticated: state.auth.get('isAuthenticated')
}))
export default class Timetable extends React.Component {

    static propTypes = {
        auth: ImmutablePropTypes.map,
        tasks: ImmutablePropTypes.map,
        timetables: ImmutablePropTypes.map,
        projects: ImmutablePropTypes.map,
        backend: ImmutablePropTypes.map,
        settings: ImmutablePropTypes.map,
        isAuthenticated: PropTypes.bool,
        dispatch: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.state = { projectColorMap: getProjectColorMap(this.props.projects.get('projectList')) }
    }

    componentDidMount() {
        // creates a new timetable if needed
        if ( !this.props.timetables.get('timetableList').size ) {
            if ( typeof window !== 'undefined' ) {
                this.props.dispatch(TimetableActions.createTimetable(thaw(DEFAULT_TIMETABLE)))
            }
        }
    }


    render() {
        const { tasks, dispatch, timetables, projects, backend, settings } = this.props
        const locale = settings.get('locale')
        const editMode = timetables.get('editMode')
        const projectList = projects.get('projectList')

        const preFilter = (editMode)
            ? (task) => task.get('type') === TASK_TYPES.repeating
            : (task) => task.get('type') !== TASK_TYPES.repeating
        const preFilteredTasks = tasks.get('taskList').filter(preFilter)


        if ( !timetables.get('timetable').size ) {
            return <div style={{ margin: 'auto' }}>
                <Spinner status={'WORKING'}/>
            </div>
        }


        return (
            <div className="react-container">
                <div className="row">
                    <div className="col px900">
                        <TimetableView
                            settings={settings}
                            timetables={timetables}
                            editMode={editMode}
                            tasks={tasks}
                            projectList={projectList}
                            {...backend.get('time') && { time: backend.get('time') }}
                            taskActions={bindActionCreators(TaskActions, dispatch)}
                            timetableActions={bindActionCreators(TimetableActions, dispatch)}
                            settingsActions={bindActionCreators(SettingsActions, dispatch)}
                            projectColorMap={this.state.projectColorMap}
                        />
                    </div>
                    <div id="sidebar" className="col sidebar">
                        {(!editMode) ?
                         <TasksSidebarView
                             taskList={preFilteredTasks}
                             projectList={projectList}
                             locale={locale}
                             filterByMoment={timetables.get('currentWeek')}
                             taskActions={bindActionCreators(TaskActions, dispatch)}
                             projectColorMap={this.state.projectColorMap}
                         />
                            :
                         <EditTimetableForm
                             onSave={bindActionCreators(TimetableActions.saveTimetable, dispatch)}
                             onRemove={bindActionCreators(TimetableActions.removeTimetable, dispatch)}
                             timetableActions={bindActionCreators(TimetableActions, dispatch)}
                             textLabel={'Enter Timetable Name...'}
                             timetables={timetables}
                             projectList={projectList}
                             projectColorMap={this.state.projectColorMap}
                             taskActions={bindActionCreators(TaskActions, dispatch)}
                             locale={locale}
                             taskList={preFilteredTasks}
                         />
                        }
                    </div>
                </div>
            </div>
        )
    }
}