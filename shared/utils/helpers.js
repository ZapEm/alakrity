import * as Immutable from 'immutable'
import moment from 'moment'
import tinycolor from 'tinycolor2'
import { SPECIAL_PROJECTS } from './constants'
import { TASK_STATUS, TaskListFilters } from './enums'

/**
 * Extract and adjust the project colors then return as immutable map
 * with projectID keys and 'normal', 'light' and 'dark' sub keys.
 * @param projectList - immutable list
 * @returns {any} - immutable map with normal, light and dark colors per projectID.
 */
export function getProjectColorMap(projectList) {
    let projectMap = {}
    projectList.forEach(project => {
            const color = project.get('color')

            projectMap[project.get('id')] = {
                project: project,
                normal: color,
                light: tinycolor(color).brighten(10).toHexString(),
                dark: tinycolor(color).brighten(-35).toHexString(),
                special: {
                    normal: tinycolor(color).brighten(-30).toHexString(),
                    light: tinycolor(color).brighten(-10).toHexString(),
                    dark: tinycolor(color).brighten(-50).toHexString()
                }
            }
        }
    )

    Immutable.fromJS(SPECIAL_PROJECTS).forEach(project => {
            projectMap[project.get('key')] = {
                project: false,
                normal: project.get('normal'),
                light: project.get('light'),
                dark: project.get('dark')
            }
        }
    )

    return Immutable.fromJS(projectMap)
}

export function getTaskListFilter(selection, projectID, filterByMoment) {

    // all projects: project | projectID = false

    switch (selection) {
        case TaskListFilters.UNASSIGNED:
            return (task) => ( ( !projectID || task.get('projectID') === projectID ) && !task.get('start') )

        case TaskListFilters.NOT_THIS_WEEK:
            return (task) => ( ( !projectID || task.get('projectID') === projectID )
                && ( !filterByMoment
                    || !task.get('start')
                    || filterByMoment.isoWeek() !== moment(task.get('start')).isoWeek()) )

        case TaskListFilters.UPCOMING:
            return (task) => {
                const start = task.get('start')
                const now = moment()
                return ( ( !projectID || task.get('projectID') === projectID )
                    && start && moment(start).isAfter(now))
            }

        case TaskListFilters.ALL:
        default:
            return (task) => ( !projectID || task.get('projectID') === projectID )
    }
}

export function dayTasksFilter(task, date) {
    if ( !task.get('repeating') ) {
        return moment(task.get('start')).isSame(date, 'day')
    } else {
        return ((taskStartMoment) => (taskStartMoment.isSameOrBefore(date, 'day')
            && taskStartMoment.isoWeekday() === date.isoWeekday()))(moment(task.get('start')))
    }
}

export function getMilestoneMap(projectList) {
    let milestones = {}
    projectList.forEach(project => {
            if ( project.has('milestones') ) {
                project.get('milestones').forEach(milestone => {
                    milestones[milestone.get('id')] = milestone
                })
            }
        }
    )
    return Immutable.fromJS(milestones)
}

export function getTaskStatus(task, startOfThisWeek = moment().startOf('isoWeek')) {
    if ( Immutable.Map.isMap(task) ) {
        task = task.toJS()
    }

    const status = !task.repeating
        ? task.status
        : task.status
                       ? task.status[startOfThisWeek]
              ? task.status[startOfThisWeek]
              : task.start
                             ? TASK_STATUS.SCHEDULED.key
                             : TASK_STATUS.DEFAULT.key
                       : task.start
              ? TASK_STATUS.SCHEDULED.key
              : TASK_STATUS.DEFAULT.key

    if ( task.repeating && typeof task.status !== 'object' ) { console.warn('Status of repeating task ', task.title, 'needs to be an Object! Is "', task.status, '" instead.\n   returning', status) }

    return status
}



export function momentSetSameWeek(momentOrDate, weekMoment = moment()) {
    return moment(momentOrDate).isoWeek(weekMoment.isoWeek())
}

export function getTaskStartMoment(task, weekMoment = moment()) {
    if ( !Immutable.Map.isMap(task) ) {
        task = Immutable.Map(task)
    }

    if ( !task.get('repeating') ) {
        return moment(task.get('start'))
    } else {
        return moment(task.get('start')).isoWeek(weekMoment.isoWeek())
    }
}

export function getTaskEndMoment(task, weekMoment = moment()) {
    if ( !Immutable.Map.isMap(task) ) {
        task = Immutable.Map(task)
    }

    if ( !task.get('repeating') ) {
        return moment(task.get('start')).add(task.get('duration'), 'minutes')
    } else {
        return moment(task.get('start')).isoWeek(weekMoment.isoWeek()).add(task.get('duration'), 'minutes')
    }
}


export function getProjectFromTask(task, projectMapOrList) {
    if ( !Immutable.Map.isMap(task) ) {

        task = Immutable.fromJS(task)
    }

    if ( Immutable.List.isList(projectMapOrList) ) {
        return projectMapOrList.find((project) => project.get('id') === task.get('projectID'))
    }

    if ( Immutable.Map.isMap(projectMapOrList) ) {
        return projectMapOrList.get(task.get('projectID'))

    }
    // invalid parameter
    console.warn('getProjectFromTask(task, projectMapOrList) needs Immutable.Map or .List of projects!')
    return false
}

export function getProjectTypeFromTask(task, projectMap) {
    if ( !task ) {
        return false
    }
    const project = getProjectFromTask(task, projectMap)
    return project ? project.get('type') : false
}

export function getMapFromList(List, keyProp) {
    if ( typeof keyProp === 'undefined' ) {
        return List.toMap()
    }
    return Immutable.Map(List.map(item => [item.get(keyProp), item]))
}

export function getProjectWeekProgress(project, taskList, task, week = moment().startOf('isoWeek')) {
    if ( !Immutable.Map.isMap(task) ) {
        task = Immutable.Map(task)
    }

    // task is from a different/irrelevant week or project.
    if ( !moment(task.get('start')).isSame(week, 'isoWeek') || task.get('projectID') !== project.get('id') ) {
        return false
    }

    const thisWeeksProjectTasks = taskList.filter(taskItem => (
        taskItem.get('projectID') === project.get('id') &&
        (taskItem.get('repeating') || moment(taskItem.get('start')).isSame(week, 'isoWeek')) &&
        [
            TASK_STATUS.DONE.key,
            TASK_STATUS.ACTIVE.key,
            TASK_STATUS.SCHEDULED.key,
            TASK_STATUS.SNOOZED.key
        ].indexOf(getTaskStatus(taskItem, week)) !== -1
    ))

    const count = {
        total: thisWeeksProjectTasks.size,
        done: 0,
        totalDuration: 0,
        doneDuration: 0
    }
    thisWeeksProjectTasks.forEach(projectTask => {
        // count the currently completed task as done.
        if ( getTaskStatus(projectTask, week) === TASK_STATUS.DONE.key || projectTask.get('id') === task.get('id') ) {
            count.done++
            count.doneDuration += projectTask.get('duration')
        }
        count.totalDuration += projectTask.get('duration')
    })


    return {
        week: week.year() + '_' + week.isoWeek(),
        count: count,
        percentTimeDone: Math.floor((count.doneDuration / count.totalDuration) * 100),
        percentDone: Math.floor((count.done / count.total) * 100)
    }
}