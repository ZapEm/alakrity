import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import momentPropTypes from 'react-moment-proptypes'
import { SPECIAL_PROJECTS } from '../../../utils/constants'


export default class Timeslot extends React.Component {

    static propTypes = {
        dateTime: momentPropTypes.momentObj.isRequired,
        position: PropTypes.shape({
            day: PropTypes.number,
            slot: PropTypes.number,
            steps: PropTypes.number
        }),
        editMode: PropTypes.bool.isRequired,
        workPeriods: ImmutablePropTypes.map.isRequired,
        projectColorMap: ImmutablePropTypes.map.isRequired,
        currentProjectID: PropTypes.string,
        changeSlotProjectID: PropTypes.func.isRequired
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

        const timeslotStyle = (projectID in SPECIAL_PROJECTS) ?
            {
                backgroundColor: SPECIAL_PROJECTS[projectID].light,
                ...SPECIAL_PROJECTS[projectID].backgroundPattern && {
                    backgroundImage: SPECIAL_PROJECTS[projectID].backgroundPattern,
                    backgroundRepeat: 'space',
                    backgroundPosition: 'center',
                    backgroundSize: '36px, 18px'
                },
                height: 3 / position.steps + 'rem'
            }
            :
            {
                ...projectID && { backgroundColor: projectColorMap.getIn([projectID, 'light']) },
                height: 3 / position.steps + 'rem'
            }

        return <div
            className="tt-timeslot"
            value={projectID}
            style={timeslotStyle}
            dateTime={dateTime.toISOString()}
            onClick={::this.handleClick}
        >
        </div>
    }
}