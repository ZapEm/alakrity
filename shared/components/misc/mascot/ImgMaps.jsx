import { MASCOT_STATUS } from '/utils/enums'
import { getRandomItem } from '/components/misc/mascot/mascotFunctions'
import moment from 'moment'
import React from 'react'


export function getMascotImage(status) {

    if ( typeof window === 'undefined' ) {
        return <div id="mascot-image" className="mascot-image"/>
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
        ),
        [MASCOT_STATUS.HAPPY]: require('img/nap.png'),
        [MASCOT_STATUS.CHORES]: getRandomItem(
            [
                require('img/clean.png'),
                require('img/sweep.png'),
                require('img/cook.png'),
                require('img/groceries.png')
            ]
        ),
        [MASCOT_STATUS.MEET]: require('img/idea.png'),
        [MASCOT_STATUS.QUESTION]: require('img/question.png'),
        [MASCOT_STATUS.AWESOME]: require('img/awesome.png')
    }

    return <img id="mascot-image" className="mascot-image mascot-blend-in" src={urlMap[status]} alt={status}/>
}

function getIdleImg(time = moment()) {
    const hour = time.hour()

    if ( 0 <= hour && hour <= 5 ) {
        return require('img/sleep.png')
    }

    else if ( 6 <= hour && hour <= 7 ) {
        return require('img/wakeup.png')
    }

    // 9 to 21 is default, for now

    else if ( 22 <= hour && hour <= 23 ) {
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