import { LogInData } from "@/components/auth/LogIn";
import { SignUpData } from "@/components/auth/SignUp";
import { apiConnector } from "@/services/apiconnector";
import { authEndPoints } from "@/services/apis";


const {
    SIGNUP_API,
    LOGIN_API,
} = authEndPoints;


export const loginApi = async (data: LogInData) => {
    try {
        console.log("1", data);
        const response = await apiConnector("POST", LOGIN_API, { data });

        console.log("2", response);
        if (!response?.data?.success) {
            console.log("error in loginapi", response?.data);
            return;
        }

        return response?.data?.success;

    } catch (error) {
        console.log("error in loginapi", error);
        return null;
    }
};

export const signupApi = async (data: SignUpData) => {
    try {
        console.log("1", data);
        const response = await apiConnector("POST", SIGNUP_API, { data });

        console.log("2", response);
        if (!response?.data?.success) {
            console.log("error in adminlogin", response?.data);
            return;
        }

    } catch (error) {
        console.log(error);
    }
    return;
};