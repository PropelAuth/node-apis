import { UnauthorizedException, UnexpectedException } from "../../exceptions"
import { httpRequest } from "../../http"

const STEP_UP_VERIFY_GRANT_ENDPOINT_PATH = "/api/backend/v1/mfa/step-up/verify-grant"

export type VerifyStepUpGrantRequest = {
    actionType: string
    userId: string
    grant: string
}

export type StepUpMfaVerifyGrantSuccessResponse = {
    success: true
}

export type StepUpMfaVerifyGrantInvalidRequestErrorResponse = {
    success: false
    errorCode: "invalid_request_fields"
    message: string
    userFacingErrors?: { [field: string]: string }
}

export type StepUpMfaVerifyGrantStandardErrorResponse = {
    success: false
    errorCode: "grant_not_found" | "feature_gated" | "unexpected_error"
    message: string
}

export type StepUpMfaVerifyGrantErrorResponse =
    | StepUpMfaVerifyGrantInvalidRequestErrorResponse
    | StepUpMfaVerifyGrantStandardErrorResponse

export type StepUpMfaVerifyGrantResponse = StepUpMfaVerifyGrantSuccessResponse | StepUpMfaVerifyGrantErrorResponse

// POST
export function verifyStepUpGrant(
    authUrl: URL,
    integrationApiKey: string,
    verifyStepUpGrantRequest: VerifyStepUpGrantRequest
): Promise<StepUpMfaVerifyGrantResponse> {
    const request = {
        action_type: verifyStepUpGrantRequest.actionType,
        user_id: verifyStepUpGrantRequest.userId,
        grant: verifyStepUpGrantRequest.grant,
    }
    return httpRequest(
        authUrl,
        integrationApiKey,
        STEP_UP_VERIFY_GRANT_ENDPOINT_PATH,
        "POST",
        JSON.stringify(request)
    ).then((httpResponse) => {
        try {
            // Success case
            if (httpResponse.statusCode && httpResponse.statusCode < 400) {
                return {
                    success: true,
                }
            }

            const errorResponse = httpResponse.response ? JSON.parse(httpResponse.response) : {}

            if (httpResponse.statusCode === 401 || errorResponse.error_code === "unauthorized") {
                throw new UnauthorizedException("integrationApiKey is incorrect")
            } else if (errorResponse.error_code === "invalid_request_fields") {
                return {
                    success: false,
                    errorCode: "invalid_request_fields",
                    message: errorResponse.user_facing_error || "Invalid request fields",
                    userFacingErrors: errorResponse.user_facing_errors,
                }
            } else if (errorResponse.error_code === "token_not_found") {
                return {
                    success: false,
                    errorCode: "grant_not_found",
                    message: errorResponse.user_facing_error || "The grant you provided was not found",
                }
            } else if (errorResponse.error_code === "feature_gated") {
                return {
                    success: false,
                    errorCode: "feature_gated",
                    message: errorResponse.user_facing_error || "Feature is not available on current plan",
                }
            } else {
                return {
                    success: false,
                    errorCode: "unexpected_error",
                    message: errorResponse.user_facing_error || "Unexpected error occurred",
                }
            }
        } catch (error) {
            throw new UnexpectedException("Failed to parse response")
        }
    })
}
