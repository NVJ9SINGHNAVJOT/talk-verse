const BASE_URL_SERVER1 = process.env.REACT_APP_BASE_URL_SERVER1 as string;

// AUTH ENDPOINTS
export const authEndPoints = {
  SIGNUP_API: BASE_URL_SERVER1 + "/auth/signup",
  LOGIN_API: BASE_URL_SERVER1 + "/auth/login",
  CHECK_USER_API: BASE_URL_SERVER1 + "/auth/checkUser"
};