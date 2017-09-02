import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import MomentPropTypes from 'react-moment-proptypes'
import IconButton from '../misc/IconButton'

export default class TimetableControls extends React.Component {

    static propTypes = {
        timetableActions: PropTypes.object.isRequired,
        momentDate: MomentPropTypes.momentObj.isRequired,
        editMode: PropTypes.bool.isRequired,
        timetableTitle: PropTypes.string
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


    render() {
        const { timetableActions, momentDate, editMode, timetableTitle } = this.props

        const currentWeek = momentDate.week()

        return (!editMode ? <div className={'tt-controls w3-display-container'}>
                              <div className="w3-display-left">
                                  <IconButton
                                      iconName={'restore'}
                                      disabled={(currentWeek === moment().week()) ? 'Already at current week' : false}
                                      tooltip="Return to today's week"
                                      onClick={::this.setCurrentWeekToToday}
                                  />
                              </div>
                              <div className="w3-display-middle">
                                  <IconButton
                                      iconName={'navigate_before'}
                                      tooltip="Show last weeks timetable"
                                      onClick={::this.goToLastWeek}
                                  />
                                  <div className="tt-controls-text">{'Week ' + currentWeek}</div>
                                  <IconButton
                                      iconName={'navigate_next'}
                                      tooltip="Show next weeks timetable"
                                      onClick={::this.goToNextWeek}
                                  />
                              </div>
                              <div className="w3-display-right">
                                  <div className="tt-controls-text w3-text-theme">{timetableTitle}</div>
                                  <IconButton
                                      iconName={'edit'}
                                      tooltip="Edit or change timetable"
                                      onClick={timetableActions.enterEditMode}
                                  />
                              </div>
                          </div>
            :
                <div className={'tt-controls tt-controls-edit-mode w3-display-container'}>
                    <h3 className="w3-display-middle tt-controls-edit-mode-text">Edit Timetable</h3>
                </div>)
    }
}