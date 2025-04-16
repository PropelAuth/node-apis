import {
    BadRequestException,
    FeatureGatedException,
    IncorrectMfaCodeException,
    InvalidRequestFieldsException,
    MfaNotEnabledException,
    UnauthorizedException,
    UnexpectedException,
    UserNotFoundException,
} from "../../exceptions"
import { httpRequest } from "../../http"

const STEP_UP_VERIFY_TOTP_ENDPOINT_PATH = "/api/backend/v1/mfa/step-up/verify-totp"

export enum StepUpMfaGrantType {
    ONE_TIME_USE = "ONE_TIME_USE",
    TIME_BASED = "TIME_BASED",
}

export type VerifyTotpChallengeRequest = {
    actionType: string
    userId: string
    code: string
    grantType: StepUpMfaGrantType
    validForSeconds: number
}

export type StepUpMfaVerifyTotpResponse = {
    stepUpGrant: string
}

// POST
export function verifyStepUpTotpChallenge(
    authUrl: URL,
    integrationApiKey: string,
    verifyTotpChallengeRequest: VerifyTotpChallengeRequest
): Promise<StepUpMfaVerifyTotpResponse> {
    const request = {
        action_type: verifyTotpChallengeRequest.actionType,
        user_id: verifyTotpChallengeRequest.userId,
        code: verifyTotpChallengeRequest.code,
        grant_type: verifyTotpChallengeRequest.grantType,
        valid_for_seconds: verifyTotpChallengeRequest.validForSeconds,
    }
    return httpRequest(
        authUrl,
        integrationApiKey,
        STEP_UP_VERIFY_TOTP_ENDPOINT_PATH,
        "POST",
        JSON.stringify(request)
    ).then((httpResponse) => {
        // Success case
        if (httpResponse.statusCode && httpResponse.statusCode < 400) {
            const responseData = JSON.parse(httpResponse.response)
            return {
                stepUpGrant: responseData.step_up_grant,
            }
        }

        const errorResponse = httpResponse.response ? JSON.parse(httpResponse.response) : {}

        if (httpResponse.statusCode === 401) {
            throw new UnauthorizedException("integrationApiKey is incorrect")
        } else if (errorResponse.error_code === "user_not_found") {
            throw new UserNotFoundException()
        } else if (errorResponse.error_code === "mfa_not_enabled") {
            throw new MfaNotEnabledException()
        } else if (errorResponse.error_code === "incorrect_mfa_code") {
            throw new IncorrectMfaCodeException()
        } else if (errorResponse.error_code === "invalid_request_fields") {
            throw new InvalidRequestFieldsException(httpResponse.response)
        } else if (errorResponse.error_code === "feature_gated") {
            throw new FeatureGatedException()
        } else {
            throw new UnexpectedException("Unknown error when verifying the TOTP challenge")
        }
    })
}
