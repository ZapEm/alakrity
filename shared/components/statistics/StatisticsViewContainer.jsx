import * as Immutable from 'immutable'
import * as statisticsActions from 'modules/statistics'
import PropTypes from 'prop-types'
import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { compileAppStats, compileUser } from '../../functions/compileStatistics'
import { getProjectColorMap } from '../../utils/helpers'
import DetailLineChart from './DetailLineChart'
import OverviewBarChart from './OverviewBarChart'

@connect(state => ({
    statistics: state.statistics,
    taskList: state.tasks.get('taskList'),
    projectList: state.projects.get('projectList'),
    timetable: state.timetables.get('timetable'),
    settings: state.settings
}))
export default class StatisticsViewContainer extends React.Component {

    static propTypes = {
        statistics: ImmutablePropTypes.map,
        settings: ImmutablePropTypes.map,
        taskList: ImmutablePropTypes.list,
        projectList: ImmutablePropTypes.list,
        timetable: ImmutablePropTypes.map,
        dispatch: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.state = {
            colorMap: getProjectColorMap(this.props.projectList)
        }
    }

    componentWillMount() {
        this.props.dispatch(statisticsActions.loadStatistics())
        this.props.dispatch(statisticsActions.loadGlobalStatistics())
    }

    render() {
        const { statistics, timetable } = this.props



        const compiled = ( statistics.get('userStatistics').size > 0 )
            ? compileUser(statistics.get('userStatistics'), 5)
            : false

        const appStats = compileAppStats(timetable)

        if (!compiled){
            return <div className="statistics-view w3-card-4 w3-padding w3-round-large w3-border w3-border-theme"/>
        }

        return <div className="statistics-view w3-card-4 w3-padding w3-round-large w3-border w3-border-theme">
            <h4 className="w3-center">Overview</h4>
            <OverviewBarChart
                compiledStats={compiled}
                appStats={appStats}
            />
            <h4 className="w3-center">Details</h4>
            <DetailLineChart
                compiledStats={compiled}
                appStats={appStats}
            />
        </div>
    }
}