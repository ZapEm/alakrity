import * as React from 'react'
import PropTypes from 'prop-types'

export default class StatisticsView extends React.Component {

    static propTypes = {
        prop: PropTypes.any
    }

    render() {
        const { prop } = this.props
        return <div className="statistics-view w3-card-4 w3-padding w3-round-large w3-border w3-border-theme">
            {prop}
            lorem ipsum
        </div>
    }
}