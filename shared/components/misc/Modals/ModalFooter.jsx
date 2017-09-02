import PropTypes from 'prop-types'
import React from 'react'
import { DANGER_LEVELS } from '../../../utils/constants'
import { MODAL_TYPES } from '../../../utils/enums'
import LabeledIconButton from '../LabeledIconButton'
import { Modal } from './Modals'

export default class ModalFooter extends React.Component {

    static propTypes = {
        modal: PropTypes.instanceOf(Modal),
        backendActions: PropTypes.objectOf(PropTypes.func).isRequired,
        updateModal: PropTypes.func
    }

    handleBegin(e) {
        e.preventDefault()
        this.props.backendActions.removeModal(this.props.modal)
        this.props.updateModal()
    }

    handleReject(e) {
        e.preventDefault()
        this.props.backendActions.removeModal(this.props.modal)
        this.props.updateModal()
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
                    label="Later"
                    dangerLevel={DANGER_LEVELS.WARN.hover}
                    onClick={::this.handleReject}
                />,
                <LabeledIconButton
                    key={2}
                    iconName="timer_off" //"event_busy" //"cancel" //"remove_circle_outline" //"skip_next"
                    label="Skip"
                    dangerLevel={DANGER_LEVELS.DANGER.hover}
                    onClick={::this.handleReject}
                />
            ],
            [MODAL_TYPES.EDIT_TASK]: () => [
                <LabeledIconButton
                    key={0}
                    iconName="save"//"slideshow"
                    label="Save"
                    dangerLevel={DANGER_LEVELS.SAFE.hover}
                    onClick={::this.handleAccept}
                />,
                <LabeledIconButton
                    key={1}
                    iconName="clear"
                    label="Cancel"
                    dangerLevel={DANGER_LEVELS.WARN.hover}
                    onClick={::this.handleReject}
                />,
                <LabeledIconButton
                    key={2}
                    iconName="delete" //"event_busy" //"cancel" //"remove_circle_outline" //"skip_next"
                    label="Delete"
                    dangerLevel={DANGER_LEVELS.DANGER.hover}
                    onClick={::this.handleReject}
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