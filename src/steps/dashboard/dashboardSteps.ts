import { Then, When } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";

When("User clicks on the Primary Line Manager card", async function (this: CustomWorld) {
    await this.dashboardPage.clickPrimaryLineManagerCard();
});

Then("User verifies the {string} stat card shows a valid number", async function (this: CustomWorld, label: string) {
    await this.dashboardPage.verifyStatCardShowsNumber(label);
});

Then("User verifies the {string} stat card total matches its breakdown", async function (this: CustomWorld, label: string) {
    await this.dashboardPage.verifyStatCardMatchesSubtext(label);
});
