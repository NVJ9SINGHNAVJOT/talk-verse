
import { authEndPoints } from "@/services/apis";
import { makeApiRequest } from "../fetchConnector";


const {
    SIGNUP_API,
} = authEndPoints;

export const signUpApi = async (data: FormData) => {
    try {
        console.log("1", data);

        const response = await makeApiRequest('post', SIGNUP_API, data, { 'Content-Type': 'multipart/form-data' });

        console.log("respones", response);




    } catch (error) {
        console.log("error in signupapi");
    }
}; 