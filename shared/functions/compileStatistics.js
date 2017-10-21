import * as Immutable from 'immutable'
import moment from 'moment'
import * as tasksCompilers from './tasksCompilers'
import { SPECIAL_PROJECTS } from '../utils/constants'


export function compileUser(stats, weeks = 5) {

    if ( !Immutable.Map.isMap(stats) ) {
        stats = Immutable.fromJS(stats)
    }

    // create padding with empty lists - for current and previous '#weeks' weeks
    let weekKey = moment().startOf('isoWeek')
    let taskStatsPadding = {}
    for ( let i = 0; i <= weeks; i++ ) {
        taskStatsPadding[weekKey.toISOString()] = Immutable.List()
        weekKey.subtract(1, 'weeks')
    }

    const sortedTaskStats = Immutable.Map(taskStatsPadding)
                                     .merge(stats.get('task'))
                                     .sortBy((val, key) => moment(key),
                                         (date1, date2) => {
                                             // newest first
                                             if ( date1.isBefore(date2) ) { return 1 }
                                             if ( date1.isAfter(date2) ) { return -1 }
                                             if ( date1.isSame(date2) ) { return 0 }
                                         })
                                     .take(weeks + 1)

    // cut off trailing empty weeks
    let truncatedSortedTaskStats = sortedTaskStats.skip(1).reverse().skipWhile(list => list.size === 0).reverse()
    const numberOfPreviousWeeks = truncatedSortedTaskStats.size

    return Immutable.fromJS({
        tasks: {
            totals: tasksCompilers.counter(truncatedSortedTaskStats.flatten(true), numberOfPreviousWeeks),
            byWeek: sortedTaskStats.map(weekStats => tasksCompilers.counter(weekStats))
        }
    })
}


export function compileGlobal(stats) {

    return Immutable.fromJS({
        raw: stats

    })
}

export function compileTimetableStats(timetable) {
    const slotMinutes = Math.round(60 / timetable.get('steps'))
    const selections = timetable.getIn(['projectPeriods', 'selection'])
    const timetableStats = {
        totalWorkPlanned: 0,
        projectWorkPlanned: {}
    }

    selections.forEach(day => day.forEach(projectID => {
        if ( projectID ) {
            if ( !timetableStats.projectWorkPlanned[projectID] ) {
                timetableStats.projectWorkPlanned[projectID] = slotMinutes
            } else {
                timetableStats.projectWorkPlanned[projectID] += slotMinutes
            }
            if (!(projectID in SPECIAL_PROJECTS)){
                timetableStats.totalWorkPlanned += slotMinutes
            }
        }
    }))


    return Immutable.fromJS(timetableStats)
}