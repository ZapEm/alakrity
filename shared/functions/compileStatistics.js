import * as Immutable from 'immutable'
import * as _ from 'lodash'
import * as tasksCompilers from './tasksCompilers'


export function compileUser(stats, weekDate = false) {

    const tasksStats = !stats.task
        ? false
        : !weekDate
                           ? _.flatMap(stats.task)
                           : stats.task.weekDate

    console.log('tasksStats:', tasksStats)

    return Immutable.fromJS({
        raw: stats,
        tasks: {
            ...tasksCompilers.counter(tasksStats)
        }

    })
}


export function compileGlobal(stats) {

    return Immutable.fromJS({
        raw: stats

    })
}

