import * as Immutable from 'immutable'
import moment from 'moment'
import tinycolor from 'tinycolor2'
import { SPECIAL_PROJECTS, TASK_TYPES } from './constants'
import { TaskListFilters } from './enums'

/**
 * Extract and adjust the project colors then return as immutable map
 * with projectID keys and 'normal', 'light' and 'dark' sub keys.
 * @param projectList - immutable list
 * @returns {any} - immutable map with normal, light and dark colors per projectID.
 */
export function getProjectColorMap(projectList) {
    let colorMap = {}
    projectList.forEach(project => {
            const color = project.get('color')

            colorMap[project.get('id')] = {
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
            colorMap[project.get('key')] = {
                normal: project.get('normal'),
                light: project.get('light'),
                dark: project.get('dark')
            }
        }
    )

    return Immutable.fromJS(colorMap)
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

export const taskDayFilters = {
    [TASK_TYPES.standard]: (task, date) => (moment(task.get('start')).isSame(date, 'day')),
    [TASK_TYPES.oneTime]: (task, date) => (moment(task.get('start')).isSame(date, 'day')),
    [TASK_TYPES.repeating]: (task, date) => {
        const taskStartMoment = moment(task.get('start'))
        return (taskStartMoment.isSameOrBefore(date, 'day') && taskStartMoment.isoWeekday() === date.isoWeekday())
    }
}

export function getRandomItem(array){
    return array[Math.floor(Math.random()*array.length)]
}