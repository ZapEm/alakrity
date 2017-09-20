import React from 'react'
import { MASCOT_STATUS } from '../../utils/enums'
import { getRandomItem } from '../../utils/helpers'


// export const urlMap = {
//     [MASCOT_STATUS.IDLE]: getRandomItem(['/idle1.png', '/idle2.png']),
//     [MASCOT_STATUS.BREAK]: '/nap.png',
//     [MASCOT_STATUS.WORK]: '/work.png',
//     [MASCOT_STATUS.STRESS]: '/stress.png',
//     [MASCOT_STATUS.GOODWORK]: '/goodwork.png',
//     [MASCOT_STATUS.STATISTICS]: '/statistics.png',
//     [MASCOT_STATUS.IDEA]: '/idea.png',
//     [MASCOT_STATUS.BACK]: '/back.png',
//     [MASCOT_STATUS.SLEEP]: '/sleep.png',
//     [MASCOT_STATUS.HI]: '/hi.png',
//     [MASCOT_STATUS.BYE]: '/bye.png',
//     [MASCOT_STATUS.DENIED]: '/denied.png',
//     [MASCOT_STATUS.SPORT]: '/sport' + getRandomItem(['1', '2', '3', '4']) + '.png'
// }

export function getMascotImage(status) {

    if ( typeof window === 'undefined' ) {
        return <div className="mascot-image" />
    }

    const urlMap = {
        [MASCOT_STATUS.IDLE]: require('../../static/png/'+ getRandomItem(['idle1', 'idle2']) + '.png'),
        [MASCOT_STATUS.BREAK]: require('../../static/png/nap.png'),
        [MASCOT_STATUS.WORK]: require('../../static/png/work.png'),
        [MASCOT_STATUS.STRESS]: require('../../static/png/stress.png'),
        [MASCOT_STATUS.GOODWORK]: require('../../static/png/goodwork.png'),
        [MASCOT_STATUS.STATISTICS]: require('../../static/png/statistics.png'),
        [MASCOT_STATUS.IDEA]: require('../../static/png/idea.png'),
        [MASCOT_STATUS.BACK]: require('../../static/png/back.png'),
        [MASCOT_STATUS.SLEEP]: require('../../static/png/sleep.png'),
        [MASCOT_STATUS.HI]: require('../../static/png/hi.png'),
        [MASCOT_STATUS.BYE]: require('../../static/png/bye.png'),
        [MASCOT_STATUS.DENIED]: require('../../static/png/denied.png'),
        [MASCOT_STATUS.SPORT]: require('../../static/png/' + getRandomItem(['sport1', 'sport2', 'sport3', 'sport4']) + '.png')
    }

    return <img className="mascot-image" src={urlMap[status]} alt={status}/>
}