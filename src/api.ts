import {httpRequest} from "./http"
import {
    ApiKeyFull,
    ApiKeyNew,
    ApiKeyResultPage,
    ApiKeyValidation,
    Org,
    OrgApiKeyValidation,
    OrgMemberInfo,
    PersonalApiKeyValidation,
    User,
    UserMetadata
} from "./user"
import {
    AccessTokenCreationException,
    AddUserToOrgException,
    ApiKeyCreateException,
    ApiKeyDeleteException,
    ApiKeyFetchException,
    ApiKeyUpdateException,
    ApiKeyValidateException,
    ChangeUserRoleInOrgException,
    CreateOrgException,
    CreateUserException,
    MagicLinkCreationException,
    MigrateUserException,
    RemoveUserFromOrgException,
    UpdateOrgException,
    UpdateUserEmailException,
    UpdateUserMetadataException,
    UpdateUserPasswordException,
    UserNotFoundException
} from "./exceptions";

export function getApis(authUrl: URL, integrationApiKey: string) {
    function fetchUserMetadataByUserId(userId: string, includeOrgs?: boolean): Promise<UserMetadata | null> {
        return fetchUserMetadataByUserIdWithIdCheck(authUrl, integrationApiKey, userId, includeOrgs);
    }

    function fetchUserMetadataByEmail(email: string, includeOrgs?: boolean): Promise<UserMetadata | null> {
        return fetchUserMetadataByQuery(authUrl, integrationApiKey, "email", {
            email: email,
            include_orgs: includeOrgs || false
        })
    }

    function fetchUserMetadataByUsername(username: string, includeOrgs?: boolean): Promise<UserMetadata | null> {
        return fetchUserMetadataByQuery(authUrl, integrationApiKey, "username", {
            username: username,
            include_orgs: includeOrgs || false
        })
    }

    function fetchBatchUserMetadataByUserIds(userIds: string[], includeOrgs?: boolean): Promise<{
        [userId: string]: UserMetadata
    }> {
        return fetchBatchUserMetadata(authUrl, integrationApiKey, "user_ids", userIds, (x) => x.userId, includeOrgs || false)
    }

    function fetchBatchUserMetadataByEmails(emails: string[], includeOrgs?: boolean): Promise<{
        [email: string]: UserMetadata
    }> {
        return fetchBatchUserMetadata(authUrl, integrationApiKey, "emails", emails, (x) => x.email, includeOrgs || false)
    }

    function fetchBatchUserMetadataByUsernames(usernames: string[], includeOrgs?: boolean): Promise<{
        [username: string]: UserMetadata
    }> {
        return fetchBatchUserMetadata(authUrl, integrationApiKey, "usernames", usernames, (x) => x.username || "", includeOrgs || false)
    }

    function fetchOrgWrapper(orgId: string): Promise<Org | null> {
        return fetchOrg(authUrl, integrationApiKey, orgId)
    }

    function fetchOrgsByQueryWrapper(orgQuery: OrgQuery): Promise<OrgQueryResponse> {
        return fetchOrgByQuery(authUrl, integrationApiKey, orgQuery)
    }

    function fetchUsersByQueryWrapper(usersQuery: UsersQuery): Promise<UsersPagedResponse> {
        return fetchUsersByQuery(authUrl, integrationApiKey, usersQuery)
    }

    function fetchUsersInOrgWrapper(usersInOrgQuery: UsersInOrgQuery): Promise<UsersPagedResponse> {
        return fetchUsersInOrg(authUrl, integrationApiKey, usersInOrgQuery)
    }

    function createUserWrapper(createUserRequest: CreateUserRequest): Promise<User> {
        return createUser(authUrl, integrationApiKey, createUserRequest)
    }

    function updateUserMetadataWrapper(userId: string, updateUserMetadataRequest: UpdateUserMetadataRequest): Promise<boolean> {
        return updateUserMetadata(authUrl, integrationApiKey, userId, updateUserMetadataRequest)
    }

    function deleteUserWrapper(userId: string): Promise<boolean> {
        return deleteUser(authUrl, integrationApiKey, userId)
    }

    function disableUserWrapper(userId: string): Promise<boolean> {
        return disableUser(authUrl, integrationApiKey, userId)
    }

    function enableUserWrapper(userId: string): Promise<boolean> {
        return enableUser(authUrl, integrationApiKey, userId)
    }

    function disableUser2faWrapper(userId: string): Promise<boolean> {
        return disableUser2fa(authUrl, integrationApiKey, userId)
    }

    function updateUserEmailWrapper(userId: string, updateUserEmailRequest: UpdateUserEmailRequest): Promise<boolean> {
        return updateUserEmail(authUrl, integrationApiKey, userId, updateUserEmailRequest)
    }

    function updateUserPasswordWrapper(userId: string, updateUserPasswordRequest: UpdateUserPasswordRequest): Promise<boolean> {
        return updateUserPassword(authUrl, integrationApiKey, userId, updateUserPasswordRequest)
    }

    function enableUserCanCreateOrgsWrapper(userId: string): Promise<boolean> {
        return enableUserCanCreateOrgs(authUrl, integrationApiKey, userId)
    }

    function disableUserCanCreateOrgsWrapper(userId: string): Promise<boolean> {
        return disableUserCanCreateOrgs(authUrl, integrationApiKey, userId)
    }

    function createMagicLinkWrapper(createMagicLinkRequest: CreateMagicLinkRequest): Promise<MagicLink> {
        return createMagicLink(authUrl, integrationApiKey, createMagicLinkRequest)
    }

    function createAccessTokenWrapper(createAccessTokenRequest: CreateAccessTokenRequest): Promise<AccessToken> {
        return createAccessToken(authUrl, integrationApiKey, createAccessTokenRequest)
    }

    function migrateUserFromExternalSourceWrapper(migrateUserFromExternalSourceRequest: MigrateUserFromExternalSourceRequest): Promise<User> {
        return migrateUserFromExternalSource(authUrl, integrationApiKey, migrateUserFromExternalSourceRequest)
    }

    function createOrgWrapper(createOrgRequest: CreateOrgRequest): Promise<Org> {
        return createOrg(authUrl, integrationApiKey, createOrgRequest)
    }

    function addUserToOrgWrapper(addUserToOrgRequest: AddUserToOrgRequest): Promise<boolean> {
        return addUserToOrg(authUrl, integrationApiKey, addUserToOrgRequest)
    }

    function changeUserRoleInOrgWrapper(changeUserRoleInOrgRequest: ChangeUserRoleInOrgRequest): Promise<boolean> {
        return changeUserRoleInOrg(authUrl, integrationApiKey, changeUserRoleInOrgRequest)
    }

    function removeUserFromOrgWrapper(removeUserFromOrgRequest: RemoveUserFromOrgRequest): Promise<boolean> {
        return removeUserFromOrg(authUrl, integrationApiKey, removeUserFromOrgRequest)
    }

    function updateOrgWrapper(updateOrgRequest: UpdateOrgRequest): Promise<boolean> {
        return updateOrg(authUrl, integrationApiKey, updateOrgRequest)
    }

    function deleteOrgWrapper(orgId: string): Promise<boolean> {
        return deleteOrg(authUrl, integrationApiKey, orgId)
    }

    function allowOrgToSetupSamlConnectionWrapper(orgId: string): Promise<boolean> {
        return allowOrgToSetupSamlConnection(authUrl, integrationApiKey, orgId)
    }

    function disallowOrgToSetupSamlConnectionWrapper(orgId: string): Promise<boolean> {
        return disallowOrgToSetupSamlConnection(authUrl, integrationApiKey, orgId)
    }

    // end user api key wrappers
    function fetchApiKeyWrapper(apiKeyId: string): Promise<ApiKeyFull> {
        return fetchApiKey(authUrl, integrationApiKey, apiKeyId)
    }

    function fetchCurrentApiKeysWrapper(apiKeyQuery: ApiKeysQueryRequest): Promise<ApiKeyResultPage> {
        return fetchCurrentApiKeys(authUrl, integrationApiKey, apiKeyQuery)
    }

    function fetchArchivedApiKeysWrapper(apiKeyQuery: ApiKeysQueryRequest): Promise<ApiKeyResultPage> {
        return fetchArchivedApiKeys(authUrl, integrationApiKey, apiKeyQuery)
    }

    function createApiKeyWrapper(apiKeyCreate: ApiKeysCreateRequest): Promise<ApiKeyNew> {
        return createApiKey(authUrl, integrationApiKey, apiKeyCreate)
    }

    function updateApiKeyWrapper(apiKeyId: string, ApiKeyUpdate: ApiKeyUpdateRequest): Promise<boolean> {
        return updateApiKey(authUrl, integrationApiKey, apiKeyId, ApiKeyUpdate)
    }

    function deleteApiKeyWrapper(apiKeyId: string): Promise<boolean> {
        return deleteApiKey(authUrl, integrationApiKey, apiKeyId)
    }

    function validatePersonalApiKeyWrapper(apiKeyToken: string): Promise<PersonalApiKeyValidation> {
        return validatePersonalApiKey(authUrl, integrationApiKey, apiKeyToken)
    }

    function validateOrgApiKeyWrapper(apiKeyToken: string): Promise<OrgApiKeyValidation> {
        return validateOrgApiKey(authUrl, integrationApiKey, apiKeyToken)
    }

    function validateApiKeyWrapper(apiKeyToken: string): Promise<ApiKeyValidation> {
        return validateApiKey(authUrl, integrationApiKey, apiKeyToken)
    }

    return {
        // fetching functions
        fetchUserMetadataByUserId,
        fetchUserMetadataByEmail,
        fetchUserMetadataByUsername,
        fetchBatchUserMetadataByUserIds,
        fetchBatchUserMetadataByEmails,
        fetchBatchUserMetadataByUsernames,
        fetchOrg: fetchOrgWrapper,
        fetchOrgByQuery: fetchOrgsByQueryWrapper,
        fetchUsersByQuery: fetchUsersByQueryWrapper,
        fetchUsersInOrg: fetchUsersInOrgWrapper,
        // user management functions
        createUser: createUserWrapper,
        updateUserMetadata: updateUserMetadataWrapper,
        updateUserEmail: updateUserEmailWrapper,
        updateUserPassword: updateUserPasswordWrapper,
        createMagicLink: createMagicLinkWrapper,
        createAccessToken: createAccessTokenWrapper,
        migrateUserFromExternalSource: migrateUserFromExternalSourceWrapper,
        deleteUser: deleteUserWrapper,
        disableUser: disableUserWrapper,
        enableUser: enableUserWrapper,
        disableUser2fa: disableUser2faWrapper,
        enableUserCanCreateOrgs: enableUserCanCreateOrgsWrapper,
        disableUserCanCreateOrgs: disableUserCanCreateOrgsWrapper,
        // org management functions
        createOrg: createOrgWrapper,
        addUserToOrg: addUserToOrgWrapper,
        changeUserRoleInOrg: changeUserRoleInOrgWrapper,
        removeUserFromOrg: removeUserFromOrgWrapper,
        updateOrg: updateOrgWrapper,
        deleteOrg: deleteOrgWrapper,
        allowOrgToSetupSamlConnection: allowOrgToSetupSamlConnectionWrapper,
        disallowOrgToSetupSamlConnection: disallowOrgToSetupSamlConnectionWrapper,
        // api keys functions
        fetchApiKey: fetchApiKeyWrapper,
        fetchCurrentApiKeys: fetchCurrentApiKeysWrapper,
        fetchArchivedApiKeys: fetchArchivedApiKeysWrapper,
        createApiKey: createApiKeyWrapper,
        updateApiKey: updateApiKeyWrapper,
        deleteApiKey: deleteApiKeyWrapper,
        validateApiKey: validateApiKeyWrapper,
        validatePersonalApiKey: validatePersonalApiKeyWrapper,
        validateOrgApiKey: validateOrgApiKeyWrapper,
    }
}

