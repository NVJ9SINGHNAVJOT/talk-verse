export const getDTimeStamp = (date: string) => {
    const timeStamp = new Date(date);
    let minutes = timeStamp.getMinutes().toString();
    if (minutes.length < 2) {
        minutes = "0" + minutes;
    }
    return timeStamp.toLocaleDateString() + "  " + timeStamp.getHours().toString() + ":" + minutes;
};