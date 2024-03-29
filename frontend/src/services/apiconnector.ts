import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Define the apiConnector function
export const apiConnector = async (
    method: string,
    url: string,
    bodyData: object,
    headers?: object,
    params?: object
): Promise<AxiosResponse> => {
    const config: AxiosRequestConfig = {
        method,
        url,
        data: bodyData,
        headers: headers || {},
        params: params || {},
        timeout: 10000, // Set your desired timeout (in milliseconds)
    };

    try {
        const response = await axios(config);
        return response; // Return the Axios response
    } catch (error) {
        // Handle any errors (e.g., network issues, invalid response, etc.)
        console.log('Error fetching data:', error);
        throw error; // Rethrow the error if needed
    }
};
