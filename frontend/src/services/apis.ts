const BASE_URL_SERVER = process.env.REACT_APP_BASE_URL_SERVER as string;

// AUTH ENDPOINTS
export const authEndPoints = {
  SIGNUP: BASE_URL_SERVER + "/auth/signup",
  LOGIN: BASE_URL_SERVER + "/auth/login",
  CHECK_USER: BASE_URL_SERVER + "/auth/checkUser"
};

export const notificationEndPoints = {
  GET_USERS: BASE_URL_SERVER + "/notification/getUsers",
  SEND_REQUEST: BASE_URL_SERVER + "/notification/sendRequest",
  GET_ALL_NOTIFICATIONS: BASE_URL_SERVER + "/notification/getAllNotifications",
  ACCEPT_REQUEST: BASE_URL_SERVER + "/notification/acceptRequest",
  CREATE_GROUP: BASE_URL_SERVER + "/notification/createGroup",
  CHECK_ONLINE_FRIENDS: BASE_URL_SERVER + "/notification/checkOnlineFriends",
  SET_UNSEEN_COUNT: BASE_URL_SERVER + "/notification/setUnseenCount",
  SET_ORDER: BASE_URL_SERVER + "/notification/setOrder"
};

export const chatEndPoints = {
  CHAT_BAR_DATA: BASE_URL_SERVER + "/chat/chatBarData",
  CHAT_MESSAGES: BASE_URL_SERVER + "/chat/chatMessages",
  GROUP_MESSAGES: BASE_URL_SERVER + "/chat/groupMessages",
  FILE_MESSAGE: BASE_URL_SERVER + "/chat/fileMessage",
};