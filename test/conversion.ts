import { parseSnakeCaseToCamelCase } from "../src/utils"
import { InternalUser, OrgMemberInfo, toUser, User, UserClass } from "../src"

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
            },
        },
        loginMethod: { loginMethod: "password" },
    }

    expect(parseSnakeCaseToCamelCase(JSON.stringify(snakeCase))).toEqual(camelCase)
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
                user_role: "Admin",
                inherited_user_roles_plus_current_role: ["Admin", "Member"],
                user_permissions: ["read", "write"],
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
                user_role: "Owner",
                inherited_user_roles_plus_current_role: ["Owner", "Admin", "Member"],
                user_permissions: [],
            },
            "4ca20d17-5021-4d62-8b3d-148214fa8d6d": {
                org_id: "4ca20d17-5021-4d62-8b3d-148214fa8d6d",
                org_name: "orgB",
                org_metadata: { orgdata_b: "orgvalue_b" },
                url_safe_org_name: "orgb",
                user_role: "Admin",
                inherited_user_roles_plus_current_role: ["Admin", "Member"],
                user_permissions: [],
            },
            "15a31d0c-d284-4e7b-80a2-afb23f939cc3": {
                org_id: "15a31d0c-d284-4e7b-80a2-afb23f939cc3",
                org_name: "orgC",
                org_metadata: { orgdata_c: "orgvalue_c" },
                url_safe_org_name: "orgc",
                user_role: "Member",
                inherited_user_roles_plus_current_role: ["Member"],
                user_permissions: [],
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
                []
            ),
            "4ca20d17-5021-4d62-8b3d-148214fa8d6d": new OrgMemberInfo(
                "4ca20d17-5021-4d62-8b3d-148214fa8d6d",
                "orgB",
                { orgdata_b: "orgvalue_b" },
                "orgb",
                "Admin",
                ["Admin", "Member"],
                []
            ),
            "15a31d0c-d284-4e7b-80a2-afb23f939cc3": new OrgMemberInfo(
                "15a31d0c-d284-4e7b-80a2-afb23f939cc3",
                "orgC",
                { orgdata_c: "orgvalue_c" },
                "orgc",
                "Member",
                ["Member"],
                []
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
            user_role: "Owner",
            inherited_user_roles_plus_current_role: ["Owner", "Admin", "Member"],
            user_permissions: [],
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
