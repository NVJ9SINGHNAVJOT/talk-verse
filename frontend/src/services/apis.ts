const BASE_URL = process.env.REACT_APP_BASE_URL_SERVER1_PART_1 as string +
                 process.env.REACT_APP_BASE_URL_SERVER1_PART_2 as string + '/' +
                 process.env.SERVER1_KEY as string

// AUTH ENDPOINTS
export const authEndPoints = {
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
}