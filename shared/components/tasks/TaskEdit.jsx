import * as _ from 'lodash/object'
import PropTypes from 'prop-types'
import React from 'react'

import { DragLayer, DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { LOCALE_STRINGS, TASK_TYPES } from '../../utils/constants'
import { TASK_MAX_DURATION } from '../../utils/defaultValues'
import { DndTypes } from '../../utils/enums'
import newId from '../../utils/newId'
import { getDurationDelta } from '../dnd/dndFunctions'
import IconButton from '../misc/IconButton'


const dragSource = {
    beginDrag(props, monitor, component) {
        // Return the data describing the dragged item
        return {
            duration: component.child.state.duration,
            changeDuration: (duration) => component.child.changeDuration(duration)
        }
    }
}


@DragSource(DndTypes.HANDLE, dragSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
}))
@DragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    monitor: monitor
}))
export default class TaskEdit extends React.Component {

    static propTypes = {
        task: ImmutablePropTypes.map.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        editTask: PropTypes.func,
        connectDragSource: PropTypes.func,
        connectDragPreview: PropTypes.func,
        isDragging: PropTypes.bool,
        monitor: PropTypes.func,
        item: PropTypes.object,
        itemType: PropTypes.string,
        colors: PropTypes.object,
        locale: PropTypes.string.isRequired
    }

    // static defaultProps = {
    //     locale: 'en'
    // }

    static contextTypes = {
        dragDropManager: PropTypes.object
    }

    constructor(props) {
        super(props)
        this.handleOffsetChange = this.handleOffsetChange.bind(this)
        this.state = props.task.toJS()
    }

    componentDidMount() {
        this.isCurrentlyMounted = true
        this.unsubscribeFromOffsetChange = this.props.monitor.subscribeToOffsetChange(
            this.handleOffsetChange
        )
        // Use empty image as a drag preview so browsers don't draw it
        this.props.connectDragPreview(getEmptyImage(), { captureDraggingState: false })
    }

    componentWillUnmount() {
        this.isCurrentlyMounted = false
        this.unsubscribeFromOffsetChange()
    }

    handleOffsetChange() {
        if ( !this.isCurrentlyMounted || this.props.itemType !== DndTypes.HANDLE ) {
            return
        }

        const offsetDelta = this.props.monitor.getDifferenceFromInitialOffset()
        if ( offsetDelta ) {
            const dragItem = this.props.item

            if ( !this.oldDuration ) this.oldDuration = dragItem.duration
            const newDuration = +dragItem.duration + getDurationDelta(offsetDelta)
            if ( newDuration !== this.oldDuration && newDuration > 0 && newDuration <= TASK_MAX_DURATION ) {
                this.oldDuration = newDuration
                dragItem.changeDuration(newDuration)
            }
        }
    }

    changeDuration(duration) {
        this.setState({ duration: duration })
    }

    handleSubmit(e) {
        e.preventDefault()
        this.props.onSubmit(_.merge({}, this.state, { id: this.props.task.get('id') }))
    }

    handleCancel(e) {
        e.preventDefault()
        this.props.onCancel()
    }

    handleDetails(e) {
        e.preventDefault()
        console.log('OPEN DETAILS')
    }

    handleTitleChange(e) {
        this.setState({ title: e.target.value })
    }

    handleKeyDown(e) {

        // ArrowUp
        if ( e.keyCode === 40 && (this.state.duration + 30 <= TASK_MAX_DURATION) ) {
            e.preventDefault()
            this.setState({ duration: this.state.duration + 30 })
        }
        // ArrowDown
        if ( e.keyCode === 38 && (this.state.duration - 30 >= 30) ) {
            e.preventDefault()
            this.setState({ duration: this.state.duration - 30 })
        }
    }

    render() {
        const { connectDragSource, isDragging, colors, locale } = this.props

        const colorStyle = {
            backgroundColor: colors.normal,
            borderColor: colors.dark
        }
        const formID = newId('FORM_')

        const durationCutoff = this.state.duration >= 90

        return <div className="task-list-item" style={{
            zIndex: 3,
            minHeight: '7rem'
        }}>
            <form
                id={formID}
                onSubmit={::this.handleSubmit}
                className={
                    'task-item task-item-edit w3-card w3-display-container' +
                    (!this.state.repeating ? ' w3-round-large' : '')
                }
                style={
                    _.merge({}, colorStyle, {
                        height: this.state.duration / 20 + 'rem'
                    })
                }
            >
                <div className="task-item-info">
                    <div
                        className="task-item-info"
                        style={{ pointerEvents: 'all' }}
                    >
                        <input
                            className="w3-input task-item-title-edit w3-round"
                            form={formID}
                            type="text"
                            required
                            autoFocus
                            onKeyDownCapture={::this.handleKeyDown}
                            placeholder="Enter title..."
                            onChange={::this.handleTitleChange}
                            defaultValue={this.state.title}/>
                    </div>
                    {durationCutoff &&
                    <p className="task-item-info duration">{(this.state.duration / 60) + LOCALE_STRINGS[locale].hours}</p>}
                </div>

                {connectDragSource(<div
                    className="material-icons task-item-handle w3-display-bottommiddle"
                    style={isDragging ?
                        {
                            pointerEvents: 'none',
                            color: colors.normal
                        } : { color: colors.normal }}
                >{'more_horiz'}</div>)
                }
            </form>
            <div
                className={'task-item-edit-buttons' + (durationCutoff ? ' cutoff' : '')}
                style={{
                    backgroundColor: colors.light,
                    borderColor: colors.dark
                }}
            >
                {!durationCutoff &&
                <p
                    className="cutoff-duration"
                >{(this.state.duration / 60) + LOCALE_STRINGS[locale].hours}
                </p>}
                <div className="ti-edit-btn-line w3-display-bottommiddle">
                    <IconButton
                        iconName={'clear'}
                        tooltip='Cancel'
                        onClick={::this.handleCancel}
                    />
                    <IconButton
                        iconName={'content_paste'}
                        tooltip="Details"
                        onClick={::this.handleDetails}
                    />
                    <IconButton
                        formID={formID}
                        tooltip="Save"
                        iconName={'save'}
                        //onClick={::this.handleSubmit}
                    />
                </div>
            </div>
        </div>
    }
}