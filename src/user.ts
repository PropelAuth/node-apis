export type User = {
    userId: string
    orgIdToOrgMemberInfo?: OrgIdToOrgMemberInfo

    // Metadata about the user
    email: string
    firstName?: string,
    lastName?: string,
    username?: string,

    // If you used our migration APIs to migrate this user from a different system,
    //   this is their original ID from that system.
    legacyUserId?: string
    impersonatorUserId?: string
    metadata?: {[key: string]: any}
    properties?: {[key: string]: any}
}

export type Org = {
    orgId: string,
    name: string,
    maxUsers?: number,
}

export type UserMetadata = {
    userId: string

    email: string
    emailConfirmed: boolean,

    username?: string
    firstName?: string,
    lastName?: string,
    pictureUrl?: string,

    locked: boolean,
    enabled: boolean,
    mfaEnabled: boolean,
    canCreateOrgs: boolean,

    createdAt: number,
    lastActiveAt: number,

    orgIdToOrgInfo?: OrgIdToOrgMemberInfo

    // If you used our migration APIs to migrate this user from a different system,
    //   this is their original ID from that system.
    legacyUserId?: string
    impersonatorUserId?: string
    metadata?: {[key: string]: any}
    properties?: {[key: string]: any}
}

export class OrgMemberInfo {
    public readonly orgId: string
    public readonly orgName: string
    public readonly orgMetadata: {[key: string]: any}
    public readonly urlSafeOrgName: string

    private readonly userAssignedRole: string
    private readonly userInheritedRolesPlusCurrentRole: string[]
    private readonly userPermissions: string[]

    constructor(orgId: string, orgName: string, orgMetadata: {[key: string]: any}, urlSafeOrgName: string, userAssignedRole: string, userInheritedRolesPlusCurrentRole: string[], userPermissions: string[]) {
        this.orgId = orgId
        this.orgName = orgName
        this.orgMetadata = orgMetadata
        this.urlSafeOrgName = urlSafeOrgName

        this.userAssignedRole = userAssignedRole
        this.userInheritedRolesPlusCurrentRole = userInheritedRolesPlusCurrentRole
        this.userPermissions = userPermissions
    }

    // validation methods

    public isRole(role: string): boolean {
        return this.userAssignedRole === role
    }

    public isAtLeastRole(role: string): boolean {
        return this.userInheritedRolesPlusCurrentRole.includes(role)
    }

    public hasPermission(permission: string): boolean {
        return this.userPermissions.includes(permission)
    }

    public hasAllPermissions(permissions: string[]): boolean {
        return permissions.every(permission => this.hasPermission(permission))
    }

    public get assignedRole(): string {
        return this.userAssignedRole
    }

    public get permissions(): string[] {
        return this.userPermissions
    }

    // getters for the private fields
    get inheritedRolesPlusCurrentRole(): string[] {
        return this.userInheritedRolesPlusCurrentRole
    }
}

export type UserAndOrgMemberInfo = {
    user: User
    orgMemberInfo: OrgMemberInfo
}

export type OrgIdToOrgMemberInfo = {
    [orgId: string]: OrgMemberInfo
}

export type ApiKeyNew = {
    apiKeyId: string
    apiKeyToken: string
}

export type ApiKeyFull = {
    apiKeyId: string
    createdAt: number
    expiresAtSeconds: number
    metadata: {[key: string]: any}
    userId: string
    orgId: string
}

export type ApiKeyResultPage = {
    apiKeys: ApiKeyFull[]
    totalApiKeys: number
    currentPage: number
    pageSize: number
    hasMoreResults: boolean
}

export type ApiKeyValidation = {
    metadata?: {[key: string]: any}
    user?: UserMetadata,
    org?: Org,
    userInOrg?: OrgMemberInfo
}

export type PersonalApiKeyValidation = {
    metadata?: {[key: string]: any}
    user: UserMetadata,
}

export type OrgApiKeyValidation = {
    metadata?: {[key: string]: any}
    org: Org,
    user?: UserMetadata,
    userInOrg?: OrgMemberInfo
}