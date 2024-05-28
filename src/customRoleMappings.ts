export type CustomRoleMappings = {
    customRoleMappings: CustomRoleMapping[]
}

export type CustomRoleMapping = {
    customRoleMappingId: string | null
    customRoleMappingName: string
    numOrgsSubscribed: number
}