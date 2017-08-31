import moment from 'moment'
import * as React from 'react'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import { DANGER_LEVELS } from '../../utils/constants'
import { getProjectColorMap } from '../../utils/helpers'
import Task from '../dnd/TaskItemDragPreview'
import LabeledIconButton from './LabeledIconButton'


export default class Modal extends React.Component {

    static propTypes = {
        task: React.PropTypes.oneOfType([ImmutablePropTypes.map, React.PropTypes.bool]).isRequired,
        backendActions: React.PropTypes.objectOf(React.PropTypes.func).isRequired,
        projectList: ImmutablePropTypes.list.isRequired
    }

    constructor(props) {
        super(props)
        //this.state = { projectColorMap: undefined }
    }

    componentWillMount() {
        this.setState({ projectColorMap: getProjectColorMap(this.props.projectList) })
    }

    handleAccept(e) {
        e.preventDefault()
        this.props.backendActions.closeModal()
    }

    handleReject(e) {
        e.preventDefault()
        this.props.backendActions.closeModal()
    }

    render() {
        const { task } = this.props

        if ( !task ) {
            return <div className="w3-modal" style={{ display: 'none' }}/>
        }

        //const projectColor = this.state.projectColorMap.get(task.get('projectID'))

        return (
            <div className="w3-modal w3-animate-opacity" style={
                {
                    display: 'block'
                }
            }>
                <div className="modal w3-modal-content w3-round-large w3-card-4 w3-animate-top">
                    <header
                        className="modal-header w3-padding w3-large w3-theme"
                        //style={{backgroundColor: projectColor.get('dark')}}
                    >
                        {'Begin with task: ' + task.get('text')}
                    </header>
                    <div
                        className="modal-middle w3-theme-l5"
                        //style={{backgroundColor: projectColor.get('normal')}}
                    >
                        <div className="modal-middle-left w3-padding">
                            <Task
                                projectColorMap={this.state.projectColorMap}
                                task={task.toJSON()}
                            />
                        </div>
                        <div className="modal-middle-right w3-padding">
                            <p>{task.get('text')}</p>
                            <p>End: {moment(task.get('start')).add(task.get('duration'), 'minutes').fromNow()}</p>
                            {/* TODO: fix when description is added */ !task.get('description') &&
                            <p>{task.get('description')} ...description here.</p>}
                        </div>

                    </div>
                    <footer
                        className="modal-footer w3-theme-l3"
                        //style={{backgroundColor: projectColor.get('light')}}
                    >
                        <LabeledIconButton
                            iconName="play_circle_outline"//"slideshow"
                            label="Begin"
                            dangerLevel={DANGER_LEVELS.SAFE.hover}
                            onClick={::this.handleAccept}
                        />
                        <LabeledIconButton
                            iconName="snooze"
                            label="Later"
                            dangerLevel={DANGER_LEVELS.WARN.hover}
                            onClick={::this.handleReject}
                        />
                        <LabeledIconButton
                            iconName="timer_off" //"event_busy" //"cancel" //"remove_circle_outline" //"skip_next"
                            label="Skip"
                            dangerLevel={DANGER_LEVELS.DANGER.hover}
                            onClick={::this.handleReject}
                        />
                    </footer>
                </div>
            </div>
        )

    }
}