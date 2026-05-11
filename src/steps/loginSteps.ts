import { When, Then } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import { LoginPage } from "../pages/loginPage";
import { expect } from "@playwright/test";
import { config } from "../support/config";

let loginPage: LoginPage;

When("I click on login button {string}", async function (this: CustomWorld, buttonName: string) {
    loginPage = new LoginPage(this.page);
    await loginPage.clickLoginButton(buttonName);
});

When("I enter Microsoft email", async function (this: CustomWorld) {
    await loginPage.pickMicrosoftAccount(config.credentials.email);
});

When("I enter Microsoft email {string}", async function (email: string) {
    await loginPage.pickMicrosoftAccount(email);
});

When("I enter Microsoft password {string}", async function (password: string) {
    await loginPage.enterPassword(password);
});

When("I enter Microsoft password", async function (this: CustomWorld) {
    await loginPage.enterPassword(config.credentials.password);
});
When("I handle stay signed in", async function (this: CustomWorld) {
    await loginPage.handleStaySignedIn();
});

Then("I should see Microsoft error message", async function (this: CustomWorld) {
    const error = await loginPage.getErrorMessage();
    expect(error).toBeTruthy();
});
