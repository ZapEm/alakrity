import Immutable from 'immutable'
import moment from 'moment'
import PropTypes from 'prop-types'
import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { DEFAULT_TASK, TASK_MAX_DURATION } from '../../utils/defaultValues'
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
        if ( this.state.task.get('repeating') ) {
            this.props.onSubmit(this.state.task.set('status', {}).delete('milestone'))
        } else {
            this.props.onSubmit(this.state.task)
        }
        // reset for next task
        this.setState(({ task }) => ({
            task: task.merge({
                title: '',
                description: ''
            })
        }))
    }

    handleTaskChange(value, field) {
        this.setState(({ task }) => ({ task: task.set(field, value) }))
    }


    handleSelectProject(e) {
        this.setState({ projectIndex: +e.target.value })
        this.handleTaskChange(this.props.projectList.getIn([+e.target.value, 'id']), 'projectID')
    }

    handleKeyDown(e) {
        // ArrowUp
        if ( e.keyCode === 40 ) {
            e.preventDefault()
            this.setState(({ task }) => {
                if ( task.get('duration') + 30 <= TASK_MAX_DURATION ) {
                    return {
                        task: task.set('duration', task.get('duration') + 30)
                    }
                }
            })
        }
        // ArrowDown
        if ( e.keyCode === 38 ) {
            e.preventDefault()
            this.setState(({ task }) => {
                if ( task.get('duration') - 30 >= 30 ) {
                    return {
                        task: task.set('duration', task.get('duration') - 30)
                    }
                }
            })
        }
    }


    render() {
        const { textLabel, projectList } = this.props
        const task = this.state.task

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
                <h3 className="w3-center w3-text-theme">Create a new task</h3>
                <div className="task-form-group">
                    <label htmlFor="task-title-input" className="task-form-label"> Name
                        <input
                            className="task-form-input w3-border w3-border-theme w3-round"
                            id="task-title-input"
                            type="text"
                            placeholder={textLabel}
                            value={task.get('title')}
                            onChange={(e) => this.handleTaskChange(e.target.value, 'title')}
                            onKeyDownCapture={::this.handleKeyDown}
                            disabled={disabled}
                            autoFocus
                            required
                        />
                    </label>

                    <label htmlFor="task-repeating-input" className="task-form-label right"
                           title={'Should the task be repeated every week?'}> Repeating
                        <input
                            className="task-form-input checkbox w3-border w3-border-theme w3-round"
                            id="task-repeating-input"
                            type="checkbox"
                            checked={task.get('repeating')}
                            onChange={() => this.handleTaskChange(!task.get('repeating'), 'repeating')}
                            disabled={disabled}
                        />
                    </label>

                    <label htmlFor="task-project-select" className="task-form-label"> Project
                        <select
                            id="task-project-select"
                            onChange={::this.handleSelectProject}
                            className={'task-form-input w3-border w3-border-theme w3-round'
                            + (disabled ? ' w3-text-gray' : '')}
                            name="option"
                            disabled={disabled}
                            defaultValue={!disabled ? 0 : 'noProject'}
                        >
                            {projectSelectOptions}
                        </select>
                    </label>

                    <label htmlFor="task-special-input" className="task-form-label right"
                           title={'Highlight the task. Purely optical as of now.'}> Special
                        <input
                            className="task-form-input checkbox w3-border w3-border-theme w3-round"
                            id="task-special-input"
                            type="checkbox"
                            checked={task.get('special')}
                            onChange={() => this.handleTaskChange(!task.get('special'), 'special')}
                            disabled={disabled}
                        />
                    </label>

                    {(milestoneSelectOptions) &&
                    <label htmlFor="task-milestone-select" className="task-form-label">{'Milestone'}

                        <select
                            id="task-milestone-select"
                            onChange={(e) => this.handleTaskChange(e.target.value, 'milestone')}
                            className={'task-form-input w3-border w3-border-theme w3-round'
                            + (disabled ? ' w3-text-gray' : '')}
                            name="option"
                            disabled={(disabled || (milestoneSelectOptions === []) || this.state.task.get('repeating'))}
                        >
                            {milestoneSelectOptions}
                        </select></label>
                    }
                </div>
                <label>
                    Duration (in hours)
                    <DurationPicker
                        value={task.get('duration')}
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
                    label={'Add Task'}
                    iconName={'add_circle'}
                    disabled={disabled}
                    style={{ marginLeft: 'auto' }}
                />

            </form>
        )
    }
}