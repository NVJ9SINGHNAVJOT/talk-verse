import { authEndPoints } from "@/services/apis";
import { fetchApi } from "@/services/fetchApi";
import { CheckUserRs } from "@/types/apis/authApiRs";
import { CommonRs } from "@/types/apis/common";

export const signUpApi = async (data: FormData): Promise<boolean> => {
  try {
    const resData: CommonRs = await fetchApi("POST", authEndPoints.SIGNUP, data);
    if (resData && resData.success === true) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const sendOtpApi = async (email: string): Promise<boolean> => {
  try {
    const resData: CommonRs = await fetchApi(
      "POST",
      authEndPoints.OTP,
      { email: email },
      { "Content-Type": "application/json" }
    );
    if (resData && resData.success === true) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const logInApi = async (data: object): Promise<CheckUserRs | null> => {
  try {
    const resData: CheckUserRs = await fetchApi("POST", authEndPoints.LOGIN, data, {
      "Content-Type": "application/json",
    });
    if (resData) {
      return resData;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const checkUserApi = async (): Promise<CheckUserRs | null> => {
  try {
    const resData: CheckUserRs = await fetchApi("GET", authEndPoints.CHECK_USER);
    if (resData && resData.success === true) {
      return resData;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const logOutApi = async (): Promise<boolean> => {
  try {
    const resData: CommonRs = await fetchApi("DELETE", authEndPoints.LOGOUT);
    if (resData && resData.success === true) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
