import {
    BadRequestException,
    FeatureGatedException,
    RateLimitedException,
    UnauthorizedException,
    UnexpectedException,
} from "../../exceptions"
import { httpRequest } from "../../http"

const STEP_UP_VERIFY_GRANT_ENDPOINT_PATH = "/api/backend/v1/mfa/step-up/verify-grant"

export type VerifyStepUpGrantRequest = {
    actionType: string
    userId: string
    grant: string
}

export type StepUpMfaVerifyGrantResponse = {
    success: boolean
}

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
        // Success case
        if (httpResponse.statusCode && httpResponse.statusCode < 400) {
            return {
                success: true,
            }
        }

        let errorResponse: any = {}
        try {
            errorResponse = httpResponse.response ? JSON.parse(httpResponse.response) : {}
        } catch (e) {
            console.error("Failed to parse error response", e)
            errorResponse = {}
        }

        if (httpResponse.statusCode === 401 || errorResponse.error_code === "unauthorized") {
            throw new UnauthorizedException("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode === 429) {
            throw new RateLimitedException(httpResponse.response)
        } else if (errorResponse.error_code === "invalid_request_fields") {
            const fieldToErrors = errorResponse.field_errors || {}
            if (fieldToErrors["grant"] == "grant_not_found") {
                return {
                    success: false,
                }
            } else {
                throw new BadRequestException(httpResponse.response)
            }
        } else if (errorResponse.error_code === "feature_gated") {
            throw new FeatureGatedException()
        } else {
            throw new UnexpectedException("Unknown error when verifying step up grant")
        }
    })
}
