export const DndTypes = Object.freeze(
    {
        TASK: 'DND_TASK',
        HANDLE: 'DND_HANDLE'
    }
)

export const TaskListFilters = Object.freeze(
    {
        UNASSIGNED: 'unassigned',
        ALL: 'all',
        NOT_THIS_WEEK: 'not_this_week'
    }
)

export const MODAL_TYPES = Object.freeze(
    {
        DEFAULT: Symbol('DEFAULT_MODAL'),
        REMINDER: Symbol('REMINDER_MODAL'),
        EDIT_TASK: Symbol('EDIT_TASK_MODAL'),
        EDIT_PROJECT: Symbol('EDIT_PROJECT_MODAL')
    }
)