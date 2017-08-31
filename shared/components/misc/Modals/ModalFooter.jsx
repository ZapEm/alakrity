import * as React from 'react'
import { DANGER_LEVELS } from '../../../utils/constants'
import { MODAL_TYPES } from '../../../utils/enums'
import LabeledIconButton from '../LabeledIconButton'
import { Modal } from './Modals'

export default class ModalFooter extends React.Component {

    static propTypes = {
        modal: React.PropTypes.instanceOf(Modal)
    }

    render() {
        const { modal } = this.props

        const footers = []

        return <footer
            className="modal-footer w3-theme-l3"
        >
            {modal.type === MODAL_TYPES.REMINDER &&
            [
                <LabeledIconButton
                    iconName="play_circle_outline"//"slideshow"
                    label="Begin"
                    dangerLevel={DANGER_LEVELS.SAFE.hover}
                    onClick={::this.handleAccept}
                />,
                <LabeledIconButton
                    iconName="snooze"
                    label="Later"
                    dangerLevel={DANGER_LEVELS.WARN.hover}
                    onClick={::this.handleReject}
                />,
                <LabeledIconButton
                    iconName="timer_off" //"event_busy" //"cancel" //"remove_circle_outline" //"skip_next"
                    label="Skip"
                    dangerLevel={DANGER_LEVELS.DANGER.hover}
                    onClick={::this.handleReject}
                />
            ]
            }
        </footer>
    }
}