import * as BackendActions from '/modules/backend'
import * as TaskActions from '/modules/tasks'
import Immutable from 'immutable'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { MODAL_TYPES } from '../../../utils/enums'
import { getProjectColorMap } from '../../../utils/helpers'
import notifyUser from '../../../utils/notifications'
import ModalContent from './ModalContent'
import ModalFooter from './ModalFooter'
import ModalHeader from './ModalHeader'

@connect(state => ({
    modalsList: state.backend.get('modalsList'),
    projectList: state.projects.get('projectList'),
    settings: state.settings
}))
export default class ModalComponent extends React.Component {

    static propTypes = {
        modalsList: ImmutablePropTypes.list,
        projectList: ImmutablePropTypes.list,
        settings: ImmutablePropTypes.map,
        dispatch: PropTypes.func
    }

    static defaultProps = {
        modalsList: Immutable.List()
    }

    constructor(props) {
        super(props)
        this.state = {
            projectColorMap: getProjectColorMap(this.props.projectList),
            modalIndex: this.props.modalsList.size > 0 ? 0 : false,
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

    componentWillReceiveProps(nextProps) {
        if ( this.state.modalIndex !== false && this.state.modalIndex >= nextProps.modalsList.size ) {
            this.setState(({ modalIndex }) => ({
                modalIndex: modalIndex > 0 ? modalIndex - 1 : false
            }))
        }
        if ( this.state.modalIndex === false && nextProps.modalsList.size > 0 ) {
            this.setState({
                modalIndex: 0
            })
        }
    }

    handleNext(e) {
        e.preventDefault()
        this.setState(({ modalIndex }) => ({
            modalIndex: (modalIndex + 1 >= this.props.modalsList.size) ? 0 : modalIndex + 1
        }))
    }

    handleBack(e) {
        e.preventDefault()
        this.setState(({ modalIndex }) => ({
            modalIndex: (modalIndex - 1 < 0) ? this.props.modalsList.size - 1 : modalIndex - 1
        }))
    }

    handleSetState(newState) {
        this.setState(newState)
    }


    render() {
        const { modalsList, settings, dispatch } = this.props
        const { modalIndex } = this.state

        if ( modalIndex === false || !modalsList || modalsList.size === 0 ) {
            return <div className="w3-modal" style={{ display: 'none' }}/>
        }

        const currentModal = modalsList.get(modalIndex)

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
                        modalsList={modalsList}
                        modalIndex={modalIndex}
                        handleBack={::this.handleBack}
                        handleNext={::this.handleNext}
                    />
                    <ModalContent
                        modal={currentModal}
                        projectColorMap={this.state.projectColorMap}
                        settings={settings}
                        changeModalState={::this.handleSetState}
                        rating={this.state.rating}
                        started={this.state.started}
                        completed={this.state.completed}
                        modalsList={this.props.modalsList}
                        projectList={this.props.projectList}
                    />
                    <ModalFooter
                        modal={currentModal}
                        taskActions={bindActionCreators(TaskActions, dispatch)}
                        backendActions={bindActionCreators(BackendActions, dispatch)}
                        rating={this.state.rating}
                        started={this.state.started ? this.state.started : moment(currentModal.task.get('start'))}
                        completed={this.state.completed ? this.state.completed :
                                   moment(currentModal.task.get('start')).add(currentModal.task.get('duration'), 'minutes')}
                    />
                </div>
            </div>
        )

    }
}