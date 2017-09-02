import moment from 'moment'
import { DndTypes } from '../../utils/enums'

const CELL_WIDTH = 113
const CELL_HEIGHT = 22.5
const HALF_CELL_WIDTH = CELL_WIDTH / 2
const HALF_CELL_HEIGHT = CELL_HEIGHT / 2

export function getTargetDate(offset) {
    return moment(document.elementFromPoint(offset.x + HALF_CELL_WIDTH, offset.y + HALF_CELL_HEIGHT).getAttribute('datetime'))
}


/**
 * DnD snap functions
 * @param dndType from utils/constants
 * @param offset = {x, y}, (sourceClientOffset)
 * @returns snapped = { offset: {x, y}, show: boolean }, show is true if offset
 * was processed (not necessarily different) and the preview should be shown.
 */
export function getSnappedOffset(dndType, offset) {
    if ( !dndType ) {
        return { offset: offset, show: false }
    }

    const snapFunctions = {
        [DndTypes.TASK]: snapIfInBounds
        // [DndTypes.HANDLE]: snapY
    }
    return snapFunctions[dndType](offset)
}

function snapIfInBounds(offset) {
    const boundingElement = document.getElementById('tt-content-dnd')
    if ( !boundingElement ) {
        return { offset: offset, show: false }
    }
    const bounds = boundingElement.getBoundingClientRect()

    offset.x -= bounds.left
    offset.y -= bounds.top

    const snappedX = ( Math.round(offset.x / CELL_WIDTH) * CELL_WIDTH ) + 1
    const snappedY = Math.round(offset.y / CELL_HEIGHT) * CELL_HEIGHT

    if ( snappedX + HALF_CELL_WIDTH > 0 &&
        snappedX + HALF_CELL_WIDTH < bounds.right - bounds.left &&
        snappedY + HALF_CELL_HEIGHT > 0 &&
        snappedY + HALF_CELL_HEIGHT < bounds.bottom - bounds.top ) {
        return { offset: { x: snappedX, y: snappedY }, show: true }
    } else {
        return { offset: offset, show: true }
    }
}

// function snapY(offset) {
//     offset.y = Math.round(offset.y / CELL_HEIGHT) * CELL_HEIGHT
//     return { offset: offset, show: false }
// }

export function getDurationDelta(differenceFromInitialOffset) {
    return Math.round(differenceFromInitialOffset.y / CELL_HEIGHT) * 30
}