export type TokenVerificationMetadata = {
    verifierKey: string
    issuer: string
}

function fetchTokenVerificationMetadata(authUrl: URL,
                                        integrationApiKey: string,
                                        manualTokenVerificationMetadata?: TokenVerificationMetadata): Promise<TokenVerificationMetadata> {
    if (manualTokenVerificationMetadata) {
        return Promise.resolve(manualTokenVerificationMetadata)
    }

    return httpRequest(authUrl, integrationApiKey, "/api/v1/token_verification_metadata", "GET").then((httpResponse) => {
        if (httpResponse.statusCode === 401) {
            throw new Error("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
            throw new Error("Unknown error when fetching token verification metadata")
        }

        const jsonParse = JSON.parse(httpResponse.response)
        return {
            verifierKey: jsonParse.verifier_key_pem,
            issuer: formatIssuer(authUrl),
        }
    })
}

function fetchUserMetadataByUserIdWithIdCheck(authUrl: URL, integrationApiKey: string, userId: string, includeOrgs?: boolean): Promise<UserMetadata | null> {
    if (isValidId(userId)) {
        return fetchUserMetadataByQuery(authUrl, integrationApiKey, userId, {include_orgs: includeOrgs || false})
    } else {
        return Promise.resolve(null);
    }
}

function fetchUserMetadataByQuery(authUrl: URL, integrationApiKey: string, pathParam: string, query: any): Promise<UserMetadata | null> {
    const queryString = formatQueryParameters(query)
    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/user/${pathParam}?${queryString}`, "GET").then((httpResponse) => {
        if (httpResponse.statusCode === 401) {
            throw new Error("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode === 404) {
            return null
        } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
            throw new Error("Unknown error when fetching user metadata")
        }

        return parseSnakeCaseToCamelCase(httpResponse.response)
    })
}

function fetchBatchUserMetadata(
    authUrl: URL,
    integrationApiKey: string,
    type: string,
    values: string[],
    keyFunction: (x: UserMetadata) => string,
    includeOrgs?: boolean,
): Promise<{ [key: string]: UserMetadata }> {
    const queryString = includeOrgs ? formatQueryParameters({include_orgs: includeOrgs}) : ""
    const jsonBody = {[type]: values}
    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/user/${type}?${queryString}`, "POST", JSON.stringify(jsonBody)).then(
        (httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new Error("Bad request " + httpResponse.response)
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when fetching batch user metadata")
            }

            const userMetadatas = parseSnakeCaseToCamelCase(httpResponse.response)

            const returnValue: { [key: string]: UserMetadata } = {}
            for (let userMetadata of userMetadatas) {
                returnValue[keyFunction(userMetadata)] = userMetadata
            }
            return returnValue
        },
    )
}

