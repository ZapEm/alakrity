import * as React from 'react'
import MomentPropTypes from 'react-moment-proptypes'
import IconButton from '../misc/IconButton'
import moment from 'moment'

export default class TimetableControls extends React.Component {

    static propTypes = {
        timetableActions: React.PropTypes.object.isRequired,
        momentDate: MomentPropTypes.momentObj.isRequired
    }

    setCurrentWeekToToday(){
        this.props.timetableActions.setCurrentWeek(moment())
    }

    goToLastWeek(){
        this.props.timetableActions.setCurrentWeek(this.props.momentDate.clone().add(-1, 'week'))
    }

    goToNextWeek(){
        this.props.timetableActions.setCurrentWeek(this.props.momentDate.clone().add(1, 'week'))
    }


    render() {
        const { timetableActions, momentDate } = this.props

        const currentWeek = momentDate.week()

        return <div className="tt-controls w3-display-container">
            <div className="w3-display-left">
                <IconButton
                    iconName={'restore'}
                    disabled={(currentWeek === moment().week()) ? 'Already at current week.' : false}
                    tooltip="Return to today's week."
                    onClick={::this.setCurrentWeekToToday}
                />
            </div>

            <div className="w3-display-middle">
                <IconButton
                    iconName={'navigate_before'}
                    tooltip="Show last weeks timetable."
                    onClick={::this.goToLastWeek}
                />
                <div className="tt-controls-text w3-label">{'Week ' + currentWeek}</div>
                <IconButton
                    iconName={'navigate_next'}
                    tooltip="Show next weeks timetable."
                    onClick={::this.goToNextWeek}
                />
            </div>
            <div className="w3-display-right">
                <IconButton
                    iconName={'edit'}
                    onClick={timetableActions.enterEditMode}
                />
            </div>
        </div>
    }
}