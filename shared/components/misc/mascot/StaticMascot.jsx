
import PropTypes from 'prop-types'
import * as React from 'react'


export default class StaticMascot extends React.Component {

    static propTypes = {
        imgUrl: PropTypes.string.isRequired
    }

    render() {
        const { imgUrl } = this.props
        if ( typeof window === 'undefined' ) {
            return <div className="mascot-container w3-margin-bottom">
                <div className="mascot-image" alt="mascot"/>
            </div>
        }
        return <div className="mascot-container w3-margin-bottom">
            <img className="mascot-image" src={imgUrl} alt="mascot"/>
        </div>
    }
}