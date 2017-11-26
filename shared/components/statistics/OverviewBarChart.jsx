import * as React from 'react'
import { Bar } from 'react-chartjs-2'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import * as dataGenerators from './chartDataGenerators'


export default class OverviewBarChart extends React.Component {

    static propTypes = {
        userStats: ImmutablePropTypes.map.isRequired,
        appStats: ImmutablePropTypes.map.isRequired
    }

    render() {
        const { userStats, appStats } = this.props

        return <div className="stats-overview-chart-container">
            <Bar
                data={dataGenerators.getCurrentVsPreviousAvgData(userStats, appStats)}
                height={130}
                options={
                    {
                        scales: {
                            yAxes: [
                                {
                                    type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                    display: false,
                                    position: 'left',
                                    id: 'y-absolute',
                                    gridLines: {
                                        drawOnChartArea: false
                                    },
                                    ticks:{
                                        suggestedMax: 20,
                                        min: 0
                                    }
                                },
                                {
                                    type: 'linear',
                                    display: false,
                                    id: 'y-stars',
                                    gridLines: {
                                        drawOnChartArea: true
                                    },
                                    ticks: {
                                        min: 0,
                                        max: 5
                                    }
                                },
                                {
                                    type: 'linear',
                                    display: false,
                                    position: 'right',
                                    id: 'y-delay',
                                    gridLines: {
                                        drawOnChartArea: false
                                    },
                                    ticks:{
                                        suggestedMax: 120,
                                        min: 0
                                    }
                                },
                                {
                                    type: 'linear',
                                    display: false,
                                    position: 'right',
                                    id: 'y-punctuality',
                                    gridLines: {
                                        drawOnChartArea: false
                                    },
                                    ticks: {
                                        max: 1,
                                        min: 0
                                    }
                                },
                                {
                                    type: 'linear',
                                    display: true,
                                    position: 'left',
                                    id: 'y-percent',
                                    gridLines: {
                                        drawOnChartArea: true
                                    },
                                    ticks: {
                                        min: 0,
                                        max: 100,
                                        // Include a dollar sign in the ticks
                                        callback: () => '' // (value, index, values) => ()
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

