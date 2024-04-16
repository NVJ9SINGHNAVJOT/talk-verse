/* eslint-disable no-unused-vars */
export const makeApiRequest = async (
    method: string,
    url: string,
    data?: object,
    headers?: Record<string, string>,
    params?: Record<string, string>
): Promise<Response> => {

    const requestOptions: RequestInit = {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
    };

    // Construct the URL with query parameters
    const urlWithParams = new URL(url);
    for (const param in params) {
        urlWithParams.searchParams.append(param, params[param]);
    }


    const response = await fetch(urlWithParams.toString(), requestOptions);

    return response;

};

// Example usage:
// const SIGNUP_API = 'https://example.com/api/signup';
// const data = { username: 'user123', password: 'secret' };
// const headers = { 'Content-Type': 'application/json' };
// const params = { lang: 'en', source: 'web' };

// try {
//     const response = await makeApiRequest('POST', SIGNUP_API, data, headers, params);
//     console.log('Response:', response);
// } catch (error) {
//     console.error('Error:', error.message);
// }
