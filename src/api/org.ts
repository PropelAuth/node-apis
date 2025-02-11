import { CustomRoleMappings } from "../customRoleMappings"
import {
    AddUserToOrgException,
    ChangeUserRoleInOrgException,
    CreateOrgException,
    RateLimitedException,
    RemoveUserFromOrgException,
    RevokePendingOrgInviteException,
    UpdateOrgException,
} from "../exceptions"
import { httpRequest } from "../http"
import { CreatedOrg, Org, Organization } from "../user"
import { isValidId, parseSnakeCaseToCamelCase } from "../utils"

const BASE_ENDPOINT_PATH = "/api/backend/v1"
const ORG_ENDPOINT_PATH = BASE_ENDPOINT_PATH + "/org"

// GET
export function fetchOrg(authUrl: URL, integrationApiKey: string, orgId: string): Promise<Organization | null> {
    if (!isValidId(orgId)) {
        return Promise.resolve(null)
    }

    return httpRequest(authUrl, integrationApiKey, `${ORG_ENDPOINT_PATH}/${orgId}`, "GET").then((httpResponse) => {
        if (httpResponse.statusCode === 401) {
            throw new Error("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode === 429) {
            throw new RateLimitedException(httpResponse.response)
        } else if (httpResponse.statusCode === 404) {
            return null
        } else if (httpResponse.statusCode === 426) {
            throw new Error(
                "Cannot use organizations unless B2B support is enabled. Enable it in your PropelAuth dashboard."
            )
        } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
            throw new Error("Unknown error when fetching org")
        }

        return parseSnakeCaseToCamelCase(httpResponse.response)
    })
}

export function fetchCustomRoleMappings(authUrl: URL, integrationApiKey: string): Promise<CustomRoleMappings> {
    return httpRequest(authUrl, integrationApiKey, "/api/backend/v1/custom_role_mappings", "GET").then(
        (httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 429) {
                throw new RateLimitedException(httpResponse.response)
            } else if (httpResponse.statusCode === 426) {
                throw new Error(
                    "Cannot use organizations unless B2B support is enabled. Enable it in your PropelAuth dashboard."
                )
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when fetching custom role mappings")
            }

            return parseSnakeCaseToCamelCase(httpResponse.response)
        }
    )
}

export type FetchPendingInvitesParams = {
    orgId?: string
    pageSize?: number
    pageNumber?: number
}
export type PendingInvite = {
    inviteeEmail: string
    orgId: string
    orgName: string
    roleInOrg: string
    additionalRolesInOrg: string[]
    createdAt: number
    expiresAt: number
    inviterEmail?: string
    inviterUserId?: string
}
export type PendingInvitesPage = {
    totalInvites: number
    currentPage: number
    pageSize: number
    hasMoreResults: boolean
    invites: PendingInvite[]
}
export function fetchPendingInvites(
    authUrl: URL,
    integrationApiKey: string,
    params?: FetchPendingInvitesParams
): Promise<PendingInvitesPage> {
    const queryParams = new URLSearchParams()
    if (params?.orgId) {
        queryParams.set("org_id", params.orgId)
    }
    if (params?.pageSize) {
        queryParams.set("page_size", params.pageSize.toString())
    }
    if (params?.pageNumber) {
        queryParams.set("page_number", params.pageNumber.toString())
    }
    const path = `/api/backend/v1/pending_org_invites?${queryParams.toString()}`
    return httpRequest(authUrl, integrationApiKey, path, "GET").then((httpResponse) => {
        if (httpResponse.statusCode === 401) {
            throw new Error("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode === 429) {
            throw new RateLimitedException(httpResponse.response)
        } else if (httpResponse.statusCode === 426) {
            throw new Error(
                "Cannot use organizations unless B2B support is enabled. Enable it in your PropelAuth dashboard."
            )
        } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
            throw new Error("Unknown error when fetching pending invites")
        }

        return parseSnakeCaseToCamelCase(httpResponse.response)
    })
}

export type FetchSamlSpMetadataResponse = {
    entityId: string
    acsUrl: string
    logoutUrl: string
}

