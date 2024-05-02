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
  GET_ALL_NOTIFICATIONS: BASE_URL_SERVER + "/notification/getAllNotifications"
};