import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import * as backendActions from '../../modules/backend'

@connect(state => ({
    editMode: state.timetables.get('editMode'),
    //currentPath: state.routing.locationBeforeTransitions.pathname || '/'
}))
export default class Clock extends React.Component {

    static propTypes = {
        editMode: PropTypes.bool,
        dispatch: PropTypes.func
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
        if ( typeof window !== 'undefined' ) {
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
            const initial = this.initial
            this.initial = false

            this.currentMinute = this.time.getMinutes()

            // Don't notify while editing schedule
            if(!this.props.editMode) {
                this.props.dispatch(backendActions.setCurrentTime(this.time))
                this.props.dispatch(backendActions.updateModals(this.time, initial))
            }
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