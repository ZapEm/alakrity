import { MASCOT_STATUS } from '/utils/enums'
import { getRandomItem } from '/utils/helpers'
import React from 'react'


export function getMascotImage(status) {

    if ( typeof window === 'undefined' ) {
        return <div className="mascot-image"/>
    }

    const urlMap = {
        [MASCOT_STATUS.IDLE]: getRandomItem(
            [
                require('img/idle1.png'),
                require('img/idle2.png')
            ]
        ),
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