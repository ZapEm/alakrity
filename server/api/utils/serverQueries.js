import * as rethink from '../service/rethink'

export function serverGetInitial(userID) {
    return Promise.all(
        [
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

            rethink.findIndexed('tasks', userID, 'userID')
                   .then((tasks) => tasks)
                   .catch(err => {
                       console.log('Error while getting initial state:', err)
                   }),

            rethink.findIndexed('projects', userID, 'userID')
                   .then((projects) => projects)
                   .catch(err => {
                       console.log('Error while getting initial state:', err)
                   })
        ]
    )
}


