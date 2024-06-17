import { parseSnakeCaseToCamelCase } from "../src/utils"
import { InternalUser, OrgMemberInfo, toUser, User, UserClass } from "../src"
import { OrgRoleStructure } from "../src/user"

test("parseSnakeCaseToCamelCase converts correctly", async () => {
    const snakeCase = {
        user_id: "cbf064e2-edaa-4d35-b413-a8d857329c12",
        email: "easteregg@propelauth.com",
        first_name: "easter",
        org_id_to_org_member_info: {
            "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a": {
                org_id: "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a",
                org_name: "orgA",
                org_metadata: { orgdata_a: "orgvalue_a" },
                org_role_structure: OrgRoleStructure.SingleRole,
                user_role: "Owner",
                inherited_user_roles_plus_current_role: ["Owner", "Admin", "Member"],
                user_permissions: [],
                additional_roles: [],
            },
        },
        login_method: { login_method: "password" },
    }
    const camelCase = {
        userId: "cbf064e2-edaa-4d35-b413-a8d857329c12",
        email: "easteregg@propelauth.com",
        firstName: "easter",
        orgIdToOrgMemberInfo: {
            "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a": {
                orgId: "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a",
                orgName: "orgA",
                orgMetadata: { orgdata_a: "orgvalue_a" },
                orgRoleStructure: OrgRoleStructure.SingleRole,
                userAssignedRole: "Owner",
                userInheritedRolesPlusCurrentRole: ["Owner", "Admin", "Member"],
                userPermissions: [],
                userAssignedAdditionalRoles: [],
            },
        },
        loginMethod: { loginMethod: "password" },
    }

    expect(parseSnakeCaseToCamelCase(JSON.stringify(snakeCase))).toEqual(camelCase)

    const snakeCaseJson = {
        first_name: "John",
        last_name: "Doe",
        contact_info: {
            email_address: "john.doe@example.com",
            phone_number: "123-456-7890",
        },
        hobbies: [
            {
                hobby_name: "Reading",
                hobby_level: "Intermediate",
            },
            {
                hobby_name: "Swimming",
                hobby_level: "Advanced",
            },
        ],
    }
    const camelCaseJson = {
        firstName: "John",
        lastName: "Doe",
        contactInfo: {
            emailAddress: "john.doe@example.com",
            phoneNumber: "123-456-7890",
        },
        hobbies: [
            {
                hobbyName: "Reading",
                hobbyLevel: "Intermediate",
            },
            {
                hobbyName: "Swimming",
                hobbyLevel: "Advanced",
            },
        ],
    }

    expect(parseSnakeCaseToCamelCase(JSON.stringify(snakeCaseJson))).toEqual(camelCaseJson)
})

test("parseSnakeCaseToCamelCase adds functions to orgMemberInfo", async () => {
    const snakeCase = {
        user_id: "cbf064e2-edaa-4d35-b413-a8d857329c12",
        email: "easteregg@propelauth.com",
        first_name: "easter",
        org_id_to_org_member_info: {
            "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a": {
                org_id: "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a",
                org_name: "orgA",
                org_metadata: { orgdata_a: "orgvalue_a" },
                url_safe_org_name: "orga",
                org_role_structure: OrgRoleStructure.SingleRole,
                user_role: "Admin",
                inherited_user_roles_plus_current_role: ["Admin", "Member"],
                user_permissions: ["read", "write"],
                additional_roles: [],
            },
        },
    }

    const camelCase = parseSnakeCaseToCamelCase(JSON.stringify(snakeCase))
    const orgMemberInfo = camelCase.orgIdToOrgMemberInfo["99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a"]
    expect(orgMemberInfo.isRole("Admin")).toEqual(true)
})

