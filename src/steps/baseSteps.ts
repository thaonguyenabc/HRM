//keywords
import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import { expect } from "@playwright/test";
import { TIMEOUT } from "node:dns";

// Given("user is on login page", async function (this: CustomWorld) {
//     await this.basePage.goto(this.config.baseUrl);
// });


Given("User goes to landing page", async function (this: CustomWorld) {
    await this.launchBrowserWithoutStorageSession();
});

// Feature -> session -> dashboard
Given("User goes to dashboard page", async function (this: CustomWorld) {
    await this.launchBrowserWithStorageSession();
});
When("I click menu item {string}", async function (item: string) {
    await this.basePage.clickMenuItem(item);
});
When("I input {string} into field {string}", async function (value: string, inputId: string) {
    await this.basePage.fillInGeneralInputField(inputId, value);
});
When("I input {string} into field forgot password {string}", async function (value: string, inputId: string) {
    await this.basePage.fillInGeneralInputFogotpassword(inputId, value);
});
When("I select {string} from combobox {string}", async function (option: string, selectId: string) {
    await this.basePage.selectDropdownByText(selectId, option);
});
When("I select radio button {string}", async function (value: string) {
    await this.basePage.selectRadioButton(value);
});
When("I select checkbox {string}", async function (value: string) {
    await this.basePage.selectCheckBox(value);
});
When("I click on button {string}", async function (text: string) {
    await this.basePage.clickButton(text);
});
Then("This page result should be {string}", async function (text: string) {
    await expect(this.page.getByRole("heading", { name: new RegExp(text, "i") })).toBeVisible();
});

Then("The page result should be {string}", async function (text: string) {
    await expect(this.page.locator(".success-msg")).toContainText(text);
});

Then("Field {string} should be invalid", async function (this: CustomWorld, fieldId: string) {
    const isInvalid = await this.basePage.isFieldInvalid(fieldId);
    expect(isInvalid).toBeTruthy();
});

Then("Field {string} validation message should contain {string}", async function (this: CustomWorld, fieldId: string, expected: string) {
    const message = await this.basePage.getValidationMessage(fieldId);
    expect(message).toContain(expected);
    await this.page.waitForTimeout(2000); // sleep 2s
});

When("I fill registration form with:", async function (dataTable) {
    const rows = dataTable.rowsHash();

    await this.basePage.fillInGeneralInputField("name", rows.name);
    await this.basePage.fillInGeneralInputField("email", rows.email);
    await this.basePage.fillInGeneralInputField("password", rows.password);
    await this.basePage.fillInGeneralInputField("confirm_password", rows.confirm_password);
    await this.basePage.selectDropdownByText("country", rows.country);
    await this.basePage.selectDropdownByText("account", rows.account);
});

When("I fill form submission form with:", async function (dataTable) {
    const rows = dataTable.rowsHash();

    await this.basePage.fillInGeneralInputField("name", rows.name);
    await this.basePage.fillInGeneralInputField("email", rows.email);
    await this.basePage.fillInGeneralInputField("contact", rows.contact);
    await this.basePage.selectDropdownByText("country", rows.country);
    await this.basePage.selectRadioButton(rows.radio);
    await this.basePage.selectCheckBox(rows.checkbox);
});

When("I fill date field {string} with {string}", async function (this: CustomWorld, fieldId: string, date: string) {
    await this.basePage.fillDate(fieldId, date);
});

Then("The forgot password page result should be {string}", async function (text: string) {
    const toast = this.page.locator(".toaster .title");

    await toast.waitFor({ state: "attached", timeout: 10000 });
    await expect(toast).toContainText(text);
});
Then("This forgot password page result should be {string}", async function (text: string) {
    await expect(this.page.getByRole("span", { name: text })).toBeVisible();
});

When("I upload file {string}", async function (fileName: string) {
    await this.basePage.uploadFile("file", fileName);
});
When("I drag Drag Me to Drop Here", async function () {
    await this.basePage.dragAndDrop();
});

Then("Drag Me should be dropped successfully", async function () {
    await this.basePage.verifyDragSuccess();
});

When("I select link {string}", async function (text: string) {
    await this.basePage.clickLinkByText(text);
});

When("I click on demo button {string}", async function (buttonName: string) {
    await Promise.all([this.page.waitForURL("https://practice.qabrains.com/ecommerce"), this.page.getByRole("button", { name: buttonName }).click()]);
    await this.page.waitForTimeout(2000);
});

When("I click on plus or minus button {string}", async function (buttonName: string) {
    await this.page.getByRole("button", { name: buttonName }).click();
});

Then("I should be on {string} page", async function (pageName: string) {
    await expect(this.page).toHaveURL(new RegExp(pageName.toLowerCase()));
});

When("I click on product detail link {string}", async function (productName: string) {
    const product = this.page.locator(`a[href*="product-details"]`, {
        hasText: productName,
    });
    await product.first().click();
    await this.page.locator(`a:has-text("${productName}")`).click();
    await this.page.waitForTimeout(1000);
});

When("I click on submit button {string}", async function (buttonName: string) {
    const button = this.page.locator(`button:has-text("${buttonName}")`);
    await button.waitFor({ state: "visible" });
    await button.click();
    await this.page.waitForTimeout(2000);
});

Then("I should see toast message {string}", async function (message: string) {
    const toast = this.page.locator("[data-sonner-toast]");

    await expect(toast).toContainText(message);
    await this.page.waitForTimeout(1000);
});

Then("I should see {string} in cart icon", async function (count: string) {
    const cartBadge = this.page.locator(".bg-qa-clr");
    if (count === "0") {
        await expect(cartBadge).toHaveCount(0);
    } else {
        await expect(cartBadge).toHaveText(count);
    }
    await this.page.waitForTimeout(1000);
});
