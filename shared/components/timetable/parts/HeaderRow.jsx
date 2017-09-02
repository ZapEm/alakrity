import React from 'react'
import momentPropTypes from 'react-moment-proptypes'


export default class HeaderRow extends React.Component {

    static propTypes = {
        momentDate: momentPropTypes.momentObj.isRequired
    }

    render() {
        const { momentDate } = this.props
        let dayDate = momentDate.clone().isoWeekday(1) // calculate this weeks mondays date from any day of the week.
        let headers = []
        for ( let i = 0; i < 7; i++ ) {
            headers.push(<div key={i} className="tt-header-day">
                <div className="tt-header-day-name">{dayDate.format('dddd')}</div>
                <div className="tt-header-day-date">{dayDate.format('MM[/]DD')}</div>
            </div>)
            dayDate.add(1, 'days')
        }

        return <div className="tt-header-row">
            <div className="tt-header-corner"/>
            {headers}
        </div>
    }
}