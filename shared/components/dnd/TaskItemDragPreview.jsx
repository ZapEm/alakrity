import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import tinycolor from 'tinycolor2'

export default class TaskItemDragPreview extends React.Component {

    static propTypes = {
        task: React.PropTypes.object.isRequired,
        projectList: ImmutablePropTypes.list.isRequired
    }

    constructor(props) {
        super(props)

        const project = this.props.projectList.find(
            p => p.get('id') === this.props.task.projectID
        )

        this.state = {
            color: project ? project.get('color') : '#fff'
        }
    }

    render() {
        const { task } = this.props
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
                <div className="task-item w3-card-4 w3-round-large"
                     style={
                         {
                             backgroundColor: this.state.color,
                             borderColor: tinycolor(this.state.color).brighten(-35)
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