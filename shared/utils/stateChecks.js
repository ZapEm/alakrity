export function checkWorking(state) {
    return (
        state.timetables.get('isWorking') ||
        state.tasks.get('isWorking') ||
        state.auth.get('isWorking')
    )
}