import moment from 'moment'
import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'


export default class TimeColumn extends React.Component {

    static propTypes = {
        timetable: ImmutablePropTypes.map.isRequired
    }


    render() {
        const { timetable } = this.props
        let times = []
        const endMoment = moment({ hour: timetable.get('end') })
        for ( let dt = moment({ hour: timetable.get('start') }); dt.isBefore(endMoment); dt.add(1, 'h') ) {
            times.push(<div key={dt.hour()} className="tt-timecolumn-time"> { dt.format('LT') } </div>)
        }
        return <div className="tt-timecolumn">
            { times }
        </div>
    }
}