import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import momentPropTypes from 'react-moment-proptypes'


export default class Timeslot extends React.Component {

    static propTypes = {
        dateTime: momentPropTypes.momentObj.isRequired,
        position: React.PropTypes.shape({
            day: React.PropTypes.number,
            slot: React.PropTypes.number,
            steps: React.PropTypes.number
        }),
        editMode: React.PropTypes.bool.isRequired,
        workPeriods: ImmutablePropTypes.map.isRequired,
        projectColorMap: ImmutablePropTypes.map.isRequired,
        currentProjectID: React.PropTypes.string,
        changeSlotProjectID: React.PropTypes.func.isRequired
    }

    static defaultProps = {
        currentProjectID: ''
    }


    handleClick(e) {
        if ( this.props.editMode && e.target.getAttribute('value') !== this.props.currentProjectID ) {
            this.props.changeSlotProjectID({
                    day: this.props.position.day,
                    slot: this.props.position.slot,
                    projectID: this.props.currentProjectID
                }
            )
        }
    }

    render() {
        const { dateTime, position, workPeriods, projectColorMap } = this.props

        const projectID = workPeriods.getIn(['selection', position.day, position.slot])

        return <div
            className="tt-timeslot"
            value={projectID}
            style={projectID ?
                {
                    backgroundColor: projectColorMap.getIn([projectID, 'light']),
                    height: 3 / position.steps + 'rem'
                } :
                {
                    height: 3 / position.steps + 'rem'
                }

            }
            dateTime={dateTime.toISOString()}
            onClick={::this.handleClick}
        >
        </div>
    }
}