test("toUser converts correctly with orgs", async () => {
    const internalUser: InternalUser = {
        user_id: "cbf064e2-edaa-4d35-b413-a8d857329c12",
        email: "easteregg@propelauth.com",
        first_name: "easter",
        org_id_to_org_member_info: {
            "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a": {
                org_id: "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a",
                org_name: "orgA",
                org_metadata: { orgdata_a: "orgvalue_a" },
                url_safe_org_name: "orga",
                org_role_structure: OrgRoleStructure.SingleRole,
                user_role: "Owner",
                inherited_user_roles_plus_current_role: ["Owner", "Admin", "Member"],
                user_permissions: [],
                additional_roles: [],
            },
            "4ca20d17-5021-4d62-8b3d-148214fa8d6d": {
                org_id: "4ca20d17-5021-4d62-8b3d-148214fa8d6d",
                org_name: "orgB",
                org_metadata: { orgdata_b: "orgvalue_b" },
                url_safe_org_name: "orgb",
                org_role_structure: OrgRoleStructure.SingleRole,
                user_role: "Admin",
                inherited_user_roles_plus_current_role: ["Admin", "Member"],
                user_permissions: [],
                additional_roles: [],
            },
            "15a31d0c-d284-4e7b-80a2-afb23f939cc3": {
                org_id: "15a31d0c-d284-4e7b-80a2-afb23f939cc3",
                org_name: "orgC",
                org_metadata: { orgdata_c: "orgvalue_c" },
                url_safe_org_name: "orgc",
                org_role_structure: OrgRoleStructure.SingleRole,
                user_role: "Member",
                inherited_user_roles_plus_current_role: ["Member"],
                user_permissions: [],
                additional_roles: [],
            },
        },
    }

    const user: User = {
        userId: "cbf064e2-edaa-4d35-b413-a8d857329c12",
        email: "easteregg@propelauth.com",
        firstName: "easter",
        orgIdToOrgMemberInfo: {
            "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a": new OrgMemberInfo(
                "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a",
                "orgA",
                { orgdata_a: "orgvalue_a" },
                "orga",
                "Owner",
                ["Owner", "Admin", "Member"],
                [],
                OrgRoleStructure.SingleRole,
                []
            ),
            "4ca20d17-5021-4d62-8b3d-148214fa8d6d": new OrgMemberInfo(
                "4ca20d17-5021-4d62-8b3d-148214fa8d6d",
                "orgB",
                { orgdata_b: "orgvalue_b" },
                "orgb",
                "Admin",
                ["Admin", "Member"],
                [],
                OrgRoleStructure.SingleRole,
                []
            ),
            "15a31d0c-d284-4e7b-80a2-afb23f939cc3": new OrgMemberInfo(
                "15a31d0c-d284-4e7b-80a2-afb23f939cc3",
                "orgC",
                { orgdata_c: "orgvalue_c" },
                "orgc",
                "Member",
                ["Member"],
                [],
                OrgRoleStructure.SingleRole,
                []
            ),
        },
        loginMethod: { loginMethod: "unknown" },
    }

    expect(toUser(internalUser)).toEqual(user)
})

test("toUser converts correctly with multiple roles per org", async () => {
    const internalUser: InternalUser = {
        user_id: "cbf064e2-edaa-4d35-b413-a8d857329c12",
        email: "easteregg@propelauth.com",
        first_name: "easter",
        org_id_to_org_member_info: {
            "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a": {
                org_id: "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a",
                org_name: "orgA",
                org_metadata: { orgdata_a: "orgvalue_a" },
                url_safe_org_name: "orga",
                org_role_structure: OrgRoleStructure.MultiRole,
                user_role: "Role A",
                inherited_user_roles_plus_current_role: ["Role A"],
                user_permissions: ["read", "write"],
                additional_roles: [],
            },
            "4ca20d17-5021-4d62-8b3d-148214fa8d6d": {
                org_id: "4ca20d17-5021-4d62-8b3d-148214fa8d6d",
                org_name: "orgB",
                org_metadata: { orgdata_b: "orgvalue_b" },
                url_safe_org_name: "orgb",
                org_role_structure: OrgRoleStructure.MultiRole,
                user_role: "Role A",
                inherited_user_roles_plus_current_role: ["Role A"],
                user_permissions: ["read", "write"],
                additional_roles: ["Role B", "Role C"],
            },
            "15a31d0c-d284-4e7b-80a2-afb23f939cc3": {
                org_id: "15a31d0c-d284-4e7b-80a2-afb23f939cc3",
                org_name: "orgC",
                org_metadata: { orgdata_c: "orgvalue_c" },
                url_safe_org_name: "orgc",
                org_role_structure: OrgRoleStructure.MultiRole,
                user_role: "Role B",
                inherited_user_roles_plus_current_role: ["Role B"],
                user_permissions: ["read", "write"],
                additional_roles: ["Role C"],
            },
        },
    }

    const user: User = {
        userId: "cbf064e2-edaa-4d35-b413-a8d857329c12",
        email: "easteregg@propelauth.com",
        firstName: "easter",
        orgIdToOrgMemberInfo: {
            "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a": new OrgMemberInfo(
                "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a",
                "orgA",
                { orgdata_a: "orgvalue_a" },
                "orga",
                "Role A",
                ["Role A"],
                ["read", "write"],
                OrgRoleStructure.MultiRole,
                []
            ),
            "4ca20d17-5021-4d62-8b3d-148214fa8d6d": new OrgMemberInfo(
                "4ca20d17-5021-4d62-8b3d-148214fa8d6d",
                "orgB",
                { orgdata_b: "orgvalue_b" },
                "orgb",
                "Role A",
                ["Role A"],
                ["read", "write"],
                OrgRoleStructure.MultiRole,
                ["Role B", "Role C"]
            ),
            "15a31d0c-d284-4e7b-80a2-afb23f939cc3": new OrgMemberInfo(
                "15a31d0c-d284-4e7b-80a2-afb23f939cc3",
                "orgC",
                { orgdata_c: "orgvalue_c" },
                "orgc",
                "Role B",
                ["Role B"],
                ["read", "write"],
                OrgRoleStructure.MultiRole,
                ["Role C"]
            ),
        },
        loginMethod: { loginMethod: "unknown" },
    }

    expect(toUser(internalUser)).toEqual(user)
})