function fetchOrg(authUrl: URL, integrationApiKey: string, orgId: string): Promise<Org | null> {
    if (!isValidId(orgId)) {
        return Promise.resolve(null);
    }

    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/org/${orgId}`, "GET").then((httpResponse) => {
        if (httpResponse.statusCode === 401) {
            throw new Error("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode === 404) {
            return null
        } else if (httpResponse.statusCode === 426) {
            throw new Error("Cannot use organizations unless B2B support is enabled. Enable it in your PropelAuth dashboard.")
        } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
            throw new Error("Unknown error when fetching org")
        }

        return parseSnakeCaseToCamelCase(httpResponse.response)
    })
}

export type OrgQuery = {
    pageSize?: number
    pageNumber?: number
    orderBy?: "CREATED_AT_ASC" | "CREATED_AT_DESC" | "NAME"
}

export type OrgQueryResponse = {
    orgs: Org[],
    totalOrgs: number,
    currentPage: number,
    pageSize: number,
    hasMoreResults: boolean,
}

function fetchOrgByQuery(authUrl: URL, integrationApiKey: string, query: OrgQuery): Promise<OrgQueryResponse> {
    const request = {
        page_size: query.pageSize,
        page_number: query.pageNumber,
        order_by: query.orderBy,
    }
    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/org/query`, "POST", JSON.stringify(request))
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new Error("Invalid query " + httpResponse.response)
            } else if (httpResponse.statusCode === 426) {
                throw new Error("Cannot use organizations unless B2B support is enabled. Enable it in your PropelAuth dashboard.")
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when fetching orgs by query")
            }

            return JSON.parse(httpResponse.response, function (key, value) {
                if (key === "org_id") {
                    this.orgId = value
                } else if (key === "org_name") {
                    this.name = value;
                } else if (key === "max_users") {
                    this.maxUsers = value;
                } else if (key === "total_orgs") {
                    this.totalOrgs = value;
                } else if (key === "current_page") {
                    this.currentPage = value;
                } else if (key === "page_size") {
                    this.pageSize = value;
                } else if (key === "has_more_results") {
                    this.hasMoreResults = value;
                } else {
                    return value
                }
            })
        })
}

