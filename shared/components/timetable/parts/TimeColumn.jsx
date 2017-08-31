import moment from 'moment'
import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'


export default class TimeColumn extends React.Component {

    static propTypes = {
        timetable: ImmutablePropTypes.map.isRequired,
        time: React.PropTypes.instanceOf(Date)
    }

    render() {
        const { timetable, time } = this.props
        const endMoment = moment({ hour: timetable.get('end') })

        let percent = 0
        let height = 0
        if (time) {
            const startValue = moment({ hour: timetable.get('start') }).valueOf()
            const endValue = endMoment.valueOf()
            const currentValue = moment({ hour: time.getHours(), minute: time.getMinutes() }).valueOf()
            percent = ((currentValue - startValue) / (endValue - startValue)) * 100
            height = Math.floor((percent / 100) * (((endValue - startValue) / 3600000)) * 45)
        }

        function getPercent(difference = 0){
            const result = (percent + difference)
            return ( result >= 0 ) ? result.toString() + '%' : '0%'
        }

        function getPixel(difference = 0){
            const result = (height + difference + 2)
            return ( result >= 0 ) ? result.toString() + 'px' : '0px'
        }

        // const timerStyle2 = {
        //     backgroundImage: 'linear-gradient(180deg, ' +
        //     'rgba(255, 255, 255, 0.95), ' +
        //     'rgba(255, 255, 255, 0.8)' + getPercent(-10) + ', ' +
        //     'rgba(255, 255, 255, 0.4)' + getPixel(0) + ', ' +
        //     //'transparent ' + getPixel(-2) + ', ' +
        //     //'transparent ' + getPixel(0) + ', ' +
        //     'white ' + getPixel(0) + ', ' +
        //     'white)'
        // }

        const timerStyle = {
            backgroundImage: 'linear-gradient(180deg, ' +
            'rgba(255, 255, 255, 1),' +
            'rgba(255, 255, 255, 1)' + getPixel(-32) + ', ' +
            //'rgba(255, 255, 255, 0.8)' + getPixel(-8) + ', ' +
            'rgba(255, 255, 255, 0.4)' + getPixel(0) + ', ' +
            'white ' + getPixel(2) + ', ' +
            'white)'
        }

        let timeLabels = []
        for ( let dt = moment({ hour: timetable.get('start') }); dt.isBefore(endMoment); dt.add(1, 'h') ) {
            timeLabels.push(
                <div
                    key={dt.hour()}
                    className="tt-timecolumn-time"
                >
                    {dt.format('LT')}
                </div>
            )
        }
        return <div className="tt-timecolumn" style={timerStyle}>
            {timeLabels}
        </div>
    }
}