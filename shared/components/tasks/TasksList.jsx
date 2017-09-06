import Immutable from 'immutable'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import MomentPropTypes from 'react-moment-proptypes'
import { SPECIAL_PROJECTS } from '../../utils/constants'
import { TaskListFilters } from '../../utils/enums'
import { getProjectColorMap } from '../../utils/helpers'
import LabeledIconButton from '../misc/LabeledIconButton'
import ProjectSelector from '../projects/ProjectSelector'
import Task from './Task'


export default class TasksList extends React.Component {

    static propTypes = {
        taskList: ImmutablePropTypes.list.isRequired,
        projectList: ImmutablePropTypes.list.isRequired,
        taskActions: PropTypes.objectOf(PropTypes.func).isRequired,
        locale: PropTypes.string.isRequired,
        draggable: PropTypes.bool,
        filterByMoment: MomentPropTypes.momentObj,
        sidebar: PropTypes.bool
    }

    static defaultProps = {
        sidebar: false
    }

    constructor(props) {
        super(props)
        this.state = {
            projectColorMap: undefined,
            filterRadioSelection: undefined,
            project: this.props.projectList.first()
        }
    }

    componentWillMount() {
        this.setState({
            projectColorMap: getProjectColorMap(this.props.projectList),
            filterRadioSelection: this.props.sidebar ? TaskListFilters.UNASSIGNED : TaskListFilters.ALL
        })
    }

    handleFilterChange(e) {
        this.setState({ filterRadioSelection: e.target.value })
        console.log(e.target.value)
    }

    handleQuickAddTask(e) {
        e.preventDefault()
        this.props.taskActions.quickAddTask(this.state.project.get('id'))
    }

    changeProject(project) {
        this.setState({ project: project })
    }

    getFilter(selection) {
        const projectID = this.state.project ? this.state.project.get('id') : ''
        switch (selection) {
            case TaskListFilters.UNASSIGNED:
                return (task) => ( task.get('projectID') === projectID && !task.get('start') )

            case TaskListFilters.NOT_THIS_WEEK:
                return (task) => ( task.get('projectID') === projectID
                    && ( !this.props.filterByMoment
                        || !task.get('start')
                        || this.props.filterByMoment.isoWeek() !== moment(task.get('start')).isoWeek()) )

            case TaskListFilters.ALL:
            default:
                return (task) => ( task.get('projectID') === projectID )
        }
    }

    render() {
        const { draggable, taskActions, taskList, projectList, sidebar = false, locale } = this.props
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
                    locale={locale}
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
            <div className={(sidebar ? 'layout-sidebar' :
                             'task-list-view') + ' w3-card-4 w3-padding w3-border w3-border-theme w3-round-large'}>
                <ProjectSelector
                    projectList={projectList}
                    specialProjects={Immutable.fromJS([SPECIAL_PROJECTS.ONE_TIME])}
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
                            value={TaskListFilters.UNASSIGNED}
                            checked={this.state.filterRadioSelection === TaskListFilters.UNASSIGNED}
                            readOnly
                        />
                        {'Unassigned'}
                    </label>
                    <label className="task-list-filter-label">
                        <input
                            className="task-list-filter-radio"
                            type="radio"
                            name="tasklist_filter"
                            value={TaskListFilters.ALL}
                            checked={this.state.filterRadioSelection === TaskListFilters.ALL}
                            readOnly
                        />
                        {'All'}
                    </label>
                </form>
                <div className="tt-form-line">
                    {sidebar &&
                    <LabeledIconButton
                        iconName="add_circle_outline"
                        label="Quick Add Task"
                        onClick={::this.handleQuickAddTask}
                    />}
                </div>
                <div className="task-list-container">
                    <ul className={'task-list' + (sidebar ? ' task-list-sidebar' : '')}>
                        {taskItems}
                    </ul>
                </div>
            </div>
        )
    }
}