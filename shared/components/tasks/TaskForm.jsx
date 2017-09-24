import Immutable from 'immutable'
import moment from 'moment'
import PropTypes from 'prop-types'
import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { DEFAULT_TASK } from '../../utils/defaultValues'
import LabeledIconButton from '../misc/LabeledIconButton'
import DurationPicker from './DurationPicker'


export default class TaskForm extends React.Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        task: ImmutablePropTypes.map,
        textLabel: PropTypes.string,
        editing: PropTypes.bool,
        projectList: ImmutablePropTypes.list.isRequired
    }

    constructor(props) {
        super(props)

        this.state = {
            task: this.props.projectList.size !== 0 ?
                  Immutable.Map(DEFAULT_TASK).set('projectID', this.props.projectList.first().get('id')) :
                  Immutable.Map(DEFAULT_TASK),
            projectIndex: this.props.projectList.size !== 0 ? 0 : false
        }
    }

    handleSubmit(e) {
        e.preventDefault()
        this.props.onSubmit(this.state.task)
        this.setState({ task: Immutable.Map(DEFAULT_TASK) })
    }

    handleTaskChange(value, field) {
        this.setState(({ task }) => ({ task: task.set(field, value) }))
    }


    handleSelectProject(e) {
        this.setState({ projectIndex: +e.target.value })
        this.handleTaskChange(this.props.projectList.getIn([+e.target.value, 'id']), 'projectID')
    }


    render() {
        const { editing, textLabel, projectList } = this.props
        const task = this.state.task
        let saveText = (editing) ? 'done' : 'add_box'

        const disabled = (projectList.size === 0) ? 'A project needs to be created first.' : false

        let projectSelectOptions = []
        if ( !disabled ) {
            projectList.forEach((project, index) => {
                    projectSelectOptions.push(
                        <option
                            key={'proj_' + index}
                            value={index}
                        >
                            {project.get('title')}
                        </option>
                    )
                }
            )
        } else {
            projectSelectOptions.push(
                <option
                    key={'noProject'}
                    value={'noProject'}
                    selected
                    disabled
                >
                    {'Create a project first'}
                </option>
            )
        }

        let milestoneSelectOptions = false
        if ( this.state.projectIndex !== false && projectList.hasIn([this.state.projectIndex, 'milestones']) ) {
            milestoneSelectOptions = [<option
                                          key={'_no-milestone'}
                                          value={false}
                                      >
                                          {'( None )'}
                                      </option>]
            projectList.getIn([this.state.projectIndex, 'milestones'])
                       .sortBy(milestone => milestone.get('deadline'))
                       .forEach((milestone, index) => {
                               if ( moment(milestone.get('deadline')).isAfter() ) {
                                   milestoneSelectOptions.push(
                                       <option
                                           key={'mile_' + index}
                                           value={milestone.get('id')}
                                           title={moment(milestone.get('deadline')).format('L') + ' - ' + moment(milestone.get('deadline')).fromNow()}
                                       >
                                           {milestone.get('title')}
                                       </option>
                                   )
                               }
                           }
                       )
        }


        return (
            <form
                onSubmit={::this.handleSubmit}
                className="task-form"
            >
                <div className="task-form-group">
                    <label htmlFor="task-title-input" className="task-form-label"> Name </label>
                    <input
                        className="w3-input w3-border w3-border-theme w3-round w3-margin-bottom"
                        id="task-title-input"
                        type="text"
                        placeholder={textLabel}
                        value={task.get('title')}
                        onChange={(e) => this.handleTaskChange(e.target.value, 'title')}
                        disabled={disabled}
                        required
                    />

                    <label htmlFor="task-project-select" className="task-form-label"> Project </label>
                    <select
                        id="task-project-select"
                        onChange={::this.handleSelectProject}
                        className={'w3-select w3-right w3-border w3-border-theme w3-round w3-margin-bottom' + (disabled ?
                                                                                                               ' w3-text-gray' :
                                                                                                               '')}
                        name="option"
                        style={{
                            padding: '8px 4px'
                        }}
                        disabled={disabled}
                    >
                        {projectSelectOptions}
                    </select>

                    {(milestoneSelectOptions) &&
                    <label htmlFor="task-milestone-select" className="task-form-label"> Milestone </label>
                    }
                    {(milestoneSelectOptions) &&
                    <select
                        id="task-milestone-select"
                        onChange={(e) => this.handleTaskChange(e.target.value, 'milestone')}
                        className={'w3-select w3-right w3-border w3-border-theme w3-round w3-margin-bottom' + (disabled ?
                                                                                                               ' w3-text-gray' :
                                                                                                               '')}
                        name="option"
                        style={{
                            padding: '8px 4px'
                        }}
                        disabled={(disabled || (milestoneSelectOptions === []))}
                    >
                        {milestoneSelectOptions}
                    </select>
                    }
                </div>
                <label>
                    Duration (in hours)
                    <DurationPicker
                        step={30}
                        min={30}
                        max={300}
                        group={2}
                        defaultValue={120}
                        onChange={(value) => this.handleTaskChange(value, 'duration')}
                        mapper={(value) => moment.duration(value, 'minutes').asHours()}
                    />
                </label>
                <LabeledIconButton
                    label={'Add New Task'}
                    iconName={saveText}
                    disabled={disabled}
                    style={{ marginLeft: 'auto' }}
                />

            </form>
        )
    }
}