import * as React from 'react'
import PropTypes from 'prop-types'
import ChartComponent from './ChartComponent'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { getProjectColorMap } from '../../utils/helpers'
import * as statisticsActions from 'modules/statistics'

@connect(state => ({
    statistics: state.statistics,
    taskList: state.tasks.get('taskList'),
    projectList: state.projects.get('projectList'),
    settings: state.settings
}))
export default class StatisticsViewContainer extends React.Component {

    static propTypes = {
        statistics: ImmutablePropTypes.map,
        settings: ImmutablePropTypes.map,
        taskList: ImmutablePropTypes.list,
        projectList: ImmutablePropTypes.list,
        dispatch: PropTypes.func
    }

    constructor(props){
        super(props)
        this.state = {
            colorMap: getProjectColorMap(this.props.projectList)
        }
    }

    componentWillMount(){
        this.props.dispatch(statisticsActions.loadStatistics())
        this.props.dispatch(statisticsActions.loadGlobalStatistics())
    }

    render() {
        const { statistics } = this.props

        return <div className="statistics-view w3-card-4 w3-padding w3-round-large w3-border w3-border-theme">
            <ChartComponent
                statistics={statistics}
            />
            lorem ipsum
        </div>
    }
}