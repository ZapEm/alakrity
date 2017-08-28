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
            height = (((endValue - startValue) / 3600000)) * 45
            //console.log('height:', height)
        }

        function getPercent(difference = 0){
            const result = (percent + difference)
            return ( result >= 0 ) ? result.toString() + '%' : '0%'
        }

        function getPixel(difference = 0){
            const result = (Math.floor((percent / 100) * height) + difference)
            return ( result >= 0 ) ? result.toString() + 'px' : '0px'
        }

        console.log(time)

        const timerStyle2 = {
            backgroundImage: 'linear-gradient(180deg, ' +
            'rgba(255, 255, 255, 0.95), ' +
            'rgba(255, 255, 255, 0.8)' + getPercent(-10) + ', ' +
            'rgba(255, 255, 255, 0.5)' + getPixel(-2) + ', ' +
            'transparent ' + getPixel(-2) + ', ' +
            'transparent ' + getPixel(0) + ', ' +
            'white ' + getPixel(0) + ', ' +
            'white)'
        }

        // const timerStyle = {
        //     backgroundImage: 'linear-gradient(180deg, ' +
        //     'rgba(255, 255, 255, 1), ' +
        //     'rgba(255, 255, 255, 1)' + getPercent(-25) + ', ' +
        //     'rgba(255, 255, 255, 0.5)' + getPercent(-0.2) + ', ' +
        //     'transparent ' + getPercent(-1) + ', ' +
        //     'transparent ' + getPercent(0) + ', ' +
        //     'white ' + getPercent(0) + ', ' +
        //     'white 100%)'
        //     //+', linear-gradient(90deg, rgba(255, 255, 255, 0.5), transparent 10px, transparent 20px, rgba(255, 255, 255, 0.5))'
        //     //+', linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5) 50%, transparent)'
        //     //+', linear-gradient(90deg, white, white 90%, transparent 95%, transparent 98%, white)'
        // }

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
        return <div className="tt-timecolumn" style={timerStyle2}>
            {timeLabels}
        </div>
    }
}