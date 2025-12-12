import { type LogInData } from "@/components/auth/LogIn";
import { type ChangePassword } from "@/components/core/profile/Settings";
import { type NewPassword } from "@/pages/ResetPassword";
import { authEndPoints } from "@/services/apis";
import { fetchApi } from "@/services/fetchApi";
import { type CheckUserRs } from "@/types/apis/authApiRs";
import { type CommonRs } from "@/types/apis/common";

export const signUpApi = async (data: FormData): Promise<CommonRs | null> => {
  const resData: CommonRs = await fetchApi("POST", authEndPoints.SIGNUP, data);
  if (resData) {
    return resData;
  }
  return null;
};

export const sendOtpApi = async (email: string, newUser: "yes" | "no"): Promise<CommonRs | null> => {
  const resData: CommonRs = await fetchApi(
    "POST",
    authEndPoints.OTP,
    { email: email, newUser: newUser },
    { "Content-Type": "application/json" }
  );
  if (resData) {
    return resData;
  }
  return null;
};

export const logInApi = async (data: LogInData): Promise<CheckUserRs | null> => {
  const resData: CheckUserRs = await fetchApi("POST", authEndPoints.LOGIN, data, {
    "Content-Type": "application/json",
  });
  if (resData) {
    return resData;
  }
  return null;
};

export const checkUserApi = async (): Promise<CheckUserRs | null> => {
  const resData: CheckUserRs = await fetchApi("GET", authEndPoints.CHECK_USER);
  if (resData && resData.success === true) {
    return resData;
  }
  return null;
};

export const logOutApi = async (): Promise<boolean> => {
  const resData: CommonRs = await fetchApi("DELETE", authEndPoints.LOGOUT);
  if (resData && resData.success === true) {
    return true;
  }
  return false;
};

export const changePasswordApi = async (data: ChangePassword): Promise<CommonRs | null> => {
  const resData: CommonRs = await fetchApi("POST", authEndPoints.CHANGE_PASSWORD, data, {
    "Content-Type": "application/json",
  });
  if (resData) {
    return resData;
  }
  return null;
};

export const verifyOtpApi = async (email: string, otp: string): Promise<CommonRs | null> => {
  const resData: CommonRs = await fetchApi(
    "PUT",
    authEndPoints.VERIFY_OTP,
    { email: email, otp: otp },
    {
      "Content-Type": "application/json",
    }
  );
  if (resData) {
    return resData;
  }
  return null;
};

export const resetPasswordApi = async (data: NewPassword): Promise<CommonRs | null> => {
  const resData: CommonRs = await fetchApi("POST", authEndPoints.RESET_PASSWORD, data, {
    "Content-Type": "application/json",
  });
  if (resData) {
    return resData;
  }
  return null;
};
