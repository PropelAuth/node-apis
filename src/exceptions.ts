export class CreateUserException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class MigrateUserException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class MigrateUserPasswordException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class CreateOrgException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class AddUserToOrgException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class ChangeUserRoleInOrgException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class RemoveUserFromOrgException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class UpdateOrgException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class RevokePendingOrgInviteException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class ForbiddenException extends Error {
    readonly message: string
    readonly status: number
    constructor(message: string) {
        super(message)
        this.message = message
        this.status = 403
    }
}

export class MagicLinkCreationException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class AccessTokenCreationException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class UnauthorizedException extends Error {
    readonly message: string
    readonly status: number
    constructor(message: string) {
        super(message)
        this.message = message
        this.status = 401
    }
}

export class UnexpectedException extends Error {
    readonly message: string
    readonly status: number
    constructor(message: string) {
        super(message)
        this.message = message
        this.status = 503
    }
}

export class UpdateUserEmailException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class UpdateUserPasswordException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class UpdateUserMetadataException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class UserNotFoundException extends Error {}

export class ApiKeyValidateException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class ApiKeyValidateRateLimitedException extends Error {
    readonly waitSeconds: number
    readonly userFacingError: string
    readonly errorCode: string
    constructor(errorBody: string) {
        super(errorBody)
        const parsedErrorBody = JSON.parse(errorBody)
        this.waitSeconds = parsedErrorBody.wait_seconds
        this.userFacingError = parsedErrorBody.user_facing_error
        this.errorCode = parsedErrorBody.error_code
    }
}

export class RateLimitedException extends Error {
    constructor(message: string) {
        super(message)
    }
}

export class ApiKeyDeleteException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class ApiKeyUpdateException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class ApiKeyCreateException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class ApiKeyFetchException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class BadRequestException extends Error {
    readonly fieldToErrors: { [fieldName: string]: string[] }
    constructor(message: string) {
        super(message)
        this.fieldToErrors = JSON.parse(message)
    }
}

export class FeatureGatedException extends Error {
    constructor() {
        super("This feature isn't available on your current pricing plan")
    }
}

export class IncorrectMfaCodeException extends Error {}

export class MfaNotEnabledException extends Error {}

export class InvalidRequestFieldsException extends Error {
    readonly errorBody: {
        error_code: string
        user_facing_error: string
        field_errors?: { [fieldName: string]: string }
        user_facing_errors?: { [fieldName: string]: string }
    }

    constructor(errorBody: string) {
        super("Invalid request")
        this.errorBody = JSON.parse(errorBody)
    }
}
