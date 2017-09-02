import { merge as _merge } from 'lodash/object'
import PropTypes from 'prop-types'
import React from 'react'

import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { DANGER_LEVELS } from '../../utils/constants'
import { DndTypes } from '../../utils/enums'
import IconButton from '../misc/IconButton'
import TaskEdit from './TaskEdit'

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
        projectColorMap: ImmutablePropTypes.map.isRequired,
        taskActions: PropTypes.objectOf(PropTypes.func),
        editable: PropTypes.bool,
        draggable: PropTypes.bool,
        scaled: PropTypes.bool,
        connectDragSource: PropTypes.func,
        connectDragPreview: PropTypes.func,
        isDragging: PropTypes.bool,
        liWrapper: PropTypes.object
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
        }
    }


    handleSave(task) {
        if ( task.text.length === 0 ) {
            this.props.taskActions.removeTask(task.id)
        } else {
            this.props.taskActions.editTask(task)
        }
        this.setState({ editing: false })
    }


    render() {
        const {
            task, taskActions: { removeTask }, editable, draggable, connectDragSource, isDragging, liWrapper,
            projectColorMap
        } = this.props


        if ( isDragging ) {
            return null
        }

        const durationCutoff = task.get('duration') >= 90

        const projectID = task.get('projectID')
        const itemColors = {
            normal: projectColorMap.getIn([projectID, 'normal']),
            dark: projectColorMap.getIn([projectID, 'dark']),
            light: projectColorMap.getIn([projectID, 'light'])
        }
        const dragStyle = draggable ?
            {
                cursor: 'move'
            } : {}

        let element
        if ( this.state.editing ) {
            element = <TaskEdit
                colors={itemColors}
                task={task}
                onSubmit={(task) => this.handleSave(task)}
            />
        } else {
            element =
                <div
                    className={'task-item w3-card-2 w3-round-large w3-display-container' + (projectID.startsWith('_') ?
                                                                                            ' special' : '')}
                    style={_merge({}, {
                            backgroundColor: itemColors.normal,
                            borderColor: itemColors.dark
                        }, dragStyle, isDragging ?
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
                        {editable &&
                        <IconButton
                            iconName={'edit'}
                            onClick={::this.handleEditClick}
                        />
                        }
                        {editable &&
                        <IconButton
                            iconName={'delete_forever'}
                            onClick={() => removeTask(task.get('id'))}
                            dangerLevel={DANGER_LEVELS.DANGER}
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