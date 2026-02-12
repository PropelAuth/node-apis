import {
    ApiKeyCreateException,
    ApiKeyDeleteException,
    ApiKeyFetchException,
    ApiKeyUpdateException,
    ApiKeyValidateException,
    ApiKeyValidateRateLimitedException,
    RateLimitedException,
    ApiKeyImportException
} from "../exceptions"
import { httpRequest } from "../http"
import { OrgReport, OrgReportType, ReportPagination, UserReport, UserReportType } from "../reports"
import { ApiKeyFull, ApiKeyNew, ApiKeyResultPage, ApiKeyValidation } from "../user"
import { formatQueryParameters, isValidHex, parseSnakeCaseToCamelCase, removeBearerIfExists } from "../utils"

const USER_REPORTS_PATH = "/api/backend/v1/user_report"
const ORG_REPORTS_PATH = "/api/backend/v1/org_report"

// GET
export function fetchUserReport(
    authUrl: URL,
    integrationApiKey: string,
    reportType: UserReportType,
    reportInterval?: string,
    pagination?: ReportPagination,
): Promise<UserReport> {
    const request = {
        report_interval: reportInterval,
        page_size: pagination?.pageSize,
        page_number: pagination?.pageNumber,
    }
    const queryString = formatQueryParameters(request)
    
    return httpRequest(authUrl, integrationApiKey, `${USER_REPORTS_PATH}/${reportType}?${queryString}`, "GET").then((httpResponse) => {
        if (httpResponse.statusCode === 401) {
            throw new Error("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode === 429) {
            throw new RateLimitedException(httpResponse.response)
        } else if (httpResponse.statusCode === 400) {
            throw new ApiKeyFetchException(httpResponse.response)
        } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
            throw new Error("Unknown error when creating the end user api key")
        }

        return parseSnakeCaseToCamelCase(httpResponse.response)
    })
}
export function fetchOrgReport(
    authUrl: URL,
    integrationApiKey: string,
    reportType: OrgReportType,
    reportInterval?: string,
    pagination?: ReportPagination,
): Promise<OrgReport> {
    const request = {
        report_interval: reportInterval,
        page_size: pagination?.pageSize,
        page_number: pagination?.pageNumber,
    }
    const queryString = formatQueryParameters(request)
    
    return httpRequest(authUrl, integrationApiKey, `${ORG_REPORTS_PATH}/${reportType}?${queryString}`, "GET").then((httpResponse) => {
        if (httpResponse.statusCode === 401) {
            throw new Error("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode === 429) {
            throw new RateLimitedException(httpResponse.response)
        } else if (httpResponse.statusCode === 400) {
            throw new ApiKeyFetchException(httpResponse.response)
        } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
            throw new Error("Unknown error when creating the end user api key")
        }

        return parseSnakeCaseToCamelCase(httpResponse.response)
    })
}
