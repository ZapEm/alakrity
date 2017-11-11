import { MODAL_TYPES } from '/utils/enums'
import { getProjectFromTask } from '/utils/helpers'
import moment from 'moment'
import 'moment-precise-range-plugin'
import PropTypes from 'prop-types'
import TimePicker from 'rc-time-picker'
import React from 'react'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import * as MomentPropTypes from 'react-moment-proptypes'
import { PROJECT_TYPES } from '../../../utils/enums'
import { momentSetSameWeek } from '../../../utils/helpers'
import TaskPreview from '../../dnd/TaskItemDragPreview'
import IconButton from '../IconButton'
import { Modal } from './Modals'
import RatingPicker from './RatingPicker'

export default class ModalContent extends React.Component {

    static propTypes = {
        modal: PropTypes.instanceOf(Modal),
        modalsList: ImmutablePropTypes.list,
        projectColorMap: ImmutablePropTypes.map.isRequired,
        settings: ImmutablePropTypes.map.isRequired,
        rating: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
        changeModalState: PropTypes.func.isRequired,
        started: PropTypes.oneOfType([MomentPropTypes.momentObj, PropTypes.bool]),
        completed: PropTypes.oneOfType([MomentPropTypes.momentObj, PropTypes.bool]),
        projectList: ImmutablePropTypes.list.isRequired
    }

    static defaultProps = {
        started: false,
        completed: false
    }

    static generateHiddenMinutes() {
        const arr = []
        for ( let value = 0; value < 60; value++ ) {
            if ( value % 15 !== 0 ) {
                arr.push(value)
            }
        }
        return arr
    }

    // componentWillMount() {
    //     const started = this.props.modal.task.get('started') ? moment(this.props.modal.task.get('started')) : false
    //     const completed = this.props.modal.task.get('completed') ? moment(this.props.modal.task.get('completed')) :
    //                       false
    //
    //     this.props.changeModalState({
    //         started: started,
    //         completed: completed,
    //         rating: false
    //     })
    // }

    // componentWillUpdate(nextProps) {
    //     if ( nextProps.modal && this.props.modal.id !== nextProps.modal.id ) {
    //         const started = nextProps.modal.task.get('started')
    //             ? moment(nextProps.modal.task.get('started'))
    //             : false
    //         const completed = nextProps.modal.task.get('completed')
    //             ? moment(nextProps.modal.task.get('completed'))
    //             : false
    //
    //         this.props.changeModalState({
    //             started: started,
    //             completed: completed,
    //             rating: false
    //         }, nextProps.modalsList.keySeq())
    //     }
    // }

    handleSetRating(rating) {
        this.props.changeModalState({ rating: rating })
    }

    handleSetStarted(value) {
        this.props.changeModalState({
            started: value,
            startedPicked: true
        })
    }

    handleSetCompleted(value) {
        this.props.changeModalState({
            completed: value,
            completedPicked: true
        })
    }

    handleResetTimes(e) {
        e.preventDefault()
        this.props.changeModalState({
            started: this.props.modal.task.get('started') ? moment(this.props.modal.task.get('started')) : false,
            completed: this.props.modal.task.get('completed') ? moment(this.props.modal.task.get('completed')) : false
        })
    }

