export const DndTypes = Object.freeze(
    {
        TASK: 'DND_TASK',
        HANDLE: 'DND_HANDLE'
    }
)

export const TaskListFilters = Object.freeze(
    {
        UNASSIGNED: 'UNASSIGNED',
        ALL: 'ALL',
        NOT_THIS_WEEK: 'NOT_THIS_WEEK',
        UPCOMING: 'UPCOMING'
    }
)

export const MODAL_TYPES = Object.freeze(
    {
        DEFAULT: 'default',
        REMINDER: 'reminder',
        COMPLETION: 'completion',
        OVER: 'over',
        EDIT_TASK: 'edit-task',
        EDIT_PROJECT: 'edit-project'
    }
)

export const PROJECT_TYPES = Object.freeze(
    {
        DEFAULT: { key: 'DEFAULT', name: 'Standard', icon: 'event', group: 0 },
        STUDIES: { key: 'STUDIES', name: 'Studies', icon: 'school', group: 0 },
        OFFICE: { key: 'OFFICE', name: 'Office', icon: 'domain', group: 0 },
        CHORES: { key: 'CHORES', name: 'Chores', icon: 'home', group: 1 },
        APPOINTMENTS: { key: 'APPOINTMENTS', name: 'Appointments', icon: 'perm_contact_calendar', group: 1 },
        SPORT: { key: 'SPORT', name: 'Sport', icon: 'directions_bike', group: 1 },
        DATE: { key: 'DATE', name: 'Dates', icon: 'local_bar', group: 2 },
        FUN: { key: 'FUN', name: 'Fun', icon: 'videogame_asset', group: 2 },
        HOLIDAY: { key: 'HOLIDAY', name: 'Holiday', icon: 'beach_access', group: 2 }
    }
)

export const TASK_STATUS = Object.freeze(
    {
        DEFAULT: { key: 'DEFAULT', name: 'Standard', icon: '' },
        SCHEDULED: { key: 'SCHEDULED', name: 'Scheduled', icon: 'alarm' },
        ACTIVE: { key: 'ACTIVE', name: 'Active', icon: 'pets' },
        DONE: { key: 'DONE', name: 'Done', icon: 'done' },
        SNOOZED: { key: 'SNOOZED', name: 'Snoozed', icon: 'snooze' },
        IGNORED: { key: 'IGNORED', name: 'Ignored', icon: 'alarm_off' },
    }
)

export const STATISTIC_TYPES = Object.freeze(
    {
        TASK: 'task',
        TIMETABLE: 'timetable',
        LOGIN: 'login'
    }
)

export const MASCOT_STATUS = Object.freeze(
    {
        IDLE: 'IDLE',
        WORK: 'WORK',
        GOODWORK: 'GOODWORK',
        STATISTICS: 'STATISTICS',
        IDEA: 'IDEA',
        BACK: 'BACK',
        STRESS: 'STRESS',
        SPORT: 'SPORT',
        BREAK: 'BREAK',
        SLEEP: 'SLEEP',
        CHORES: 'CHORES',
        HI: 'HI',
        BYE: 'BYE',
        DENIED: 'DENIED',
        MEET: 'MEET',
        HAPPY: 'HAPPY',
        AWESOME: 'AWESOME',
        QUESTION: 'QUESTION'
    }
)

