import {
    ApiKeyFull,
    ApiKeyNew,
    ApiKeyResultPage,
    ApiKeyValidation,
    CreatedOrg,
    CreatedUser,
    Org,
    OrgApiKeyValidation,
    Organization,
    PersonalApiKeyValidation,
    UserMetadata,
} from "./user"
import {
    clearUserPassword,
    createUser,
    CreateUserRequest,
    deleteUser,
    disableUser,
    disableUser2fa,
    disableUserCanCreateOrgs,
    enableUser,
    resendEmailConfirmation,
    enableUserCanCreateOrgs,
    fetchBatchUserMetadata,
    fetchUserMetadataByQuery,
    fetchUserMetadataByUserIdWithIdCheck,
    fetchUsersByQuery,
    fetchUserSignupQueryParams,
    fetchUsersInOrg,
    inviteUserToOrg,
    InviteUserToOrgRequest,
    updateUserEmail,
    UpdateUserEmailRequest,
    updateUserMetadata,
    UpdateUserMetadataRequest,
    updateUserPassword,
    UpdateUserPasswordRequest,
    UserSignupQueryParams,
    UsersInOrgQuery,
    UsersPagedResponse,
    UsersQuery,
    logoutAllUserSessions,
} from "./api/user"
import {
    addUserToOrg,
    AddUserToOrgRequest,
    allowOrgToSetupSamlConnection,
    changeUserRoleInOrg,
    ChangeUserRoleInOrgRequest,
    createOrg,
    CreateOrgRequest,
    deleteOrg,
    disallowOrgToSetupSamlConnection,
    fetchCustomRoleMappings,
    fetchOrg,
    fetchOrgByQuery,
    fetchPendingInvites,
    FetchPendingInvitesParams,
    OrgQuery,
    OrgQueryResponse,
    PendingInvitesPage,
    removeUserFromOrg,
    RemoveUserFromOrgRequest,
    subscribeOrgToRoleMapping,
    updateOrg,
    UpdateOrgRequest,
} from "./api/org"
import { createMagicLink, CreateMagicLinkRequest, MagicLink } from "./api/magicLink"
import { AccessToken, createAccessToken, CreateAccessTokenRequest } from "./api/accessToken"
import { migrateUserFromExternalSource, MigrateUserFromExternalSourceRequest } from "./api/migrateUser"
import {
    ApiKeysCreateRequest,
    ApiKeysQueryRequest,
    ApiKeyUpdateRequest,
    createApiKey,
    deleteApiKey,
    fetchApiKey,
    fetchArchivedApiKeys,
    fetchCurrentApiKeys,
    updateApiKey,
    validateApiKey,
} from "./api/endUserApiKeys"
import { validateOrgApiKey, validatePersonalApiKey } from "./validators"
import { TokenVerificationMetadata, fetchTokenVerificationMetadata } from "./api/tokenVerificationMetadata"
import { CustomRoleMappings } from "./customRoleMappings"

