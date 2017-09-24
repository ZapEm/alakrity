import { TASK_TYPES } from './constants'
import * as _ from 'lodash/object'
import { PROJECT_TYPES, TASK_STATUS } from './enums'


export function thaw(frozenObject) {
    return _.merge({}, frozenObject)
}

export const TASK_MAX_DURATION = 300

export const DEFAULT_TASK = Object.freeze(
    {
        // id,
        // userID,
        // projectID,
        // created,
        // lastEdited,

        title: '',
        description: '',
        type: TASK_TYPES.standard,
        start: null,
        duration: 120,

        status: TASK_STATUS.DEFAULT
    }
)

export const DEFAULT_PROJECT = Object.freeze(
    {
        // id,
        // userID,
        // created,
        // lastEdited,

        title: '',
        description: '',
        defaultTaskType: TASK_TYPES.standard,
        color: '#FFFFFF',
        type: PROJECT_TYPES.DEFAULT.key,

        tracked: true
    }
)

export const DEFAULT_TIMETABLE = Object.freeze(
    {
        // id,
        // userID,
        // created,
        // lastEdited,

        title: 'New Timetable',
        start: 7,
        end: 22,
        steps: 2,
        projectPeriods: {
            selection: [[], [], [], [], [], [], []]
        }
    }
)