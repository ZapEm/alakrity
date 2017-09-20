import PropTypes from 'prop-types'
import * as React from 'react'
import { connect } from 'react-redux'
import { MASCOT_STATUS } from '/utils/enums'
import { getMascotImage } from './ImgMaps'


@connect(state => ({
    status: state.backend.get('mascotStatus'),
    time: state.backend.get('time')
}))
export default class MascotContainer extends React.Component {

    static propTypes = {
        status: PropTypes.string,
        time: PropTypes.any,
        periodicUpdates: PropTypes.bool
    }

    static defaultProps = {
        status: MASCOT_STATUS.SLEEP,
        periodicUpdates: false
    }

    shouldComponentUpdate(nextProps) {
        return this.props.status !== nextProps.status || (this.props.periodicUpdates && this.props.time !== nextProps.time)
    }


    render() {
        const { status } = this.props

        const img = getMascotImage(status)

        return <div className="mascot-container w3-margin-bottom">
            {img}
        </div>
    }
}