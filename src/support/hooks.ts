import { setDefaultTimeout, Before, After, AfterStep, BeforeAll, AfterAll } from "@cucumber/cucumber";
import { Browser, BrowserContext, chromium } from "@playwright/test";
import { CustomWorld } from "./world";
import { config } from "./config";
import * as fs from "fs";
import * as path from "path";

setDefaultTimeout(60 * 1000);

const AUTH_FILE = path.join(process.cwd(), ".auth/user.json");

let browser: Browser;
let authenticatedContext: BrowserContext;

// Khởi động browser 1 lần duy nhất cho toàn bộ test suite
BeforeAll(async function () {
    browser = await chromium.launch({ headless: config.headless });
    if (fs.existsSync(AUTH_FILE)) {
        authenticatedContext = await browser.newContext({ storageState: AUTH_FILE });
    }
});

// Inject browser và shared context vào từng scenario
Before(async function (this: CustomWorld) {
    this.browser = browser;
    this.authenticatedContext = authenticatedContext;
});

AfterStep(async function (this: CustomWorld) {
    if (this.page) await this.page.waitForTimeout(1000);
});

// Chỉ đóng page sau mỗi scenario — context và browser vẫn sống
After(async function (this: CustomWorld) {
    if (this.page) await this.page.close();
    // Đóng context riêng của login test (không phải shared context)
    if (this.context && this.context !== authenticatedContext) {
        await this.context.close();
    }
});

// Đóng browser 1 lần sau khi tất cả test xong
AfterAll(async function () {
    if (authenticatedContext) await authenticatedContext.close();
    if (browser) await browser.close();
});
