import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { authEndpoints } from "../apis"

const {
    SIGNUP_API,
    LOGIN_API,
} = authEndpoints


export const adminLogin = async(data) => {
    try {
        console.log("1", data)
        const response = await apiConnector("POST", LOGIN_API, {data})
        
        console.log("2", response)
        if(!response?.data?.success){
            console.log("error in adminlogin", response?.data);
            return;
        }

    } catch (error) {
        console.log(error)
    }
    return;
}