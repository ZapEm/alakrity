import classNames from 'classnames'
import Immutable from 'immutable'
import * as _ from 'lodash/object'
import { merge as _merge } from 'lodash/object'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import ImmutablePropTypes from 'react-immutable-proptypes'
import MomentPropTypes from 'react-moment-proptypes'
import { DANGER_LEVELS, LOCALE_STRINGS } from '../../utils/constants'
import { DEFAULT_PROJECT } from '../../utils/defaultValues'
import { DndTypes, TASK_STATUS } from '../../utils/enums'
import { getTaskEndMoment, getTaskStartMoment, getTaskStatus } from '../../utils/helpers'
import IconButton from '../misc/IconButton'
import TaskEdit from './TaskEdit'

const dragSource = {
    canDrag(props) {
        if ( props.draggable && !props.editMode && props.task.get('repeating') ) {
            if ( alert('Repeating tasks can only be moved while in the "Change Weekly Schedule" view.\n\n' +
                    'In the future, there could be a way to create one-time exceptions here.') ) {
                //TODO: exceptions for repeating tasks
            }
            return false
        }
        return props.draggable
    },

    beginDrag(props) {
        // Return the data describing the dragged item
        return props.task.toJSON()
    },

    endDrag(props, monitor) {
        // When dropped on a compatible target, do something.
        // Read the original dragged item from getItem():
        const task = monitor.getItem()

        if ( !monitor.didDrop() ) {
            const thisWeek = moment().startOf('isoWeek')

            if ( getTaskStatus(task, thisWeek) === TASK_STATUS.DONE.key ) {
                if ( !confirm('You are trying to remove a task that is already done from the schedule. ' +
                        'This will change it back to "not done". \n\n' +
                        'Do you wish to proceed?') ) {
                    return
                }
            }

            //
            // props.taskActions.editTask(_merge({}, task, {
            //         start: null,
            //         status: task.repeating ? { [thisWeek]: TASK_STATUS.DEFAULT.key } : TASK_STATUS.DEFAULT.key
            //     })
            // )

            props.taskActions.rescheduleTask(task, !!task.started, true)

            return
        }


        // You may also read the drop result from the drop target
        // that handled the drop, if it returned an object from
        // its drop() method.
        const dropResult = monitor.getDropResult()

        // This is a good place to call some action
        if ( dropResult ) {
            const milestones = props.projectColorMap.getIn([task.projectID, 'project', 'milestones'])
            let milestone = false
            if ( task.milestone && milestones ) {
                milestone = milestones.find(milestone => milestone.get('id') === task.milestone)
            }
            if ( milestone && moment(milestone.get('deadline')).isBefore(moment(dropResult.droppedAt), 'day') ) {
                // if milestone deadline would be before the scheduled time, ask for confirmation.
                if ( confirm('You are trying to schedule a task after its deadline (milestone).\n\nAre you sure you want to do this?') ) {
                    props.taskActions.editTaskStart(_merge(task, { start: dropResult.droppedAt }))
                }
            } else {
                props.taskActions.editTaskStart(_merge(task, { start: dropResult.droppedAt }))
            }
        }
    }
}

@DragSource(DndTypes.TASK, dragSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
}))
export default class Task extends React.Component {

    static propTypes = {
        task: ImmutablePropTypes.map.isRequired,
        projectColorMap: ImmutablePropTypes.map.isRequired,
        taskActions: PropTypes.objectOf(PropTypes.func),
        editable: PropTypes.bool,
        draggable: PropTypes.bool,
        dragShadow: PropTypes.bool,
        scaled: PropTypes.bool,
        connectDragSource: PropTypes.func,
        connectDragPreview: PropTypes.func,
        isDragging: PropTypes.bool,
        liWrapper: PropTypes.object,
        locale: PropTypes.string.isRequired,
        editMode: PropTypes.bool,
        editTaskStart: PropTypes.func,
        setEditingTask: PropTypes.func,
        displayMoment: MomentPropTypes.momentObj
    }

    static defaultProps = {
        editMode: false
    }

    static contextTypes = {
        dragDropManager: PropTypes.object
    }

    constructor(props, context) {
        super(props, context)

        this.state = {
            editing: false
        }
    }

    static getMilestoneTooltip(milestone, deadline) {
        if ( milestone && deadline ) {
            return 'Milestone: \nTitle:\t'
                + milestone.get('title') + '\nDate:\t'
                + deadline.format('LL') + '\n\t('
                + deadline.fromNow() + ')'
        }
        return 'No Milestone'
    }

    componentWillMount() {
        this.setState({ editing: this.props.task.get('editing') || false })
    }

    componentDidMount() {
        // Use empty image as a drag preview so browsers don't draw it
        // and we can draw whatever we want on the custom drag layer instead.
        if ( this.props.draggable ) {
            this.props.connectDragPreview(getEmptyImage(), {
                // IE fallback: specify that we'd rather screenshot the node
                // when it already knows it's being dragged so we can hide it with CSS.
                captureDraggingState: false
            })
        }
    }

    handleEditClick() {
        if ( this.props.editable ) {
            this.setState({ editing: true })
            this.props.setEditingTask(this.props.task.get('id'), true)
        }
    }

    handleSave(task) {
        if ( !task.title || task.title.length === 0 ) {
            this.props.taskActions.removeTask(task.id)
        } else {
            this.props.taskActions.editTask(task)
        }
        this.setState({ editing: false })
        this.props.setEditingTask(this.props.task.get('id'), false)
    }

    handleCancel() {
        this.setState({ editing: false })
        this.props.setEditingTask(this.props.task.get('id'), false)
    }

