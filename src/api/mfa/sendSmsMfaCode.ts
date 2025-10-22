import {
    BadRequestException,
    FeatureGatedException,
    RateLimitedException,
    UnauthorizedException,
    UnexpectedException,
} from "../../exceptions"
import { httpRequest } from "../../http"
import { parseSnakeCaseToCamelCase } from "../../utils"
import { StepUpMfaGrantType } from "./verifyTotp"

const ENDPOINT_PATH = "/api/backend/v1/mfa/step-up/phone/send"

export type SendSmsMfaCodeRequest = {
    actionType: string
    userId: string
    mfaPhoneId: string
    grantType: StepUpMfaGrantType
    validForSeconds: number
}

export type SendSmsMfaCodeRequestResponse = {
    challengeId: string
}

// POST
export function sendSmsMfaCode(
    authUrl: URL,
    integrationApiKey: string,
    sendSmsMfaCodeRequest: SendSmsMfaCodeRequest
): Promise<SendSmsMfaCodeRequestResponse> {
    const request = {
        action_type: sendSmsMfaCodeRequest.actionType,
        user_id: sendSmsMfaCodeRequest.userId,
        mfa_phone_id: sendSmsMfaCodeRequest.mfaPhoneId,
        grant: sendSmsMfaCodeRequest.grantType,
        valid_for_seconds: sendSmsMfaCodeRequest.validForSeconds,
    }
    
    return httpRequest(
        authUrl,
        integrationApiKey,
        ENDPOINT_PATH,
        "POST",
        JSON.stringify(request)
    ).then((httpResponse) => {
        // Success case
        if (httpResponse.statusCode && httpResponse.statusCode < 400) {
            return parseSnakeCaseToCamelCase(httpResponse.response)
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
            throw new UnexpectedException("Unknown error when sending sms mfa code")
        }
    })
}
