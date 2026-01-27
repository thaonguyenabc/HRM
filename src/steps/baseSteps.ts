import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";

Given("user is on login page", async function (this: CustomWorld) {
    await this.basePage.goto(this.config.baseUrl);
    await this.page.waitForTimeout(2000);
});
