import * as Immutable from 'immutable'
import tinycolor from 'tinycolor2'
import { compileUser } from '../../functions/compileStatistics'
import { PROJECT_COLORS } from '../../utils/constants'

export function getUserTotalData(statistics, weeks) {

    if ( !statistics.get('userStatistics').size > 0 ) {
        return {
            labels: [],
            datasets: []
        }
    }
    const userTotals = compileUser(statistics.get('userStatistics'), weeks).getIn(['tasks', 'totals'])

    return {
        labels: ['Last ' + weeks + ' weeks'],
        datasets: []//getDataSets(userTotals)
    }
}

export function getCurrentVsPreviousAvgData(statistics, weeks = 5) {

    if ( statistics.get('userStatistics').size <= 0 ) {
        return {
            labels: [],
            datasets: []
        }
    }

    const compiled = compileUser(statistics.get('userStatistics'), weeks)
    const userTotals = mapToLabels(compiled.getIn(['tasks', 'totals']))
    const userWeek = mapToLabels(compiled.getIn(['tasks', 'byWeek']).first())

    const numberOfWeeks = compiled.getIn(['tasks', 'totals', 'numberOfWeeks'])

    return {
        labels: userTotals.keySeq().toArray(),
        datasets: [
            {
                label: 'Previous ' + numberOfWeeks + ' weeks avg.',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: userTotals.toArray()
            },
            {
                label: 'This Week',
                backgroundColor: 'rgba(99,255,132,0.2)',
                borderColor: 'rgba(99,255,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(99,255,132,0.4)',
                hoverBorderColor: 'rgba(99,255,132,1)',
                data: userWeek.toArray()
            }
        ]
    }
}

export function getCurrentVsPreviousAvgData2(statistics, weeks = 5) {

    if ( statistics.get('userStatistics').size <= 0 ) {
        return {
            labels: [],
            datasets: []
        }
    }

    const compiled = compileUser(statistics.get('userStatistics'), weeks)
    const userTotals = mapToLabels(compiled.getIn(['tasks', 'totals']))
    const userWeek = mapToLabels(compiled.getIn(['tasks', 'byWeek']).first())

    const numberOfWeeks = compiled.getIn(['tasks', 'totals', 'numberOfWeeks'])

    const keyMap = {
        'Completed': {
            yAxisID: 'y-absolute',
            color: PROJECT_COLORS[1]
        },
        'Avg. Rating': {
            yAxisID: 'y-stars',
            color: PROJECT_COLORS[6]
        },
        'Start Delay': {
            yAxisID: 'y-delay',
            color: PROJECT_COLORS[3]
        },
        'Completion Delay': {
            yAxisID: 'y-delay',
            color: PROJECT_COLORS[4]
        },
        'Completion Percent': {
            yAxisID: 'y-percent',
            color: PROJECT_COLORS[5]
        }
    }

    let datasets = []
    userWeek.forEach((value, key) => {
        datasets.push({
            label: key,
            yAxisID: keyMap[key].yAxisID,
            borderWidth: 1,
            ...getBarColors(keyMap[key].color),
            data: [userTotals.get(key), value]
        })
    })

    return {
        labels: ['Previous ' + numberOfWeeks + ' weeks avg.', 'This week'],
        datasets: datasets
    }
}


function mapToLabels(precompiledStats) {
    if ( !Immutable.Map.isMap(precompiledStats) ) {
        precompiledStats = Immutable.Map(precompiledStats)
    }

    const total = precompiledStats.get('total')
    const numberOfWeeks = precompiledStats.get('numberOfWeeks')

    return Immutable.fromJS({
        'Completed': precompiledStats.get('completed') / numberOfWeeks,
        'Avg. Rating': precompiledStats.get('averageRating'),
        'Start Delay': precompiledStats.get('totalStartDelay') / numberOfWeeks,
        'Completion Delay': precompiledStats.get('totalCompletionDelay') / numberOfWeeks,
        'Completion Percent': total > 0 ? (precompiledStats.get('completed') / total) * 100 : 0
    })
}

function getBarColors(color) {
    return {
        backgroundColor: tinycolor(color).setAlpha(0.6).toRgbString(),
        borderColor: tinycolor(color).darken(20).toRgbString(),
        hoverBackgroundColor: tinycolor(color).setAlpha(0.8).toRgbString(),
        hoverBorderColor: tinycolor(color).darken(20).toRgbString()
    }
}