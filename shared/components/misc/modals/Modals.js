import { MODAL_TYPES, TASK_STATUS } from '../../../utils/enums'
import moment from 'moment'
import { getTaskStatus } from '../../../utils/helpers'

export class Modal {
    constructor(content, type) {
        this.id = (type ? type + '_' : 'default_') + content.get('id')
        this.type = type ? type : MODAL_TYPES.DEFAULT

        // may be overridden
        this.task = content // meh
        this.headerTitle = content.has('header') ? content.get('header') : 'Default Header'
        this.date = content.has('time') ? moment(content.get('time')) : moment()
    }
}

export class ReminderModal extends Modal {
    constructor(task) {
        super(task, MODAL_TYPES.REMINDER)

        this.task = task
        this.headerTitle = 'Begin: ' + task.get('title')
        this.date = moment(task.get('start'))
    }
}

export class SnoozedReminderModal extends Modal {
    constructor(task) {
        super(task, MODAL_TYPES.REMINDER)

        this.task = task
        this.headerTitle = 'Begin: ' + task.get('title')
        this.snooze = task.get('snooze')
        this.date = moment(task.get('start')).add(task.get('snooze'), 'minutes')
    }
}

export class CompletionModal extends Modal {
    constructor(task) {
        super(task, MODAL_TYPES.COMPLETION)

        this.task = task
        this.headerTitle = 'Complete: ' + task.get('title')
        this.date = moment(task.get('start')).add(task.get('duration'), 'minutes')
    }
}

export function getTaskModal(task, thisWeek) {

    switch (getTaskStatus(task, thisWeek)) {
        case TASK_STATUS.SCHEDULED.key:
            return new ReminderModal(task)

        case TASK_STATUS.SNOOZED.key:
            return new SnoozedReminderModal(task)

        case TASK_STATUS.ACTIVE.key:
            return new CompletionModal(task)

        default:
            return new Modal(task)
    }
}