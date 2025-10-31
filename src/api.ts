import { AccessToken, createAccessToken, CreateAccessTokenRequest } from "./api/accessToken"
import {
    ApiKeysCreateRequest,
    ApiKeysQueryRequest,
    ApiKeyUpdateRequest,
    ApiKeyUsageQueryRequest,
    ApiKeyUsageQueryResponse,
    createApiKey,
    deleteApiKey,
    fetchApiKey,
    fetchApiKeyUsage,
    fetchArchivedApiKeys,
    fetchCurrentApiKeys,
    updateApiKey,
    validateApiKey,
    importApiKey,
    ApiKeysImportRequest,
    ApiKeysImportResponse,
    validateImportedApiKey
} from "./api/endUserApiKeys"
import {
    StepUpMfaVerifyTotpResponse,
    VerifyTotpChallengeRequest,
    verifyStepUpTotpChallenge,
} from "./api/mfa/verifyTotp"
import {
    sendSmsMfaCode,
    SendSmsMfaCodeRequestResponse,
    SendSmsMfaCodeRequest
} from "./api/mfa/sendSmsMfaCode"
import {
    verifySmsChallenge,
    VerifySmsChallengeRequest,
    VerifySmsChallengeResponse
} from "./api/mfa/verifySmsChallenge"
import { StepUpMfaVerifyGrantResponse, VerifyStepUpGrantRequest, verifyStepUpGrant } from "./api/mfa/verifyGrant"
import { createMagicLink, CreateMagicLinkRequest, MagicLink } from "./api/magicLink"
import { fetchEmployeeById, Employee } from "./api/employee"
import {
    migrateUserFromExternalSource,
    MigrateUserFromExternalSourceRequest,
    migrateUserPassword,
    MigrateUserPasswordRequest,
} from "./api/migrateUser"
import {
    addUserToOrg,
    AddUserToOrgRequest,
    allowOrgToSetupSamlConnection,
    changeUserRoleInOrg,
    ChangeUserRoleInOrgRequest,
    createOrg,
    CreateOrgRequest,
    createOrgSamlConnectionLink,
    CreateSamlConnectionLinkResponse,
    deleteOrg,
    deleteSamlConnection,
    disallowOrgToSetupSamlConnection,
    fetchCustomRoleMappings,
    fetchOrg,
    fetchOrgByQuery,
    fetchPendingInvites,
    FetchPendingInvitesParams,
    fetchSamlSpMetadata,
    FetchSamlSpMetadataResponse,
    OrgQuery,
    OrgQueryResponse,
    PendingInvitesPage,
    removeUserFromOrg,
    RemoveUserFromOrgRequest,
    revokePendingOrgInvite,
    RevokePendingOrgInviteRequest,
    samlGoLive,
    setSamlIdpMetadata,
    SetSamlIdpMetadataRequest,
    subscribeOrgToRoleMapping,
    updateOrg,
    UpdateOrgRequest,
} from "./api/org"
import { fetchTokenVerificationMetadata, TokenVerificationMetadata } from "./api/tokenVerificationMetadata"
import {
    clearUserPassword,
    createUser,
    CreateUserRequest,
    deleteUser,
    disableUser,
    disableUser2fa,
    disableUserCanCreateOrgs,
    enableUser,
    enableUserCanCreateOrgs,
    fetchBatchUserMetadata,
    fetchUserMetadataByQuery,
    fetchUserMetadataByUserIdWithIdCheck,
    fetchUsersByQuery,
    fetchUserSignupQueryParams,
    fetchUsersInOrg,
    inviteUserToOrg,
    InviteUserToOrgRequest,
    inviteUserToOrgByUserId,
    InviteUserToOrgByUserIdRequest,
    logoutAllUserSessions,
    resendEmailConfirmation,
    updateUserEmail,
    UpdateUserEmailRequest,
    updateUserMetadata,
    UpdateUserMetadataRequest,
    updateUserPassword,
    UpdateUserPasswordRequest,
    UserSignupQueryParams,
    UsersInOrgQuery,
    UsersPagedResponse,
    UsersInOrgPagedResponse,
    UsersQuery,
    fetchUserMfaMethods,
    MfaPhoneType,
    MfaPhones,
    MfaTotpType,
    FetchUserMfaMethodsResponse
} from "./api/user"
import { CustomRoleMappings } from "./customRoleMappings"
import {
    ApiKeyFull,
    ApiKeyNew,
    ApiKeyResultPage,
    ApiKeyValidation,
    CreatedOrg,
    CreatedUser,
    Organization,
    OrgApiKeyValidation,
    PersonalApiKeyValidation,
    UserMetadata,
} from "./user"
import { validateOrgApiKey, validatePersonalApiKey } from "./validators"

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

    function fetchUsersInOrgWrapper(usersInOrgQuery: UsersInOrgQuery): Promise<UsersInOrgPagedResponse> {
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

    function fetchEmployeeByIdWrapper(employeeId: string): Promise<Employee | null> {
        return fetchEmployeeById(authUrl, integrationApiKey, employeeId)
    }

    function migrateUserFromExternalSourceWrapper(
        migrateUserFromExternalSourceRequest: MigrateUserFromExternalSourceRequest
    ): Promise<CreatedUser> {
        return migrateUserFromExternalSource(authUrl, integrationApiKey, migrateUserFromExternalSourceRequest)
    }

    function migrateUserPasswordWrapper(migrateUserPasswordRequest: MigrateUserPasswordRequest): Promise<boolean> {
        return migrateUserPassword(authUrl, integrationApiKey, migrateUserPasswordRequest)
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

    function createOrgSamlConnectionLinkWrapper(
        orgId: string,
        expiresInSeconds?: number
    ): Promise<CreateSamlConnectionLinkResponse> {
        return createOrgSamlConnectionLink(authUrl, integrationApiKey, orgId, expiresInSeconds)
    }

    function fetchSamlSpMetadataWrapper(orgId: string): Promise<FetchSamlSpMetadataResponse> {
        return fetchSamlSpMetadata(authUrl, integrationApiKey, orgId)
    }

    function setSamlIdpMetadataWrapper(orgId: string, samlIdpMetadata: SetSamlIdpMetadataRequest): Promise<boolean> {
        return setSamlIdpMetadata(authUrl, integrationApiKey, orgId, samlIdpMetadata)
    }

    function samlGoLiveWrapper(orgId: string): Promise<boolean> {
        return samlGoLive(authUrl, integrationApiKey, orgId)
    }

    function deleteSamlConnectionWrapper(orgId: string): Promise<boolean> {
        return deleteSamlConnection(authUrl, integrationApiKey, orgId)
    }

    function inviteUserToOrgWrapper(inviteUserToOrgRequest: InviteUserToOrgRequest): Promise<boolean> {
        return inviteUserToOrg(authUrl, integrationApiKey, inviteUserToOrgRequest)
    }

    function inviteUserToOrgByUserIdWrapper(inviteUserToOrgByUserIdRequest: InviteUserToOrgByUserIdRequest): Promise<boolean> {
        return inviteUserToOrgByUserId(authUrl, integrationApiKey, inviteUserToOrgByUserIdRequest)
    }

    function logoutAllUserSessionsWrapper(userId: string): Promise<boolean> {
        return logoutAllUserSessions(authUrl, integrationApiKey, userId)
    }

    function fetchPendingInvitesWrapper(params?: FetchPendingInvitesParams): Promise<PendingInvitesPage> {
        return fetchPendingInvites(authUrl, integrationApiKey, params)
    }

    function revokePendingOrgInviteWrapper(
        revokePendingOrgInviteRequest: RevokePendingOrgInviteRequest
    ): Promise<boolean> {
        return revokePendingOrgInvite(authUrl, integrationApiKey, revokePendingOrgInviteRequest)
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

    function verifyStepUpTotpChallengeWrapper(
        verifyTotpChallengeRequest: VerifyTotpChallengeRequest
    ): Promise<StepUpMfaVerifyTotpResponse> {
        return verifyStepUpTotpChallenge(authUrl, integrationApiKey, verifyTotpChallengeRequest)
    }

    function verifyStepUpGrantWrapper(
        verifyStepUpGrantRequest: VerifyStepUpGrantRequest
    ): Promise<StepUpMfaVerifyGrantResponse> {
        return verifyStepUpGrant(authUrl, integrationApiKey, verifyStepUpGrantRequest)
    }

    function fetchApiKeyUsageWrapper(
        apiKeyUsageQuery: ApiKeyUsageQueryRequest
    ): Promise<ApiKeyUsageQueryResponse> {
        return fetchApiKeyUsage(authUrl, integrationApiKey, apiKeyUsageQuery)
    }

    function importApiKeyWrapper(
        apiKeysImportRequest: ApiKeysImportRequest
    ): Promise<ApiKeysImportResponse> {
        return importApiKey(authUrl, integrationApiKey, apiKeysImportRequest)
    }

    function validateImportedApiKeyWrapper(
        apiKeyToken: string
    ): Promise<ApiKeyValidation> {
        return validateImportedApiKey(authUrl, integrationApiKey, apiKeyToken)
    }

    function fetchUserMfaMethodsWrapper(
        userId: string
    ): Promise<FetchUserMfaMethodsResponse | null> {
        return fetchUserMfaMethods(authUrl, integrationApiKey, userId)
    }

    function sendSmsMfaCodeWrapper(
        sendSmsMfaCodeRequest: SendSmsMfaCodeRequest
    ): Promise<SendSmsMfaCodeRequestResponse> {
        return sendSmsMfaCode(authUrl, integrationApiKey, sendSmsMfaCodeRequest)
    }

    function verifySmsChallengeWrapper(
        verifySmsChallengeRequest: VerifySmsChallengeRequest
    ): Promise<VerifySmsChallengeResponse> {
        return verifySmsChallenge(authUrl, integrationApiKey, verifySmsChallengeRequest)
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
        migrateUserPassword: migrateUserPasswordWrapper,
        deleteUser: deleteUserWrapper,
        disableUser: disableUserWrapper,
        enableUser: enableUserWrapper,
        disableUser2fa: disableUser2faWrapper,
        resendEmailConfirmation: resendEmailConfirmationWrapper,
        enableUserCanCreateOrgs: enableUserCanCreateOrgsWrapper,
        disableUserCanCreateOrgs: disableUserCanCreateOrgsWrapper,
        logoutAllUserSessions: logoutAllUserSessionsWrapper,
        fetchUserMfaMethods: fetchUserMfaMethodsWrapper,
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
        createOrgSamlConnectionLink: createOrgSamlConnectionLinkWrapper,
        inviteUserToOrg: inviteUserToOrgWrapper,
        inviteUserToOrgByUserId: inviteUserToOrgByUserIdWrapper,
        fetchPendingInvites: fetchPendingInvitesWrapper,
        revokePendingOrgInvite: revokePendingOrgInviteWrapper,
        fetchSamlSpMetadata: fetchSamlSpMetadataWrapper,
        setSamlIdpMetadata: setSamlIdpMetadataWrapper,
        samlGoLive: samlGoLiveWrapper,
        deleteSamlConnection: deleteSamlConnectionWrapper,
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
        fetchApiKeyUsage: fetchApiKeyUsageWrapper,
        importApiKey: importApiKeyWrapper,
        validateImportedApiKey: validateImportedApiKeyWrapper,
        // step-up mfa functions
        verifyStepUpTotpChallenge: verifyStepUpTotpChallengeWrapper,
        verifyStepUpGrant: verifyStepUpGrantWrapper,
        sendSmsMfaCode: sendSmsMfaCodeWrapper,
        verifySmsChallenge: verifySmsChallengeWrapper,
        // employee functions
        fetchEmployeeById: fetchEmployeeByIdWrapper,
    }
}
