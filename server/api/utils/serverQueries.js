import * as rethink from '../service/rethink'

export function serverGetInitial(userID) {
    return Promise.all(
        [
            // Current timetable (or first)
            rethink.find('users', userID)
                   .then((user) => {
                       return (user) ?
                              (user.currentTimetable) ?
                              rethink.find('timetables', user.currentTimetable) :
                              rethink.findLastIndexed('timetables', userID, 'userID')
                           : {}
                   })
                   .catch(err => {
                       console.log('Error while getting initial state:', err)
                   }),

            // Timetable list (for selector etc...)
            rethink.findIndexed('timetables', userID, 'userID')
                   .then((timetables) => (timetables) ? timetables.map((timetable) => (
                       {
                           id: timetable.id,
                           title: timetable.title
                       }
                   )) : [])
                   .catch(err => {
                       console.log('Error while getting initial state:', err)
                   }),

            // Tasks
            rethink.findIndexed('tasks', userID, 'userID')
                   .then((tasks) => tasks)
                   .catch(err => {
                       console.log('Error while getting initial state:', err)
                   }),

            // Projects
            rethink.findIndexed('projects', userID, 'userID')
                   .then((projects) => projects)
                   .catch(err => {
                       console.log('Error while getting initial state:', err)
                   }),

            // Settings
            rethink.find('users', userID)
                   .then((user) => (user) ?
                                   (user.settings) ?
                                   user.settings : {}
                       : {}
                   )
                   .catch(err => {
                       console.log('Error while getting initial state:', err)
                   })
        ]
    )
}


