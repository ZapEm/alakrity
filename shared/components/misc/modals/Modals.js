import { MODAL_TYPES } from '../../../utils/enums'

export class Modal {
    constructor(content) {
        this.type = MODAL_TYPES.DEFAULT
        this.id = content.get('id')
        this.headerTitle = ''

        // if(content) {
        //     content.forEach(key => this[key] = content.get(key))
        // }
    }
}

export class ReminderModal extends Modal {
    constructor(task) {
        super(task)

        this.type = MODAL_TYPES.REMINDER
        this.headerTitle = 'Begin: ' + task.get('title')
        this.task = task

    }

}