export type UsersQuery = {
    pageSize?: number,
    pageNumber?: number,
    orderBy?: "CREATED_AT_ASC" | "CREATED_AT_DESC" | "LAST_ACTIVE_AT_ASC" | "LAST_ACTIVE_AT_DESC" | "EMAIL" | "USERNAME",
    emailOrUsername?: string,
    includeOrgs?: boolean,
}

export type UsersPagedResponse = {
    users: UserMetadata[],
    totalUsers: number,
    currentPage: number,
    pageSize: number,
    hasMoreResults: boolean
}

function fetchUsersByQuery(authUrl: URL, integrationApiKey: string, query: UsersQuery): Promise<UsersPagedResponse> {
    const queryParams = {
        page_size: query.pageSize,
        page_number: query.pageNumber,
        order_by: query.orderBy,
        email_or_username: query.emailOrUsername,
        include_orgs: query.includeOrgs,
    }
    const q = formatQueryParameters(queryParams)
    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/user/query?${q}`, "GET")
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new Error("Invalid query " + httpResponse.response)
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when fetching users by query")
            }

            return parseSnakeCaseToCamelCase(httpResponse.response)
        })
}

export type UsersInOrgQuery = {
    orgId: string,
    pageSize?: number,
    pageNumber?: number,
    includeOrgs?: boolean,
}

function fetchUsersInOrg(authUrl: URL, integrationApiKey: string, query: UsersInOrgQuery): Promise<UsersPagedResponse> {
    if (!isValidId(query.orgId)) {
        const emptyResponse: UsersPagedResponse = {
            users: [],
            totalUsers: 0,
            currentPage: query.pageNumber || 0,
            pageSize: query.pageSize || 10,
            hasMoreResults: false
        }
        return Promise.resolve(emptyResponse)
    }

    const queryParams = {
        page_size: query.pageSize,
        page_number: query.pageNumber,
        include_orgs: query.includeOrgs,
    }
    const queryString = formatQueryParameters(queryParams)
    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/user/org/${query.orgId}?${queryString}`, "GET")
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new Error("Invalid query " + httpResponse.response)
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when fetching users in org")
            }

            return parseSnakeCaseToCamelCase(httpResponse.response)
        })
}

export type CreateUserRequest = {
    email: string,
    emailConfirmed?: boolean,
    sendEmailToConfirmEmailAddress?: boolean,

    password?: string,
    askUserToUpdatePasswordOnLogin?: boolean,

    username?: string,
    firstName?: string,
    lastName?: string,

    properties?: { [key: string]: any },
}

