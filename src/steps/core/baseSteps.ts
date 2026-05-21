import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";

Given("User goes to landing page", async function (this: CustomWorld) {
    await this.launchBrowserWithoutStorageSession();
});

Given("User goes to dashboard page", async function (this: CustomWorld) {
    await this.launchBrowserWithStorageSession();
});

When("User clicks on sidebar menu {string}", async function (this: CustomWorld, name: string) {
    await this.basePage.clickSidebarItem(name);
});

Then("User should see page title {string}", async function (this: CustomWorld, title: string) {
    await this.basePage.verifyPageTitle(title);
});

When("User enters {string} into the {string} field", async function (this: CustomWorld, value: string, label: string) {
    await this.basePage.fillInGeneralInputField(label, value);
});

When("User enters {string} into the {string} textarea", async function (this: CustomWorld, value: string, label: string) {
    await this.basePage.fillInTextArea(label, value);
});

When("User clicks on the {string} button", async function (this: CustomWorld, btnName: string) {
    await this.basePage.clickOnBTNGeneral(btnName);
});

When("User clicks on the {string} section", async function (this: CustomWorld, label: string) {
    await this.basePage.clickOnSection(label);
});

When("User clicks on the element with data-testid {string}", async function (this: CustomWorld, testId: string) {
    await this.basePage.clickElementByDataTestId(testId);
});

When("User selects the {string} option from the dropdown", async function (this: CustomWorld, label: string) {
    await this.basePage.selectFirstDropdownOption(label);
});

When("User goes back", async function (this: CustomWorld) {
    await this.page.goBack();
    await this.basePage.pageAlready();
});

When("User takes a screenshot", async function (this: CustomWorld) {
    await this.page.screenshot({ path: "debug-screenshot.png", fullPage: true });
});

When("User waits for {int} seconds", async function (this: CustomWorld, seconds: number) {
    await this.page.waitForTimeout(seconds * 1000);
});

When("User presses the {string} key", async function (this: CustomWorld, key: string) {
    await this.page.keyboard.press(key);
});

When("User switches to {string} iframe", async function (this: CustomWorld, name: string) {
    this.basePage.switchToFrame(name);
});

When("User switches to main page", async function (this: CustomWorld) {
    this.basePage.switchToMain();
});

When("User {string} the {string} toggle", async function (this: CustomWorld, action: string, label: string) {
    const checked = action.toLowerCase() === "enables" || action.toLowerCase() === "on";
    await this.basePage.setToggle(label, checked);
});

Then("User verifies the {string} field is {string}", async function (this: CustomWorld, label: string, status: string) {
    await this.basePage.verifyTextFieldStatus(label, status);
});

Then("User verify the {string} button is {string}", async function (this: CustomWorld, buttonText: string, state: string) {
    await this.basePage.verifyButtonStatus(buttonText, state);
});

Then("User verifies the {string} text is {string}", async function (this: CustomWorld, text: string, state: string) {
    await this.basePage.verifyText(text, state);
});

Then("User verify the {string} text exactly is {string}", async function (this: CustomWorld, text: string, state: string) {
    await this.basePage.verifyTextExact(text, state);
});

Then("User verify the {string} header is {string}", async function (this: CustomWorld, header: string, state: string) {
    await this.basePage.verifyHeaderState(header, state);
});

Then("User verify the {string} toggle is {string}", async function (this: CustomWorld, label: string, status: string) {
    await this.basePage.verifyToggleStatus(label, status);
});

Then("User should see the URL contains {string}", async function (this: CustomWorld, expected: string) {
    await this.basePage.verifyURL(expected);
});

Then("User verifies the image with alt text {string} is visible", async function (this: CustomWorld, altText: string) {
    await this.basePage.verifyImageByAltText(altText);
});

Then("The page should contain the following fields:", async function (this: CustomWorld, dataTable: DataTable) {
    const fields = dataTable.raw().flat();
    for (const field of fields) {
        await this.basePage.verifyText(field, "visible");
    }
});
