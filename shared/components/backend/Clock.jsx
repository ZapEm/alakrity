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
        this.currentMinute = this.state.time.getMinutes()
        this.initial = true
    }

    componentWillUpdate(nextProps, nextState) {
        return nextState.time !== this.state.time
    }

    componentWillMount() {
        if ( typeof window !== 'undefined') {
            this.timerID = setInterval(() => this.tick(), 1000)
            this._isMounted = true
        }
    }

    componentWillUnmount() {
        if ( typeof window !== 'undefined' ) {
            clearInterval(this.timerID)
            this._isMounted = false
        }
    }

    tick() {

        this.time = new Date()

        if ( this._isMounted ) {
            this.setState({
                time: this.time
            })
        }

        // do once per minute...
        if ( this.initial || this.time.getMinutes() !== this.currentMinute ) {
            this.currentMinute = this.time.getMinutes()
            this.props.backendActions.updateUpcomingTasks(this.props.taskList, this.time, 10)
            this.props.backendActions.setTime(this.time)
            this.initial = false
        }
    }

    render() {
        return <div
            className="clock"
        >
            <span className="w3-large w3-theme-d1">{this.state.time.toLocaleTimeString('de')}</span>
        </div>
    }
}