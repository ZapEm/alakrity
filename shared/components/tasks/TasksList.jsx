import moment from 'moment'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import MomentPropTypes from 'react-moment-proptypes'
import Task from './Task'
import { getProjectColorMap } from '../../utils/helpers'


export default class TasksList extends React.Component {

    static propTypes = {
        taskList: ImmutablePropTypes.list.isRequired,
        projectList: ImmutablePropTypes.list.isRequired,
        taskActions: React.PropTypes.objectOf(React.PropTypes.func).isRequired,
        draggable: React.PropTypes.bool,
        filterByMoment: MomentPropTypes.momentObj
    }

    constructor(props){
        super(props)
        this.state = { projectColorMap: undefined }
    }

    componentWillMount() {
        this.setState({ projectColorMap: getProjectColorMap(this.props.projectList) })
    }


    handleRemove = (e) => {
        const listIndex = Number(e.target.dataset.id)

        this.props.taskActions.removeTask(this.props.taskList.getIn([listIndex, 'id']))
    }

    handleEdit = (e) => {
        const listIndex = Number(e.target.dataset.id)
        const task = this.props.taskList.get(listIndex)

        // For cutting edge UX
        let newVal = window.prompt('', task.get('text'))
        this.props.taskActions.editTask(task.get('id'), newVal, 1)
    }

    render() {
        const { draggable, taskActions, filterByMoment, taskList } = this.props
        let taskItems

        if ( taskList.size > 0 ) {
            taskItems = taskList.map((task, index) =>
                (!filterByMoment || !task.get('start') || filterByMoment.isoWeek() !== moment(task.get('start')).isoWeek()) ?
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
            <div id="task-list-view">
                <ul className="task-list">
                    { taskItems }
                </ul>
            </div>
        )
    }
}