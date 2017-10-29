import * as Immutable from 'immutable'
import moment from 'moment'
import tinycolor from 'tinycolor2'
import { SPECIAL_PROJECTS } from './constants'
import { MASCOT_STATUS, PROJECT_TYPES, TASK_STATUS, TaskListFilters } from './enums'

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

export function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)]
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


export const SPLASH_TYPES = Object.freeze({
    COMPLETED: 'completed',
    BEGIN: 'begin'
})

export function getMascotSplash(type, { startDelay, completeDelay, rating }) {

    switch (type) {
        case SPLASH_TYPES.COMPLETED:
            if ( (rating && rating <= 2) || completeDelay > 35 ) {
                return MASCOT_STATUS.STRESS
            } else if ( (rating && rating <= 3) || completeDelay > 20 ) {
                return MASCOT_STATUS.WORK
            } else {
                return MASCOT_STATUS.GOODWORK
            }

        case SPLASH_TYPES.BEGIN:
            if ( startDelay > 35 ) {
                return MASCOT_STATUS.STRESS
            } else if ( startDelay > 20 ) {
                return MASCOT_STATUS.WORK
            } else {
                return MASCOT_STATUS.GOODWORK
            }

        default:
            return false
    }
}

export function getProjectFromTask(task, projectMapOrList) {
    if ( Immutable.List.isList(projectMapOrList) ) {
        projectMapOrList = getMapFromList(projectMapOrList, 'id')
    }
    if ( Immutable.Map.isMap(projectMapOrList) ) {
        return Immutable.Map.isMap(task) ? projectMapOrList.get(task.get('projectID')) :
               false
    }
    // invalid parameter
    console.warn('getProjectFromTask(task, projectMapOrList) needs Immutable.Map or .List of projects!')
    return false
}

export function getProjectTypeFromTask(task, projectMap) {
    const project = getProjectFromTask(task, projectMap)
    return project ? project.get('type') : false
}

export function getMapFromList(List, keyProp) {
    if(typeof keyProp === 'undefined'){
        return List.toMap()
    }
    return Immutable.Map(List.map(item => [item.get(keyProp), item]))
}

export function getMascotStatusFromProjectType(projectType) {

    const status = {
        [PROJECT_TYPES.DEFAULT.key]: MASCOT_STATUS.WORK,
        [PROJECT_TYPES.OFFICE.key]: MASCOT_STATUS.WORK,
        [PROJECT_TYPES.STUDIES.key]: MASCOT_STATUS.WORK,
        [PROJECT_TYPES.SPORT.key]: MASCOT_STATUS.SPORT,
        [PROJECT_TYPES.CHORES.key]: MASCOT_STATUS.CHORES,
        [PROJECT_TYPES.APPOINTMENTS.key]: MASCOT_STATUS.MEET,
        [PROJECT_TYPES.DATE.key]: MASCOT_STATUS.MEET,
        [PROJECT_TYPES.FUN.key]: MASCOT_STATUS.HAPPY,
        [PROJECT_TYPES.HOLIDAY.key]: MASCOT_STATUS.HAPPY
    }[projectType]
    return status ? status : MASCOT_STATUS.IDLE
}