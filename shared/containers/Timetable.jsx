import moment from 'moment'
import * as React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spinner from '../components/misc/Spinner'
import TaskForm from '../components/tasks/TaskForm'
import TasksList from '../components/tasks/TasksList'
import EditTimetableForm from '../components/timetable/EditTimetableForm'
import TimetableView from '../components/timetable/TimetableView'
import Toolbar from '../components/timetable/Toolbar'
import * as TaskActions from '../modules/tasks'
import * as TimetableActions from '../modules/timetables'


@connect(state => ({
    auth: state.auth,
    tasks: state.tasks,
    projects: state.projects,
    timetables: state.timetables,
    isAuthenticated: state.auth.get('isAuthenticated')
}))
@DragDropContext(HTML5Backend)
export default class Timetable extends React.Component {

    static propTypes = {
        auth: ImmutablePropTypes.map,
        tasks: ImmutablePropTypes.map,
        timetables: ImmutablePropTypes.map,
        projects: ImmutablePropTypes.map,
        isAuthenticated: React.PropTypes.bool,
        dispatch: React.PropTypes.func
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
        const { tasks, dispatch, timetables, projects } = this.props
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
                <Toolbar
                    editMode={editMode}
                    timetables={timetables}
                    projectList={projectList}
                    onNewTimetable={() => this.createNewTimetable(this.props.timetables.get('timetableList').size + 2)}
                    loadTimetable={bindActionCreators(TimetableActions.loadTimetable, dispatch)}
                    setCurrentProject={bindActionCreators(TimetableActions.setCurrentProject, dispatch)}
                />
                <div className="row">
                    <div className="col px900">
                        <TimetableView
                            timetables={timetables}
                            userSettings={userSettings}
                            editMode={editMode}
                            tasks={tasks}
                            projectList={projectList}
                            taskActions={bindActionCreators(TaskActions, dispatch)}
                            timetableActions={bindActionCreators(TimetableActions, dispatch)}
                        />
                    </div>
                    {(!editMode) ?
                     <div className="col px300">
                         <TaskForm
                             onSubmit={bindActionCreators(TaskActions.createTask, dispatch)}
                             textLabel="Enter new task name"
                             editing={false}
                             projectList={projectList}
                         />
                         <TasksList
                             taskList={tasks.get('taskList')}
                             projectList={projectList}
                             draggable={true}
                             filterByMoment={moment()}
                             taskActions={bindActionCreators(TaskActions, dispatch)}
                         />
                     </div>
                        :
                     <div className="col px300">
                         <EditTimetableForm
                             onSave={bindActionCreators(TimetableActions.saveTimetable, dispatch)}
                             onRemove={bindActionCreators(TimetableActions.removeTimetable, dispatch)}
                             timetableChange={bindActionCreators(TimetableActions.changeTimetable, dispatch)}
                             textLabel={'Enter Timetable Name...'}
                             timetables={timetables}
                         />
                     </div>
                    }
                </div>
            </div>
        )
    }
}