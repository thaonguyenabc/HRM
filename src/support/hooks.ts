import { setDefaultTimeout, Before, After } from "@cucumber/cucumber";
import { chromium } from "@playwright/test";
import { CustomWorld } from "./world";
import { config } from "./config";

setDefaultTimeout(60 * 1000);

// Chỉ mở browser, không navigate — để step Given quyết định
Before(async function (this: CustomWorld) {
    this.browser = await chromium.launch({ headless: config.headless });
});

// Đóng tất cả sau mỗi scenario
After(async function (this: CustomWorld) {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
});
