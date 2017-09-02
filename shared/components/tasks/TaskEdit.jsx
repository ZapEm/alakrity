import * as _ from 'lodash/object'
import PropTypes from 'prop-types'
import React from 'react'

import { DragLayer, DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import ImmutablePropTypes from 'react-immutable-proptypes'
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
        // removeTask: PropTypes.func,
        editTask: PropTypes.func,
        connectDragSource: PropTypes.func,
        connectDragPreview: PropTypes.func,
        isDragging: PropTypes.bool,
        monitor: PropTypes.func,
        item: PropTypes.object,
        itemType: PropTypes.string,
        colors: PropTypes.object
    }

    static contextTypes = {
        dragDropManager: PropTypes.object
    }

    constructor(props) {
        super(props)
        this.handleOffsetChange = this.handleOffsetChange.bind(this)
        this.state = props.task.toJSON()
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
            if ( newDuration !== this.oldDuration && newDuration > 0 && newDuration < 241 ) {
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

    handleTextChange(e) {
        this.setState({ text: e.target.value })
    }

    render() {
        const { connectDragSource, isDragging, colors } = this.props

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
                className="task-item task-item-edit w3-card-2 w3-round-large w3-display-container"
                style={
                    _.merge({}, colorStyle, {
                        height: this.state.duration / 20 + 'rem'
                    })
                }
            >
                <div className="task-item-info">
                    <div
                        className="task-item-info"
                    >
                        <input
                            className="w3-input task-item-title-edit"
                            type="text"
                            autoFocus
                            placeholder="Enter title..."
                            onChange={::this.handleTextChange}
                            defaultValue={this.state.text}/>
                    </div>
                    {durationCutoff && <p className="task-item-info duration">{this.state.duration / 60} hours</p>}
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
                className="task-item-edit-buttons"
                style={{
                    backgroundColor: colors.light,
                    borderColor: colors.dark
                }}
            >
                <IconButton
                    formID={formID}
                    iconName={'save'}
                />
                <IconButton
                    style={{
                        display: 'block',
                        marginTop: 0
                    }}
                    iconName={'clear'}
                />
                <IconButton
                    style={{
                        display: 'block',
                        marginTop: 0
                    }}
                    iconName={'content_paste'}
                />
            </div>
        </div>
    }
}