function createUser(authUrl: URL, integrationApiKey: string, createUserRequest: CreateUserRequest): Promise<User> {
    const request = {
        email: createUserRequest.email,
        email_confirmed: createUserRequest.emailConfirmed,
        send_email_to_confirm_email_address: createUserRequest.sendEmailToConfirmEmailAddress,

        password: createUserRequest.password,
        ask_user_to_update_password_on_login: createUserRequest.askUserToUpdatePasswordOnLogin,

        username: createUserRequest.username,
        first_name: createUserRequest.firstName,
        last_name: createUserRequest.lastName,

        properties: createUserRequest.properties,
    }
    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/user/`, "POST", JSON.stringify(request))
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new CreateUserException(httpResponse.response)
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when creating user")
            }

            return parseSnakeCaseToCamelCase(httpResponse.response)
        })
}

export type UpdateUserMetadataRequest = {
    username?: string,
    firstName?: string,
    lastName?: string,
    pictureUrl?: string
    metadata?: { [key: string]: any }
    properties?: { [key: string]: any }
}

function updateUserMetadata(authUrl: URL, integrationApiKey: string, userId: string, updateUserMetadataRequest: UpdateUserMetadataRequest): Promise<boolean> {
    if (!isValidId(userId)) {
        return Promise.resolve(false)
    }
    if (updateUserMetadataRequest.metadata) {
        console.info("metadata is deprecated. You should use properties instead, with metadata being a JSON property")
    }

    const request = {
        username: updateUserMetadataRequest.username,
        first_name: updateUserMetadataRequest.firstName,
        last_name: updateUserMetadataRequest.lastName,
        picture_url: updateUserMetadataRequest.pictureUrl,
        metadata: updateUserMetadataRequest.metadata,
        properties: updateUserMetadataRequest.properties,
    }
    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/user/${userId}`, "PUT", JSON.stringify(request))
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new UpdateUserMetadataException(httpResponse.response)
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when updating user metadata")
            }

            return true
        })
}

function deleteUser(authUrl: URL, integrationApiKey: string, userId: string): Promise<boolean> {
    if (!isValidId(userId)) {
        return Promise.resolve(false)
    }

    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/user/${userId}`, "DELETE")
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when deleting user")
            }

            return true
        })
}

function disableUser(authUrl: URL, integrationApiKey: string, userId: string): Promise<boolean> {
    if (!isValidId(userId)) {
        return Promise.resolve(false)
    }

    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/user/${userId}/disable`, "POST")
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when disabling user")
            }

            return true
        })
}

function enableUser(authUrl: URL, integrationApiKey: string, userId: string): Promise<boolean> {
    if (!isValidId(userId)) {
        return Promise.resolve(false)
    }

    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/user/${userId}/enable`, "POST")
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when enabling user")
            }

            return true
        })
}

function disableUser2fa(authUrl: URL, integrationApiKey: string, userId: string): Promise<boolean> {
    if (!isValidId(userId)) {
        return Promise.resolve(false)
    }

    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/user/${userId}/disable_2fa`, "POST")
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when disabling 2FA")
            }

            return true
        })
}

export type UpdateUserEmailRequest = {
    newEmail: string,
    requireEmailConfirmation: boolean,
}

function updateUserEmail(authUrl: URL, integrationApiKey: string, userId: string, updateUserEmail: UpdateUserEmailRequest): Promise<boolean> {
    if (!isValidId(userId)) {
        return Promise.resolve(false)
    }

    const request = {
        new_email: updateUserEmail.newEmail,
        require_email_confirmation: updateUserEmail.requireEmailConfirmation,
    }
    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/user/${userId}/email`, "PUT", JSON.stringify(request))
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new UpdateUserEmailException(httpResponse.response)
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when creating user")
            }

            return true
        })
}

export type UpdateUserPasswordRequest = {
    password: string
    askUserToUpdatePasswordOnLogin?: boolean,
}

function updateUserPassword(authUrl: URL, integrationApiKey: string, userId: string, updateUserPasswordRequest: UpdateUserPasswordRequest): Promise<boolean> {
    if (!isValidId(userId)) {
        return Promise.resolve(false)
    }

    const request = {
        password: updateUserPasswordRequest.password,
        ask_user_to_update_password_on_login: updateUserPasswordRequest.askUserToUpdatePasswordOnLogin,
    }
    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/user/${userId}/password`, "PUT", JSON.stringify(request))
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new UpdateUserPasswordException(httpResponse.response)
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when updating password")
            }

            return true
        })
}

function enableUserCanCreateOrgs(authUrl: URL, integrationApiKey: string, userId: string): Promise<boolean> {
    if (!isValidId(userId)) {
        return Promise.resolve(false)
    }

    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/user/${userId}/can_create_orgs/enable`, "PUT")
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when enabling canCreateOrgs")
            }

            return true
        })
}

function disableUserCanCreateOrgs(authUrl: URL, integrationApiKey: string, userId: string): Promise<boolean> {
    if (!isValidId(userId)) {
        return Promise.resolve(false)
    }

    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/user/${userId}/can_create_orgs/disable`, "PUT")
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when disabling canCreateOrgs")
            }

            return true
        })
}


export type CreateMagicLinkRequest = {
    email: string,
    redirectToUrl?: string,
    expiresInHours?: string,
    createNewUserIfOneDoesntExist?: boolean,
}

export type MagicLink = {
    url: string
}

