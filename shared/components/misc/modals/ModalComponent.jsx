import PropTypes from 'prop-types'
import React from 'react'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import { MODAL_TYPES } from '../../../utils/enums'
import { getProjectColorMap } from '../../../utils/helpers'
import notifyUser from '../../../utils/notifications'
import ModalContent from './ModalContent'
import ModalFooter from './ModalFooter'
import ModalHeader from './ModalHeader'
import { connect } from 'react-redux'
import Immutable from 'immutable'
import * as TaskActions from '/modules/tasks'
import * as BackendActions from '/modules/backend'
import { bindActionCreators } from 'redux'
import moment from 'moment'

@connect(state => ({
    modalsOM: state.backend.get('modalsOM'),
    projectList: state.projects.get('projectList'),
    settings: state.settings
}))
export default class ModalComponent extends React.Component {

    static propTypes = {
        modalsOM: ImmutablePropTypes.orderedMap,
        projectList: ImmutablePropTypes.list,
        settings: ImmutablePropTypes.map,
        dispatch: PropTypes.func
    }

    static defaultProps = {
        modalsOM: Immutable.OrderedMap()
    }

    constructor(props) {
        super(props)
        this.state = {
            modalKey: '',
            rating: false
        }
    }

    static handleNotification(modal) {
        const title = modal.task.get('title')
        switch (modal.type) {
            case MODAL_TYPES.REMINDER:
                notifyUser(
                    'Task "' + title + '" is scheduled now!',
                    {
                        body: 'Please start the task when you are ready. \n( Click here to show Alakrity )',
                        tag: modal.id
                    }
                )
                notifyUser(
                    'Task "' + title + '" is scheduled now!',
                    {
                        body: 'Please start the task when you are ready. \n( Click here to show Alakrity )',
                        tag: modal.id
                    }
                )
                break

            case MODAL_TYPES.COMPLETION:
                notifyUser(
                    'Task "' + title + '" is at its end!',
                    {
                        body: 'Please confirm the completion when you are done. \n( Click here to show Alakrity )',
                        icon: require('img/goodwork_cropped.png'),
                        tag: modal.id
                    }
                )
                break

            default:
                notifyUser(
                    'Alakrity needs your attention',
                    {
                        body: 'Please start the task when you are ready. \n( Click here to show Alakrity )',
                        tag: modal.id
                    }
                )
        }
    }

    componentWillMount() {

        this.setState({
            projectColorMap: getProjectColorMap(this.props.projectList),
            ...this.props.modalsOM.size > 0 && { modalKey: this.props.modalsOM.keySeq().first()}
        })
    }

    componentWillUpdate(nextProps) {
        if ( this.state.modalKey === '' && nextProps.modalsOM.size > 0 ) {
            this.setState({
                modalKey: nextProps.modalsOM.keySeq().first()
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
        const { modalsOM, settings, dispatch } = this.props
        const { modalKey } = this.state

        if ( modalKey === '' || !modalsOM || modalsOM.size === 0 ) {
            return <div className="w3-modal" style={{ display: 'none' }}/>
        }

        const currentModal = modalsOM.get(modalKey)

        if ( typeof window !== 'undefined' && document.hidden ) {
            ModalComponent.handleNotification(currentModal)
        }

        return (
            <div
                className="w3-modal w3-animate-opacity"
                style={
                    {
                        display: 'block'
                    }
                }
            >
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
                        changeModalState={::this.setState}
                        rating={this.state.rating}
                        started={this.state.started}
                        completed={this.state.completed}
                    />
                    <ModalFooter
                        modal={currentModal}
                        taskActions={bindActionCreators(TaskActions, dispatch)}
                        backendActions={bindActionCreators(BackendActions, dispatch)}
                        updateModal={::this.updateModal}
                        rating={this.state.rating}
                        started={this.state.started}
                        completed={this.state.completed}
                    />
                </div>
            </div>
        )

    }
}