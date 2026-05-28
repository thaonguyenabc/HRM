import { setDefaultTimeout, Before, After, AfterStep, BeforeAll, AfterAll } from "@cucumber/cucumber";
import { Browser, BrowserContext, chromium } from "@playwright/test";
import { CustomWorld } from "./world";
import { config } from "./config";
import { LoginPage } from "../pages/login/loginPage";
import * as fs from "fs";
import * as path from "path";

setDefaultTimeout(60 * 1000);

const AUTH_FILE = path.join(process.cwd(), ".auth/user.json");

let browser: Browser;
let authenticatedContext: BrowserContext;

// BeforeAll: luôn chạy SSO flow để đảm bảo session hợp lệ.
// Nếu có .auth/user.json → load MS cookies → SSO auto-pass (không nhập password).
// Nếu không có file → full SSO login (cần nhập email/password).
// Page sau login được giữ sống để preserve sessionStorage cho tất cả tests.
BeforeAll(async function () {
    browser = await chromium.launch({ headless: config.headless });

    const ctxOptions = fs.existsSync(AUTH_FILE) ? { storageState: AUTH_FILE } : {};
    const context = await browser.newContext(ctxOptions);
    const page = await context.newPage();

    await page.goto(config.baseUrl, { waitUntil: "networkidle" });

    // Kiểm tra xem app có đang ở login page không
    const needsLogin = await page
        .getByRole("button", { name: "Sign in with MS" })
        .isVisible({ timeout: 5000 })
        .catch(() => false);

    if (needsLogin) {
        const loginPage = new LoginPage(page);
        await loginPage.clickLoginButton("Sign in with MS");
        await loginPage.pickMicrosoftAccount(config.credentials.email);
        await loginPage.enterPassword(config.credentials.password);
        await loginPage.handleStaySignedIn();
        await page.waitForURL(/abcdigital/);
        await page.waitForLoadState("networkidle");

        const dir = path.dirname(AUTH_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        await context.storageState({ path: AUTH_FILE });
    }

    authenticatedContext = context;
    // Page không đóng — giữ sống để preserve sessionStorage
});

Before(async function (this: CustomWorld) {
    this.browser = browser;
    this.authenticatedContext = authenticatedContext;
});

AfterStep(async function (this: CustomWorld) {
    if (this.page && !this.page.isClosed()) {
        await this.page.waitForTimeout(700).catch(() => {});
    }
});

After(async function (this: CustomWorld) {
    if (this.page) {
        // Không close page cuối cùng trong authenticatedContext — đây là auth page giữ sessionStorage
        const isLastAuthPage = this.context === authenticatedContext && this.context.pages().length <= 1;
        if (!isLastAuthPage) await this.page.close();
    }
    if (this.context && this.context !== authenticatedContext) {
        await this.context.close();
    }
});

AfterAll(async function () {
    if (authenticatedContext) await authenticatedContext.close();
    if (browser) await browser.close();
});