function createMagicLink(authUrl: URL, integrationApiKey: string, createMagicLinkRequest: CreateMagicLinkRequest): Promise<MagicLink> {
    const request = {
        email: createMagicLinkRequest.email,
        redirect_to_url: createMagicLinkRequest.redirectToUrl,
        expires_in_hours: createMagicLinkRequest.expiresInHours,
        create_new_user_if_one_doesnt_exist: createMagicLinkRequest.createNewUserIfOneDoesntExist,
    }
    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/magic_link`, "POST", JSON.stringify(request))
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new MagicLinkCreationException(httpResponse.response)
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when creating magic link")
            }

            return JSON.parse(httpResponse.response)
        })
}

export type CreateAccessTokenRequest = {
    userId: string,
    durationInMinutes: number,
}

export type AccessToken = {
    access_token: string
}

function createAccessToken(authUrl: URL, integrationApiKey: string, createAccessTokenRequest: CreateAccessTokenRequest): Promise<AccessToken> {
    if (!isValidId(createAccessTokenRequest.userId)) {
        throw new UserNotFoundException()
    }

    const request = {
        user_id: createAccessTokenRequest.userId,
        duration_in_minutes: createAccessTokenRequest.durationInMinutes,
    }
    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/access_token`, "POST", JSON.stringify(request))
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new AccessTokenCreationException(httpResponse.response)
            } else if (httpResponse.statusCode === 403) {
                throw new UserNotFoundException()
            } else if (httpResponse.statusCode === 404) {
                throw new Error("Access token creation is not enabled")
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when creating access token")
            }

            return JSON.parse(httpResponse.response)
        })
}

export type MigrateUserFromExternalSourceRequest = {
    email: string,
    emailConfirmed: boolean,

    existingUserId?: string,
    existingPasswordHash?: string,
    existingMfaBase32EncodedSecret?: string,
    askUserToUpdatePasswordOnLogin?: boolean,

    enabled?: boolean,

    firstName?: string,
    lastName?: string,
    username?: string,

    properties?: { [key: string]: any },
}

function migrateUserFromExternalSource(authUrl: URL,
                                              integrationApiKey: string,
                                              migrateUserFromExternalSourceRequest: MigrateUserFromExternalSourceRequest): Promise<User> {
    const request = {
        email: migrateUserFromExternalSourceRequest.email,
        email_confirmed: migrateUserFromExternalSourceRequest.emailConfirmed,

        existing_user_id: migrateUserFromExternalSourceRequest.existingUserId,
        existing_password_hash: migrateUserFromExternalSourceRequest.existingPasswordHash,
        existing_mfa_base32_encoded_secret: migrateUserFromExternalSourceRequest.existingMfaBase32EncodedSecret,
        update_password_required: migrateUserFromExternalSourceRequest.askUserToUpdatePasswordOnLogin,

        enabled: migrateUserFromExternalSourceRequest.enabled,

        first_name: migrateUserFromExternalSourceRequest.firstName,
        last_name: migrateUserFromExternalSourceRequest.lastName,
        username: migrateUserFromExternalSourceRequest.username,

        properties: migrateUserFromExternalSourceRequest.properties,
    }
    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/migrate_user/`, "POST", JSON.stringify(request))
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new MigrateUserException(httpResponse.response)
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when migrating user")
            }

            return parseSnakeCaseToCamelCase(httpResponse.response)
        })
}

export type CreateOrgRequest = {
    name: string
}

function createOrg(authUrl: URL, integrationApiKey: string, createOrgRequest: CreateOrgRequest): Promise<Org> {
    const request = {
        name: createOrgRequest.name,
    }
    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/org/`, "POST", JSON.stringify(request))
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new CreateOrgException(httpResponse.response)
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when creating org")
            }

            return parseSnakeCaseToCamelCase(httpResponse.response)
        })
}

export type AddUserToOrgRequest = {
    userId: string
    orgId: string
    role: string
}

function addUserToOrg(authUrl: URL, integrationApiKey: string, addUserToOrgRequest: AddUserToOrgRequest): Promise<boolean> {
    const request = {
        user_id: addUserToOrgRequest.userId,
        org_id: addUserToOrgRequest.orgId,
        role: addUserToOrgRequest.role,
    }
    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/org/add_user`, "POST", JSON.stringify(request))
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new AddUserToOrgException(httpResponse.response)
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when adding user to org")
            }

            return true
        })
}

export type ChangeUserRoleInOrgRequest = {
    userId: string
    orgId: string
    role: string
}

function changeUserRoleInOrg(authUrl: URL, integrationApiKey: string, changeUserRoleInOrgRequest: ChangeUserRoleInOrgRequest): Promise<boolean> {
    const request = {
        user_id: changeUserRoleInOrgRequest.userId,
        org_id: changeUserRoleInOrgRequest.orgId,
        role: changeUserRoleInOrgRequest.role,
    }
    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/org/change_role`, "POST", JSON.stringify(request))
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new ChangeUserRoleInOrgException(httpResponse.response)
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when changing users role in org")
            }

            return true
        })
}

export type RemoveUserFromOrgRequest = {
    userId: string
    orgId: string
}

