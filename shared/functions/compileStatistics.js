import * as Immutable from 'immutable'
import moment from 'moment'
import * as tasksCompilers from './tasksCompilers'


export function compileUser(stats, weeks = 5) {

    if ( !Immutable.Map.isMap(stats) ) {
        stats = Immutable.fromJS(stats)
    }

    const sortedTaskStats = stats.get('task')
                                 .sortBy((val, key) => moment(key),
                                     (date1, date2) => {
                                         // newest first
                                         if ( date1.isBefore(date2) ) { return 1 }
                                         if ( date1.isAfter(date2) ) { return -1 }
                                         if ( date1.isSame(date2) ) { return 0 }
                                     })
                                 .take(weeks)

    const numberOfWeeks = sortedTaskStats.size

    return Immutable.fromJS({
        tasks: {
            totals: tasksCompilers.counter(sortedTaskStats.flatten(true), numberOfWeeks),
            byWeek: sortedTaskStats.map(weekStats => tasksCompilers.counter(weekStats))
        }
    })
}


export function compileGlobal(stats) {

    return Immutable.fromJS({
        raw: stats

    })
}