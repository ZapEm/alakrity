import { MODAL_TYPES, TASK_STATUS } from '../../../utils/enums'
import moment from 'moment'

const _ = require('lodash/object')

export class Modal {
    constructor(content) {
        // for all
        this.id = content.get('id')

        // may be overridden
        this.type = MODAL_TYPES.DEFAULT
        this.headerTitle = content.has('header') ? content.get('header') : 'Default Header'
        this.date = content.has('time') ? moment(content.get('time')) : moment()
        this.task = content // meh
    }
}

export class ReminderModal extends Modal {
    constructor(task) {
        super(task)

        this.type = MODAL_TYPES.REMINDER
        this.headerTitle = 'Begin: ' + task.get('title')
        this.task = task
        this.date = moment(task.get('start'))
    }
}

export class SnoozedReminderModal extends Modal {
    constructor(task) {
        super(task)

        this.type = MODAL_TYPES.REMINDER
        this.headerTitle = 'Begin: ' + task.get('title')
        this.task = task
        this.snooze = task.get('snooze')
        this.date = moment(task.get('start')).add(task.get('snooze'), 'minutes')
    }
}

export class CompletionModal extends Modal {
    constructor(task) {
        super(task)

        this.type = MODAL_TYPES.COMPLETION
        this.headerTitle = 'Complete: ' + task.get('title')
        this.task = task
        this.date = moment(task.get('start')).add(task.get('duration'), 'minutes')
    }
}

export function getTaskModal(task, statusOverride = false) {
    if ( statusOverride ) {
        task = task.set('status', statusOverride)
    }

    switch (task.get('status')) {
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