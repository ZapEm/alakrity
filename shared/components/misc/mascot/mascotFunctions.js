import { MASCOT_STATUS, PROJECT_TYPES } from '../../../utils/enums'

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
                        message: getRandomItem(['Can\'t win them all.',
                                                'Put some more effort in it!',
                                                'Not your best performance.',
                                                'There is still room for improvement.'])
                    }
                } else if ( (rating && rating <= 3) || completeDelay > 20 ) {
                    return {
                        status: MASCOT_STATUS.STRESS,
                        message: getRandomItem(['It\'s done.',
                                                'Ok.',
                                                'Not bad.',
                                                'Hmm.'])
                    }
                } else {
                    return {
                        status: MASCOT_STATUS.AWESOME,
                        message: getRandomItem(['That was awesome!',
                                                'Great work!',
                                                'Nicely done!',
                                                'Cool!',
                                                'You rock!'])
                    }
                }

            case SPLASH_TYPES.OVER:
                if ( (rating && rating <= 2) || completeDelay > 35 || startDelay > 35 ) {
                    return {
                        status: MASCOT_STATUS.DENIED,
                        message: getRandomItem(['I think you can do better than that.',
                                                'There is probably a good reason for this.',
                                                'You get the best results if you stick to the schedule.',
                                                'There will always be some bad days. Don\'t worry about it and focus on the next tasks!'])
                    }
                } else if ( (rating && rating <= 3) || completeDelay > 20 || startDelay > 20 ) {
                    return {
                        status: MASCOT_STATUS.STRESS,
                        message: getRandomItem(['Another task completed.',
                                                'Done. Next!',
                                                'Yep, did that one too.'])
                    }
                } else {
                    return {
                        status: MASCOT_STATUS.GOODWORK,
                        message: getRandomItem(['Good work on that one!',
                                                'That one was nicely done.',
                                                'Nice!',
                                                'Oh, I remember that one! Good work!'])
                    }
                }

            case SPLASH_TYPES.BEGIN:
                if ( startDelay > 35 ) {
                    return {
                        status: MASCOT_STATUS.DENIED,
                        message: getRandomItem(['Better late than never.',
                                                'Better hurry now.',
                                                'You know, it\'s easier if you start on time.'])
                    }
                } else if ( startDelay > 20 ) {
                    return {
                        status: MASCOT_STATUS.STRESS,
                        message: getRandomItem(['Just a small delay. No problem.',
                                                'You can still make it!',
                                                'Try not to use the academic quarter too much.'])
                    }
                } else {
                    return {
                        status: MASCOT_STATUS.GOODWORK,
                        message: getRandomItem(['Off to a good start! Let\'s do this!',
                                                '3, 2, 1 - Go!',
                                                'The early cat catches the bird!'])
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
        [PROJECT_TYPES.APPOINTMENTS.key]: MASCOT_STATUS.HI,
        [PROJECT_TYPES.DATE.key]: MASCOT_STATUS.HI,
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
            return `You completed your first task of ${project.get('title')}. Keep it up!`

        case (progress.count.total - progress.count.done === 1):
            saveLastShownProgress()
            return `Just one more task for ${project.get('title')} this week.`

        case (progress.count.total === progress.count.done && progress.count.total >= 1):
            saveLastShownProgress()
            return `You are done with ${project.get('title')} for this week. Nice!`

        case (progress.week !== lastProgress.week || progress.percentTimeDone - lastProgress.percentTimeDone >= 25):
            saveLastShownProgress()
            return `You are ${progress.percentTimeDone}% done with this weeks work for project ${project.get('title')}!`

        default:
            return false
    }
}