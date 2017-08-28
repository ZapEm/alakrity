export const RESOLVED_NAME = '_SUCCESS'
export const REJECTED_NAME = '_FAILURE'


export const PROJECT_COLORS = [
    '#FFFFFF',
    '#FF6670',
    '#FFEE6F',
    '#67E588',
    '#5DC1DD',
    '#D85BCA',
    '#FFA86F',
    '#C5F66B',
    '#7785FF',
    '#A37CFF'
]

export const SPECIAL_PROJECTS = {
    CLEAR: {
        dark: '#777777',
        normal: '#cccccc',
        light: '#eeeeee'
    },
    BUFFER: {
        dark: '#5673a6',
        normal: '#8eb9ff',
        light: '#b5d1ff',
        backgroundPattern: `${generateRepeatingLinearLines(255, 255, 255, 0.4, 0, 5)}, ${generateRepeatingLinearLines(255, 255, 255, 0.4, 90, 5)}`
    },
    BREAK: {
        dark: '#48774c',
        normal: '#7ccb81',
        light: '#b9f4b7',
        backgroundPattern: `${generateRepeatingLinearLines(255, 255, 255, 0.4, 45, 3, 6)}`
    }
}

function generateRepeatingLinearLines(r, g, b, a, deg, width1, width2 = width1) {
    return `repeating-linear-gradient(${deg}deg, transparent, transparent ${width1}px, rgba(${r},${g},${b},${a}) ${width1+1}px, rgba(${r},${g},${b},${a}) ${(width1+width2+1)}px)`
}