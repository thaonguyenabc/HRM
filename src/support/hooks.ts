import { Before, After, BeforeAll, AfterAll } from "@cucumber/cucumber";
import { chromium, Browser } from "@playwright/test";
import { CustomWorld } from "./world";
import { BasePage } from "../pages/basePage";

Before(async function (this: CustomWorld) {
    this.browser = await chromium.launch({
        headless: false,
    });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    this.basePage = new BasePage(this.page);
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
