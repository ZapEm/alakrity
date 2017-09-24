import PropTypes from 'prop-types'
import * as React from 'react'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import MascotContainer from '../misc/mascot/MascotContainer'
import { MASCOT_STATUS } from '../../utils/enums'
import TaskForm from './TaskForm'

export default class TasksSidebar extends React.Component {

    static propTypes = {
        taskActions: PropTypes.objectOf(PropTypes.func).isRequired,
        projectList: ImmutablePropTypes.list
    }


    render() {
        const { projectList, taskActions } = this.props

        return <div
            className={'layout-sidebar w3-card-4 w3-padding w3-border w3-border-theme w3-round-large'}
        >
            <MascotContainer status={MASCOT_STATUS.IDLE}/>
            <TaskForm
                onSubmit={taskActions.createTask}
                textLabel="Enter new task name"
                editing={false}
                projectList={projectList}
            />
        </div>
    }
}