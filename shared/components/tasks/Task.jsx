import { merge as _merge } from 'lodash/object'
import * as React from 'react'

import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { DndTypes, PROJECT_COLORS } from '../../utils/constants'
import IconButton from '../misc/IconButton'
import TaskEdit from './TaskEdit'
import tinycolor from 'tinycolor2'

const dragSource = {
    canDrag(props) {
        return props.draggable
    },

    beginDrag(props) {
        // Return the data describing the dragged item
        return props.task.toJSON()
    },

    endDrag(props, monitor) {
        if ( !monitor.didDrop() ) {
            // You can check whether the drop was successful
            // or if the drag ended but nobody handled the drop
            props.taskActions.editTask(_merge(monitor.getItem(), { start: null }))
            return
        }

        // When dropped on a compatible target, do something.
        // Read the original dragged item from getItem():
        const task = monitor.getItem()

        // You may also read the drop result from the drop target
        // that handled the drop, if it returned an object from
        // its drop() method.
        const dropResult = monitor.getDropResult()

        // This is a good place to call some action
        props.taskActions.editTask(_merge(task, { start: dropResult.droppedAt }))
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
        projectList: ImmutablePropTypes.list.isRequired,
        taskActions: React.PropTypes.objectOf(React.PropTypes.func).isRequired,
        editable: React.PropTypes.bool,
        draggable: React.PropTypes.bool,
        scaled: React.PropTypes.bool,
        connectDragSource: React.PropTypes.func,
        connectDragPreview: React.PropTypes.func,
        isDragging: React.PropTypes.bool,
        liWrapper: React.PropTypes.object
    }

    static contextTypes = {
        dragDropManager: React.PropTypes.object
    }

    componentDidMount() {
        // Use empty image as a drag preview so browsers don't draw it
        // and we can draw whatever we want on the custom drag layer instead.
        this.props.connectDragPreview(getEmptyImage(), {
            // IE fallback: specify that we'd rather screenshot the node
            // when it already knows it's being dragged so we can hide it with CSS.
            captureDraggingState: false
        })
    }


    constructor(props, context) {
        super(props, context)

        const project = this.props.projectList.find(
            p => p.get('id') === this.props.task.get('projectID')
        )

        this.state = {
            editing: false,
            color: project ? project.get('color') : '#fff'
        }
    }

    handleEditClick() {
        if ( this.props.editable ) {
            this.setState({ editing: true })
        }
    }


    handleSave(task) {
        if ( task.text.length === 0 ) {
            this.props.taskActions.removeTask(task)
        } else {
            this.props.taskActions.editTask(task)
        }
        this.setState({ editing: false })
    }

    // getProjectColor() {
    //     const project = this.props.projectList.find(
    //         p => p.get('id') === this.props.task.get('projectID')
    //     )
    //     return project ? project.get('color') : '#fff'
    // }

    render() {
        const { task, taskActions: { removeTask }, editable, draggable, connectDragSource, isDragging, liWrapper } = this.props
        if ( isDragging ) {
            return null
        }

        const durationCutoff = task.get('duration') >= 90

        const colorStyle = {
            backgroundColor: this.state.color,
            borderColor: tinycolor(this.state.color).brighten(-35)
        }
        const dragStyle = draggable ?
            {
                cursor: 'move'
            } : {}
        let element

        if ( this.state.editing ) {
            element = <TaskEdit
                colorStyle={colorStyle}
                task={task}
                onSubmit={ (task) => this.handleSave(task) }
            />
        } else {
            element =
                <div
                    className="task-item w3-card-2 w3-round-large w3-display-container"
                    style={_merge(colorStyle, dragStyle, isDragging ?
                        {
                            pointerEvents: 'none',
                            opacity: 0.6,
                            zIndex: 1
                        } : {}
                    )}
                >
                    <div className="task-item-info">
                        <p className="title">{task.get('text')}</p>
                        {durationCutoff && <p className="duration">{task.get('duration') / 60} hours</p>}
                    </div>
                    <div className="task-item-buttons w3-display-hover w3-display-topright">
                        { editable &&
                        <IconButton
                            iconName={'edit'}
                            onClick={::this.handleEditClick}
                        />
                        }
                        { editable &&
                        <IconButton
                            iconName={'delete_forever'}
                            onClick={() => removeTask(task.get('id'))}
                            dangerLevel={'danger'}
                        />
                        }
                    </div>
                </div>
            element = connectDragSource((liWrapper) ? <li
                className={liWrapper.className}
                style={liWrapper.style}
            >{element}</li> : element)
        }
        return element
    }
}