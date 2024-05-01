const BASE_URL_SERVER1 = process.env.REACT_APP_BASE_URL_SERVER1 as string;

// AUTH ENDPOINTS
export const authEndPoints = {
  SIGNUP: BASE_URL_SERVER1 + "/auth/signup",
  LOGIN: BASE_URL_SERVER1 + "/auth/login",
  CHECK_USER: BASE_URL_SERVER1 + "/auth/checkUser"
};

export const notificationEndPoints = {
  GET_USERS: BASE_URL_SERVER1 + "/notification/getUsers",
  SEND_REQUEST: BASE_URL_SERVER1 + "/notification/sendRequest",
  GET_ALL_NOTIFICATIONS: BASE_URL_SERVER1 + "/notification/getAllNotifications"
};