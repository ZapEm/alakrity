import moment from 'moment'
import * as React from 'react'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import { DANGER_LEVELS } from '../../../utils/constants'
import { getProjectColorMap } from '../../../utils/helpers'
import Task from '../../dnd/TaskItemDragPreview'
import LabeledIconButton from '../LabeledIconButton'
import ModalFooter from './ModalFooter'
import { MODAL_TYPES } from '../../../utils/enums'
import ModalContent from './ModalContent'
import ModalHeader from './ModalHeader'


export default class ModalComponent extends React.Component {

    static propTypes = {
        modalList: ImmutablePropTypes.list.isRequired,
        backendActions: React.PropTypes.objectOf(React.PropTypes.func).isRequired,
        projectList: ImmutablePropTypes.list.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            modalIndex: 0
        }
    }

    componentWillMount() {
        this.setState({ projectColorMap: getProjectColorMap(this.props.projectList) })
    }

    handleAccept(e) {
        e.preventDefault()
        this.props.backendActions.removeModal()
    }

    handleReject(e) {
        e.preventDefault()
        this.props.backendActions.removeModal()
    }

    render() {
        const { modalList } = this.props
        const { modalIndex } = this.state

        if ( modalList.size === 0 ) {
            return <div className="w3-modal" style={{ display: 'none' }}/>
        }

        const currentModal = modalList.get(modalIndex)
        console.log(currentModal, modalList.toJS())

        return (
            <div className="w3-modal w3-animate-opacity" style={
                {
                    display: 'block'
                }
            }>
                <div className="modal w3-modal-content w3-round-large w3-card-4 w3-animate-top">
                    <ModalHeader
                        modal={modalList}
                        currentModalIndex={modalIndex}
                    />
                    <ModalContent
                        modal={currentModal}
                    />

                    <ModalFooter
                        modal={currentModal}
                    />
                </div>
            </div>
        )

    }
}