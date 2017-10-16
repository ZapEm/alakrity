import * as Immutable from 'immutable'
import moment from 'moment'
import tinycolor from 'tinycolor2'
import { PROJECT_COLORS } from '../../utils/constants'


export function getCurrentVsPreviousAvgData(compiledStats, appStats) {

    const userTotals = mapToLabels(compiledStats.getIn(['tasks', 'totals']), appStats)
    const userWeek = mapToLabels(compiledStats.getIn(['tasks', 'byWeek']).first(), appStats)

    const numberOfWeeks = compiledStats.getIn(['tasks', 'totals', 'numberOfWeeks'])


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

export function getWeeklyLineData(compiledStats) {

    //const userTotals = mapToLabels(compiledStats.getIn(['tasks', 'totals']))
    const allWeeks = compiledStats.getIn(['tasks', 'byWeek']).reverse().map(weekStats => mapToLabels(weekStats))

    //const numberOfWeeks = compiledStats.getIn(['tasks', 'totals', 'numberOfWeeks'])

    //console.log(allWeeks, allWeeks.first())

    let datasets = []
    allWeeks.first().forEach((value, key) => {
        datasets.push({
            label: key,
            yAxisID: keyMap[key].yAxisID,
            borderWidth: 2,
            fill: false,
            lineTension: 0,
            ...getLineColors(keyMap[key].color),
            data: allWeeks.map(week => week.get(key)).toArray()
        })
    })

    return {
        labels: allWeeks.map((week, key) => moment(key).format('L')).toArray(),
        datasets: datasets
    }
}


function mapToLabels(precompiledStats, appStats) {
    if ( !Immutable.Map.isMap(precompiledStats) ) { precompiledStats = Immutable.Map(precompiledStats) }
    if ( !Immutable.Map.isMap(appStats) ) { appStats = Immutable.Map(appStats) }

    //const total = precompiledStats.get('total')
    const numberOfWeeks = precompiledStats.get('numberOfWeeks')

    return Immutable.fromJS({
        [keyMap.COMPLETED.label]: precompiledStats.get('completed') / numberOfWeeks,
        [keyMap.AVG_RATING.label]: precompiledStats.get('averageRating'),
        [keyMap.START_DELAY.label]: precompiledStats.get('totalStartDelay') / numberOfWeeks,
        [keyMap.COMPLETION_DELAY.label]: precompiledStats.get('totalCompletionDelay') / numberOfWeeks,
        ...(appStats.size !== 0) && {
            [keyMap.COVERAGE.label]: ''
        }
    })
}

const keyMap = {
    COMPLETED: {
        label: 'Completed',
        yAxisID: 'y-absolute',
        color: PROJECT_COLORS[1]
    },
    AVG_RATING: {
        label: 'Avg. Rating',
        yAxisID: 'y-stars',
        color: PROJECT_COLORS[6]
    },
    START_DELAY: {
        label: 'Start Delay',
        yAxisID: 'y-delay',
        color: PROJECT_COLORS[3]
    },
    COMPLETION_DELAY: {
        label: 'Completion Delay',
        yAxisID: 'y-delay',
        color: PROJECT_COLORS[4]
    },
    COVERAGE: {
        label: 'Coverage Percent',
        yAxisID: 'y-percent',
        color: PROJECT_COLORS[7]
    }
}

function getBarColors(color) {
    return {
        backgroundColor: tinycolor(color).setAlpha(0.6).toRgbString(),
        borderColor: tinycolor(color).darken(20).toRgbString(),
        hoverBackgroundColor: tinycolor(color).setAlpha(0.8).toRgbString(),
        hoverBorderColor: tinycolor(color).darken(20).toRgbString()
    }
}

function getLineColors(color) {
    return {
        backgroundColor: tinycolor(color).setAlpha(0.6).toRgbString(),
        borderColor: tinycolor(color).darken(20).toRgbString(),
        hoverBackgroundColor: tinycolor(color).setAlpha(0.8).toRgbString(),
        hoverBorderColor: tinycolor(color).darken(20).toRgbString()
    }
}

