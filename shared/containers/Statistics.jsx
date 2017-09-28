import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import StatisticsSidebar from '../components/statistics/StatisticsSidebar'
import StatisticsViewContainer from '../components/statistics/StatisticsViewContainer'


export default class Projects extends React.Component {

    static propTypes = {
        auth: ImmutablePropTypes.map,
        tasks: ImmutablePropTypes.map,
        projects: ImmutablePropTypes.map,
        isAuthenticated: PropTypes.bool,
        settings: ImmutablePropTypes.map,
        dispatch: PropTypes.func
    }

    render() {
        //const { } = this.props

        return (
            <div className="react-container">
                <div className="row">
                    <div className="col px900">
                        <StatisticsViewContainer/>
                    </div>
                    <div id="sidebar" className="col sidebar">
                        <StatisticsSidebar
                        />
                    </div>
                </div>
            </div>
        )
    }
}