import { Then, When } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";

When("User clicks on {string} in the Org Chart", async function (this: CustomWorld, name: string) {
    await this.orgStructurePage.clickPerson(name);
});

When("User searches for {string} in Org Chart", async function (this: CustomWorld, name: string) {
    await this.orgStructurePage.searchPerson(name);
});

Then("User should see {string} in the Org Chart", async function (this: CustomWorld, name: string) {
    await this.orgStructurePage.verifyPersonVisible(name);
});

Then("User should see {string} in profile overview", async function (this: CustomWorld, text: string) {
    await this.orgStructurePage.verifyInProfileOverview(text);
});

Then("User should see role badge {string} next to {string} in Org Chart", async function (this: CustomWorld, role: string, name: string) {
    await this.orgStructurePage.verifyRoleBadge(name, role);
});

Then("User should see {string} listed under {string} in Org Chart", async function (this: CustomWorld, employee: string, manager: string) {
    await this.orgStructurePage.verifyEmployeeUnderManager(manager, employee);
});

Then("Org Chart should show no results", async function (this: CustomWorld) {
    await this.orgStructurePage.verifyNoResults();
});