export function getApis(authUrl: URL, integrationApiKey: string) {
    function fetchTokenVerificationMetadataWrapper(): Promise<TokenVerificationMetadata> {
        return fetchTokenVerificationMetadata(authUrl, integrationApiKey)
    }

    function fetchUserMetadataByUserId(userId: string, includeOrgs?: boolean): Promise<UserMetadata | null> {
        return fetchUserMetadataByUserIdWithIdCheck(authUrl, integrationApiKey, userId, includeOrgs)
    }

    function fetchUserMetadataByEmail(email: string, includeOrgs?: boolean): Promise<UserMetadata | null> {
        return fetchUserMetadataByQuery(authUrl, integrationApiKey, "email", {
            email: email,
            include_orgs: includeOrgs || false,
        })
    }

    function fetchUserMetadataByUsername(username: string, includeOrgs?: boolean): Promise<UserMetadata | null> {
        return fetchUserMetadataByQuery(authUrl, integrationApiKey, "username", {
            username: username,
            include_orgs: includeOrgs || false,
        })
    }

    function fetchBatchUserMetadataByUserIds(
        userIds: string[],
        includeOrgs?: boolean
    ): Promise<{ [userId: string]: UserMetadata }> {
        return fetchBatchUserMetadata(
            authUrl,
            integrationApiKey,
            "user_ids",
            userIds,
            (x) => x.userId,
            includeOrgs || false
        )
    }

    function fetchBatchUserMetadataByEmails(
        emails: string[],
        includeOrgs?: boolean
    ): Promise<{ [email: string]: UserMetadata }> {
        return fetchBatchUserMetadata(
            authUrl,
            integrationApiKey,
            "emails",
            emails,
            (x) => x.email,
            includeOrgs || false
        )
    }

    function fetchBatchUserMetadataByUsernames(
        usernames: string[],
        includeOrgs?: boolean
    ): Promise<{ [username: string]: UserMetadata }> {
        return fetchBatchUserMetadata(
            authUrl,
            integrationApiKey,
            "usernames",
            usernames,
            (x) => x.username || "",
            includeOrgs || false
        )
    }

    function fetchOrgWrapper(orgId: string): Promise<Organization | null> {
        return fetchOrg(authUrl, integrationApiKey, orgId)
    }

    function fetchOrgsByQueryWrapper(orgQuery: OrgQuery): Promise<OrgQueryResponse> {
        return fetchOrgByQuery(authUrl, integrationApiKey, orgQuery)
    }

    function fetchCustomRoleMappingsWrapper(): Promise<CustomRoleMappings> {
        return fetchCustomRoleMappings(authUrl, integrationApiKey)
    }

    function fetchUsersByQueryWrapper(usersQuery: UsersQuery): Promise<UsersPagedResponse> {
        return fetchUsersByQuery(authUrl, integrationApiKey, usersQuery)
    }

    function fetchUsersInOrgWrapper(usersInOrgQuery: UsersInOrgQuery): Promise<UsersPagedResponse> {
        return fetchUsersInOrg(authUrl, integrationApiKey, usersInOrgQuery)
    }

    function fetchUserSignupQueryParamsWrapper(userId: string): Promise<UserSignupQueryParams | null> {
        return fetchUserSignupQueryParams(authUrl, integrationApiKey, userId)
    }

    function createUserWrapper(createUserRequest: CreateUserRequest): Promise<CreatedUser> {
        return createUser(authUrl, integrationApiKey, createUserRequest)
    }

    function clearUserPasswordWrapper(userId: string): Promise<boolean> {
        return clearUserPassword(authUrl, integrationApiKey, userId)
    }

    function updateUserMetadataWrapper(
        userId: string,
        updateUserMetadataRequest: UpdateUserMetadataRequest
    ): Promise<boolean> {
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

    function resendEmailConfirmationWrapper(userId: string): Promise<boolean> {
        return resendEmailConfirmation(authUrl, integrationApiKey, userId)
    }

    function updateUserEmailWrapper(userId: string, updateUserEmailRequest: UpdateUserEmailRequest): Promise<boolean> {
        return updateUserEmail(authUrl, integrationApiKey, userId, updateUserEmailRequest)
    }

    function updateUserPasswordWrapper(
        userId: string,
        updateUserPasswordRequest: UpdateUserPasswordRequest
    ): Promise<boolean> {
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

    function migrateUserFromExternalSourceWrapper(
        migrateUserFromExternalSourceRequest: MigrateUserFromExternalSourceRequest
    ): Promise<CreatedUser> {
        return migrateUserFromExternalSource(authUrl, integrationApiKey, migrateUserFromExternalSourceRequest)
    }

    function createOrgWrapper(createOrgRequest: CreateOrgRequest): Promise<CreatedOrg> {
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

    function subscribeOrgToRoleMappingWrapper(orgId: string, customRoleMappingName: string): Promise<boolean> {
        return subscribeOrgToRoleMapping(authUrl, integrationApiKey, orgId, customRoleMappingName)
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

    function inviteUserToOrgWrapper(inviteUserToOrgRequest: InviteUserToOrgRequest): Promise<boolean> {
        return inviteUserToOrg(authUrl, integrationApiKey, inviteUserToOrgRequest)
    }

    function logoutAllUserSessionsWrapper(userId: string): Promise<boolean> {
        return logoutAllUserSessions(authUrl, integrationApiKey, userId)
    }

    function fetchPendingInvitesWrapper(params?: FetchPendingInvitesParams): Promise<PendingInvitesPage> {
        return fetchPendingInvites(authUrl, integrationApiKey, params)
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
        fetchTokenVerificationMetadata: fetchTokenVerificationMetadataWrapper,
        fetchUserMetadataByUserId,
        fetchUserMetadataByEmail,
        fetchUserMetadataByUsername,
        fetchBatchUserMetadataByUserIds,
        fetchBatchUserMetadataByEmails,
        fetchBatchUserMetadataByUsernames,
        fetchOrg: fetchOrgWrapper,
        fetchOrgByQuery: fetchOrgsByQueryWrapper,
        fetchCustomRoleMappings: fetchCustomRoleMappingsWrapper,
        fetchUsersByQuery: fetchUsersByQueryWrapper,
        fetchUsersInOrg: fetchUsersInOrgWrapper,
        fetchUserSignupQueryParams: fetchUserSignupQueryParamsWrapper,

        // user management functions
        createUser: createUserWrapper,
        updateUserMetadata: updateUserMetadataWrapper,
        updateUserEmail: updateUserEmailWrapper,
        updateUserPassword: updateUserPasswordWrapper,
        clearUserPassword: clearUserPasswordWrapper,
        createMagicLink: createMagicLinkWrapper,
        createAccessToken: createAccessTokenWrapper,
        migrateUserFromExternalSource: migrateUserFromExternalSourceWrapper,
        deleteUser: deleteUserWrapper,
        disableUser: disableUserWrapper,
        enableUser: enableUserWrapper,
        disableUser2fa: disableUser2faWrapper,
        resendEmailConfirmation: resendEmailConfirmationWrapper,
        enableUserCanCreateOrgs: enableUserCanCreateOrgsWrapper,
        disableUserCanCreateOrgs: disableUserCanCreateOrgsWrapper,
        logoutAllUserSessions: logoutAllUserSessionsWrapper,
        // org management functions
        createOrg: createOrgWrapper,
        addUserToOrg: addUserToOrgWrapper,
        changeUserRoleInOrg: changeUserRoleInOrgWrapper,
        removeUserFromOrg: removeUserFromOrgWrapper,
        updateOrg: updateOrgWrapper,
        subscribeOrgToRoleMapping: subscribeOrgToRoleMappingWrapper,
        deleteOrg: deleteOrgWrapper,
        allowOrgToSetupSamlConnection: allowOrgToSetupSamlConnectionWrapper,
        disallowOrgToSetupSamlConnection: disallowOrgToSetupSamlConnectionWrapper,
        inviteUserToOrg: inviteUserToOrgWrapper,
        fetchPendingInvites: fetchPendingInvitesWrapper,
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
