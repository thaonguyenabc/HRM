import { Before, After, BeforeAll, AfterAll } from "@cucumber/cucumber";
import { chromium, Browser } from "@playwright/test";
import { CustomWorld } from "./world";
import { BasePage } from "../pages/basePage";

Before(async function (this: CustomWorld) {
    // 1. Launch browser per scenario
    this.browser = await chromium.launch({
        headless: false,
    });
    // 2. Create context
    this.context = await this.browser.newContext({
        viewport: null,
        storageState: this.storageStatePath, // optional
    });
    // 3. Create page + init POM
    const page = await this.context.newPage();
    this.initPages(page);
});

After(async function (this: CustomWorld) {
    if (this.page) {
        await this.page.close();
    }
    if (this.context) {
        await this.context.close();
    }
    if (this.browser) {
        await this.browser.close();
    }
});
