
export async function fetchApi
    (
        method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "HEAD",
        url: string,
        data?: object | FormData | null,
        headers?: { [key: string]: string } | null,
        params?: { [key: string]: string }
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    : Promise<any> {
    try {
        // only 'Content-Type' : 'application/json' header is used as input, otherwise header should be {}
        const requestHeaders = new Headers();

        if (headers) {
            Object.entries(headers ?? {}).forEach(([key, value]) => requestHeaders.append(key, value));
        }

        // Backend servers can be accessed with server key only
        requestHeaders.append("Authorization", process.env.SERVER_KEY as string);

        // parameters added to url
        if (params) {
            const searchParams = new URLSearchParams(params);
            url += `?${searchParams.toString()}`;
        }

        let requestOptions: RequestInit = {
            method,
            headers: requestHeaders,
            credentials: "include",
        };

        if (data) {
            if (headers?.["Content-Type"] === "application/json") {
                requestOptions = {
                    ...requestOptions,
                    body: JSON.stringify(data),
                };
            } else {
                requestOptions = {
                    ...requestOptions,
                    body: data as FormData,
                };
            }
        }

        const response = await fetch(url, requestOptions);

        const route = url.split('/');
        console.log(route[route.length - 2] + "/" + route[route.length - 1]);

        if (response.ok && response.status === 200) {
            const resData = await response.json();
            console.log("api data", resData);
            return resData;
        }
        else {
            console.log("api response", response);
            const resData = await response.json();
            console.log("api data", resData);
            return null;
        }

    } catch (error) {
        console.log('error in fetchapi');
        return null;
    }
}