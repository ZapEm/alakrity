import * as statisticsActions from 'modules/statistics'
import PropTypes from 'prop-types'
import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { compileTimetableStats, compileUser } from '../../functions/compileStatistics'
import { getProjectColorMap } from '../../utils/helpers'
import DetailLineChart from './DetailLineChart'
import OverviewBarChart from './OverviewBarChart'
import ProjectsLineChart from './ProjectsLineChart'
import Spinner from '../misc/Spinner'

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
            colorMap: getProjectColorMap(this.props.projectList),
            appStats: compileTimetableStats(this.props.timetable),
            userStats: false
        }
    }

    componentWillMount() {
        this.props.dispatch(statisticsActions.loadStatistics())
        this.props.dispatch(statisticsActions.loadGlobalStatistics())
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            ...(this.props.timetable !== nextProps.timetable) && { appStats: compileTimetableStats(nextProps.timetable) },
            ...(this.props.statistics !== nextProps.statistics) && {
                userStats: ( nextProps.statistics.get('userStatistics').size > 0 )
                    ? compileUser(nextProps.statistics.get('userStatistics'), 5, this.props.projectList)
                    : false
            }
        })
    }

    render() {
        const { statistics, projectList } = this.props
        const { userStats, appStats } = this.state // state!

        if(statistics.get('isWorkingMap').some(item => item === true)){
            return <div className="w3-display-container"
                        style={{height: '500px'}}>
                <div className="w3-display-middle">
                <Spinner status={'WORKING'}/>
                </div>
            </div>
        }

        if ( !userStats || !appStats ) {
            return <div className="statistics-view w3-card-4 w3-padding w3-round-large w3-border w3-border-theme">
                <h5 className="w3-center">
                    {(statistics.get('userStatistics').size === 0) ? 'No statistics recorded yet.' : ''}
                </h5>
            </div>
        }
        //console.log('userStats:', userStats.toJS(), '\n appStats:' , appStats.toJS())

        return <div className="statistics-view w3-card-4 w3-padding w3-round-large w3-border w3-border-theme">
            <h4 className="w3-center">Overview</h4>
            <OverviewBarChart
                userStats={userStats}
                appStats={appStats}
            />

            <h4 className="w3-center">Time Line</h4>
            <DetailLineChart
                userStats={userStats}
                appStats={appStats}
            />

            <h4 className="w3-center">Project Time Coverage (in %)
                <div className="w3-center w3-small">Actual and *targeted values (from total task durations)</div>
            </h4>

            <ProjectsLineChart
                userStats={userStats}
                appStats={appStats}
                projectList={projectList}
            />
        </div>
    }
}