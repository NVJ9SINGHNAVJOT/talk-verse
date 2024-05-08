export const clientE = {

    USER_REQUEST: "USER_REQUEST",
    REQUEST_ACCEPTED: "REQUEST_ACCEPTED",
    ADDED_IN_GROUP: "ADDED_IN_GROUP",

    MESSAGE_RECIEVED: "MESSAGE_RECIEVED",
    GROUP_MESSAGE_RECIEVED: "GROUP_MESSAGE_RECIEVED",

    // below both events are only triggered when user is onffline from server only
    SET_USER_ONLINE: "SET_USER_ONLINE",
    SET_USER_OFFLINE: "SET_USER_OFFLINE",

    // for below events their is only friendId: string is passed as parameter in function 
    OTHER_START_TYPING: "OTHER_START_TYPING",
    OTHER_STOP_TYPING: "OTHER_STOP_TYPING",
};

export const serverE = {

    SEND_MESSAGE: "SEND_MESSAGE",
    SEND_GROUP_MESSAGE: "SEND_GROUP_MESSAGE",

    // for below events their is only friendId: string is passed as parameter in function 
    START_TYPING: "START_TYPING",
    STOP_TYPING: "STOP_TYPING",
};