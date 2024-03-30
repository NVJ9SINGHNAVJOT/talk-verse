import { LogInData } from "@/components/auth/LogIn";
import { SignUpData } from "@/components/auth/SignUp";
import { apiConnector } from "@/services/apiconnector"
import { authEndpoints } from "@/services/apis"


const {
    SIGNUP_API,
    LOGIN_API,
} = authEndpoints;


export const loginApi = async (data: LogInData) => {
    try {
        console.log("1", data)
        const response = await apiConnector("POST", LOGIN_API, { data });

        console.log("2", response)
        if (!response?.data?.success) {
            console.log("error in adminlogin", response?.data);
            return;
        }

    } catch (error) {
        console.log(error)
    }
    return;
}

export const signupApi = async (data: SignUpData) => {
    try {
        console.log("1", data)
        const response = await apiConnector("POST", SIGNUP_API, { data });

        console.log("2", response)
        if (!response?.data?.success) {
            console.log("error in adminlogin", response?.data);
            return;
        }

    } catch (error) {
        console.log(error)
    }
    return;
}