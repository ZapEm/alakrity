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
import { getProjectColorMap, momentSetSameWeek } from '../../../utils/helpers'
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
        const modalIndex = this.props.modalsList.size > 0 ? 0 : false
        const initialTask = modalIndex ? this.props.modalsList.get(modalIndex).task : false


        this.state = {
            projectColorMap: getProjectColorMap(this.props.projectList),
            modalIndex: modalIndex,
            started: (initialTask && initialTask.get('started')) ? moment(initialTask.get('started')) : false,
            startedPicked: false,
            completed: (initialTask && initialTask.get('completed')) ? moment(initialTask.get('completed')) : false,
            completedPicked: false,
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
            this.setState(({ modalIndex }) => {
                const newIndex = modalIndex > 0 ? nextProps.modalsList.size - 1 : false
                const newTask = newIndex ? nextProps.modalsList.get(newIndex).task : false
                return {
                    modalIndex: modalIndex > 0 ? modalIndex - 1 : false,
                    started: (newTask && newTask.get('started')) ? moment(newTask.get('started')) : false,
                    completed: (newTask && newTask.get('completed')) ? moment(newTask.get('completed')) : false,
                    startedPicked: false,
                    completedPicked: false,
                    rating: false
                }
            })
        } else if ( this.state.modalIndex === false && nextProps.modalsList.size > 0 ) {
            const newTask = nextProps.modalsList.get(0).task
            this.setState({
                modalIndex: 0,
                started: (newTask && newTask.get('started')) ? moment(newTask.get('started')) : false,
                completed: (newTask && newTask.get('completed')) ? moment(newTask.get('completed')) : false,
                startedPicked: false,
                completedPicked: false,
                rating: false
            })
        } else if ( this.state.modalIndex !== false && this.state.modalIndex < nextProps.modalsList.size ) {
            // if task has changed, but index may be the same.
            if ( this.props.modalsList.get(this.state.modalIndex).id !== nextProps.modalsList.get(this.state.modalIndex).id ) {
                this.setState(({ modalIndex }) => {
                    const newTask = nextProps.modalsList.get(modalIndex)
                    return {
                        modalIndex: modalIndex,
                        started: (newTask && newTask.get('started')) ? moment(newTask.get('started')) : false,
                        completed: (newTask && newTask.get('completed')) ? moment(newTask.get('completed')) : false,
                        startedPicked: false,
                        completedPicked: false,
                        rating: false
                    }
                })
            }
        }
    }

    handleNext(e) {
        e.preventDefault()
        this.setState(({ modalIndex }) => {
            const newIndex = (modalIndex + 1 >= this.props.modalsList.size) ? 0 : modalIndex + 1
            const newTask = newIndex ? this.props.modalsList.get(newIndex).task : false
            return {
                modalIndex: newIndex,
                started: (newTask && newTask.get('started')) ? moment(newTask.get('started')) : false,
                completed: (newTask && newTask.get('completed')) ? moment(newTask.get('completed')) : false,
                startedPicked: false,
                completedPicked: false,
                rating: false
            }
        })
    }

    handleBack(e) {
        e.preventDefault()
        this.setState(({ modalIndex }) => {
            const newIndex = (modalIndex - 1 < 0) ? this.props.modalsList.size - 1 : modalIndex - 1
            const newTask = newIndex ? this.props.modalsList.get(newIndex).task : false
            return {
                modalIndex: newIndex,
                started: (newTask && newTask.get('started')) ? moment(newTask.get('started')) : false,
                completed: (newTask && newTask.get('completed')) ? moment(newTask.get('completed')) : false,
                startedPicked: false,
                completedPicked: false,
                rating: false
            }
        })
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

        let started = this.state.started
            ? this.state.started
            : currentModal.task.get('repeating')
                          ? momentSetSameWeek(moment(currentModal.task.get('start')))
                          : moment(currentModal.task.get('start'))

        let completed = this.state.completed
            ? this.state.completed
            : currentModal.task.get('repeating')
                            ?
              momentSetSameWeek(moment(currentModal.task.get('start'))).add(currentModal.task.get('duration'), 'minutes')
                            : moment(currentModal.task.get('start')).add(currentModal.task.get('duration'), 'minutes')


        // update started or completed times every minute if appropriate.
        if ( currentModal.type === MODAL_TYPES.REMINDER ) {
            if ( !this.state.startedPicked ) {
                started = moment().startOf('minute')
            }
        } else if ( currentModal.type === MODAL_TYPES.COMPLETION ) {
            if ( !this.state.completedPicked ) {
                completed = moment().startOf('minute')
            }
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
                        started={started}
                        completed={completed}
                        modalsList={modalsList}
                        projectList={this.props.projectList}
                    />
                    <ModalFooter
                        modal={currentModal}
                        taskActions={bindActionCreators(TaskActions, dispatch)}
                        backendActions={bindActionCreators(BackendActions, dispatch)}
                        rating={this.state.rating}
                        started={started}
                        completed={completed}
                    />
                </div>
            </div>
        )

    }
}