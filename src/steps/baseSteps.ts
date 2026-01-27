import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";

Given("user is on login page", async function (this: CustomWorld) {
    await this.basePage.goto("https://excalidraw.com/");
    await this.page.waitForTimeout(2000);
    await this.basePage.goto("https://excalidraw.com/");
});
