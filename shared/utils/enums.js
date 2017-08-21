import {Enum} from 'enumify'

export class TaskListFilter extends Enum {}
TaskListFilter.initEnum(['UNASSIGNED', 'ALL', 'NOT_THIS_WEEK'])