const BACKEND_API_BASE_URL = "https://propelauth-api.com";

export type HttpResponse = {
    statusCode?: number
    response: string
}

export function httpRequest(
    authUrlOrigin: URL,
    apiKey: string,
    path: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    body?: string
): Promise<HttpResponse> {
    let headers: any = {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
        "X-Propelauth-url": authUrlOrigin.hostname,
    }

    return fetch(BACKEND_API_BASE_URL + path, {
        method,
        headers,
        body,
    }).then((response) => {
        return response.text().then((res) => {
            return {
                statusCode: response.status,
                response: res,
            }
        })
    })
}
