import moment from 'moment'
import PropTypes from 'prop-types'
import TimePicker from 'rc-time-picker'
import React from 'react'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import * as MomentPropTypes from 'react-moment-proptypes'
import { MODAL_TYPES } from '../../../utils/enums'
import TaskPreview from '../../dnd/TaskItemDragPreview'
import IconButton from '../IconButton'
import { Modal } from './Modals'
import RatePicker from './RatingPicker'

export default class ModalContent extends React.Component {

    static propTypes = {
        modal: PropTypes.instanceOf(Modal),
        modalsList: ImmutablePropTypes.list,
        projectColorMap: ImmutablePropTypes.map.isRequired,
        settings: ImmutablePropTypes.map.isRequired,
        rating: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
        changeModalState: PropTypes.func.isRequired,
        started: PropTypes.oneOfType([MomentPropTypes.momentObj, PropTypes.bool]),
        completed: PropTypes.oneOfType([MomentPropTypes.momentObj, PropTypes.bool])
    }

    static defaultProps = {
        started: false,
        completed: false
    }

    static generateHiddenMinutes() {
        const arr = []
        for ( let value = 0; value < 60; value++ ) {
            if ( value % 5 !== 0 ) {
                arr.push(value)
            }
        }
        return arr
    }

    componentWillMount() {
        this.props.changeModalState({
            started: moment(this.props.modal.task.get('start')),
            completed: moment(this.props.modal.task.get('start')).add(this.props.modal.task.get('duration'), 'minutes')
        })
    }

    componentWillUpdate(nextProps) {
        if ( nextProps.modal && this.props.modal !== nextProps.modal ) {
            this.props.changeModalState({
                started: moment(nextProps.modal.task.get('start')),
                completed: moment(nextProps.modal.task.get('start')).add(nextProps.modal.task.get('duration'), 'minutes')
            }, nextProps.modalsList.keySeq())
        }
    }

    handleSetRating(rating) {
        this.props.changeModalState({ rating: rating })
    }

    handleSetStarted(value) {
        this.props.changeModalState({ started: value })
    }

    handleSetCompleted(value) {
        this.props.changeModalState({ completed: value })
    }

    handleResetTimes(e) {
        e.preventDefault()
        this.props.changeModalState({
            started: moment(this.props.modal.task.get('start')),
            completed: moment(this.props.modal.task.get('start')).add(this.props.modal.task.get('duration'), 'minutes')
        })
    }

    render() {
        const { modal, projectColorMap, settings, rating, started, completed } = this.props

        const task = modal.task// ? modal.task : false
        const locale = settings.get('locale')

        const hiddenMinutes = ModalContent.generateHiddenMinutes()

        let overElements = null
        if ( modal.type === MODAL_TYPES.OVER && started && completed ) {
            overElements = (
                <div className="modal-content-over-elements w3-padding">
                    <div className="modal-content-over-label">
                        Scheduled
                        <div
                            className="modal-content-over-date"
                            title={'The date is currently not adjustable here. If necessary, \nuse "Reschedule" and move it manually into the past.'}
                        >
                            {moment(task.get('start')).format('ll')}
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
                        task={task.toJSON()}
                        locale={locale}
                    />
                    {modal.type === MODAL_TYPES.COMPLETION || modal.type === MODAL_TYPES.OVER &&
                    <RatePicker
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
                        <p>Did you complete it? <br/> Enter your start and completion times.</p>
                        <p>Did you miss it? <br/> Decide if you want to reschedule or remove the task.</p>
                        <p>{task.get('description')}</p>
                    </div>
                        :
                    <div className="modal-middle-right w3-padding">
                        <p>{task.get('title')}</p>
                        <p>End: {moment(task.get('start')).add(task.get('duration'), 'minutes').fromNow()}</p>
                        {/* TODO: fix when description is added */ !task.get('description') &&
                        <p>{task.get('description')}</p>}
                    </div>
                }

            </div>
            {overElements}
        </div>
    }
}