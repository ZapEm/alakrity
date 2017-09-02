import moment from 'moment'

export function updateEventTime(task, newDate) {
    const { start } = task //, end
    const { value, type } = newDate
    const startDate = moment(start)

    const backgroundCell = moment(value)


    const newStartDate = type === 'Day'
        ? backgroundCell.add(startDate.hours(), 'h').add(startDate.minutes(), 'm')
        : backgroundCell

    //const newEndDate = moment(newStartDate).add(duration);

    return {
        ...task,
        start: newStartDate.toDate()
    }
}