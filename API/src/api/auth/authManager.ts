import axios from "axios";
import fs from "node:fs";
import path from "node:path";
import { config } from "../../support/config";

let cachedToken: string | null = null;
let tokenExpiry = 0; // epoch seconds

const ENV_PATH = path.resolve(process.cwd(), ".env");

/**
 * Returns an access token: uses the cached one if still valid; otherwise calls /auth/refresh.
 * HRM uses refresh-token ROTATION - each refresh returns a NEW token via Set-Cookie,
 * so we must read the new token and write it back to .env for the next run.
 */
export async function getAccessToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);

    if (cachedToken && now < tokenExpiry - 60) {
        return cachedToken;
    }

    if (!config.refreshToken) {
        throw new Error(
            "HRM_REFRESH_TOKEN is missing in .env. Run auth.setup.ts (Web project) and copy the new refresh_token here."
        );
    }

    const res = await axios.post(
        `${config.umsBaseUrl}/api/v1/auth/refresh`,
        {},
        {
            headers: {
                "Content-Type": "application/json",
                Cookie: `refresh_token=${config.refreshToken}`,
            },
            validateStatus: () => true,
        }
    );

    const token = res.data?.data?.access_token;
    if (!token) {
        throw new Error(
            `Refresh did not return an access_token (status ${res.status}). Response: ${JSON.stringify(res.data)}`
        );
    }

    // Read the NEW refresh token from Set-Cookie and persist it for the next run
    const newRefresh = extractRefreshToken(res.headers["set-cookie"]);
    if (newRefresh && newRefresh !== config.refreshToken) {
        updateEnvRefreshToken(newRefresh);
    }

    cachedToken = token;
    tokenExpiry = decodeExp(token);
    return token;
}

/** Extract refresh_token from the Set-Cookie header array */
function extractRefreshToken(setCookie?: string[]): string | null {
    if (!setCookie) return null;
    for (const c of setCookie) {
        const m = c.match(/refresh_token=([^;]+)/);
        if (m) return m[1];
    }
    return null;
}

/** Overwrite HRM_REFRESH_TOKEN in .env, keeping all other lines intact */
function updateEnvRefreshToken(newToken: string): void {
    try {
        let content = fs.readFileSync(ENV_PATH, "utf-8");
        if (/^HRM_REFRESH_TOKEN=.*$/m.test(content)) {
            content = content.replace(/^HRM_REFRESH_TOKEN=.*$/m, `HRM_REFRESH_TOKEN=${newToken}`);
        } else {
            content += `\nHRM_REFRESH_TOKEN=${newToken}\n`;
        }
        fs.writeFileSync(ENV_PATH, content);
    } catch (e) {
        console.warn("Could not update .env:", (e as Error).message);
    }
}

/** Decode the exp field from the JWT */
function decodeExp(jwt: string): number {
    try {
        const payload = JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString("utf-8"));
        return payload.exp || 0;
    } catch {
        return Math.floor(Date.now() / 1000) + 300;
    }
}