export function fetchSamlSpMetadata(
    authUrl: URL,
    integrationApiKey: string,
    orgId: string
): Promise<FetchSamlSpMetadataResponse> {
    const path = BASE_ENDPOINT_PATH + `/saml_sp_metadata/${orgId}`
    return httpRequest(authUrl, integrationApiKey, path, "GET").then((httpResponse) => {
        if (httpResponse.statusCode === 401) {
            throw new Error("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode === 429) {
            throw new RateLimitedException(httpResponse.response)
        } else if (httpResponse.statusCode === 426) {
            throw new Error(
                "Cannot use organizations unless B2B support is enabled. Enable it in your PropelAuth dashboard."
            )
        } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
            throw new Error("Unknown error when fetching custom role mappings")
        }

        return parseSnakeCaseToCamelCase(httpResponse.response)
    })
}

// POST
export type OrgQuery = {
    pageSize?: number
    pageNumber?: number
    orderBy?: "CREATED_AT_ASC" | "CREATED_AT_DESC" | "NAME"
    name?: string
    legacyOrgId?: string
    domain?: string
}

export type OrgQueryResponse = {
    orgs: Org[]
    totalOrgs: number
    currentPage: number
    pageSize: number
    hasMoreResults: boolean
}

export function fetchOrgByQuery(authUrl: URL, integrationApiKey: string, query: OrgQuery): Promise<OrgQueryResponse> {
    const request = {
        page_size: query.pageSize,
        page_number: query.pageNumber,
        order_by: query.orderBy,
        name: query.name,
        legacy_org_id: query.legacyOrgId,
        domain: query.domain,
    }
    return httpRequest(authUrl, integrationApiKey, `${ORG_ENDPOINT_PATH}/query`, "POST", JSON.stringify(request)).then(
        (httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 429) {
                throw new RateLimitedException(httpResponse.response)
            } else if (httpResponse.statusCode === 400) {
                throw new Error("Invalid query " + httpResponse.response)
            } else if (httpResponse.statusCode === 426) {
                throw new Error(
                    "Cannot use organizations unless B2B support is enabled. Enable it in your PropelAuth dashboard."
                )
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when fetching orgs by query")
            }

            return JSON.parse(httpResponse.response, function (key, value) {
                if (key === "org_id") {
                    this.orgId = value
                } else if (key === "org_name") {
                    this.name = value
                } else if (key === "max_users") {
                    this.maxUsers = value
                } else if (key === "legacy_org_id") {
                    this.legacyOrgId = value
                } else if (key === "total_orgs") {
                    this.totalOrgs = value
                } else if (key === "current_page") {
                    this.currentPage = value
                } else if (key === "page_size") {
                    this.pageSize = value
                } else if (key === "has_more_results") {
                    this.hasMoreResults = value
                } else {
                    return value
                }
            })
        }
    )
}

export type CreateOrgRequest = {
    name: string
    domain?: string
    enableAutoJoiningByDomain?: boolean
    membersMustHaveMatchingDomain?: boolean
    maxUsers?: number
    customRoleMappingName?: string
    legacyOrgId?: string
}

type CreateOrgApiRequest = {
    name: string
    domain?: string
    enable_auto_joining_by_domain?: boolean
    members_must_have_matching_domain?: boolean
    max_users?: number
    custom_role_mapping_name?: string
    legacy_org_id?: string
}

export function createOrg(
    authUrl: URL,
    integrationApiKey: string,
    createOrgRequest: CreateOrgRequest
): Promise<CreatedOrg> {
    const {
        name,
        domain,
        enableAutoJoiningByDomain = false,
        membersMustHaveMatchingDomain = false,
        maxUsers,
        customRoleMappingName,
        legacyOrgId,
    } = createOrgRequest
    const request: CreateOrgApiRequest = {
        name,
        enable_auto_joining_by_domain: enableAutoJoiningByDomain,
        members_must_have_matching_domain: membersMustHaveMatchingDomain,
    }
    if (domain) {
        request["domain"] = domain
    }
    if (maxUsers) {
        request["max_users"] = maxUsers
    }
    if (legacyOrgId) {
        request["legacy_org_id"] = legacyOrgId
    }
    if (customRoleMappingName) {
        request["custom_role_mapping_name"] = customRoleMappingName
    }
    return httpRequest(authUrl, integrationApiKey, `${ORG_ENDPOINT_PATH}/`, "POST", JSON.stringify(request)).then(
        (httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 429) {
                throw new RateLimitedException(httpResponse.response)
            } else if (httpResponse.statusCode === 400) {
                throw new CreateOrgException(httpResponse.response)
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when creating org")
            }

            return parseSnakeCaseToCamelCase(httpResponse.response)
        }
    )
}