    render() {
        const { modal, projectColorMap, settings, rating, projectList } = this.props
        let { started, completed } = this.props

        const task = modal.task
        const locale = settings.get('locale')

        const startMoment = task.get('repeating') ? momentSetSameWeek(moment(task.get('start')).startOf('minute')) :
                            moment(task.get('start')).startOf('minute')
        //const snoozeStartMoment = startMoment.clone().add(task.get('snooze') ? task.get('snooze') : 0, 'minutes')

        const endMoment = task.get('repeating') ?
                          momentSetSameWeek(moment(task.get('start')).add(task.get('duration'), 'minutes').startOf('minute')) :
                          moment(task.get('start')).add(task.get('duration'), 'minutes').startOf('minute')

        //const extendEndMoment = endMoment.clone().add(task.get('extend') ? task.get('extend') : 0, 'minutes')

        const project = getProjectFromTask(task, projectList)

        const hiddenMinutes = ModalContent.generateHiddenMinutes()

        let overElements = null
        if ( modal.type === MODAL_TYPES.OVER ) {
            overElements = (
                <div className="modal-content-over-elements w3-padding">
                    <div className="modal-content-over-label">
                        Scheduled
                        <div
                            className="modal-content-over-date"
                            title={'The date is currently not adjustable here. If necessary, \nuse "Reschedule" and move it manually into the past.'}
                        >
                            {task.get('repeating') ? 'Every ' + moment(task.get('start')).format('dddd') : moment(task.get('start')).format('ll')}
                        </div>
                    </div>
                    <div className="modal-content-over-label">
                        Started
                        <TimePicker
                            className="modal-content-over-timepicker"
                            popupClassName={locale !== 'en' ? 'modal-content-over-popup w3-card' : ' w3-card'}
                            value={started}
                            showSecond={false}
                            use12Hours={locale === 'en'}
                            disabledMinutes={() => hiddenMinutes}
                            hideDisabledOptions
                            allowEmpty={false}
                            onChange={::this.handleSetStarted}
                        />
                    </div>
                    <div className="modal-content-over-label">
                        Completed
                        <TimePicker
                            className="modal-content-over-timepicker"
                            popupClassName={locale !== 'en' ? 'modal-content-over-popup' : ''}
                            value={completed}
                            showSecond={false}
                            use12Hours={locale === 'en'}
                            disabledMinutes={() => hiddenMinutes}
                            hideDisabledOptions
                            allowEmpty={false}
                            onChange={::this.handleSetCompleted}
                        />
                    </div>
                    <IconButton
                        iconName={'restore'}
                        style={
                            {
                                justifySelf: 'end',
                                marginTop: '23px'
                            }}
                        onClick={::this.handleResetTimes}
                        tooltip={'Restore scheduled times'}
                    />
                </div>
            )
        }

        return <div className="modal-content-wrapper w3-theme-l5">
            <div
                className="modal-middle"
            >
                <div className="modal-middle-left w3-padding">
                    <TaskPreview
                        projectColorMap={projectColorMap}
                        task={task.toJS()}
                        locale={locale}
                        notDragging={true}
                    />
                    {(modal.type === MODAL_TYPES.COMPLETION || modal.type === MODAL_TYPES.OVER) &&
                    <RatingPicker
                        setRating={::this.handleSetRating}
                        rating={rating}
                    />
                    }
                </div>
                {
                    (modal.type === MODAL_TYPES.OVER)
                        ?
                    <div className="modal-middle-right w3-padding">
                        <p>{'The task "' + task.get('title') + '" was scheduled in the past. '}</p>
                        <p>Did you complete it? <br/>Enter your start and completion times.</p>
                        <p>Did you miss it? <br/>Decide if you want to reschedule or remove the task.</p>
                        {/*<p>{task.get('description')}</p>*/}
                    </div>
                        :
                    (modal.type === MODAL_TYPES.REMINDER)
                        ?
                    <div className="modal-middle-right w3-padding">
                        <div className="modal-content-grid">
                            <div className="modal-content-label">Project:</div>
                            <div className="modal-content-text">{project.get('title')}
                                <div
                                    className="material-icons project-type-option-icon"
                                    title={project.get('type')}
                                    style={{
                                        marginLeft: '8px',
                                        marginTop: '-8px',
                                        color: 'rgba(0,0,0,0.6)'
                                    }}
                                >
                                    {PROJECT_TYPES[project.get('type')].icon}
                                </div>
                            </div>

                            <div className="modal-content-label">Date:</div>
                            <div className="modal-content-text">{startMoment.format('LL')}</div>

                            <div className="modal-content-label">Start:</div>
                            <TimePicker
                                className="modal-content-over-timepicker"
                                popupClassName={locale !== 'en' ? 'modal-content-over-popup w3-card' : ' w3-card'}
                                value={started}
                                showSecond={false}
                                use12Hours={locale === 'en'}
                                disabledMinutes={() => hiddenMinutes}
                                hideDisabledOptions
                                allowEmpty={false}
                                onChange={::this.handleSetStarted}
                            />

                            <div className="modal-content-label">{'End:'}</div>
                            <div className="modal-content-text">
                                {
                                    (started)
                                        ?
                                    started.clone().add(task.get('duration'), 'minutes').format('LT') + '  (Planned ' + endMoment.format('LT') + ')'
                                        :
                                    endMoment.format('LT')
                                }
                            </div>
                        </div>
                    </div>
                        :
                    (modal.type === MODAL_TYPES.COMPLETION)
                        ?
                    <div className="modal-middle-right w3-padding">
                        <div className="modal-content-grid">
                            <div className="modal-content-label">Project:</div>
                            <div className="modal-content-text">{project.get('title')}
                                <div
                                    className="material-icons project-type-option-icon"
                                    title={project.get('type')}
                                    style={{
                                        marginLeft: '8px',
                                        marginTop: '-8px',
                                        color: 'rgba(0,0,0,0.6)'
                                    }}
                                >
                                    {PROJECT_TYPES[project.get('type')].icon}
                                </div>
                            </div>

                            <div className="modal-content-label">Date:</div>
                            <div className="modal-content-text">{startMoment.format('LL')}</div>

                            <div className="modal-content-label">Started:</div>
                            <div className="modal-content-text">
                                {
                                    started && (
                                        (started.isSame(startMoment, 'minute'))
                                            ?
                                        started.format('LT')
                                            :
                                        started.format('LT') + '  (Planned ' + startMoment.format('LT') + ')'
                                    )
                                }
                            </div>

                            <div className="modal-content-label">Completed:</div>
                            <TimePicker
                                className="modal-content-over-timepicker"
                                popupClassName={locale !== 'en' ? 'modal-content-over-popup' : ''}
                                value={completed}
                                showSecond={false}
                                use12Hours={locale === 'en'}
                                disabledMinutes={() => hiddenMinutes}
                                hideDisabledOptions
                                allowEmpty={false}
                                onChange={::this.handleSetCompleted}
                            />
                        </div>
                    </div>
                        :
                    <div className="modal-middle-right w3-padding"/>
                }
            </div>
            {overElements}
        </div>
    }
}