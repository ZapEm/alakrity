import { MASCOT_STATUS } from '/utils/enums'
import PropTypes from 'prop-types'
import * as React from 'react'
import { connect } from 'react-redux'
import { mascotSplash } from '../../../modules/backend'
import { MASCOT_TIPS } from '../../../utils/constants'
import { getMascotImage } from './ImgMaps'
import { getRandomItem } from './mascotFunctions'
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
        periodicUpdates: PropTypes.bool,
        dispatch: PropTypes.func
    }

    static defaultProps = {
        status: MASCOT_STATUS.SLEEP,
        replaceStatus: false,
        statusOverride: false,
        periodicUpdates: false,
        message: false
    }

    constructor(props) {
        super(props)
        this.state = {
            image: getMascotImage(this.getStatus()),
            oldImage: null
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.state.image !== nextState.image
            || this.props.status !== nextProps.status
            || this.props.statusOverride !== nextProps.statusOverride
            || this.props.message !== nextProps.message
            || (this.props.periodicUpdates && this.props.time !== nextProps.time)
        )
    }

    getStatus(props = this.props) {
        return props.statusOverride
            ? props.statusOverride
            : props.replaceStatus
                   ? props.replaceStatus
                   : props.status
    }

    componentWillUpdate() {
        // hacky animation refresh, but nothing better really possible...
        const oldImg = this.oldImgRef
        if ( oldImg ) {
            oldImg.classList.remove('mascot-blend-out')
            void oldImg.offsetWidth
            oldImg.classList.add('mascot-blend-out')
        }
        const img = document.getElementById('mascot-image')
        if ( img ) {
            img.classList.remove('mascot-blend-in')
            void img.offsetWidth
            img.classList.add('mascot-blend-in')
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(({ image }) => ({
                oldImage: image ? <img ref={(ref) => this.oldImgRef = ref} id="old-mascot-image"
                                       className="mascot-image-old mascot-blend-out" src={image.props.src}
                                       alt={'oldImage'}/> :
                          null,
                image: getMascotImage(this.getStatus(nextProps))
            })
        )
    }

    showTip(e) {
        e.preventDefault()
        this.props.dispatch(mascotSplash({ status: MASCOT_STATUS.IDEA, message: getRandomItem(MASCOT_TIPS) }, 15))
    }

    resetMascot(e) {
        e.preventDefault()
        this.props.dispatch(mascotSplash({ status: MASCOT_STATUS.IDLE }, 0))
    }


    render() {
        const { message } = this.props
        const { image, oldImage } = this.state
        const isIdle = (this.props.status === MASCOT_STATUS.IDLE && !this.props.replaceStatus && !this.props.statusOverride)


        return <div
            className="mascot-container w3-margin-bottom"
            onClick={isIdle ? ::this.showTip : ::this.resetMascot}
        >
            <SpeechBubble message={message}/>
            {image}
            {oldImage}
        </div>
    }
}