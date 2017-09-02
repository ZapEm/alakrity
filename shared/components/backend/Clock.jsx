import * as React from 'react'
import * as ImmutablePropTypes from 'react-immutable-proptypes'


export default class Clock extends React.Component {

    static propTypes = {
        taskList: ImmutablePropTypes.list.isRequired,
        backendActions: React.PropTypes.objectOf(React.PropTypes.func).isRequired
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
        if ( this.refs.clockRef ) {
            this.setState({
                time: time
            })

        }

        // do once per minute...
        if ( !this.currentMinute || time.getMinutes() !== this.currentMinute ) {
            this.currentMinute = time.getMinutes()

            this.props.backendActions.updateUpcomingTasks(this.props.taskList, time, 10)

            // const immediateSchedule = this.getImmediateSchedule(this.props.taskList, 1)
            //
            // if(immediateSchedule.size > 0) {
            //     this.props.backendActions.addModal(immediateSchedule.map((task) => new ReminderModal(task)))
            // }

            //console.log(this.currentMinute, immediateSchedule.toJSON())

            this.props.backendActions.setTime(time)
        }
    }

    /**
     * Gets all tasks that start between 'now' and 'in <lookahead> hours'
     * @param taskList <Immutable list> of tasks (with start: date)
     * @param lookahead <int> time in hours
     * @return Immutable list
     */
    getImmediateSchedule(taskList, lookahead) {
        if ( taskList ) {
            const lookAheadDate = new Date(this.state.time.getTime() + (lookahead * 3600000))
            return taskList.filter((task) => {
                const startTime = new Date(task.get('start'))
                return ( startTime >= this.state.time && startTime < lookAheadDate)
            })
        }
    }

    render() {
        //const {  } = this.props
        return <div className="clock-wrapper w3-row w3-top" ref="clockRef">
            <div className="clock w3-right w3-large w3-theme-d1">
                {
                    this.state.time.toLocaleTimeString()
                }
            </div>
        </div>

    }
}