import { AccessTokenCreationException, RateLimitedException, UserNotFoundException } from "../exceptions"
import { httpRequest } from "../http"
import { isValidId, parseSnakeCaseToCamelCase } from "../utils"

const ENDPOINT_PATH = "/api/backend/v1/employee"

export type Employee = {
    email: string
}

export function fetchEmployeeById(authUrl: URL, integrationApiKey: string, employeeId: string): Promise<Employee | null> {
    if (!isValidId(employeeId)) {
        return Promise.resolve(null)
    }

    return httpRequest(authUrl, integrationApiKey, `${ENDPOINT_PATH}/${employeeId}`, "GET").then((httpResponse) => {
        if (httpResponse.statusCode === 401) {
            throw new Error("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode === 429) {
            throw new RateLimitedException(httpResponse.response)
        } else if (httpResponse.statusCode === 404) {
            return null
        } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
            throw new Error("Unknown error when fetching employee")
        }

        return parseSnakeCaseToCamelCase(httpResponse.response)
    })
}