function removeUserFromOrg(authUrl: URL, integrationApiKey: string, removeUserFromOrgRequest: RemoveUserFromOrgRequest): Promise<boolean> {
    const request = {
        user_id: removeUserFromOrgRequest.userId,
        org_id: removeUserFromOrgRequest.orgId,
    }
    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/org/remove_user`, "POST", JSON.stringify(request))
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new RemoveUserFromOrgException(httpResponse.response)
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when removing users from org")
            }

            return true
        })
}

export type UpdateOrgRequest = {
    orgId: string
    name?: string
    canSetupSaml?: boolean
    maxUsers?: number
    metadata?: { [key: string]: any }
}

function updateOrg(authUrl: URL, integrationApiKey: string, updateOrgRequest: UpdateOrgRequest): Promise<boolean> {
    if (!isValidId(updateOrgRequest.orgId)) {
        return Promise.resolve(false)
    }

    const request = {
        name: updateOrgRequest.name,
        can_setup_saml: updateOrgRequest.canSetupSaml,
        metadata: updateOrgRequest.metadata,
        max_users: updateOrgRequest.maxUsers,
    }
    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/org/${updateOrgRequest.orgId}`, "PUT", JSON.stringify(request))
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new UpdateOrgException(httpResponse.response)
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when updating org")
            }

            return true
        })
}

function deleteOrg(authUrl: URL, integrationApiKey: string, orgId: string): Promise<boolean> {
    if (!isValidId(orgId)) {
        return Promise.resolve(false)
    }

    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/org/${orgId}`, "DELETE")
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when deleting org")
            }

            return true
        })
}


function allowOrgToSetupSamlConnection(authUrl: URL, integrationApiKey: string, orgId: string): Promise<boolean> {
    if (!isValidId(orgId)) {
        return Promise.resolve(false)
    }

    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/org/${orgId}/allow_saml`, "POST")
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when allowing org to setup SAML connection")
            }

            return true
        })
}

function disallowOrgToSetupSamlConnection(authUrl: URL, integrationApiKey: string, orgId: string): Promise<boolean> {
    if (!isValidId(orgId)) {
        return Promise.resolve(false)
    }

    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/org/${orgId}/disallow_saml`, "POST")
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when disallowing org to setup SAML connection")
            }

            return true
        })
}

// functions for managing end user api keys

function fetchApiKey(authUrl: URL, integrationApiKey: string, apiKeyId: string): Promise<ApiKeyFull> {
    if (!isValidHex(apiKeyId)) {
        throw new ApiKeyFetchException("Invalid api key")
    }

    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/end_user_api_keys/${apiKeyId}`, "GET")
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new ApiKeyFetchException(httpResponse.response)
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when creating the end user api key")
            }

            return parseSnakeCaseToCamelCase(httpResponse.response)
        })
}

export type ApiKeysQueryRequest = {
    orgId?: string
    userId?: string
    userEmail?: string
    pageSize?: number
    pageNumber?: number
}

function fetchCurrentApiKeys(authUrl: URL, integrationApiKey: string, apiKeyQuery: ApiKeysQueryRequest): Promise<ApiKeyResultPage> {
    const request = {
        org_id: apiKeyQuery.orgId,
        user_id: apiKeyQuery.userId,
        user_email: apiKeyQuery.userEmail,
        page_size: apiKeyQuery.pageSize,
        page_number: apiKeyQuery.pageNumber,
    }
    const queryString = formatQueryParameters(request)

    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/end_user_api_keys?${queryString}`, "GET")
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new ApiKeyFetchException(httpResponse.response)
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when creating the end user api key")
            }

            return parseSnakeCaseToCamelCase(httpResponse.response)
        })
}

function fetchArchivedApiKeys(authUrl: URL, integrationApiKey: string, apiKeyQuery: ApiKeysQueryRequest): Promise<ApiKeyResultPage> {
    const request = {
        org_id: apiKeyQuery.orgId,
        user_id: apiKeyQuery.userId,
        user_email: apiKeyQuery.userEmail,
        page_size: apiKeyQuery.pageSize,
        page_number: apiKeyQuery.pageNumber,
    }
    const queryString = formatQueryParameters(request)

    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/end_user_api_keys/archived?${queryString}`, "GET")
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new ApiKeyFetchException(httpResponse.response)
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when creating the end user api key")
            }

            return parseSnakeCaseToCamelCase(httpResponse.response)
        })
}


export type ApiKeysCreateRequest = {
    orgId?: string
    userId?: string
    expiresAtSeconds?: number
    metadata?: object
}

function createApiKey(authUrl: URL, integrationApiKey: string, apiKeyCreate: ApiKeysCreateRequest): Promise<ApiKeyNew> {
    const request = {
        org_id: apiKeyCreate.orgId,
        user_id: apiKeyCreate.userId,
        expires_at_seconds: apiKeyCreate.expiresAtSeconds,
        metadata: apiKeyCreate.metadata,
    }

    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/end_user_api_keys`, "POST", JSON.stringify(request))
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new ApiKeyCreateException(httpResponse.response)
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when creating the end user api key")
            }

            return parseSnakeCaseToCamelCase(httpResponse.response)
        })
}

export type ApiKeyUpdateRequest = {
    expiresAtSeconds?: number
    metadata?: string
}

function updateApiKey(authUrl: URL, integrationApiKey: string, apiKeyId: string, apiKeyUpdate: ApiKeyUpdateRequest): Promise<boolean> {
    if (!isValidHex(apiKeyId)) {
        throw new ApiKeyUpdateException("Invalid api key")
    }

    const request = {
        expires_at_seconds: apiKeyUpdate.expiresAtSeconds,
        metadata: apiKeyUpdate.metadata,
    }

    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/end_user_api_keys/${apiKeyId}`, "PATCH", JSON.stringify(request))
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new ApiKeyUpdateException(httpResponse.response)
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when updating the end user api key")
            }

            return true
        })
}

