import { chromium } from "@playwright/test";
import path from "path";
import { config } from "./config";
import { LoginPage } from "../pages/login/loginPage";

const authFile = path.join(__dirname, "../../.auth/user.json");

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(config.baseUrl);

    const loginPage = new LoginPage(page);
    await loginPage.clickLoginButton("Sign in with MS");
    await loginPage.pickMicrosoftAccount(config.credentials.email);
    await loginPage.enterPassword(config.credentials.password);
    await loginPage.handleStaySignedIn();

    await page.waitForURL(/abcdigital/);
    await context.storageState({ path: authFile });

    await browser.close();
    console.log("Auth state saved to", authFile);
})();
