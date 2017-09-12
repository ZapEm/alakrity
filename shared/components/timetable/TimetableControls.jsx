import classNames from 'classnames'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import MomentPropTypes from 'react-moment-proptypes'
import IconButton from '../misc/IconButton'
import LabeledIconButton from '../misc/LabeledIconButton'

export default class TimetableControls extends React.Component {

    static propTypes = {
        timetableActions: PropTypes.object.isRequired,
        momentDate: MomentPropTypes.momentObj.isRequired,
        editMode: PropTypes.bool.isRequired,
        timetableTitle: PropTypes.string
    }

    constructor() {
        super()
        this.state = {
            initial: true
        }
    }

    static handleSubmit(e) {
        e.preventDefault()
        // eslint-disable-next-line
        ReactDOM.findDOMNode(document.getElementById('tt-edit-form')).dispatchEvent(new Event('submit'))
    }

    setCurrentWeekToToday() {
        this.props.timetableActions.setCurrentWeek(moment())
    }

    goToLastWeek() {
        this.props.timetableActions.setCurrentWeek(this.props.momentDate.clone().add(-1, 'week'))
    }

    goToNextWeek() {
        this.props.timetableActions.setCurrentWeek(this.props.momentDate.clone().add(1, 'week'))
    }

    handleEditClick(e) {
        e.preventDefault()
        this.props.timetableActions.enterEditMode()
        this.setState({ initial: false })
    }

    render() {
        const { momentDate, editMode, timetableTitle } = this.props
        const { initial } = this.state

        const now = moment()

        return (<div className='tt-controls-wrapper'>
                <div className={classNames('tt-controls', {
                    'tt-controls-visible': !initial && !editMode,
                    'tt-controls-invisible': !initial && editMode,
                    'tt-controls-hide-initial': initial && editMode
                })}>
                    <div className="tt-controls-left">
                        <div className="w3-text-theme">{timetableTitle}</div>

                    </div>
                    <div className="tt-controls-middle-l">
                        {(momentDate.isAfter(now, 'week')) &&
                        <IconButton
                            iconName={'first_page'}
                            tooltip="Return to today's week"
                            onClick={::this.setCurrentWeekToToday}
                        />
                        }
                    </div>
                    <div className="tt-controls-middle">

                        <IconButton
                            iconName={'navigate_before'}
                            tooltip="Show last weeks timetable"
                            onClick={::this.goToLastWeek}
                        />
                        <div className="tt-controls-label">{'Week ' + momentDate.week()}</div>
                        <IconButton
                            iconName={'navigate_next'}
                            tooltip="Show next weeks timetable"
                            onClick={::this.goToNextWeek}
                        />
                    </div>
                    <div className="tt-controls-middle-r">
                        {(momentDate.isBefore(now, 'week')) &&
                        <IconButton
                            iconName={'last_page'}
                            tooltip="Return to today's week"
                            onClick={::this.setCurrentWeekToToday}
                        />
                        }
                    </div>
                    <div className="tt-controls-right">
                        <LabeledIconButton
                            iconName={'edit'}
                            tooltip="Edit or change timetable"
                            onClick={::this.handleEditClick}
                            label="Basic Schedule"
                        />
                    </div>
                </div>
                <div className={classNames('tt-controls', {
                    'tt-controls-visible': !initial && editMode,
                    'tt-controls-invisible': !initial && !editMode,
                    'tt-controls-hide-initial': initial && !editMode
                })}>
                    <div className="tt-controls-edit-mode">
                        <h3 className="tt-controls-edit-mode-text">Basic Schedule</h3>
                        <div className="tt-controls-edit-mode-done">
                            <LabeledIconButton
                                iconName={'done'}
                                tooltip="Back to"
                                onClick={::TimetableControls.handleSubmit}
                                label="Done"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}