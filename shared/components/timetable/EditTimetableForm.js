import moment from 'moment'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import IconButton from '../misc/IconButton'
import ProjectPeriodPicker from './parts/ProjectPeriodPicker'

export default class EditTimetableForm extends React.Component {
    static propTypes = {
        onSave: React.PropTypes.func.isRequired,
        onRemove: React.PropTypes.func.isRequired,
        timetableActions: React.PropTypes.object.isRequired,
        timetables: ImmutablePropTypes.map.isRequired,
        projectList: ImmutablePropTypes.list.isRequired,
        textLabel: React.PropTypes.string
    }

    constructor(props) {
        super(props)
        this.state = {}
    }

    componentWillMount() {
        this.setState(
            {
                timetable: this.props.timetables.get('timetable').toJSON()
            }
        )
    }

    componentWillReceiveProps(nextProps) {
        if ( this.props.timetables.get('timetable') !== nextProps.timetables.get('timetable') ) {
            this.setState({ timetable: nextProps.timetables.get('timetable').toJSON() })
        }
    }

    handleSubmit(e) {
        e.preventDefault()
        this.props.onSave(this.props.timetables.get('timetable').merge(this.state.timetable))
    }

    handleTitleChange(e) {
        this.setState({ timetable: { title: e.target.value } })
    }

    handleSelectTimetable(e) {
        console.log('## Loading Timetable (ID):', e.target.value)
        this.props.timetableActions.loadTimetable(e.target.value)
    }

    createNewTimetable(e) {
        e.preventDefault()
        const tableNr = this.props.timetables.get('timetableList').size + 1 | '0'
        const timetable = {
            title: 'New Timetable' + (tableNr > 0 ? ` (${tableNr})` : ''),
            start: 7,
            end: 22,
            steps: 2,
            projectPeriods: {
                selection: [[], [], [], [], [], [], []]
            },
            created: moment()
        }

        console.log('No timetable found. Creating new timetable!')
        this.props.timetableActions.createTimetable(timetable)
    }


    handleStartChange(e) {
        this.setState({ start: +e.target.value })
        this.props.timetableActions.changeTimetable(this.props.timetables.get('timetable').merge({ start: +e.target.value }))
    }

    handleEndChange(e) {
        this.setState({ end: +e.target.value })
        this.props.timetableActions.changeTimetable(this.props.timetables.get('timetable').merge({ end: +e.target.value }))
    }


    render() {
        const { textLabel, timetables, timetableActions, projectList } = this.props
        const timetable = timetables.get('timetable')
        let saveText = 'done'


        const sortedTimetableList = timetables.get('timetableList').sort((a, b) => a.get('title').localeCompare(b.get('title')), { numeric: true })
        let dropdownOptions = []
        let k = 0
        for ( let tt of sortedTimetableList ) {
            dropdownOptions.push(<option key={k++} value={tt.get('id')}>{tt.get('title')}</option>)
        }

        return (
            <div
                className="w3-display-container"
            >
                <form
                    className="task-form w3-padding w3-card-4 w3-round-large w3-border w3-border-theme w3-leftbar w3-rightbar"
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
                        <label className="tt-form-label" htmlFor="tt_title">Title</label>
                        <input
                            className='tt-form-input tt-title-field w3-input'
                            id="tt_title"
                            type="text"
                            placeholder={textLabel}
                            value={this.state.timetable.title}
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

                    <div className="w3-border-bottom w3-margin-top w3-margin-bottom w3-border-theme"/>

                    <label title="Pick a project and 'paint in' project periods">Projects</label>
                    <ProjectPeriodPicker
                        setCurrentProject={timetableActions.setCurrentProject}
                        projectList={projectList}
                        currentProjectID={timetables.get('currentProjectID')}
                    />

                    <IconButton
                        iconName={saveText}
                    />
                </form>
            </div>
        )
    }

}