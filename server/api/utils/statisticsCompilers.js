import * as _ from 'lodash'

export function compileUserStatistics(stats) {


    const compiled = group(stats)
    console.log('\n--- USER STATISTICS ---\n', compiled, '\n-------------------\n')
    return compiled
}


export function compileGlobalStatistics(stats) {


    const compiled = group(anonymize(stats))
    console.log('\n--- GLOBAL STATISTICS ---\n', compiled, '\n-------------------\n')
    return compiled
}

function group(stats) {
    return _.mapValues(_.groupBy(stats, stat => stat.type), typeGroup => _.groupBy(typeGroup, stat => stat.weekDate))
}

function anonymize(rawStats) {
    return _.map(rawStats, stat => _.omit(stat, ['userID', 'task.title', 'task.description']))
}