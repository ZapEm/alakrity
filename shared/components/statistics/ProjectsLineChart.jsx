import * as React from 'react'
import { Line } from 'react-chartjs-2'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import * as dataGenerators from './chartDataGenerators'


export default class DetailLineChart extends React.Component {

    static propTypes = {
        userStats: ImmutablePropTypes.map.isRequired,
        appStats: ImmutablePropTypes.map.isRequired,
        projectList: ImmutablePropTypes.list.isRequired
    }

    render() {
        const { userStats, appStats, projectList } = this.props

        return <div className="stats-detail-chart-container">
            <Line
                data={dataGenerators.getWeeklyProjectLineData(userStats, appStats, projectList, 10)}
                height={100}
                 options={
                    {
                        scales: {
                            yAxes: [
                                {
                                    type: 'linear',
                                    display: true,
                                    position: 'left',
                                    id: 'y-percent-plus',
                                    gridLines: {
                                        drawOnChartArea: true
                                    },
                                    ticks: {
                                        min: 0,
                                        max: 200,
                                        stepSize: 25
                                    }
                                }
                            ]
                        }
                    }
                }
            />
        </div>
    }
}

