import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'

export default class TaskItemDragPreview extends React.Component {

    static propTypes = {
        task: React.PropTypes.object.isRequired,
        projectColorMap: ImmutablePropTypes.map.isRequired
    }

    render() {
        const { task, projectColorMap } = this.props
        const durationCutoff = task.duration >= 90

        return (
            <div
                className="drag-item"
                style={
                    {
                        height: task.duration / 20 + 'rem',
                        width: '112px',
                        padding: '2px',
                        pointerEvents: 'none'
                    }
                }>
                <div className={'task-item w3-card-4 w3-round-large' + (task.projectID.startsWith('_') ? ' special' : '')}
                     style={
                         {
                             backgroundColor: projectColorMap.getIn([task.projectID, 'normal']),
                             borderColor: projectColorMap.getIn([task.projectID, 'dark'])
                         }
                     }>
                    <div className="task-item-info">
                        <p className="task-item-info title">{task.text}</p>
                        {durationCutoff &&
                        <p className="task-item-info duration">{task.duration / 60} hours</p>}
                    </div>
                </div>
            </div>)
    }
}