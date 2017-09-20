import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { DEFAULT_TIMETABLE, thaw } from '../../utils/defaultValues'
import { TaskListFilters } from '../../utils/enums'
import { getTaskListFilter } from '../../utils/helpers'
import newId from '../../utils/newId'
import IconButton from '../misc/IconButton'
import LabeledIconButton from '../misc/LabeledIconButton'
import TasksList from '../tasks/TasksList'
import ProjectPeriodPicker from './parts/ProjectPeriodPicker'

export default class TimetableEditSidebar extends React.Component {
    static propTypes = {
        onSave: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        timetableActions: PropTypes.object.isRequired,
        timetables: ImmutablePropTypes.map.isRequired,
        projectList: ImmutablePropTypes.list.isRequired,
        textLabel: PropTypes.string,
        projectColorMap: ImmutablePropTypes.map.isRequired,
        taskList: ImmutablePropTypes.list,
        taskActions: PropTypes.objectOf(PropTypes.func).isRequired,
        locale: PropTypes.string.isRequired
    }

    defaultProps = {
        taskList: Immutable.List()
    }

    constructor(props) {
        super(props)
        const currentProjectID = this.props.timetables.get('currentProjectID')
        this.state = {
            project: this.props.projectList.find((pro) => pro.get('id') === currentProjectID, null, false),
            _update: true
        }
    }

    componentWillMount() {
        this.setState(
            {
                timetable: this.props.timetables.get('timetable'),
                filterRadioSelection: TaskListFilters.UNASSIGNED
            }
        )
    }


    componentWillUnmount() {
        this.setState({ _update: true })
    }