function deleteApiKey(authUrl: URL, integrationApiKey: string, apiKeyId: string): Promise<boolean> {
    if (!isValidHex(apiKeyId)) {
        throw new ApiKeyDeleteException("Invalid api key")
    }

    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/end_user_api_keys/${apiKeyId}`, "DELETE")
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new ApiKeyDeleteException(httpResponse.response)
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when deleting the end user api key")
            }

            return true
        })
}


async function validatePersonalApiKey(authUrl: URL, integrationApiKey: string, apiKeyToken: string): Promise<PersonalApiKeyValidation> {
    const apiKeyValidation = await validateApiKey(authUrl, integrationApiKey, apiKeyToken)
    if (!apiKeyValidation.user || apiKeyValidation.org) {
        throw new ApiKeyValidateException(JSON.stringify({"api_key_token": ["Not a personal API Key"]}))
    }
    return {
        user: apiKeyValidation.user,
        metadata: apiKeyValidation.metadata,
    }
}

async function validateOrgApiKey(authUrl: URL, integrationApiKey: string, apiKeyToken: string): Promise<OrgApiKeyValidation> {
    const apiKeyValidation = await validateApiKey(authUrl, integrationApiKey, apiKeyToken)
    if (!apiKeyValidation.org) {
        throw new ApiKeyValidateException(JSON.stringify({"api_key_token": ["Not an org API Key"]}))
    }
    return {
        org: apiKeyValidation.org,
        metadata: apiKeyValidation.metadata,
        user: apiKeyValidation.user,
        userInOrg: apiKeyValidation.userInOrg,
    }
}

function validateApiKey(authUrl: URL, integrationApiKey: string, apiKeyToken: string): Promise<ApiKeyValidation> {
    const request = {
        api_key_token: removeBearerIfExists(apiKeyToken),
    }

    return httpRequest(authUrl, integrationApiKey, `/api/backend/v1/end_user_api_keys/validate`, "POST", JSON.stringify(request))
        .then((httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 400) {
                throw new ApiKeyValidateException(httpResponse.response)
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when updating the end user api key")
            }

            return parseSnakeCaseToCamelCase(httpResponse.response)
        })
}

const idRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
const hexRegex = /^[0-9a-fA-F]{32}$/i;

function isValidId(id: string): boolean {
    return idRegex.test(id)
}


function isValidHex(id: string): boolean {
    return hexRegex.test(id)
}

function removeBearerIfExists(token: string): string {
    if (!token) {
        return token
    } else if (token.toLowerCase().startsWith("bearer ")) {
        return token.substring(7)
    } else {
        return token
    }
}

function formatQueryParameters(obj: { [key: string]: any }): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
            params.set(key, value);
        }
    }
    return params.toString()
}

function formatIssuer(authUrl: URL): string {
    return authUrl.origin
}

function parseSnakeCaseToCamelCase(response: string) {
    let parsedObject = JSON.parse(response);
    return processKeys(parsedObject);
}

const keysForValueNotToModify = ["metadata", "org_metadata", "properties"];

function isOrgMemberInfo(value: any) {
    return value &&
        typeof value === "object" &&
        value.hasOwnProperty("orgId") &&
        value.hasOwnProperty("orgName") &&
        value.hasOwnProperty("urlSafeOrgName") &&
        value.hasOwnProperty("orgMetadata") &&
        value.hasOwnProperty("userAssignedRole") &&
        value.hasOwnProperty("userRoles") &&
        value.hasOwnProperty("userPermissions")
}

function processKeys(obj: any): any {
    let newObj: any = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue
        }

        let value = obj[key];
        const doNotModifyValue = keysForValueNotToModify.includes(key)
        if (!doNotModifyValue && value && typeof value === "object") {
            value = processKeys(value);
        }

        if (isOrgMemberInfo(value)) {
            value = new OrgMemberInfo(
                value["orgId"], value["orgName"], value["orgMetadata"], value["urlSafeOrgName"],
                value["userAssignedRole"], value["userRoles"], value["userPermissions"])
        }

        let newKey;
        if (key === "user_role") {
            newKey = "userAssignedRole";
        } else if (key === "inherited_user_roles_plus_current_role") {
            newKey = "userRoles";
        } else {
            newKey = camelCase(key);
        }

        newObj[newKey] = value;
    }
    return newObj;
}

function camelCase(key: string): string {
    return key.replace(/_([a-z])/g, function (g) {
        return g[1].toUpperCase();
    })
}