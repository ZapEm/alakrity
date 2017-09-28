import * as _ from 'lodash'

export function counter(taskStats) {

    let count = {
        total: 0,
        started: 0,
        completed: 0,
        delayedStarts: 0,
        totalStartDelay: 0,
        delayedCompletions: 0,
        totalCompletionDelay: 0,
        totalSnooze: 0,
        totalExtended: 0
        // averageRating: 0,
        // ratedRatio: 0
    }

    let totalRating = 0
    let totalRated = 0

    _.forEach(taskStats, (taskStat) => {
            count.total++
            if ( taskStat.started ) { count.started++ }
            if ( taskStat.completed ) {
                count.completed++
                if ( taskStat.rating ) {
                    totalRated++
                    totalRating += taskStat.rating
                }
            }
            if ( taskStat.startDelay ) {
                count.delayedStarts++
                count.totalStartDelay += taskStat.startDelay
            }
            if ( taskStat.completeDelay ) {
                count.delayedCompletions++
                count.totalCompletionDelay += taskStat.completeDelay
            }
            if ( taskStat.snooze ) { count.totalSnooze += taskStat.snooze }
            if ( taskStat.extended ) {count.totalExtended += taskStat.extended }
        }
    )

    count.averageRating = totalRated !== 0 ? totalRating / totalRated : 0
    count.ratedRatio = count.total !== 0 || count.completed !== 0 ? totalRated / count.completed : 0
    console.log('COUNT:', count)
    return count
}