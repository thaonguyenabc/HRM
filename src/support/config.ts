import dotenv from "dotenv";

dotenv.config();

export const config = {
    baseUrl: process.env.BASE_URL!,
    headless: process.env.HEADLESS ? process.env.HEADLESS === "true" : true,

    credentials: {
        email: process.env.MS_EMAIL!,
        password: process.env.MS_PASSWORD!,
    },
} as const;
