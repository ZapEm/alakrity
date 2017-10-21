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
        totalWorkTimeTarget: 0,
        totalWorkTimeActual: 0,
        totalWorkTimeBuffer: 0,
        projectWorkTimeTarget: {},
        projectWorkTimeActual: {}
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

                // Targeted worked time in Projects/Buffer (how tasks where placed)
                if ( !count.projectWorkTimeTarget[taskStat.task.projectID] ) { count.projectWorkTimeTarget[taskStat.task.projectID] = 0 }
                if ( taskStat.started ) {
                    const workDuration = moment(taskStat.completed).diff(taskStat.started, 'minutes')
                    count.totalWorkTimeTarget += (workDuration > 0) ? workDuration : 0
                    count.projectWorkTimeTarget[taskStat.task.projectID] += (workDuration > 0)
                        ? workDuration
                        : 0
                }

                // Actual worked time in Projects/Buffer (with delays/extends)
                if ( !count.projectWorkTimeActual[taskStat.task.projectID] ) { count.projectWorkTimeActual[taskStat.task.projectID] = 0 }
                if ( taskStat.timeInProject ) {
                    count.totalWorkTimeActual += taskStat.timeInProject
                    count.projectWorkTimeActual[taskStat.task.projectID] += taskStat.timeInProject
                }
                if ( taskStat.timeInBuffer ) {
                    count.totalWorkTimeBuffer += taskStat.timeInBuffer
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