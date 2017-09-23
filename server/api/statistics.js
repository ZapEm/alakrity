import { STATISTIC_TYPES } from '../../shared/utils/enums'
import * as rethink from './service/rethink'
import handleError from './utils/handleError'

/**
 * Api function(s) to call the DB. Authentication is handled by middleware beforehand.
 * The decoded token can be found in res.locals.decoded
 * @param req
 * @param res
 */
export function getStatistics(req, res) {
    rethink.findIndexed('statistics', res.locals.decoded.id, 'userID')
           .then((response) => res.json(response))
           .catch(err => handleError(res, err, 400))
}

// export function addStatistic(req, res) {
//     const statistic = { ...req.body, userID: res.locals.decoded.id }
//     rethink.save('statistics', statistic)
//            .then((response) => res.json(response))
//            .catch(err => handleError(res, err, 400))
// }

export function recordStatistic(req, res) {
    const statistic = { ...req.body, userID: res.locals.decoded.id }

    console.log(statistic)

    if ( !statistic.type ) {
        rethink.save('statistics', statistic)
               .then((response) => res.json(response))
               .catch(err => handleError(res, err, 400))
        return
    }



    if ( statistic.type === STATISTIC_TYPES.TASK ) {

        rethink.record('statistics', statistic)

        // if ( rethink.has('statistics', statistic.id) ) {
        //     rethink.edit('statistics', statistic.id, statistic)
        //            .then((response) => {
        //                console.log('$$edited', response)
        //                return res.json(response)
        //            })
        //            .catch(err => handleError(res, err, 400))
        // } else {
        //     rethink.save('statistics', statistic)
        //            .then((response) => {
        //                console.log('@@saved', response)
        //                return res.json(response)
        //            })
        //            .catch(err => handleError(res, err, 400))
        //
        // }
    }
}

// export function editStatistic(req, res) {
//     const statistic = { ...req.body, userID: res.locals.decoded.id }
//     rethink.edit('statistics', statistic.id, statistic)
//            .then((response) => res.json(response))
//            .catch(err => handleError(res, err, 400))
// }

export function removeStatistic(req, res) {
    rethink.remove('statistics', req.params.id)
           .then((response) => res.json(response))
           .catch(err => handleError(res, err, 400))
}

export function getGlobalStatistics(req, res) {
    rethink.findAll('statistics')
           .then((response) => {
               // TODO: compile response!
               console.log('NOT YET IMPLEMENTED!')
               return res.json({ message: 'NOT YET IMPLEMENTED!' })
           })
           .catch(err => handleError(res, err, 400))
}