export type AddUserToOrgRequest = {
    userId: string
    orgId: string
    role: string
    additionalRoles?: string[]
}

export function addUserToOrg(
    authUrl: URL,
    integrationApiKey: string,
    addUserToOrgRequest: AddUserToOrgRequest
): Promise<boolean> {
    const request = {
        user_id: addUserToOrgRequest.userId,
        org_id: addUserToOrgRequest.orgId,
        role: addUserToOrgRequest.role,
        additional_roles: addUserToOrgRequest.additionalRoles ?? [],
    }
    return httpRequest(authUrl, integrationApiKey, `${ORG_ENDPOINT_PATH}/add_user`, "POST", JSON.stringify(request)).then(
        (httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 429) {
                throw new RateLimitedException(httpResponse.response)
            } else if (httpResponse.statusCode === 400) {
                throw new AddUserToOrgException(httpResponse.response)
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when adding user to org")
            }

            return true
        }
    )
}

export type ChangeUserRoleInOrgRequest = {
    userId: string
    orgId: string
    role: string
    additionalRoles?: string[]
}

export function changeUserRoleInOrg(
    authUrl: URL,
    integrationApiKey: string,
    changeUserRoleInOrgRequest: ChangeUserRoleInOrgRequest
): Promise<boolean> {
    const request = {
        user_id: changeUserRoleInOrgRequest.userId,
        org_id: changeUserRoleInOrgRequest.orgId,
        role: changeUserRoleInOrgRequest.role,
        additional_roles: changeUserRoleInOrgRequest.additionalRoles ?? [],
    }
    return httpRequest(
        authUrl,
        integrationApiKey,
        `${ORG_ENDPOINT_PATH}/change_role`,
        "POST",
        JSON.stringify(request)
    ).then((httpResponse) => {
        if (httpResponse.statusCode === 401) {
            throw new Error("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode === 429) {
            throw new RateLimitedException(httpResponse.response)
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

export function removeUserFromOrg(
    authUrl: URL,
    integrationApiKey: string,
    removeUserFromOrgRequest: RemoveUserFromOrgRequest
): Promise<boolean> {
    const request = {
        user_id: removeUserFromOrgRequest.userId,
        org_id: removeUserFromOrgRequest.orgId,
    }
    return httpRequest(
        authUrl,
        integrationApiKey,
        `${ORG_ENDPOINT_PATH}/remove_user`,
        "POST",
        JSON.stringify(request)
    ).then((httpResponse) => {
        if (httpResponse.statusCode === 401) {
            throw new Error("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode === 429) {
            throw new RateLimitedException(httpResponse.response)
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

export function allowOrgToSetupSamlConnection(
    authUrl: URL,
    integrationApiKey: string,
    orgId: string
): Promise<boolean> {
    if (!isValidId(orgId)) {
        return Promise.resolve(false)
    }

    return httpRequest(authUrl, integrationApiKey, `${ORG_ENDPOINT_PATH}/${orgId}/allow_saml`, "POST").then(
        (httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 429) {
                throw new RateLimitedException(httpResponse.response)
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when allowing org to setup SAML connection")
            }

            return true
        }
    )
}

export function disallowOrgToSetupSamlConnection(
    authUrl: URL,
    integrationApiKey: string,
    orgId: string
): Promise<boolean> {
    if (!isValidId(orgId)) {
        return Promise.resolve(false)
    }

    return httpRequest(authUrl, integrationApiKey, `${ORG_ENDPOINT_PATH}/${orgId}/disallow_saml`, "POST").then(
        (httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 429) {
                throw new RateLimitedException(httpResponse.response)
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when disallowing org to setup SAML connection")
            }

            return true
        }
    )
}

export type CreateSamlConnectionLinkResponse = {
    url: string
}

export async function createOrgSamlConnectionLink(
    authUrl: URL,
    integrationApiKey: string,
    orgId: string,
    expiresInSeconds?: number
): Promise<CreateSamlConnectionLinkResponse> {
    if (!isValidId(orgId)) {
        return Promise.reject(new Error("Invalid orgId"))
    }

    const request = {
        expires_in_seconds: expiresInSeconds,
    }

    const response = await httpRequest(
        authUrl,
        integrationApiKey,
        `${ORG_ENDPOINT_PATH}/${orgId}/create_saml_connection_link`,
        "POST",
        JSON.stringify(request)
    )
    if (response.statusCode === 401) {
        throw new Error("integrationApiKey is incorrect")
    } else if (response.statusCode === 429) {
        throw new RateLimitedException(response.response)
    } else if (response.statusCode === 404) {
        throw new Error("Org not found")
    } else if (response.statusCode && response.statusCode >= 400) {
        throw new Error(`Error when creating SAML connection link: ${response.response}`)
    }

    return JSON.parse(response.response)
}

export type SetSamlIdpMetadataRequest = {
    idpEntityId: string
    idpSsoUrl: string
    idpCertificate: string
    provider: IdpProvider
}

export type IdpProvider = "Google" | "Rippling" | "OneLogin" | "JumpCloud" | "Okta" | "Azure" | "Duo" | "Generic";

export function setSamlIdpMetadata(
    authUrl: URL,
    integrationApiKey: string,
    orgId: string,
    setSamlIdpMetadataRequest: SetSamlIdpMetadataRequest
): Promise<boolean> {
    if (!isValidId(orgId)) {
        return Promise.resolve(false)
    }

    let request = {
        org_id: orgId,
        idp_entity_id: setSamlIdpMetadataRequest.idpEntityId,
        idp_sso_url: setSamlIdpMetadataRequest.idpSsoUrl,
        idp_certificate: setSamlIdpMetadataRequest.idpCertificate,
        provider: setSamlIdpMetadataRequest.provider,
    };

    return httpRequest(
        authUrl,
        integrationApiKey,
        `${BASE_ENDPOINT_PATH}/saml_idp_metadata`,
        "POST",
        JSON.stringify(request)
    ).then(
        (httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 429) {
                throw new RateLimitedException(httpResponse.response)
            } else if (httpResponse.statusCode === 400) {
                throw new UpdateOrgException(httpResponse.response)
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when setting the SAML IdP metadata for an org's SAML connection")
            }

            return true
        }
    )
}

export function samlGoLive(
    authUrl: URL,
    integrationApiKey: string,
    orgId: string
): Promise<boolean> {
    if (!isValidId(orgId)) {
        return Promise.resolve(false)
    }

    return httpRequest(authUrl, integrationApiKey, `${BASE_ENDPOINT_PATH}/saml_idp_metadata/go_live/${orgId}`, "POST").then(
        (httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 429) {
                throw new RateLimitedException(httpResponse.response)
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when setting orgs SAML connection to go live")
            }

            return true
        }
    )
}

// PUT/PATCH
export type UpdateOrgRequest = {
    orgId: string
    name?: string
    canSetupSaml?: boolean
    maxUsers?: number
    metadata?: { [key: string]: any }
    canJoinOnEmailDomainMatch?: boolean // In the backend, this is the `domain_autojoin` argument.
    membersMustHaveEmailDomainMatch?: boolean // In the backend, this is the `domain_restrict` argument.
    domain?: string
    legacyOrgId?: string
    // TODO: Add `require_2fa_by` optional argument.
}

export function updateOrg(
    authUrl: URL,
    integrationApiKey: string,
    updateOrgRequest: UpdateOrgRequest
): Promise<boolean> {
    if (!isValidId(updateOrgRequest.orgId)) {
        return Promise.resolve(false)
    }

    const request = {
        name: updateOrgRequest.name,
        can_setup_saml: updateOrgRequest.canSetupSaml,
        metadata: updateOrgRequest.metadata,
        max_users: updateOrgRequest.maxUsers,
        autojoin_by_domain: updateOrgRequest.canJoinOnEmailDomainMatch,
        restrict_to_domain: updateOrgRequest.membersMustHaveEmailDomainMatch,
        domain: updateOrgRequest.domain,
        legacy_org_id: updateOrgRequest.legacyOrgId,
    }
    return httpRequest(
        authUrl,
        integrationApiKey,
        `${ORG_ENDPOINT_PATH}/${updateOrgRequest.orgId}`,
        "PUT",
        JSON.stringify(request)
    ).then((httpResponse) => {
        if (httpResponse.statusCode === 401) {
            throw new Error("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode === 429) {
            throw new RateLimitedException(httpResponse.response)
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

export function subscribeOrgToRoleMapping(
    authUrl: URL,
    integrationApiKey: string,
    orgId: string,
    customRoleMappingName: string
): Promise<boolean> {
    if (!isValidId(orgId)) {
        return Promise.resolve(false)
    }

    const request = {
        custom_role_mapping_name: customRoleMappingName,
    }
    return httpRequest(authUrl, integrationApiKey, `${ORG_ENDPOINT_PATH}/${orgId}`, "PUT", JSON.stringify(request)).then(
        (httpResponse) => {
            if (httpResponse.statusCode === 401) {
                throw new Error("integrationApiKey is incorrect")
            } else if (httpResponse.statusCode === 429) {
                throw new RateLimitedException(httpResponse.response)
            } else if (httpResponse.statusCode === 400) {
                throw new UpdateOrgException(httpResponse.response)
            } else if (httpResponse.statusCode === 404) {
                return false
            } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
                throw new Error("Unknown error when subscribing an org to a role mapping")
            }

            return true
        }
    )
}

// DELETE
export function deleteOrg(authUrl: URL, integrationApiKey: string, orgId: string): Promise<boolean> {
    if (!isValidId(orgId)) {
        return Promise.resolve(false)
    }

    return httpRequest(authUrl, integrationApiKey, `${ORG_ENDPOINT_PATH}/${orgId}`, "DELETE").then((httpResponse) => {
        if (httpResponse.statusCode === 401) {
            throw new Error("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode === 429) {
            throw new RateLimitedException(httpResponse.response)
        } else if (httpResponse.statusCode === 404) {
            return false
        } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
            throw new Error("Unknown error when deleting org")
        }

        return true
    })
}

export type RevokePendingOrgInviteRequest = {
    inviteeEmail: string
    orgId: string
}

export function revokePendingOrgInvite(
    authUrl: URL,
    integrationApiKey: string,
    revokePendingOrgInviteRequest: RevokePendingOrgInviteRequest
): Promise<boolean> {
    const request = {
        invitee_email: revokePendingOrgInviteRequest.inviteeEmail,
        org_id: revokePendingOrgInviteRequest.orgId,
    }
    return httpRequest(
        authUrl,
        integrationApiKey,
        `/api/backend/v1/pending_org_invites`,
        "DELETE",
        JSON.stringify(request)
    ).then((httpResponse) => {
        if (httpResponse.statusCode === 401) {
            throw new Error("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode === 429) {
            throw new RateLimitedException(httpResponse.response)
        } else if (httpResponse.statusCode === 400) {
            throw new RevokePendingOrgInviteException(httpResponse.response)
        } else if (httpResponse.statusCode === 404) {
            return false
        } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
            throw new Error("Unknown error when revoking org invite")
        }

        return true
    })
}

export function deleteSamlConnection(
    authUrl: URL,
    integrationApiKey: string,
    orgId: string
): Promise<boolean> {
    if (!isValidId(orgId)) {
        return Promise.resolve(false)
    }

    return httpRequest(
        authUrl,
        integrationApiKey,
        `${BASE_ENDPOINT_PATH}/saml_idp_metadata/${orgId}`,
        "DELETE"
    ).then((httpResponse) => {
        if (httpResponse.statusCode === 401) {
            throw new Error("integrationApiKey is incorrect")
        } else if (httpResponse.statusCode === 429) {
            throw new RateLimitedException(httpResponse.response)
        } else if (httpResponse.statusCode === 400) {
            throw new RevokePendingOrgInviteException(httpResponse.response)
        } else if (httpResponse.statusCode === 404) {
            return false
        } else if (httpResponse.statusCode && httpResponse.statusCode >= 400) {
            throw new Error("Unknown error when deleting SAML connection")
        }

        return true
    })
}
