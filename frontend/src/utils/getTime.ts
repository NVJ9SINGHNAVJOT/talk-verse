export const getDTimeStamp = (date: Date) => {
    return date.toLocaleDateString() + "  " + date.getHours() + ":" + date.getMinutes();
};