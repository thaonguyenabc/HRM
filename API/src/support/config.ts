import dotenv from "dotenv";

dotenv.config();

export const config = {
    baseUrl: process.env.HRM_BASE_URL!,
    umsBaseUrl: process.env.UMS_BASE_URL!,
    refreshToken: process.env.HRM_REFRESH_TOKEN || "",
    tokens: {
        employee01: process.env.EMPLOYEE01_TOKEN || "",
        manager01: process.env.MANAGER01_TOKEN || "",
        hradmin01: process.env.HRADMIN01_TOKEN || "",
    },
} as const;

export type TokenKey = keyof typeof config.tokens;
