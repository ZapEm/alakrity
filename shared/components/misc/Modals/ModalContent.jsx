import * as React from 'react'
import TaskPreview from '../../dnd/TaskItemDragPreview'
import { Modal } from './Modals'
import moment from 'moment'
import * as ImmutablePropTypes from 'react-immutable-proptypes'

export default class ModalContent extends React.Component {

    static propTypes = {
        modal: React.PropTypes.instanceOf(Modal),
        projectColorMap: ImmutablePropTypes.map.isRequired
    }

    render() {
        const { modal, projectColorMap } = this.props
        const task = modal.task

        return <div
            className="modal-middle w3-theme-l5"
        >
            <div className="modal-middle-left w3-padding">
                <TaskPreview
                    projectColorMap={projectColorMap}
                    task={task.toJSON()}
                />
            </div>
            <div className="modal-middle-right w3-padding">
                <p>{task.get('text')}</p>
                <p>End: {moment(task.get('start')).add(task.get('duration'), 'minutes').fromNow()}</p>
                {/* TODO: fix when description is added */ !task.get('description') &&
                <p>{task.get('description')} ...description here.</p>}
            </div>

        </div>
    }
}