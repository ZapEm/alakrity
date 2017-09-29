import { compileUser } from '../../functions/compileStatistics'
import * as Immutable from 'immutable'

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

export function getUserWeekVsTotalData(statistics, weeks = 5) {

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
                label: 'Last ' + numberOfWeeks + ' weeks avg.',
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


function mapToLabels(precompiledStats) {
    if(!Immutable.Map.isMap(precompiledStats)){
        precompiledStats = Immutable.Map(precompiledStats)
    }

    const total = precompiledStats.get('total')
    const numberOfWeeks = precompiledStats.get('numberOfWeeks')

    return Immutable.fromJS({
        'Completed': precompiledStats.get('completed') / numberOfWeeks,
        'Avg. Rating': precompiledStats.get('averageRating'),
        'Start Delay': precompiledStats.get('totalStartDelay') / numberOfWeeks,
        'Completion Delay': precompiledStats.get('totalCompletionDelay') / numberOfWeeks,
        'Completion Ratio': total > 0 ? precompiledStats.get('completed') / total : 0
    })
}