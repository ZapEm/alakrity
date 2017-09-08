import Immutable from 'immutable'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import MomentPropTypes from 'react-moment-proptypes'
import { SPECIAL_PROJECTS } from '../../utils/constants'
import { TaskListFilters } from '../../utils/enums'
import { getProjectColorMap, getTaskListFilter } from '../../utils/helpers'
import LabeledIconButton from '../misc/LabeledIconButton'
import ProjectSelector from '../projects/ProjectSelector'
import TasksList from './TasksList'


export default class TasksSidebarView extends React.Component {

    static propTypes = {
        taskList: ImmutablePropTypes.list.isRequired,
        projectList: ImmutablePropTypes.list.isRequired,
        taskActions: PropTypes.objectOf(PropTypes.func).isRequired,
        filterByMoment: MomentPropTypes.momentObj.isRequired,
        locale: PropTypes.string.isRequired
    }

    static defaultProps = {
        sidebar: false,
        filterByMoment: moment()
    }

    constructor(props) {
        super(props)
        this.state = {
            project: false,
            projectColorMap: getProjectColorMap(this.props.projectList)
        }
    }

    componentWillMount() {
        this.setState({
            filterRadioSelection: TaskListFilters.UNASSIGNED
        })
    }

    handleFilterChange(e) {
        this.setState({ filterRadioSelection: e.target.value })
        console.log(e.target.value)
    }

    handleQuickAddTask(e) {
        e.preventDefault()
        this.props.taskActions.quickAddTask(this.state.project)
    }

    changeProject(project) {
        this.setState({ project: project })
    }

    render() {
        const { taskActions, taskList, projectList, locale } = this.props

        const projectID = this.state.project ? this.state.project.get('id') : false
        const filter = getTaskListFilter(this.state.filterRadioSelection, projectID , this.props.filterByMoment)

        return (
            <div className={'layout-sidebar w3-card-4 w3-padding w3-border w3-border-theme w3-round-large'}>
                <div className="timetable-sidebar">
                    <ProjectSelector
                        projectList={projectList}
                        specialProjects={Immutable.fromJS([SPECIAL_PROJECTS.ONE_TIME])}
                        selectProject={::this.changeProject}
                        withAllOption={true}
                    />
                    <div className="tt-form-line">
                        <LabeledIconButton
                            disabled={!this.state.project ? 'Select a project first' : false}
                            iconName="add_circle_outline"
                            label="Quick Add Task"
                            onClick={::this.handleQuickAddTask}
                        />
                    </div>
                    <form
                        className="w3-center w3-border-bottom w3-margin-top w3-border-theme"
                        onChange={::this.handleFilterChange}
                    >
                        <label>Filter:</label>
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
                    <TasksList
                        taskList={taskList.filter(filter)}
                        taskActions={taskActions}
                        projectColorMap={this.state.projectColorMap}
                        locale={locale}
                        sidebar={true}
                        draggable={true}
                        columns={2}
                    />
                </div>
            </div>
        )
    }
}