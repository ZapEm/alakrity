import * as Immutable from 'immutable'
import moment from 'moment'
import tinycolor from 'tinycolor2'
import { PROJECT_COLORS, SPECIAL_PROJECTS } from '../../utils/constants'


export function getCurrentVsPreviousAvgData(compiledStats, appStats) {

    //console.log(compiledStats)

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

export function getWeeklyLineData(compiledStats, appStats, maxWeeks = 10) {

    const allWeeks = compiledStats.getIn(['tasks', 'byWeek'])
                                  .take(maxWeeks)
                                  .reverse()
                                  .map(weekStats => mapToKeys(weekStats, appStats))

    let datasets = []
    allWeeks.last().forEach((value, key) => {
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

export function getWeeklyProjectLineData(compiledStats, appStats, projectList, maxWeeks = 6) {

    const allWeeks = compiledStats.getIn(['tasks', 'byWeek'])
                                  .take(maxWeeks)
                                  .reverse()
                                  .map(weekStats => mapToProjects(weekStats, projectList, appStats))

    let datasets = []

    allWeeks.flatten(true).forEach((projectStats, projectID) => {
        datasets.push({
            label: projectStats.get('title'),
            yAxisID: 'y-percent-plus',
            borderWidth: 1,
            fill: false,
            lineTension: 0,
            ...projectID === SPECIAL_PROJECTS._BUFFER.key && {
                borderDash: [6, 3],
                hidden: true
            },
            ...getLineColors(projectStats.get('color')),
            data: allWeeks.map(week => week.hasIn([projectID, 'actualCoverage']) ? week.getIn([projectID, 'actualCoverage']) : 0).toArray(),
        })
        if ( projectID !== SPECIAL_PROJECTS._BUFFER.key ) {
            datasets.push({
                label: projectStats.get('title') + '*',
                yAxisID: 'y-percent-plus',
                borderWidth: 0,
                pointRadius: 1,
                pointHoverRadius: 1,
                fill: '-1',
                lineTension: 0,
                ...getLineColorsTarget(projectStats.get('color')),
                data: allWeeks.map(week => week.hasIn([projectID, 'targetCoverage']) ? week.getIn([projectID, 'targetCoverage']) : 0).toArray()
            })
        }
    })

    return {
        labels: allWeeks.map((week, key) => moment(key).format('L')).toArray(),
        datasets: datasets
    }
}


function mapToKeys(userStats, appStats) {
    if ( !Immutable.Map.isMap(userStats) ) { userStats = Immutable.Map(userStats) }
    if ( !Immutable.Map.isMap(appStats) ) { appStats = Immutable.Map(appStats) }

    //const total = precompiledStats.get('total')
    const numberOfWeeks = userStats.get('numberOfWeeks')

    return Immutable.fromJS({
        [keyMap.COMPLETED.key]: userStats.get('completed') / numberOfWeeks,
        [keyMap.AVG_RATING.key]: userStats.get('averageRating'),
        [keyMap.START_DELAY.key]: userStats.get('totalStartDelay') / numberOfWeeks,
        [keyMap.COMPLETION_DELAY.key]: userStats.get('totalCompletionDelay') / numberOfWeeks,
        [keyMap.COVERAGE.key]: (userStats.get('totalWorkTimeActual') > 0 && appStats.get('totalWorkPlanned') > 0)
            ? Math.round((userStats.get('totalWorkTimeActual') / appStats.get('totalWorkPlanned')) * 10000) / 100 : 0
    })
}

function mapToProjects(weekStats, projectList, appStats) {
    if ( !Immutable.Map.isMap(weekStats) ) { weekStats = Immutable.fromJS(weekStats) }
    if ( !Immutable.Map.isMap(appStats) ) { appStats = Immutable.fromJS(appStats) }


    const projectsStats = {}
    weekStats.get('projectWorkTimeActual').forEach((actualTime, projectID) => {
        const project = projectList.find(project => project.get('id') === projectID)
        const plannedTime = appStats.getIn(['projectWorkPlanned', projectID])

        if(project.get('tracked')){
            projectsStats[projectID] = {
                title: project.get('title'),
                actualCoverage: (plannedTime > 0)
                    ? Math.round((actualTime / plannedTime) * 10000) / 100 : 0,
                targetCoverage: (plannedTime > 0)
                    ? Math.round((weekStats.getIn(['projectWorkTimeTarget', projectID]) / plannedTime) * 10000) / 100 : 0,
                color: project.get('color'),
                active: true
            }
        }
    })

    // add Buffer stats, but inactive (hidden at first).
    const plannedBufferTime = appStats.getIn(['projectWorkPlanned', SPECIAL_PROJECTS._BUFFER.key])
    projectsStats[SPECIAL_PROJECTS._BUFFER.key] = {
        title: 'Buffer Use',
        actualCoverage: (plannedBufferTime > 0)
            ? Math.round((weekStats.get('totalWorkTimeBuffer') / plannedBufferTime) * 10000) / 100 : 0,
        targetCoverage: 0,
        color: SPECIAL_PROJECTS._BUFFER.normal,
        isBuffer: true,
        active: false
    }

    return Immutable.fromJS(projectsStats)
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
        label: 'Project Coverage %',
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

function getLineColorsTarget(color) {
    return {
        backgroundColor: tinycolor(color).setAlpha(0.6).toRgbString(),
        borderColor: 'transparent',
        hoverBackgroundColor: tinycolor(color).setAlpha(0.8).toRgbString(),
        hoverBorderColor: 'transparent'
    }
}

