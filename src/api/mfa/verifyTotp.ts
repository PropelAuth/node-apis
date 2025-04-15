import { UnauthorizedException, UnexpectedException } from "../../exceptions"
import { httpRequest } from "../../http"

const STEP_UP_VERIFY_TOTP_ENDPOINT_PATH = "/api/backend/v1/mfa/step-up/verify-totp"

export enum StepUpMfaTokenType {
    ONE_TIME_USE = "ONE_TIME_USE",
    TIME_BASED = "TIME_BASED",
}

export type VerifyTotpChallengeRequest = {
    actionType: string
    userId: string
    code: string
    tokenType: StepUpMfaTokenType
    validForSeconds: number
}

export type StepUpMfaVerifyTotpSuccessResponse = {
    success: true
    stepUpGrant: string
}

export type StepUpMfaVerifyTotpInvalidRequestErrorResponse = {
    success: false
    errorCode: "invalid_request_fields"
    message: string
    userFacingErrors?: { [field: string]: string }
}

export type StepUpMfaVerifyTotpStandardErrorResponse = {
    success: false
    errorCode: "user_not_found" | "incorrect_mfa_code" | "mfa_not_enabled" | "feature_gated" | "unexpected_error"
    message: string
}

export type StepUpMfaVerifyTotpErrorResponse =
    | StepUpMfaVerifyTotpInvalidRequestErrorResponse
    | StepUpMfaVerifyTotpStandardErrorResponse

export type StepUpMfaVerifyTotpResponse = StepUpMfaVerifyTotpSuccessResponse | StepUpMfaVerifyTotpErrorResponse

// POST
export function verifyTotpChallenge(
    authUrl: URL,
    integrationApiKey: string,
    verifyTotpChallengeRequest: VerifyTotpChallengeRequest
): Promise<StepUpMfaVerifyTotpResponse> {
    const request = {
        action_type: verifyTotpChallengeRequest.actionType,
        user_id: verifyTotpChallengeRequest.userId,
        code: verifyTotpChallengeRequest.code,
        token_type: verifyTotpChallengeRequest.tokenType,
        valid_for_seconds: verifyTotpChallengeRequest.validForSeconds,
    }
    return httpRequest(
        authUrl,
        integrationApiKey,
        STEP_UP_VERIFY_TOTP_ENDPOINT_PATH,
        "POST",
        JSON.stringify(request)
    ).then((httpResponse) => {
        try {
            // Success case
            if (httpResponse.statusCode && httpResponse.statusCode < 400) {
                const responseData = JSON.parse(httpResponse.response)
                return {
                    success: true,
                    stepUpGrant: responseData.step_up_grant,
                }
            }

            const errorResponse = httpResponse.response ? JSON.parse(httpResponse.response) : {}

            if (httpResponse.statusCode === 401 || errorResponse.error_code === "unauthorized") {
                throw new UnauthorizedException("integrationApiKey is incorrect")
            } else if (errorResponse.error_code === "user_not_found") {
                return {
                    success: false,
                    errorCode: "user_not_found",
                    message: errorResponse.user_facing_error || "User not found",
                }
            } else if (errorResponse.error_code === "mfa_not_enabled") {
                return {
                    success: false,
                    errorCode: "mfa_not_enabled",
                    message: errorResponse.user_facing_error || "MFA is not enabled for this user",
                }
            } else if (errorResponse.error_code === "incorrect_mfa_code") {
                return {
                    success: false,
                    errorCode: "incorrect_mfa_code",
                    message: errorResponse.user_facing_error || "Incorrect MFA code",
                }
            } else if (errorResponse.error_code === "invalid_request_fields") {
                return {
                    success: false,
                    errorCode: "invalid_request_fields",
                    message: errorResponse.user_facing_error || "Invalid request fields",
                    userFacingErrors: errorResponse.user_facing_errors,
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
