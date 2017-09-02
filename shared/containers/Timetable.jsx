import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spinner from '../components/misc/Spinner'
import TasksList from '../components/tasks/TasksList'
import EditTimetableForm from '../components/timetable/EditTimetableForm'
import TimetableView from '../components/timetable/TimetableView'
import * as TaskActions from '../modules/tasks'
import * as TimetableActions from '../modules/timetables'


@connect(state => ({
    auth: state.auth,
    tasks: state.tasks,
    projects: state.projects,
    timetables: state.timetables,
    backend: state.backend,
    isAuthenticated: state.auth.get('isAuthenticated')
}))
@DragDropContext(HTML5Backend)
export default class Timetable extends React.Component {

    static propTypes = {
        auth: ImmutablePropTypes.map,
        tasks: ImmutablePropTypes.map,
        timetables: ImmutablePropTypes.map,
        projects: ImmutablePropTypes.map,
        backend: ImmutablePropTypes.map,
        isAuthenticated: PropTypes.bool,
        dispatch: PropTypes.func
    }

    componentDidMount() {
        if ( !this.props.timetables.get('timetableList').size ) {
            if ( typeof window !== 'undefined' ) {
                this.createNewTimetable()
            }
        }
    }

    createNewTimetable(tableNr = 0) {
        const timetable = {
            title: 'New Timetable' + (tableNr > 0 ? ` (${tableNr})` : ''),
            start: 7,
            end: 22,
            steps: 2,
            projectPeriods: {
                selection: [[], [], [], [], [], [], []]
            },
            created: moment()
        }

        console.log('No timetable found. Creating new timetable!')
        this.props.dispatch(TimetableActions.createTimetable(timetable))
    }

    render() {
        const { tasks, dispatch, timetables, projects, backend } = this.props
        const userSettings = {}
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
                            timetables={timetables}
                            userSettings={userSettings}
                            editMode={editMode}
                            tasks={tasks}
                            projectList={projectList}
                            {...backend.get('time') && { time: backend.get('time') }}
                            taskActions={bindActionCreators(TaskActions, dispatch)}
                            timetableActions={bindActionCreators(TimetableActions, dispatch)}
                        />
                    </div>
                    {(!editMode) ?
                     <div className="col px300">
                         <TasksList
                             taskList={tasks.get('taskList')}
                             projectList={projectList}
                             draggable={true}
                             filterByMoment={timetables.get('currentWeek')}
                             taskActions={bindActionCreators(TaskActions, dispatch)}
                             sidebar={true}
                         />
                     </div>
                        :
                     <div className="col px300">
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