    getMilestoneDetails() {
        const milestones = this.props.projectColorMap.getIn([this.props.task.get('projectID'), 'project', 'milestones'])
        if ( milestones && this.props.task.get('milestone') ) {
            const milestone = milestones.find(milestone => milestone.get('id') === this.props.task.get('milestone'))
            if ( milestone ) {
                const deadline = moment(milestone.get('deadline'))
                return { milestones, milestone, deadline }
            }
        }
        return { milestones, milestone: false, deadline: false }
    }

    render() {
        const {
            task, taskActions: { removeTask }, editable, draggable, connectDragSource, isDragging, dragShadow, liWrapper,
            projectColorMap, locale, displayMoment
        } = this.props


        if ( isDragging && !dragShadow ) {
            return null
        }

        const taskStatus = displayMoment ? getTaskStatus(task, displayMoment.clone().startOf('isoWeek')) :
                           task.get('status')
        // const status = (editable || taskStatus !== TASK_STATUS.SCHEDULED.key) ?
        //                TASK_STATUS[taskStatus] : false

        const durationCutoff = task.get('duration') >= 90


        const colors = (projectColorMap.get(task.get('projectID')) || Immutable.fromJS({
            project: DEFAULT_PROJECT,
            normal: 'gray',
            dark: 'dimgray',
            light: 'lightgray',
            special: {
                normal: 'darkgray',
                dark: 'darkslategray',
                light: 'silver'
            }
        })).toJSON()

        const status = colors.project && colors.project.tracked && TASK_STATUS[taskStatus] ? TASK_STATUS[taskStatus] :
                       false
        const milestoneDetails = this.getMilestoneDetails()

        const itemColors = !task.get('special') ?
                           _.omit(colors, ['special']) :
                           colors.special

        const dragStyle = draggable ?
            {
                cursor: 'move'
            } : {}

        let element
        if ( this.state.editing ) {
            element = <TaskEdit
                colors={itemColors}
                task={task}
                locale={locale}
                onSubmit={(task) => this.handleSave(task)}
                onCancel={::this.handleCancel}
                milestones={milestoneDetails.milestones}
            />
        } else {

            let iconTooltip = ''
            try {
                iconTooltip = !status ? '' : {
                    [TASK_STATUS.SNOOZED.key]: (task) => 'Snoozed.\nReminder '
                        + getTaskStartMoment(task)
                            .add(task.get('snooze'), 'minutes')
                            .fromNow() + '.',
                    [TASK_STATUS.ACTIVE.key]: (task) => 'Active.\nPlanned end '
                        + getTaskEndMoment(task)
                            .add(task.get('extend'), 'minutes')
                            .fromNow() + '.',
                    [TASK_STATUS.DONE.key]: () => status.name,
                    [TASK_STATUS.DEFAULT.key]: () => status.name,
                    [TASK_STATUS.SCHEDULED.key]: () => status.name,
                    [TASK_STATUS.IGNORED.key]: () => 'Task is being ignored for the current week.\nYou will be reminded again next week.'
                }[status.key](task)
            } catch (error) {
                iconTooltip = status ? status.name : ''
            }
            // urgent task
            let isUrgent = false
            if ( milestoneDetails.deadline && status && status.key === TASK_STATUS.DEFAULT.key
                && moment().add(3, 'days').isAfter(milestoneDetails.deadline, 'day') ) {
                isUrgent = true
            }

            const taskTitle = task.get('title')

            element =
                <div
                    className={
                        classNames('task-item', 'w3-card', 'w3-display-container',
                            {
                                'dragging': isDragging,
                                'w3-round-large': !task.get('repeating'),
                                'special': task.get('special')
                            }
                        )
                    }
                    style={
                        _merge({}, {
                                backgroundColor: itemColors.normal,
                                borderColor: itemColors.dark
                            }, dragStyle
                        )
                    }
                    title={milestoneDetails.milestone ?
                           Task.getMilestoneTooltip(milestoneDetails.milestone, milestoneDetails.deadline) : ''}
                    // data-start={task.get('start')}
                    // data-duration={task.get('duration')}
                >
                    {status && (status.icon || isUrgent) &&
                    <div
                        className={'material-icons w3-display-topleft task-status-icon' + (task.get('duration') < 60 ?
                                                                                           ' small' : '')}
                        title={isUrgent ? 'Deadline is coming up!' : iconTooltip}
                        style={{ ...isUrgent && { color: 'rgba(100,0,0,0.4)' } }}
                    >
                        {isUrgent ? 'notifications_active' : status.icon}
                    </div>}
                    <div className="task-item-info">
                        <p className="title"
                           style={{
                               fontSize: taskTitle.length < 10 ? 'normal' : taskTitle.length < 20 ? 'small' : 'smaller'
                           }}>{taskTitle}</p>
                        {durationCutoff &&
                        <p className="duration">{(task.get('duration') / 60) + LOCALE_STRINGS[locale].hours}</p>}
                    </div>
                    {editable && !isDragging &&
                    <div className="task-item-buttons w3-display-hover">
                        <IconButton
                            iconName={'check_circle'}
                            onClick={() => removeTask(task.get('id'))}
                            dangerLevel={DANGER_LEVELS.DANGER}
                            style={{ float: 'left' }}
                            unarmedDangerLevel={DANGER_LEVELS.WARN.hover}
                            unarmedIconName={'delete_forever'}
                        />
                        <IconButton
                            iconName={'edit'}
                            onClick={::this.handleEditClick}
                            style={{ float: 'right' }}
                        />

                    </div>}
                </div>
            element = connectDragSource((liWrapper) ? <li
                className={liWrapper.className}
                style={liWrapper.style}
            >{element}</li> : element)
        }
        return element
    }
}