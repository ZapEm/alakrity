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

export const MASCOT_TIPS = [
    'Take regular short breaks, but be aware of time sinks like "I\'ll just browse a bit on the internet" or "a few minutes of TV".',
    'Taking a short walk is a good way to clear your head.',
    'Regular sporting activity has shown to help with improving the ability to concentrate. Don\'t forget to plan for it in your schedule.',
    'Remember to be generous when planning your tasks. Multiply your guess by 1.5 or even 2!',
    'Update the next weeks schedule in advance. Create a repeating task for it, so you won\'t forget!',
    'Some cats can sleep more than 27 hours in a single day. Harness this ancient power of the cats! Have plenty of sleep, take naps, catch a few mice!',
    'You are free to use not-tracked projects as you see fit. But you should at least somehow mark the time you spend on these projects in your timetable. Even if you only paint in the time periods or just create a repeating task.',
    'You don\'t have to create every task of a project at the beginning. It is best to update your tasks dynamically. You could even use "special tasks" to mark tasks that need to be split up further.',
    'Be as precise as possible when naming tasks, so you won\'t have to think about what need to do and can start working immediately.'
]

function generateRepeatingLinearLines(r, g, b, a, deg, width1, width2 = width1) {
    return `repeating-linear-gradient(${deg}deg, transparent, transparent ${width1}px, rgba(${r},${g},${b},${a}) ${width1 + 1}px, rgba(${r},${g},${b},${a}) ${(width1 + width2 + 1)}px)`
}
