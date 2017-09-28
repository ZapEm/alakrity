import * as _ from 'lodash/object'
import PropTypes from 'prop-types'
import * as React from 'react'
import { Bar, defaults } from 'react-chartjs-2'


export default class ChartComponent extends React.Component {

    static propTypes = {
        data: PropTypes.object.isRequired
    }

    render() {
        const { data } = this.props

        _.merge(defaults, {
            global: {
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 100
                        }
                    }]
                }
            }
        })

        const chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: 'rgba(23,244,132,0.2)',
                    borderColor: 'rgba(23,244,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(23,244,132,0.4)',
                    hoverBorderColor: 'rgba(23,244,132,1)',
                    data: [90, 52, 80, 21, 56, 35, 34]
                }
            ]
        }

        return <div className="chart-container">
            <Bar
                data={chartData}
            />
        </div>
    }
}

function getDatasets(data, week = false, projects = false) {
    return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: !week ? 'This Week' : '',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [65, 59, 80, 81, 56, 55, 40]
            }
        ]
    }
}