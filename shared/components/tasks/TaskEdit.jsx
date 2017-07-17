import { merge as _merge } from 'lodash/object'
import * as React from 'react'

import { DragLayer, DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { DndTypes } from '../../utils/constants'
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
        onSubmit: React.PropTypes.func.isRequired,
        // removeTask: React.PropTypes.func,
        editTask: React.PropTypes.func,
        connectDragSource: React.PropTypes.func,
        connectDragPreview: React.PropTypes.func,
        isDragging: React.PropTypes.bool,
        monitor: React.PropTypes.func,
        item: React.PropTypes.object,
        itemType: React.PropTypes.string
    }

    static contextTypes = {
        dragDropManager: React.PropTypes.object
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
        console.log('SAVEEE!!!')
        this.props.onSubmit(this.state)
    }

    handleTextChange(e) {
        this.setState({ text: e.target.value })
    }

    render() {
        const { connectDragSource, isDragging } = this.props

        const durationCutoff = this.state.duration >= 90

        return <div className="task-list-item">
            <form
                onSubmit={::this.handleSubmit}
                className="task-item task-item-edit w3-card-2 w3-round-large w3-border w3-border-theme w3-round-large w3-bottombar w3-border-theme w3-display-container"
                style={{ height: this.state.duration / 20 + 'rem' }}
            >
                <div className="task-item-info">
                    <div
                        className="task-item-info"
                    >
                        <input
                            className="w3-input task-item-title-edit"
                            type="text"
                            onChange={::this.handleTextChange}
                            defaultValue={this.state.text}/>
                    </div>
                    {durationCutoff && <p className="task-item-info duration">{this.state.duration / 60} hours</p>}
                </div>
                <div className="task-item-buttons Xw3-display-hover w3-display-bottomright">
                    <IconButton
                        iconName={'save'}
                    />
                </div>
                { connectDragSource(<div
                    className="material-icons task-item-handle w3-display-bottommiddle"
                    style={ isDragging ?
                        {
                            pointerEvents: 'none'
                        } : {} }
                >{'more_horiz'}</div>)
                }
            </form>
        </div>
    }
}