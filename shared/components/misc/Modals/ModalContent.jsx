import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import TaskPreview from '../../dnd/TaskItemDragPreview'
import { Modal } from './Modals'

export default class ModalContent extends React.Component {

    static propTypes = {
        modal: PropTypes.instanceOf(Modal),
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