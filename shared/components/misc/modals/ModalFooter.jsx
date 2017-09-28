import PropTypes from 'prop-types'
import React from 'react'
import { DANGER_LEVELS } from '../../../utils/constants'
import { MODAL_TYPES } from '../../../utils/enums'
import LabeledIconButton from '../LabeledIconButton'
import { Modal } from './Modals'
import MomentPropTypes from 'react-moment-proptypes'

export default class ModalFooter extends React.Component {

    static propTypes = {
        modal: PropTypes.instanceOf(Modal),
        taskActions: PropTypes.objectOf(PropTypes.func).isRequired,
        backendActions: PropTypes.objectOf(PropTypes.func),
        rating: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
        started: PropTypes.oneOfType([MomentPropTypes.momentObj, PropTypes.bool]),
        completed: PropTypes.oneOfType([MomentPropTypes.momentObj, PropTypes.bool])
    }


    static defaultProps = {
        rating: false,
        started: false,
        completed: false
    }

    handleBegin(e) {
        e.preventDefault()
        this.props.taskActions.beginTask(this.props.modal.task)
    }

    handleComplete(e) {
        e.preventDefault()
        this.props.taskActions.completeTask(this.props.modal.task, { rating: this.props.rating })
    }

    handleConfirmOver(e) {
        e.preventDefault()
        this.props.taskActions.completeTask(this.props.modal.task, {
            rating: this.props.rating,
            started: this.props.started,
            completed: this.props.completed
        })
    }

    handleReschedule(e) {
        e.preventDefault()
        this.props.taskActions.rescheduleTask(this.props.modal.task)
    }

    handleAbort(e) {
        e.preventDefault()
        this.props.taskActions.rescheduleTask(this.props.modal.task, true)
    }

    handleSnooze(e) {
        e.preventDefault()
        this.props.taskActions.snoozeTask(this.props.modal.task)
    }

    handleExtend(e) {
        e.preventDefault()
        this.props.taskActions.extendTask(this.props.modal.task)
    }

    getFooter(type) {
        const footers = {
            [MODAL_TYPES.REMINDER]: () => [
                <LabeledIconButton
                    key={0}
                    iconName="play_circle_outline"//"slideshow"
                    label="Begin"
                    dangerLevel={DANGER_LEVELS.SAFE.hover}
                    onClick={::this.handleBegin}
                />,
                <LabeledIconButton
                    key={1}
                    iconName="snooze"
                    label="Snooze"
                    dangerLevel={DANGER_LEVELS.WARN.hover}
                    onClick={::this.handleSnooze}
                    tooltip={'Remind again in 15 minutes.\n'}
                />,
                <LabeledIconButton
                    key={2}
                    iconName="timer_off" //"event_busy" //"cancel" //"remove_circle_outline" //"skip_next"
                    label="Reschedule"
                    tooltip={'Removes this task from the schedule.\nYou can reschedule it later.'}
                    dangerLevel={DANGER_LEVELS.DANGER.hover}
                    onClick={::this.handleReschedule}
                />
            ],
            [MODAL_TYPES.COMPLETION]: () => [
                <LabeledIconButton
                    key={0}
                    iconName="assignment_turned_in"//"slideshow"
                    label="Complete"
                    dangerLevel={DANGER_LEVELS.SAFE.hover}
                    onClick={::this.handleComplete}
                />,
                <LabeledIconButton
                    key={1}
                    iconName="snooze"
                    label="Extend"
                    dangerLevel={DANGER_LEVELS.WARN.hover}
                    onClick={::this.handleExtend}
                />,
                <LabeledIconButton
                    key={2}
                    iconName="cancel" //"event_busy" //"cancel" //"remove_circle_outline" //"skip_next"
                    label="Abort"
                    dangerLevel={DANGER_LEVELS.DANGER.hover}
                    onClick={::this.handleAbort}
                />
            ],
            [MODAL_TYPES.OVER]: () => [
                <LabeledIconButton
                    key={0}
                    iconName="save"//"slideshow"
                    label="Confirm"
                    dangerLevel={DANGER_LEVELS.SAFE.hover}
                    onClick={::this.handleConfirmOver}
                    disabled={!(this.props.started && this.props.completed)
                        ? 'Please fill out start and completion times first.'
                        : false}
                />,
                <LabeledIconButton
                    key={1}
                    iconName="clear"
                    label="Reschedule"
                    dangerLevel={DANGER_LEVELS.WARN.hover}
                    onClick={::this.handleReschedule}
                />,
                <LabeledIconButton
                    key={2}
                    iconName="delete" //"event_busy" //"cancel" //"remove_circle_outline" //"skip_next"
                    label="Delete"
                    dangerLevel={DANGER_LEVELS.DANGER.hover}
                    onClick={::this.handleReschedule}
                />
            ]
        }
        return footers[type]()
    }

    render() {
        const { modal } = this.props


        return <footer
            className="modal-footer w3-theme-l3"
        >
            {this.getFooter(modal.type)}
        </footer>
    }
}