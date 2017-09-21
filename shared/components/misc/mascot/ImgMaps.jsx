import { MASCOT_STATUS } from '/utils/enums'
import { getRandomItem } from '/utils/helpers'
import moment from 'moment'
import React from 'react'


export function getMascotImage(status) {

    if ( typeof window === 'undefined' ) {
        return <div className="mascot-image"/>
    }

    const urlMap = {
        [MASCOT_STATUS.IDLE]: getIdleImg(),
        [MASCOT_STATUS.BREAK]: require('img/nap.png'),
        [MASCOT_STATUS.WORK]: require('img/work.png'),
        [MASCOT_STATUS.STRESS]: require('img/stress.png'),
        [MASCOT_STATUS.GOODWORK]: require('img/goodwork.png'),
        [MASCOT_STATUS.STATISTICS]: require('img/statistics.png'),
        [MASCOT_STATUS.IDEA]: require('img/idea.png'),
        [MASCOT_STATUS.BACK]: require('img/back.png'),
        [MASCOT_STATUS.SLEEP]: require('img/sleep.png'),
        [MASCOT_STATUS.HI]: require('img/hi.png'),
        [MASCOT_STATUS.BYE]: require('img/bye.png'),
        [MASCOT_STATUS.DENIED]: require('img/denied.png'),
        [MASCOT_STATUS.SPORT]: getRandomItem(
            [
                require('img/sport1.png'),
                require('img/sport2.png'),
                require('img/sport3.png'),
                require('img/sport4.png')
            ]
        )
    }

    return <img className="mascot-image" src={urlMap[status]} alt={status}/>
}

function getIdleImg(time = moment()) {
    const hour = time.hour()

    if ( 0 <= hour && hour <= 5 ) {
        return require('img/sleep.png')
    }
    else if ( 6 <= hour && hour <= 7 ) {
        return require('img/wakeup.png')
    }

    // 9 to 18 is default

    else if ( 19 <= hour && hour <= 22 ) {
        return require('img/goodwork.png') // TODO: appropriate img
    }
    else if ( hour === 23 ) {
        return require('img/tired.png')
    }
    // default
    return getRandomItem(
        [
            require('img/idle1.png'),
            require('img/idle2.png')
        ]
    )
}