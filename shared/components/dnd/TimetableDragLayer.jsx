import React, { Component, PropTypes } from 'react'
import { DragLayer } from 'react-dnd'

import shallowEqual from 'react-dnd/lib/utils/shallowEqual'
import shallowEqualScalar from 'react-dnd/lib/utils/shallowEqualScalar'
import { DndTypes } from '../../utils/constants'
import { getSnappedOffset } from './dndFunctions'
import TaskItemDragPreview from './TaskItemDragPreview'
import ImmutablePropTypes from 'react-immutable-proptypes'

const arePropsEqual = shallowEqualScalar


@DragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    monitor: monitor
}))
export default class CustomDragLayer extends Component {
    static propTypes = {
        item: PropTypes.object,
        itemType: PropTypes.string,
        isDragging: PropTypes.bool,
        snapToGrid: PropTypes.bool.isRequired,
        projectColorMap: ImmutablePropTypes.map.isRequired,
        monitor: PropTypes.object
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !arePropsEqual(nextProps, this.props) || !shallowEqual(nextState, this.state)
    }

    constructor(props, context) {
        super(props, context)
        this.handleOffsetChange = this.handleOffsetChange.bind(this)
        this.handleStateChange = this.handleStateChange.bind(this)
        this.state = {
            item: this.props.monitor.getItem(),
            itemType: this.props.monitor.getItemType(),
            isDragging: this.props.monitor.isDragging()
        }

    }

    componentDidMount() {
        this.isCurrentlyMounted = true

        this.unsubscribeFromOffsetChange = this.props.monitor.subscribeToOffsetChange(
            this.handleOffsetChange
        )
        this.unsubscribeFromStateChange = this.props.monitor.subscribeToStateChange(
            this.handleStateChange
        )

        this.handleStateChange()
    }

    componentWillUnmount() {
        this.isCurrentlyMounted = false

        this.unsubscribeFromOffsetChange()
        this.unsubscribeFromStateChange()
    }

    handleOffsetChange() {
        if ( !this.isCurrentlyMounted || this.state.itemType !== DndTypes.TASK ) {
            return
        }
        const now = Date.now() // limit to ~60 updates per second to increase render performance.
        if ( !this.lastTime || now - this.lastTime > 15 ) {
            this.lastTime = now
            let offset = this.props.monitor.getSourceClientOffset()
            if ( offset ) {
                const snapped = getSnappedOffset(this.state.itemType, offset)

                if ( this.dragOffsetDiv ) {
                    if ( snapped.show ) {
                        this.dragOffsetDiv.style.display = 'block'
                        this.dragOffsetDiv.style.left = snapped.offset.x + 'px'
                        this.dragOffsetDiv.style.top = snapped.offset.y + 'px'
                    } else {
                        this.dragOffsetDiv.style.display = 'none'
                    }
                }
            }
        }
    }

    handleStateChange() {
        if ( !this.isCurrentlyMounted ) {
            return
        }
        const nextState = this.getCurrentState()
        if ( !shallowEqual(nextState, this.state) ) {
            this.setState(nextState)
        }
    }

    getCurrentState() {
        return {
            item: this.props.monitor.getItem(),
            itemType: this.props.monitor.getItemType(),
            isDragging: this.props.monitor.isDragging()
        }
    }




    renderItem(type, item) {
        const elements = {
            [DndTypes.TASK]: <TaskItemDragPreview task={item} projectColorMap={this.props.projectColorMap}/>
        }
        return (elements[type] || null )
    }

    render() {
        const { item, itemType, isDragging } = this.state

        if ( !isDragging || itemType === DndTypes.HANDLE ) {
            return null
        }
        return (
            <div className="custom-drag-layer">
                <div className="drag-offset" ref={dragOffsetDiv => this.dragOffsetDiv = dragOffsetDiv}>
                    {this.renderItem(itemType, item)}
                </div>
            </div>
        )
    }
}