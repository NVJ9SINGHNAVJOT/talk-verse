export const getDTimeStamp = (date: string) => {
    const timeStamp = new Date(date);
    return timeStamp.toLocaleDateString() + "  " + timeStamp.getHours() + ":" + timeStamp.getMinutes();
};