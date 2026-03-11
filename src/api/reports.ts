import { RateLimitedException } from "../exceptions"
import { httpRequest } from "../http"
import {
    ChartData,
    ChartMetric,
    ChartMetricCadence,
    OrgReport,
    OrgReportType,
    ReportPagination,
    UserReport,
    UserReportType,
} from "../reports"
import { formatQueryParameters, parseSnakeCaseToCamelCase, } from "../utils"

const USER_REPORTS_PATH = "/api/backend/v1/user_report"
const ORG_REPORTS_PATH = "/api/backend/v1/org_report"
const CHART_METRICS_PATH = "/api/backend/v1/chart_metrics"

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
        } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
            throw new Error("Unknown error when fetching the user report")
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
        } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
            throw new Error("Unknown error when fetching the org report")
        }

        return parseSnakeCaseToCamelCase(httpResponse.response)
    })
}

export function fetchChartMetricData(
    authUrl: URL,
    integrationApiKey: string,
    chartMetric: ChartMetric,
    cadence?: ChartMetricCadence,
    startDate?: Date,
    endDate?: Date,
): Promise<ChartData> {
    const request = {
        cadence: cadence,
        start_date: startDate?.toISOString().slice(0, 10), // format to YYYY-MM-DD
        end_date: endDate?.toISOString().slice(0, 10), // format to YYYY-MM-DD
    }
    const queryString = formatQueryParameters(request)
    
    return httpRequest(authUrl, integrationApiKey, `${CHART_METRICS_PATH}/${chartMetric}?${queryString}`, "GET").then((httpResponse) => {
        if (httpResponse.statusCode === 401) {
            throw new Error("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode === 429) {
            throw new RateLimitedException(httpResponse.response)
        } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
            throw new Error("Unknown error when fetching the chart metric data")
        }

        return parseSnakeCaseToCamelCase(httpResponse.response)
    })
}