    componentWillReceiveProps(nextProps) {
        if ( this.props.timetables.get('timetable') !== nextProps.timetables.get('timetable') ) {
            const currentProjectID = this.props.timetables.get('currentProjectID')
            this.setState({
                timetable: nextProps.timetables.get('timetable'),
                project: this.props.projectList.find((pro) => pro.get('id') === currentProjectID, null, false)
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState._update || this.props.timetables !== nextProps.timetables
    }

    handleSubmit(e) {
        e.preventDefault()
        this.setState({ _update: false })
        this.props.onSave(this.props.timetables.get('timetable').merge(this.state.timetable))
    }

    handleQuickAddTask(e) {
        e.preventDefault()
        //const project = this.props.projectList.find((pro) => pro.get('id') === this.props.timetables.get('currentProjectID'), null, false)
        if ( this.state.project ) {
            this.props.taskActions.quickAddTask(this.state.project, 'repeating')
        } else {
            alert('Special work periods (Buffer, Break, ...) can not have tasks.')
        }
    }

    handleTitleChange(e) {
        e.preventDefault()
        this.setState({ timetable: this.state.timetable.merge({ title: e.target.value }) })
    }

    handleSelectTimetable(e) {
        e.preventDefault()
        this.props.timetableActions.loadTimetable(e.target.value)
    }

    createNewTimetable(e) {
        e.preventDefault()

        if ( typeof window !== 'undefined' ) {
            this.props.timetableActions.createTimetable(thaw(DEFAULT_TIMETABLE))
        }
    }


    handleStartChange(e) {
        e.preventDefault()
        this.setState({ start: +e.target.value })
        this.props.timetableActions.changeTimetable(this.props.timetables.get('timetable').merge({ start: +e.target.value }))
    }

    handleEndChange(e) {
        e.preventDefault()
        this.setState({ end: +e.target.value })
        this.props.timetableActions.changeTimetable(this.props.timetables.get('timetable').merge({ end: +e.target.value }))
    }

    handleFilterChange(e) {
        this.setState({ filterRadioSelection: e.target.value })
    }

    handleSelectProjectPeriod(projectID) {
        this.setState({
            project: this.props.projectList.find((pro) => pro.get('id') === projectID, null, false),
            _update: true
        })
        this.props.timetableActions.setCurrentProject(projectID)
    }


    render() {
        const { textLabel, timetables, projectList, projectColorMap, taskActions, taskList, locale } = this.props
        const timetable = timetables.get('timetable')

        const sortedTimetableList = timetables.get('timetableList').sort((a, b) => a.get('title').localeCompare(b.get('title')), { numeric: true })
        let dropdownOptions = []
        let k = 0
        for ( let tt of sortedTimetableList ) {
            dropdownOptions.push(<option key={k++} value={tt.get('id')}>{tt.get('title')}</option>)
        }

        const titleID = newId('tt_title_')

        return (
            <div
                className="flex-column tt-edit-sidebar w3-padding w3-card-4 w3-round-large w3-border w3-border-theme"
            >
                <form
                    id="tt-edit-form"
                    className="tt-form flex-item-rigid"
                    onSubmit={::this.handleSubmit}
                >
                    <select
                        className="w3-select w3-border w3-round"
                        style={
                            {
                                display: 'inline-block',
                                width: '196px'
                            }
                        }
                        name="option"
                        defaultValue={timetables.get('timetable').get('id')}
                        onChange={::this.handleSelectTimetable}
                    >
                        {dropdownOptions}
                    </select>
                    <IconButton
                        style={
                            {
                                float: 'right',
                                margin: '6px 0 6px 0'
                            }
                        }
                        iconName="note_add"
                        tooltip="Create a new timetable"
                        onClick={::this.createNewTimetable}
                    />

                    <div className="w3-border-bottom w3-margin-top w3-margin-bottom w3-border-theme"/>

                    <div className="tt-form-line">
                        <label className="tt-form-label" htmlFor={titleID}>Title</label>
                        <input
                            className='tt-form-input tt-title-field w3-input'
                            id={titleID}
                            type="text"
                            placeholder={textLabel}
                            value={this.state.timetable.get('title')}
                            onChange={::this.handleTitleChange}
                        />
                    </div>
                    <div className="tt-form-line">
                        <label
                            className="tt-form-label"
                            htmlFor="tt_start"
                            title="First hour of the timetable (in 24h format)"
                        >Start</label>
                        <input
                            className="tt-form-input w3-input"
                            id="tt_start"
                            title="First hour of the timetable (in 24h format)"
                            style={
                                {
                                    textAlign: 'right',
                                    paddingRight: '0'
                                }}
                            type="number"
                            step={1}
                            min={0}
                            max={timetable.get('end')}
                            value={timetable.get('start')}
                            onChange={::this.handleStartChange}
                        />
                        <span className="tt-form-time-sign">:00</span>

                        <div className="tt-form-spacer"/>

                        <label
                            className="tt-form-label"
                            htmlFor="tt_end"
                            title="Last hour of the timetable (in 24h format)"
                        >End</label>
                        <input
                            className="tt-form-input w3-input"
                            id="tt_end"
                            title="Last hour of the timetable (in 24h format)"
                            style={
                                {
                                    textAlign: 'right',
                                    paddingRight: '0'
                                }}
                            type="number"
                            step={1}
                            min={timetable.get('start')}
                            max={24}
                            value={timetable.get('end')}
                            onChange={::this.handleEndChange}
                        />
                        <span className="tt-form-time-sign">:00</span>
                    </div>
                </form>
                {/*<div className="flex-item-rigid w3-border-bottom w3-margin-top w3-margin-bottom w3-border-theme"/>*/}
                {/*<div className="flex-item-flexible">*/}
                <ProjectPeriodPicker
                    setCurrentProject={::this.handleSelectProjectPeriod}
                    projectList={projectList}
                    currentProjectID={timetables.get('currentProjectID')}
                />
                {/*</div>*/}

                {/*<div className="flex-item-rigid w3-border-bottom w3-margin-top w3-margin-bottom w3-border-theme"/>*/}

                <div className="flex-item-rigid">
                    <label>Repeating Tasks</label>
                    <div className="tt-form-line">
                        <LabeledIconButton
                            disabled={!this.state.project ? 'Special work periods (Clear, Buffer, Break, ...) can not have tasks.' : false}
                            iconName="add_circle_outline"
                            label="Quick Add Repeating Task"
                            onClick={::this.handleQuickAddTask}
                        />
                    </div>
                    <form
                        className="w3-center"
                        onChange={::this.handleFilterChange}
                    >
                        <label className="task-list-filter-label">
                            <input
                                className="task-list-filter-radio"
                                type="radio"
                                name="tasklist_filter"
                                value={TaskListFilters.UNASSIGNED}
                                checked={this.state.filterRadioSelection === TaskListFilters.UNASSIGNED}
                                readOnly
                            />
                            {'Unassigned'}
                        </label>
                        <label className="task-list-filter-label">
                            <input
                                className="task-list-filter-radio"
                                type="radio"
                                name="tasklist_filter"
                                value={TaskListFilters.ALL}
                                checked={this.state.filterRadioSelection === TaskListFilters.ALL}
                                readOnly
                            />
                            {'All'}
                        </label>
                    </form>
                </div>
                <TasksList
                    addClassNames={'flex-item-shrinkable'}
                    taskList={taskList.filter(getTaskListFilter(this.state.filterRadioSelection))}
                    taskActions={taskActions}
                    projectColorMap={projectColorMap}
                    locale={locale}
                    sidebar={true}
                    draggable={true}
                    editMode={true}
                    columns={2}
                />

            </div>
        )
    }
}