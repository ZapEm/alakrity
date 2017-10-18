import * as Immutable from 'immutable'
import moment from 'moment'
import tinycolor from 'tinycolor2'
import { PROJECT_COLORS } from '../../utils/constants'


export function getCurrentVsPreviousAvgData(compiledStats, appStats) {

    const userTotals = mapToKeys(compiledStats.getIn(['tasks', 'totals']), appStats)
    const userWeek = mapToKeys(compiledStats.getIn(['tasks', 'byWeek']).first(), appStats)

    const numberOfWeeks = compiledStats.getIn(['tasks', 'totals', 'numberOfWeeks'])


    let datasets = []
    userWeek.forEach((value, key) => {
        const dataType = keyMap[key]
        if ( dataType ) {
            datasets.push({
                label: dataType.label,
                yAxisID: dataType.yAxisID,
                borderWidth: 1,
                ...getBarColors(dataType.color),
                data: [userTotals.get(key), value]
            })
        } else {
            console.warn('"', key, '" is not in keyMap!')
        }

    })

    return {
        labels: ['Previous ' + numberOfWeeks + ' weeks avg.', 'This week'],
        datasets: datasets
    }
}

export function getWeeklyLineData(compiledStats) {

    //const userTotals = mapToLabels(compiledStats.getIn(['tasks', 'totals']))
    const allWeeks = compiledStats.getIn(['tasks', 'byWeek']).reverse().map(weekStats => mapToKeys(weekStats))

    //const numberOfWeeks = compiledStats.getIn(['tasks', 'totals', 'numberOfWeeks'])

    //console.log(allWeeks, allWeeks.first())

    let datasets = []
    allWeeks.first().forEach((value, key) => {
        const dataType = keyMap[key]
        if ( dataType ) {
            datasets.push({
                label: dataType.label,
                yAxisID: dataType.yAxisID,
                borderWidth: 2,
                fill: false,
                lineTension: 0,
                ...getLineColors(dataType.color),
                data: allWeeks.map(week => week.get(key)).toArray()
            })
        } else {
            console.warn('"', key, '" is not in keyMap!!')
        }
    })

    return {
        labels: allWeeks.map((week, key) => moment(key).format('L')).toArray(),
        datasets: datasets
    }
}


function mapToKeys(precompiledStats, appStats) {
    if ( !Immutable.Map.isMap(precompiledStats) ) { precompiledStats = Immutable.Map(precompiledStats) }
    if ( !Immutable.Map.isMap(appStats) ) { appStats = Immutable.Map(appStats) }

    //const total = precompiledStats.get('total')
    const numberOfWeeks = precompiledStats.get('numberOfWeeks')

    return Immutable.fromJS({
        [keyMap.COMPLETED.key]: precompiledStats.get('completed') / numberOfWeeks,
        [keyMap.AVG_RATING.key]: precompiledStats.get('averageRating'),
        [keyMap.START_DELAY.key]: precompiledStats.get('totalStartDelay') / numberOfWeeks,
        [keyMap.COMPLETION_DELAY.key]: precompiledStats.get('totalCompletionDelay') / numberOfWeeks,
        ...(appStats.size !== 0) && {
            [keyMap.COVERAGE.key]: ''
        }
    })
}


const keyMap = {
    COMPLETED: {
        key: 'COMPLETED',
        label: 'Completed',
        yAxisID: 'y-absolute',
        color: PROJECT_COLORS[1]
    },
    AVG_RATING: {
        key: 'AVG_RATING',
        label: 'Avg. Rating',
        yAxisID: 'y-stars',
        color: PROJECT_COLORS[6]
    },
    START_DELAY: {
        key: 'START_DELAY',
        label: 'Start Delay',
        yAxisID: 'y-delay',
        color: PROJECT_COLORS[3]
    },
    COMPLETION_DELAY: {
        key: 'COMPLETION_DELAY',
        label: 'Completion Delay',
        yAxisID: 'y-delay',
        color: PROJECT_COLORS[4]
    },
    COVERAGE: {
        key: 'COVERAGE',
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

