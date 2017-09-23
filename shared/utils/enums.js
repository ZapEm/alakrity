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
        EDIT_TASK: 'edit-task',
        EDIT_PROJECT: 'edit-project'
    }
)

export const PROJECT_TYPES = Object.freeze(
    {
        DEFAULT: { key: 'DEFAULT', name: 'Standard', icon: 'event' },
        OFFICE: { key: 'OFFICE', name: 'Office', icon: 'domain' },
        CHORES: { key: 'CHORES', name: 'Chores', icon: 'home' },
        SPORT: { key: 'SPORT', name: 'Sport', icon: 'directions_bike' },
        APPOINTMENTS: { key: 'APPOINTMENTS', name: 'Appointments', icon: 'perm_contact_calendar' },
        FUN: { key: 'FUN', name: 'Fun', icon: 'videogame_asset' },
        DATE: { key: 'DATE', name: 'Date', icon: 'local_bar' },
        STUDIES: { key: 'STUDIES', name: 'Studies', icon: 'school' },
        HOLIDAY: { key: 'HOLIDAY', name: 'Holiday', icon: 'beach_access' }
    }
)

export const TASK_STATUS = Object.freeze(
    {
        DEFAULT: { key: 'DEFAULT', name: 'Standard', icon: '' },
        SCHEDULED: { key: 'SCHEDULED', name: 'Scheduled', icon: 'grid_on' },
        ACTIVE: { key: 'ACTIVE', name: 'Active', icon: 'pets' },
        DONE: { key: 'DONE', name: 'Done', icon: 'done' },
        //WAITING: { key: 'WAITING', name: 'Waiting', icon: 'notifications_active' },
        SNOOZED: { key: 'SNOOZED', name: 'Snoozed', icon: 'snooze' }
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
        //HAPPY: 'HAPPY',
        HI: 'HI',
        BYE: 'BYE',
        DENIED: 'DENIED'
    }
)

export const projectToMascotStatus = Object.freeze({
    ['asd']: MASCOT_STATUS.IDLE

})