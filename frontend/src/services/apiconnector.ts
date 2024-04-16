import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Define the apiConnector function
export const apiConnector = async (
    method: string,
    url: string,
    bodyData: object,
    headers?: object,
    params?: object
): Promise<AxiosResponse<unknown>> => {
    const config: AxiosRequestConfig = {
        method,
        url,
        data: bodyData || {},
        headers: headers || {},
        params: params || {},
        timeout: 10000, // Set your desired timeout (in milliseconds)
    };

    const response = await axios(config)
        .then((respone) => {
            if (respone.status < 400) {
                return respone;
            }
        })
        .catch((response) => {
            return response;
        });
    return response
};
