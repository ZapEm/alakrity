import classNames from 'classnames'
import PropTypes from 'prop-types'
import * as React from 'react'

export default class SpeechBubble extends React.Component {

    static propTypes = {
        message: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
    }

    static defaultProps = {
        message: false
    }

    constructor(props) {
        super(props)
        this.state = {
            message: this.props.message,
            animation: ''
        }

    }

    componentWillReceiveProps(nextProps) {
        if ( this.props.message !== nextProps.message ) {
            if ( this.props.message && !nextProps.message ) {
                this.setState({
                    message: this.props.message,
                    animation: 'fade'
                })
                setTimeout(() => this.setState({ message: nextProps.message }), 1000)
            }
            else if ( !this.props.message && nextProps.message ) {
                this.setState({
                    message: nextProps.message,
                    animation: 'appear'
                })
            }
            else if ( this.props.message && nextProps.message ) {
                this.setState({ animation: 'fade' })
                setTimeout(() => this.setState({
                    message: nextProps.message,
                    animation: 'appear'
                }), 1000)
            }
        }
    }

    render() {
        const { message, animation } = this.state //state!

        if ( !message ) {
            return null
        }

        const minWidth = Math.floor(Math.log(message.length) * 50) + 'px'

        return <div
            className={classNames('speech-bubble-wrapper', {
                'animate-fade-in': animation === 'appear',
                'animate-fade-out': animation === 'fade'
            })}
        >
            <p className="w3-card-4 speech-bubble" style={{ minWidth: minWidth }}>
                {message}
            </p>
        </div>
    }
}