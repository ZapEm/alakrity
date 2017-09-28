import { STATISTIC_TYPES } from '../../shared/utils/enums'
import * as rethink from './service/rethink'
import handleError from './utils/handleError'
import moment from 'moment'
import { compileGlobalStatistics, compileUserStatistics } from './utils/statisticsCompilers'

/**
 * Api function(s) to call the DB. Authentication is handled by middleware beforehand.
 * The decoded token can be found in res.locals.decoded
 * @param req
 * @param res
 */
export function getStatistics(req, res) {
    rethink.findIndexed('statistics', res.locals.decoded.id, 'userID')
           .then((response) => res.json(compileUserStatistics(response)))
           .catch(err => handleError(res, err, 400))
}

export function recordStatistic(req, res) {
    const statistic = { ...req.body, userID: res.locals.decoded.id }

    if ( !statistic.type ) {
        rethink.save('statistics', statistic)
               .then((response) => res.json(response))
               .catch(err => handleError(res, err, 400))
        return
    }



    if ( statistic.type === STATISTIC_TYPES.TASK ) {

        rethink.record('statistics', statistic)
    }
}


export function removeStatistic(req, res) {
    rethink.remove('statistics', req.params.id)
           .then((response) => res.json(response))
           .catch(err => handleError(res, err, 400))
}

export function getGlobalStatistics(req, res) {
    rethink.findIndexed('statistics', moment().startOf('isoWeek').toISOString(), 'weekDate')
           .then((response) => {
               return res.json(compileGlobalStatistics(response))
           })
           .catch(err => handleError(res, err, 400))
}




