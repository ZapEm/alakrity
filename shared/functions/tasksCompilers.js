import * as _ from 'lodash'
import moment from 'moment'

export function counter(taskStats, numberOfWeeks = 1) {

    try {
        taskStats = taskStats.toJS()
    } catch (err) {
        console.warn(err)
    }


    let count = {
        total: 0,
        started: 0,
        completed: 0,
        delayedStarts: 0,
        totalStartDelay: 0,
        delayedCompletions: 0,
        totalCompletionDelay: 0,
        totalSnooze: 0,
        totalExtended: 0,
        totalWorkTime: 0,
        projectWorkTime: {}
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
                if ( taskStat.started ) {
                    const workDuration = moment(taskStat.completed).diff(taskStat.started, 'minutes')
                    count.totalWorkTime += (workDuration > 0) ? workDuration : 0
                    if ( !count.projectWorkTime[taskStat.task.projectID] ) { count.projectWorkTime[taskStat.task.projectID] = 0 }
                    count.projectWorkTime[taskStat.task.projectID] += (workDuration > 0)
                        ? workDuration
                        : 0
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
            if ( taskStat.extended ) { count.totalExtended += taskStat.extended }
        }
    )

    count.averageRating = totalRated !== 0 ? Math.round(totalRating / totalRated * 100) / 100 : 0
    count.ratedRatio = count.completed !== 0 ? Math.round(totalRated / count.completed * 100) / 100 : 0

    count.numberOfWeeks = numberOfWeeks

    return count
}