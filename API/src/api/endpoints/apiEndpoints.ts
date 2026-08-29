export const ApiEndpoints = {
    reports: "/api/v1/reports",
    reportsMe: "/api/v1/reports/me",
    reportById: "/api/v1/reports/:id",
    recentWeeklyReports: "/api/v1/reports/recent-weekly-reports",


    // Them endpoint khac o day khi mo rong...
} as const;

export type ApiEndpointKey = keyof typeof ApiEndpoints;
