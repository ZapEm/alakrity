import * as React from 'react'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import { ReminderModal } from '../misc/Modals/Modals'


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

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    tick() {
        const time = new Date()
        this.setState({
            time: time
        })

        // do once per minute...
        if ( !this.currentMinute || time.getMinutes() !== this.currentMinute ) {
            this.currentMinute = time.getMinutes()

            const immediateSchedule = this.getImmediateSchedule(this.props.taskList, 1)

            immediateSchedule.map((task) => new ReminderModal(task))
            if(immediateSchedule.size > 0) {
                this.props.backendActions.addModal(immediateSchedule)
            }

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
            return taskList.filter((task) => {
                const startTime = new Date(task.get('start'))
                return ( startTime >= this.state.time && startTime < new Date(this.state.time.getTime() + (lookahead * 3600000)))
            })
        }
    }

    render() {
        //const {  } = this.props
        return <div className="clock-wrapper w3-row w3-top">
            <div className="clock w3-right w3-large w3-theme-d1">
                {
                    this.state.time.toLocaleTimeString()
                }
            </div>
        </div>

    }
}