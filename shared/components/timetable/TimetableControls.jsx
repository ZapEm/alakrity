import * as React from 'react'
import MomentPropTypes from 'react-moment-proptypes'
import IconButton from '../misc/IconButton'

export default class TimetableControls extends React.Component {

    static propTypes = {
        timetableActions: React.PropTypes.object.isRequired,
        momentDate: MomentPropTypes.momentObj.isRequired
    }

    render() {
        const { timetableActions, momentDate } = this.props

        const currentWeek = momentDate.week()

        return <div className="tt-controls w3-display-container">
            <div className="w3-display-left">
                <IconButton
                    iconName={'restore'}
                    disabled="Already at current week."
                    tooltip="Return to today's week."
                    //onClick={timetableActions.enterEditMode}
                />
            </div>

            <div className="w3-display-middle">
                <IconButton
                    iconName={'navigate_before'}
                    tooltip="Show last weeks timetable."
                />
                <div className="tt-controls-text w3-label">{'Week ' + currentWeek}</div>
                <IconButton
                    iconName={'navigate_next'}
                    tooltip="Show next weeks timetable."
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