test("toUser converts correctly with active org", async () => {
    const internalUser: InternalUser = {
        user_id: "cbf064e2-edaa-4d35-b413-a8d857329c12",
        email: "easteregg@propelauth.com",
        first_name: "easter",
        org_member_info: {
            org_id: "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a",
            org_name: "orgA",
            org_metadata: { orgdata_a: "orgvalue_a" },
            url_safe_org_name: "orga",
            org_role_structure: OrgRoleStructure.SingleRole,
            user_role: "Owner",
            inherited_user_roles_plus_current_role: ["Owner", "Admin", "Member"],
            user_permissions: [],
            additional_roles: [],
        },
    }

    const user: User = {
        userId: "cbf064e2-edaa-4d35-b413-a8d857329c12",
        email: "easteregg@propelauth.com",
        firstName: "easter",
        orgIdToOrgMemberInfo: {
            "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a": new OrgMemberInfo(
                "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a",
                "orgA",
                { orgdata_a: "orgvalue_a" },
                "orga",
                "Owner",
                ["Owner", "Admin", "Member"],
                [],
                OrgRoleStructure.SingleRole,
                []
            ),
        },
        loginMethod: { loginMethod: "unknown" },
        activeOrgId: "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a",
    }

    expect(toUser(internalUser)).toEqual(user)
})

test("toUser converts correctly without orgs", async () => {
    const internalUser: InternalUser = {
        user_id: "cbf064e2-edaa-4d35-b413-a8d857329c12",
        email: "easteregg@propelauth.com",
        username: "easteregg",
        legacy_user_id: "something",
    }
    const user: User = {
        userId: "cbf064e2-edaa-4d35-b413-a8d857329c12",
        email: "easteregg@propelauth.com",
        username: "easteregg",
        legacyUserId: "something",
        loginMethod: { loginMethod: "unknown" },
    }
    expect(toUser(internalUser)).toEqual(user)
})

test("toUser converts login_method correctly", async () => {
    const internalUser: InternalUser = {
        user_id: "cbf064e2-edaa-4d35-b413-a8d857329c12",
        email: "easteregg@propelauth.com",
        username: "easteregg",
        legacy_user_id: "something",
        login_method: { login_method: "saml_sso", org_id: "someOrgId", provider: "Okta" },
    }
    const user: User = {
        userId: "cbf064e2-edaa-4d35-b413-a8d857329c12",
        email: "easteregg@propelauth.com",
        username: "easteregg",
        legacyUserId: "something",
        loginMethod: { loginMethod: "saml_sso", orgId: "someOrgId", provider: "Okta" },
    }
    expect(toUser(internalUser)).toEqual(user)
})

test("UserClass and User match", async () => {
    const user: User = {
        userId: "cbf064e2-edaa-4d35-b413-a8d857329c12",
        email: "easteregg@propelauth.com",
        firstName: "easter",
        orgIdToOrgMemberInfo: {
            "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a": new OrgMemberInfo(
                "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a",
                "orgA",
                { orgdata_a: "orgvalue_a" },
                "orga",
                "Owner",
                ["Owner", "Admin", "Member"],
                [],
                OrgRoleStructure.SingleRole,
                []
            ),
        },
        loginMethod: { loginMethod: "unknown" },
        activeOrgId: "99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a",
    }
    const userClass = new UserClass(user)

    expect(userClass.userId).toEqual(user.userId)
    expect(userClass.email).toEqual(user.email)
    expect(userClass.firstName).toEqual(user.firstName)
    expect(userClass.getOrg("99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a")).toEqual(
        user.orgIdToOrgMemberInfo ? user.orgIdToOrgMemberInfo["99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a"] : undefined
    )
    expect(userClass.getOrgs().length).toEqual(1)
    expect(userClass.getOrgs()[0]).toEqual(
        user.orgIdToOrgMemberInfo ? user.orgIdToOrgMemberInfo["99ee1329-e536-4aeb-8e2b-9f56c1b8fe8a"] : undefined
    )
    expect(userClass.loginMethod).toEqual(user.loginMethod)
    expect(userClass.activeOrgId).toEqual(user.activeOrgId)
})
