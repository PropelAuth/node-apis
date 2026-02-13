export type ReportPagination = {
    pageSize?: number,
    pageNumber?: number,
}

// org report types

export type OrgReportRecord = {
    id: string,
    reportId: string,
    orgId: string,
    name: string,
    numUsers: number,
    orgCreatedAt: number,
    extraProperties: { [key: string]: any },
}

export type OrgReport = {
    orgReports: OrgReportRecord[],
    currentPage: number,
    totalCount: number,
    pageSize: number,
    hasMoreResults: boolean,
    reportTime: number,
}

export enum OrgReportType {
    ATTRITION = "attrition",
    REENGAGEMENT = "reengagement",
    GROWTH = "growth",
    CHURN = "churn",
}

// user report types

export type UserOrgMembershipForReport = {
    displayName: string,
    orgId: string,
    userRole: string,
}

export type UserReportRecord = {
    id: string,
    reportId: string,
    userId: string,
    email: string,
    userCreatedAt: number,
    lastActiveAt: number,
    username?: string,
    firstName?: string,
    lastName?: string,
    orgData?: UserOrgMembershipForReport[],
    extraProperties: { [key: string]: any },
}

export type UserReport = {
    userReports: UserReportRecord[],
    currentPage: number,
    totalCount: number,
    pageSize: number,
    hasMoreResults: boolean,
    reportTime: number,
}

export enum UserReportType {
    REENGAGEMENT = "reengagement",
    CHURN = "churn",
    TOP_INVITERS = "top_inviter",
    CHAMPION = "champion",
}

// report interval options

export enum ReengagementReportInterval {
    WEEKLY = "Weekly",
    MONTHLY = "Monthly",
}
export enum ChurnReportInterval {
    SEVEN_DAYS = "7",
    FOURTEEN_DAYS = "14",
    THIRTY_DAYS = "30",
}
export enum GrowthReportInterval {
    THIRTY_DAYS = "30",
    SIXTY_DAYS = "60",
    NINETY_DAYS = "90",
}
export enum TopInviterReportInterval {
    THIRTY_DAYS = "30",
    SIXTY_DAYS = "60",
    NINETY_DAYS = "90",
}
export enum ChampionReportInterval {
    THIRTY_DAYS = "30",
    SIXTY_DAYS = "60",
    NINETY_DAYS = "90",
}
export enum AttritionReportInterval {
    THIRTY_DAYS = "30",
    SIXTY_DAYS = "60",
    NINETY_DAYS = "90",
}