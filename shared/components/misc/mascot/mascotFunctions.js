import { MASCOT_STATUS, PROJECT_TYPES } from '../../../utils/enums'
import { getProjectWeekProgress } from '../../../utils/helpers'

export function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)]
}

export const SPLASH_TYPES = Object.freeze({
    COMPLETED: 'completed',
    BEGIN: 'begin',
    OVER: 'over'
})

export function getMascotSplash(splashType, { startDelay, completeDelay, rating, message = false }) {

    const mascot = ((type) => {
        switch (type) {
            case SPLASH_TYPES.COMPLETED:
                if ( (rating && rating <= 2) || completeDelay > 35 ) {
                    return {
                        status: MASCOT_STATUS.DENIED,
                        message: 'Can\'t win them all.'
                    }
                } else if ( (rating && rating <= 3) || completeDelay > 20 ) {
                    return {
                        status: MASCOT_STATUS.STRESS,
                        message: 'It\'s done.'
                    }
                } else {
                    return {
                        status: MASCOT_STATUS.GOODWORK,
                        message: 'Good work!'
                    }
                }

            case SPLASH_TYPES.OVER:
                if ( (rating && rating <= 2) || completeDelay > 35 || startDelay > 35 ) {
                    return {
                        status: MASCOT_STATUS.DENIED,
                        message: 'I think you can do better than that.'
                    }
                } else if ( (rating && rating <= 3) || completeDelay > 20 || startDelay > 20 ) {
                    return {
                        status: MASCOT_STATUS.STRESS,
                        message: 'Another task completed.'
                    }
                } else {
                    return {
                        status: MASCOT_STATUS.GOODWORK,
                        message: 'That was nicely done!'
                    }
                }

            case SPLASH_TYPES.BEGIN:
                if ( startDelay > 35 ) {
                    return {
                        status: MASCOT_STATUS.DENIED,
                        message: 'Better late than never.'
                    }
                } else if ( startDelay > 20 ) {
                    return {
                        status: MASCOT_STATUS.STRESS,
                        message: 'Just a small delay. No problem.'
                    }
                } else {
                    return {
                        status: MASCOT_STATUS.GOODWORK,
                        message: 'Off to a good start! Let\'s do this!'
                    }
                }

            default:
                return {
                    status: false,
                    message: false
                }
        }
    })(splashType)

    // override default message with computed one.
    if ( message ) {
        mascot.message = message
    }

    return mascot
}

export function getMascotStatusFromProjectType(projectType) {

    const status = {
        [PROJECT_TYPES.DEFAULT.key]: MASCOT_STATUS.WORK,
        [PROJECT_TYPES.OFFICE.key]: MASCOT_STATUS.WORK,
        [PROJECT_TYPES.STUDIES.key]: MASCOT_STATUS.WORK,
        [PROJECT_TYPES.SPORT.key]: MASCOT_STATUS.SPORT,
        [PROJECT_TYPES.CHORES.key]: MASCOT_STATUS.CHORES,
        [PROJECT_TYPES.APPOINTMENTS.key]: MASCOT_STATUS.MEET,
        [PROJECT_TYPES.DATE.key]: MASCOT_STATUS.MEET,
        [PROJECT_TYPES.FUN.key]: MASCOT_STATUS.HAPPY,
        [PROJECT_TYPES.HOLIDAY.key]: MASCOT_STATUS.HAPPY
    }[projectType]
    return status ? status : MASCOT_STATUS.IDLE
}

export function getMascotMessageFromProgress(progress, project, editProject) {
    if ( !progress ) {
        return false
    }

    function saveLastShownProgress() {
        editProject(project.set('lastShownProgress', progress))
    }

    const lastProgress = project.get('lastShownProgress')
        ? project.get('lastShownProgress').toJS()
        : { // default if lastShownProgress is false
            count: {
                total: progress.count.total,
                done: 0,
                totalDuration: progress.count.totalDuration,
                doneDuration: 0
            },
            percentTimeDone: 0,
            percentDone: 0
        }

    switch (true) {
        case (project.get('lastShownProgress') === false):
            saveLastShownProgress()
            return `You completed your first task of ${project.get('title')}!`

        case (progress.count.total - progress.count.done === 1):
            saveLastShownProgress()
            return `Just one more task for ${project.get('title')} this week.`

        case (progress.count.total === progress.count.done && progress.count.total >= 1):
            saveLastShownProgress()
            return `You are done with ${project.get('title')} for this week. Nice!`

        case (progress.percentTimeDone - lastProgress.percentTimeDone >= 25):
            saveLastShownProgress()
            return `You are ${progress.percentTimeDone}% done with this weeks work for project ${project.get('title')}!`

        default:
            return false
    }
}