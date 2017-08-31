import { MODAL_TYPES } from '../../../utils/enums'
import * as Immutable from 'immutable'

export class Modal {
    constructor(content, type) {
        if(Immutable.isImmutable(content)){
            content = content.toJS()
        }
        const initActions = {
            [MODAL_TYPES.REMINDER]: () => {
                this.modalType = MODAL_TYPES.REMINDER
                this.headerTitle = content.text
            }
        }

        this.headerTitle = content.headerTitle
    }
}

export class ReminderModal extends Modal {
    constructor(task) {
        super({
            headerTitle: task.text
        })
        this.modalType = MODAL_TYPES.REMINDER
    }

}