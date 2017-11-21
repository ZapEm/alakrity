export const RESOLVED_NAME = '_SUCCESS'
export const REJECTED_NAME = '_FAILURE'


export const PROJECT_COLORS = [
    '#75a3ff',  // 0
    '#ff737c',  // 1
    '#ffe369',  // 2
    '#67E588',  // 3
    '#5DC1DD',  // 4
    '#D85BCA',  // 5
    '#FFA86F',  // 6
    '#C5F66B',  // 7
    '#8080ff',  // 8
    '#A37CFF'   // 9
]

export const SPECIAL_PROJECTS = Object.freeze(
    {
        _CLEAR: {
            title: 'Clear',
            key: '_CLEAR',
            dark: '#777777',
            normal: '#cccccc',
            light: '#eeeeee'
        },
        _BUFFER: {
            title: 'Buffer',
            key: '_BUFFER',
            dark: '#5673a6',
            normal: '#8eb9ff',
            light: '#b5d1ff',
            backgroundPattern: `${generateRepeatingLinearLines(255, 255, 255, 0.4, 0, 5)}, ${generateRepeatingLinearLines(255, 255, 255, 0.4, 90, 5)}`
        },
        _BREAK: {
            title: 'Break',
            key: '_BREAK',
            dark: '#48774c',
            normal: '#7ccb81',
            light: '#b9f4b7',
            backgroundPattern: `${generateRepeatingLinearLines(255, 255, 255, 0.4, 45, 3, 6)}`
        }
    }
)

export const TASK_TYPES = Object.freeze(
    {
        standard: 0,
        oneTime: 1,
        repeating: 2
    }
)

export const DANGER_LEVELS = Object.freeze(
    {
        DEFAULT: {
            both: ' w3-text-theme w3-hover-theme ',
            hover: ' w3-text-theme w3-hover-theme '
        },
        SAFE: {
            both: ' w3-text-green w3-hover-green ',
            hover: ' w3-text-theme w3-hover-green '
        },
        WARN: {
            both: ' w3-text-deep-orange w3-hover-deep-orange ',
            hover: ' w3-text-theme w3-hover-deep-orange '
        },
        DANGER: {
            both: ' w3-text-pink w3-hover-pink ',
            hover: ' w3-text-theme w3-hover-pink '
        },
        DISABLED: {
            both: ' w3-text-gray '
        }
    }
)



export const LOCALE_STRINGS = Object.freeze(
    {
        en: {
            hours: ' hours',
            dateFormat: 'MMM, D.',
            changeFrom: 'Change to German date/time format'
        },
        de: {
            hours: ' Stunden',
            dateFormat: 'D. MMM',
            changeFrom: 'Change to US date/time format'
        }
    }
)

function generateRepeatingLinearLines(r, g, b, a, deg, width1, width2 = width1) {
    return `repeating-linear-gradient(${deg}deg, transparent, transparent ${width1}px, rgba(${r},${g},${b},${a}) ${width1 + 1}px, rgba(${r},${g},${b},${a}) ${(width1 + width2 + 1)}px)`
}
