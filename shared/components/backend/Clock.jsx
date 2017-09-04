import PropTypes from 'prop-types'
import React from 'react'
import * as ImmutablePropTypes from 'react-immutable-proptypes'


export default class Clock extends React.Component {

    static propTypes = {
        taskList: ImmutablePropTypes.list.isRequired,
        backendActions: PropTypes.objectOf(PropTypes.func).isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            time: new Date()
        }
    }

    componentWillMount() {
        this.timerID = setInterval(() => this.tick(), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    tick() {

        const time = new Date()
        if ( this.clockRef ) {
            this.setState({
                time: time
            })

        }

        // do once per minute...
        if ( !this.currentMinute || time.getMinutes() !== this.currentMinute ) {
            this.currentMinute = time.getMinutes()

            this.props.backendActions.updateUpcomingTasks(this.props.taskList, time, 10)
            this.props.backendActions.setTime(time)
        }
    }

    render() {
        return <div
            className="clock"
            ref={ref => this.clockRef = ref}
        >
            <span className="w3-large w3-theme-d1">{this.state.time.toLocaleTimeString()}</span>
        </div>
    }
}