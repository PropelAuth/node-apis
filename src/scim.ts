export type FetchOrgScimGroupsRequest = {
    orgId: string
    userId?: string
    pageSize?: number
    pageNumber?: number
}

export type FetchScimGroupRequest = {
    orgId: string
    groupId: string
}

export type ScimGroupResult = {
    groupId: string
    displayName: string
    externalIdFromIdp?: string
}

export type ScimGroupResultPage = {
    groups: ScimGroupResult[]
    pageNumber: number
    pageSize: number
    totalGroups: number
}

export type ScimGroupMember = {
    userId: string
}

export type ScimGroup = {
    groupId: string
    displayName: string
    externalIdFromIdp?: string
    members: ScimGroupMember[]
}
