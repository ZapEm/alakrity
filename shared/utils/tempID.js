export function generateTempIDfromDate(dateOrMoment = new Date()) {
    return (window.performance && typeof window.performance.now === 'function')
        ? 'TEMP_ID_' + (dateOrMoment.valueOf() + performance.now() + (Math.random() * 10000)).toString() //use high-precision timer if available
        : 'TEMP_ID_' + (dateOrMoment.valueOf() + (Math.random() * 100000000)).toString()
}