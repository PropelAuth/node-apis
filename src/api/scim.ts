import { RateLimitedException } from "../exceptions"
import { httpRequest } from "../http"
import { ScimGroupResultPage, ScimGroup, FetchOrgScimGroupsRequest, FetchScimGroupRequest } from "../scim"
import { formatQueryParameters, parseSnakeCaseToCamelCase } from "../utils"

const SCIM_GROUPS_PATH = "/api/backend/v1/scim"

// GET
export function fetchOrgScimGroups(
    authUrl: URL,
    integrationApiKey: string,
    fetchOrgScimGroupsRequest: FetchOrgScimGroupsRequest
): Promise<ScimGroupResultPage> {
    const request = {
        page_size: fetchOrgScimGroupsRequest.pageSize,
        page_number: fetchOrgScimGroupsRequest.pageNumber,
        user_id: fetchOrgScimGroupsRequest.userId,
    }
    const queryString = formatQueryParameters(request)

    return httpRequest(
        authUrl,
        integrationApiKey,
        `${SCIM_GROUPS_PATH}/${fetchOrgScimGroupsRequest.orgId}/groups?${queryString}`,
        "GET"
    ).then((httpResponse) => {
        if (httpResponse.statusCode === 401) {
            throw new Error("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode === 429) {
            throw new RateLimitedException(httpResponse.response)
        } else if (httpResponse.statusCode && httpResponse.statusCode === 404) {
            throw new Error("Organization not found")
        } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
            throw new Error("Unknown error when fetching SCIM groups")
        }

        return parseSnakeCaseToCamelCase(httpResponse.response)
    })
}

export function fetchScimGroup(
    authUrl: URL,
    integrationApiKey: string,
    fetchScimGroupRequest: FetchScimGroupRequest
): Promise<ScimGroup> {
    return httpRequest(
        authUrl,
        integrationApiKey,
        `${SCIM_GROUPS_PATH}/${fetchScimGroupRequest.orgId}/groups/${fetchScimGroupRequest.groupId}`,
        "GET"
    ).then((httpResponse) => {
        if (httpResponse.statusCode === 401) {
            throw new Error("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode === 429) {
            throw new RateLimitedException(httpResponse.response)
        } else if (httpResponse.statusCode && httpResponse.statusCode === 404) {
            throw new Error("Organization not found")
        } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
            throw new Error("Unknown error when fetching SCIM group")
        }

        return parseSnakeCaseToCamelCase(httpResponse.response)
    })
}
