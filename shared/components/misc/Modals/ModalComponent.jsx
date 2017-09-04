import PropTypes from 'prop-types'
import React from 'react'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import { getProjectColorMap } from '../../../utils/helpers'
import ModalContent from './ModalContent'
import ModalFooter from './ModalFooter'
import ModalHeader from './ModalHeader'


export default class ModalComponent extends React.Component {

    static propTypes = {
        modalsOM: ImmutablePropTypes.orderedMap.isRequired,
        backendActions: PropTypes.objectOf(PropTypes.func).isRequired,
        projectList: ImmutablePropTypes.list.isRequired,
        settings: ImmutablePropTypes.map.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            modalKey: ''
        }
    }

    componentWillMount() {
        this.setState({
            projectColorMap: getProjectColorMap(this.props.projectList),
            ...this.props.modalsOM.size > 0 && { modalKey: this.props.modalsOM.keySeq().first() }
        })
    }

    componentWillUpdate() {
        if ( this.state.modalKey === '' && this.props.modalsOM.size > 0 ) {
            this.setState({
                modalKey: this.props.modalsOM.keySeq().first()
            })
        }
    }


    handleNext(e) {
        e.preventDefault()
        const keySeq = this.props.modalsOM.keySeq()
        this.setState({
            modalKey: keySeq.toIndexedSeq().get((keySeq.keyOf(this.state.modalKey) + 1 ) % keySeq.size)
        })
    }

    handleBack(e) {
        e.preventDefault()
        const keySeq = this.props.modalsOM.keySeq()
        this.setState({
            modalKey: keySeq.toIndexedSeq().get((keySeq.keyOf(this.state.modalKey) - 1 ) % keySeq.size)
        })
    }

    updateModal() {
        const keySeq = this.props.modalsOM.keySeq()
        if ( keySeq.size > 1 ) {
            this.setState({
                modalKey: keySeq.toIndexedSeq().get((keySeq.keyOf(this.state.modalKey) - 1 ) % keySeq.size)
            })
        } else {
            this.setState({ modalKey: '' })
        }
        // this.forceUpdate()
    }

    render() {
        const { modalsOM, backendActions, settings } = this.props
        const { modalKey } = this.state

        if ( modalKey === '' ) {
            return <div className="w3-modal" style={{ display: 'none' }}/>
        }

        const currentModal = modalsOM.get(modalKey)
        //console.log(modalKey, currentModal)

        return (
            <div className="w3-modal w3-animate-opacity" style={
                {
                    display: 'block'
                }
            }>
                <div className="modal w3-modal-content w3-round-large w3-card-4 w3-animate-top">
                    <ModalHeader
                        modalsOM={modalsOM}
                        currentModalKey={modalKey}
                        handleBack={::this.handleBack}
                        handleNext={::this.handleNext}
                    />
                    <ModalContent
                        modal={currentModal}
                        projectColorMap={this.state.projectColorMap}
                        settings={settings}
                    />

                    <ModalFooter
                        modal={currentModal}
                        backendActions={backendActions}
                        updateModal={::this.updateModal}
                    />
                </div>
            </div>
        )

    }
}