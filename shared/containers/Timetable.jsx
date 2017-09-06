import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spinner from '../components/misc/Spinner'
import TasksList from '../components/tasks/TasksList'
import EditTimetableForm from '../components/timetable/TimetableEditSidebar'
import TimetableView from '../components/timetable/TimetableView'
import * as TaskActions from '../modules/tasks'
import * as TimetableActions from '../modules/timetables'
import * as SettingsActions from '../modules/settings'
import { DEFAULT_TIMETABLE, thaw } from '../utils/defaultValues'


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
                        />
                    </div>
                    {(!editMode) ?
                     <div className="col sidebar">
                         <TasksList
                             taskList={tasks.get('taskList')}
                             projectList={projectList}
                             locale={locale}
                             draggable={true}
                             filterByMoment={timetables.get('currentWeek')}
                             taskActions={bindActionCreators(TaskActions, dispatch)}
                             sidebar={true}
                         />
                     </div>
                        :
                     <div className="col sidebar">
                         <EditTimetableForm
                             onSave={bindActionCreators(TimetableActions.saveTimetable, dispatch)}
                             onRemove={bindActionCreators(TimetableActions.removeTimetable, dispatch)}
                             timetableActions={bindActionCreators(TimetableActions, dispatch)}
                             textLabel={'Enter Timetable Name...'}
                             timetables={timetables}
                             projectList={projectList}
                         />
                     </div>
                    }
                </div>
            </div>
        )
    }
}