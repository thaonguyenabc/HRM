import dotenv from "dotenv";

// Load environment variables
const result = dotenv.config();

export const config = {
    baseUrl: process.env.BASE_URL!,
    headless: process.env.HEADLESS === "true",
} as const;
