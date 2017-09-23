import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import { MODAL_TYPES } from '../../../utils/enums'
import notifyUser from '../../../utils/notifications'
import TaskPreview from '../../dnd/TaskItemDragPreview'
import { Modal } from './Modals'
import RatePicker from './RatingPicker'

export default class ModalContent extends React.Component {

    static propTypes = {
        modal: PropTypes.instanceOf(Modal),
        projectColorMap: ImmutablePropTypes.map.isRequired,
        settings: ImmutablePropTypes.map.isRequired,
        rating: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
        changeModalState: PropTypes.func.isRequired
    }

    handleSetRating(rating) {
        this.props.changeModalState({ rating: rating })
    }




    render() {
        const { modal, projectColorMap, settings, rating } = this.props
        const task = modal.task
        const locale = settings.get('locale')


        return <div
            className="modal-middle w3-theme-l5"
        >
            <div className="modal-middle-left w3-padding">
                <TaskPreview
                    projectColorMap={projectColorMap}
                    task={task.toJSON()}
                    locale={locale}
                />
                {modal.type === MODAL_TYPES.COMPLETION &&
                <RatePicker
                    setRating={::this.handleSetRating}
                    rating={rating}
                />
                }
            </div>
            <div className="modal-middle-right w3-padding">
                <p>{task.get('title')}</p>
                <p>End: {moment(task.get('start')).add(task.get('duration'), 'minutes').fromNow()}</p>
                {/* TODO: fix when description is added */ !task.get('description') &&
                <p>{task.get('description')} ...description here.</p>}
            </div>

        </div>
    }
}