import * as React from 'react'
import { MODAL_TYPES } from '../../../utils/enums'
import { Modal } from './Modals'

export default class ModalHeader extends React.Component {

    static propTypes = {
        modalList: React.PropTypes.instanceOf(Modal),
        currentModalIndex: React.PropTypes.number
    }

    static defaultProps = {
        currentModalIndex: 0
    }

    render() {
        const { modalList, currentModalIndex } = this.props

        const modal = modalList.get(currentModalIndex)

        const headers = {
            [MODAL_TYPES.REMINDER]: (modal) =>
                <header
                    className="modal-header w3-padding w3-large w3-theme"
                >
                    {'Begin with task: ' + modal.task.get('text')}
                </header>
            ,
            [MODAL_TYPES.EDIT_TASK]: (modal) => <header
                className="modal-header w3-padding w3-large w3-theme"
            >
                {'Change task: ' + modal.task.get('text')}
            </header>
        }


        return headers[modal.type](modal)
    }

}