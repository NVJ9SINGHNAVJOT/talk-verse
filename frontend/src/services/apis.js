const BASE_URL = process.env.REACT_APP_BASE_URL

// AUTH ENDPOINTS
export const authEndpoints = {
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
}