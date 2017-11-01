import PropTypes from 'prop-types'
import * as React from 'react'

export default class SpeechBubble extends React.Component {

    static propTypes = {
        message: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        timeout: PropTypes.number
    }

    static defaultProps = {
        message: false,
        timeout: 5000
    }


    render() {
        const { message } = this.props

        if ( !message ) {
            return null
        }

        const minWidth = Math.floor(Math.log(message.length) * 50) + 'px'

        return <div className="speech-bubble-wrapper">
            <p className="w3-card-4 speech-bubble" style={{ minWidth: minWidth }}>
                {message}
            </p>
        </div>
    }
}