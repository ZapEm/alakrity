import { MASCOT_STATUS } from '/utils/enums'
import PropTypes from 'prop-types'
import * as React from 'react'
import { connect } from 'react-redux'
import { getMascotImage } from './ImgMaps'
import SpeechBubble from './SpeechBubble'


@connect(state => ({
    status: state.backend.get('mascotStatus'),
    statusOverride: state.backend.get('mascotStatusOverride'),
    message: state.backend.get('mascotMessage'),
    time: state.backend.get('time')
}))
export default class MascotContainer extends React.Component {

    static propTypes = {
        status: PropTypes.string,
        replaceStatus: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        statusOverride: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        message: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        time: PropTypes.any,
        periodicUpdates: PropTypes.bool
    }

    static defaultProps = {
        status: MASCOT_STATUS.SLEEP,
        replaceStatus: false,
        statusOverride: false,
        periodicUpdates: false,
        message: false
    }

    shouldComponentUpdate(nextProps) {
        return (
            this.props.status !== nextProps.status
            || this.props.statusOverride !== nextProps.statusOverride
            || this.props.message !== nextProps.message
            || (this.props.periodicUpdates && this.props.time !== nextProps.time)
        )
    }

    render() {
        const { status, replaceStatus, statusOverride, message } = this.props

        console.log('mascotMessage:', message)

        return <div className="mascot-container w3-margin-bottom">
            <SpeechBubble message={message}/>
            {getMascotImage(
                statusOverride
                    ? statusOverride
                    : replaceStatus
                    ? replaceStatus
                    : status
            )}
        </div>
    }
}