import { MigrateUserException, RateLimitedException, MigrateUserPasswordException } from "../exceptions"
import { httpRequest } from "../http"
import { CreatedUser } from "../user"
import { isValidId, parseSnakeCaseToCamelCase } from "../utils"

const ENDPOINT_PATH = "/api/backend/v1/migrate_user"

// POST
export type MigrateUserFromExternalSourceRequest = {
    email: string
    emailConfirmed: boolean

    existingUserId?: string
    existingPasswordHash?: string
    existingMfaBase32EncodedSecret?: string
    askUserToUpdatePasswordOnLogin?: boolean

    enabled?: boolean

    firstName?: string
    lastName?: string
    username?: string
    pictureUrl?: string
    properties?: { [key: string]: any }
}

export function migrateUserFromExternalSource(
    authUrl: URL,
    integrationApiKey: string,
    migrateUserFromExternalSourceRequest: MigrateUserFromExternalSourceRequest
): Promise<CreatedUser> {
    const {
        email,
        emailConfirmed: email_confirmed,
        existingUserId: existing_user_id,
        existingPasswordHash: existing_password_hash,
        existingMfaBase32EncodedSecret: existing_mfa_base32_encoded_secret,
        askUserToUpdatePasswordOnLogin: update_password_required,
        enabled,
        firstName: first_name,
        lastName: last_name,
        username,
        pictureUrl: picture_url,
        properties,
    } = migrateUserFromExternalSourceRequest
    const request = {
        email,
        email_confirmed,

        existing_user_id,
        existing_password_hash,
        existing_mfa_base32_encoded_secret,
        update_password_required,

        enabled,

        first_name,
        last_name,
        username,
        picture_url,
        properties,
    }
    return httpRequest(authUrl, integrationApiKey, `${ENDPOINT_PATH}/`, "POST", JSON.stringify(request)).then(
        (httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 429) {
                throw new RateLimitedException(httpResponse.response)
            } else if (httpResponse.statusCode === 400) {
                throw new MigrateUserException(httpResponse.response)
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when migrating user")
            }

            return parseSnakeCaseToCamelCase(httpResponse.response)
        }
    )
}

export type MigrateUserPasswordRequest = {
    userId: string
    passwordHash: string
}

export function migrateUserPassword(
    authUrl: URL,
    integrationApiKey: string,
    migrateUserPasswordRequest: MigrateUserPasswordRequest
): Promise<boolean> {
    if (!isValidId(migrateUserPasswordRequest.userId)) {
        return Promise.resolve(false)
    }

    const request = {
        user_id: migrateUserPasswordRequest.userId,
        password_hash: migrateUserPasswordRequest.passwordHash,
    }
    return httpRequest(authUrl, integrationApiKey, `${ENDPOINT_PATH}/password`, "POST", JSON.stringify(request)).then(
        (httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 429) {
                throw new RateLimitedException(httpResponse.response)
            } else if (httpResponse.statusCode === 400) {
                throw new MigrateUserPasswordException(httpResponse.response)
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when migrating user password")
            }

            return parseSnakeCaseToCamelCase(httpResponse.response)
        }
    )
}
