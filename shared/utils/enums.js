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
        REMINDER: Symbol('reminder'),
        EDIT_TASK: Symbol('edit_task'),
        EDIT_PROJECT: Symbol('edit_project')
    }
)