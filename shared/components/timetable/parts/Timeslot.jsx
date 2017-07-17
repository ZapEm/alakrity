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
        newProjectNr: React.PropTypes.number,
        changeSlotProjectNr: React.PropTypes.func.isRequired
    }

    static defaultProps = {
        newProjectNr: 0
    }


    handleClick(e) {
        if ( this.props.editMode && Number(e.target.getAttribute('value')) !== this.props.newProjectNr ) {
            this.props.changeSlotProjectNr({
                    day: this.props.position.day,
                    slot: this.props.position.slot,
                    projectNr: this.props.newProjectNr
                }
            )
        }
    }

    render() {
        const { dateTime, position, workPeriods } = this.props
        const colors = workPeriods.get('colors')
        const projectNr = workPeriods.getIn(['selection', position.day, position.slot])

        return <div
            className="tt-timeslot"
            value={projectNr}
            style={projectNr ?
                {
                    backgroundColor: colors.get(projectNr),
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