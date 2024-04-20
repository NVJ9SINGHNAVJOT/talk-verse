
export async function fetchApi
    (
        method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "HEAD",
        url: string,
        data?: object | FormData,
        headers?: { [key: string]: string }
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    : Promise<any> {
    try {
        // only 'Content-Type' : 'application/json' header is used as input, otherwise header should be {}
        const requestHeaders = new Headers();

        if (headers) {
            Object.entries(headers ?? {}).forEach(([key, value]) => requestHeaders.append(key, value));
        }

        // Backend servers can be accessed with apikey only
        requestHeaders.append("Api_Key", process.env.SERVER1_KEY as string);

        let requestOptions: RequestInit = {
            method,
            headers: requestHeaders,
        };

        if (headers?.['Content-Type'] === 'application/json') {
            requestOptions = {
                ...requestOptions,
                body: JSON.stringify(data),
            };
        }
        else {
            requestOptions = {
                ...requestOptions,
                body: data as FormData,
            };
        }

        const response = await fetch(url, requestOptions);
        console.log("api response", response);
        if (response.ok && response.status === 200) {
            const data = await response.json();
            console.log("api data", data);
            return data;
        }
        else {
            return null;
        }
    } catch (error) {
        return null;
    }
}