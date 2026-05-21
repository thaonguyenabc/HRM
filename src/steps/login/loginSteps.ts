import { When, Then } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { expect } from "@playwright/test";

When("User clicks on login button {string}", async function (this: CustomWorld, buttonName: string) {
    await this.loginPage.clickLoginButton(buttonName);
});

When("User enters Microsoft email", async function (this: CustomWorld) {
    await this.loginPage.pickMicrosoftAccount(this.config.credentials.email);
});

When("User enters Microsoft email {string}", async function (this: CustomWorld, email: string) {
    await this.loginPage.pickMicrosoftAccount(email);
});

When("User enters Microsoft password", async function (this: CustomWorld) {
    await this.loginPage.enterPassword(this.config.credentials.password);
});

When("User enters Microsoft password {string}", async function (this: CustomWorld, password: string) {
    await this.loginPage.enterPassword(password);
});

When("User handles stay signed in", async function (this: CustomWorld) {
    await this.loginPage.handleStaySignedIn();
});

Then("User should see Microsoft error message", async function (this: CustomWorld) {
    const error = await this.loginPage.getErrorMessage();
    expect(error).toBeTruthy();
});
