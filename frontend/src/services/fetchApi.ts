export async function fetchApi(
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "HEAD",
  url: string,
  data?: object | FormData | null,
  headers?: { [key: string]: string } | null,
  params?: { [key: string]: string } // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
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

    if (response.ok && response.status === 200) {
      const resData = await response.json();
      return resData;
    }
    return null;
  } catch (error) {
    return null;
  }
}
