import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import tinycolor from 'tinycolor2'
import IconButton from '../misc/IconButton'


export default class Project extends React.Component {

    static propTypes = {
        project: ImmutablePropTypes.map.isRequired,
        projectActions: React.PropTypes.objectOf(React.PropTypes.func),
        editable: React.PropTypes.bool
    }

    static defaultPropTypes = {
        editable: false
    }

    constructor(){
        super()
        this.state = {
            editing: false
        }
    }

    handleClick() {
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

    render() {
        const { project, editable } = this.props
        return <div
            className="project w3-card-2 w3-round-large w3-display-container"
            style={
                {
                    backgroundColor: project.get('color'),
                    border: 'solid 1px ' + tinycolor(project.get('color')).brighten(-35)
                }
            }
        >
            <div className="project-title w3-large w3-center">
                {project.get('title')}
            </div>
            <div className="task-item-buttons w3-display-hover w3-display-topright">
                { editable &&
                <IconButton
                    iconName={'edit'}
                    onClick={::this.handleClick}
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
    }
}