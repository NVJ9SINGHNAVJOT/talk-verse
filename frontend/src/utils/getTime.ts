export function getDTimeStamp(date: Date) {
    return date.toLocaleDateString() + "  " + date.getHours() + ":" + date.getMinutes()
}