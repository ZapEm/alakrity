import moment from 'moment'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import MomentPropTypes from 'react-moment-proptypes'
import { TaskListFilter } from '../../utils/enums'
import { getProjectColorMap } from '../../utils/helpers'
import ProjectSelector from '../projects/ProjectSelector'
import Task from './Task'


export default class TasksList extends React.Component {

    static propTypes = {
        taskList: ImmutablePropTypes.list.isRequired,
        projectList: ImmutablePropTypes.list.isRequired,
        taskActions: React.PropTypes.objectOf(React.PropTypes.func).isRequired,
        draggable: React.PropTypes.bool,
        filterByMoment: MomentPropTypes.momentObj,
        sidebar: React.PropTypes.bool
    }

    constructor(props) {
        super(props)
        this.state = {
            projectColorMap: undefined,
            project: this.props.projectList.first(),
            filterRadioSelection: TaskListFilter.UNASSIGNED
        }
    }

    componentWillMount() {
        this.setState({ projectColorMap: getProjectColorMap(this.props.projectList) })
    }

    handleFilterChange(e) {
        this.setState({ filterRadioSelection: TaskListFilter.enumValueOf(e.target.value) })
    }

    changeProject(project) {
        this.setState({ project: project })
    }

    getFilter(selection) {
        const projectID = this.state.project.get('id')
        switch (selection) {
            case TaskListFilter.UNASSIGNED:
                return (task) => ( task.get('projectID') === projectID && !task.get('start') )

            case TaskListFilter.NOT_THIS_WEEK:
                return (task) => ( task.get('projectID') === projectID
                    && ( !this.props.filterByMoment
                        || !task.get('start')
                        || this.props.filterByMoment.isoWeek() !== moment(task.get('start')).isoWeek()) )

            case TaskListFilter.ALL:
            default:
                return (task) => ( task.get('projectID') === projectID )
        }
    }

    render() {
        const { draggable, taskActions, taskList, projectList, sidebar = false } = this.props
        let taskItems

        const filter = this.getFilter(this.state.filterRadioSelection)

        if ( taskList.size > 0 ) {
            taskItems = taskList.map((task, index) =>
                filter(task) ?
                <Task
                    key={'task_li_' + index}
                    task={task}
                    projectColorMap={this.state.projectColorMap}
                    taskActions={taskActions}
                    draggable={draggable}
                    editable={true}
                    liWrapper={
                        {
                            className: 'task-list-item',
                            style: { height: task.get('duration') / 20 + 'rem' }
                        }
                    }
                />
                    : null
            )
        } else {
            taskItems = <li key={'task_li_none'}>
                {'No tasks!'}
            </li>
        }

        return (
            <div className={(sidebar ? 'task-list-view-sidebar' :
                             'task-list-view') + ' w3-card w3-padding w3-border w3-border-theme w3-round-large'}>
                <ProjectSelector
                    projectList={projectList}
                    selectProject={::this.changeProject}
                />
                <form
                    className="w3-border-bottom w3-border-theme w3-center"
                    onChange={::this.handleFilterChange}
                >
                    <span>Filter:</span>
                    <label className="task-list-filter-label">
                        <input
                            className="task-list-filter-radio"
                            type="radio"
                            name="tasklist_filter"
                            value={TaskListFilter.UNASSIGNED.name}
                            checked={this.state.filterRadioSelection === TaskListFilter.UNASSIGNED}
                            readOnly
                        />
                        {'Unassigned'}
                    </label>
                    <label className="task-list-filter-label">
                        <input
                            className="task-list-filter-radio"
                            type="radio"
                            name="tasklist_filter"
                            value={TaskListFilter.ALL.name}
                            checked={this.state.filterRadioSelection === TaskListFilter.ALL}
                            readOnly
                        />
                        {'All'}
                    </label>
                </form>
                <div className="task-list-container">
                    <ul className={'task-list' + (sidebar ? ' task-list-sidebar' : '')}>
                        {taskItems}
                    </ul>
                </div>
            </div>
        )
    }
}