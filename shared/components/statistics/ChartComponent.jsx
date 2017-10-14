import * as React from 'react'
import { Bar, defaults } from 'react-chartjs-2'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import * as dataGenerators from './chartDataGenerators'


export default class BarChartComponent extends React.Component {

    static propTypes = {
        statistics: ImmutablePropTypes.map.isRequired
    }

    /**
     *
     * SPLIT CHART IN TWO MORE DETAILED CHARTS!
     *
     * Multi-axis with only two datasets seems impossible...
     *
     */

    render() {
        const { statistics } = this.props

        // _.merge(defaults, {
        //     global: {
        //         scales: {
        //             yAxes: [{
        //                 ticks: {
        //                     min: 0,
        //                     max: 100
        //                 }
        //             }]
        //         }
        //     }
        // })

        // const chartData = {
        //     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        //     datasets: [
        //         {
        //             label: 'My First dataset',
        //             backgroundColor: 'rgba(255,99,132,0.2)',
        //             borderColor: 'rgba(255,99,132,1)',
        //             borderWidth: 1,
        //             hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        //             hoverBorderColor: 'rgba(255,99,132,1)',
        //             data: [65, 59, 80, 81, 56, 55, 40]
        //         },
        //         {
        //             label: 'My Second dataset',
        //             backgroundColor: 'rgba(23,244,132,0.2)',
        //             borderColor: 'rgba(23,244,132,1)',
        //             borderWidth: 1,
        //             hoverBackgroundColor: 'rgba(23,244,132,0.4)',
        //             hoverBorderColor: 'rgba(23,244,132,1)',
        //             data: [90, 52, 80, 21, 56, 35, 34]
        //         }
        //     ]
        // }

        return <div className="stats-chart-container">
            <Bar
                data={dataGenerators.getCurrentVsPreviousAvgData2(statistics, 5)}
                height={100}
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
                                        callback: function(value, index, values) {
                                            return ''
                                        }
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

