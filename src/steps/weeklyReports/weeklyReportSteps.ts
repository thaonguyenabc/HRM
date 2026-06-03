import { When, Then } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";



When("User opens the first report", async function (this: CustomWorld) {
    await this.weeklyReportPage.clickViewFirstReport();
});

When("User opens report for week {string}", async function (this: CustomWorld, weekRange: string) {
    await this.weeklyReportPage.clickViewReportByWeek(weekRange);
});

When("User selects a week for the new report", async function (this: CustomWorld) {
    await this.weeklyReportPage.selectFirstAvailableWeek();
});

When("User fills in the weekly report content {string}", async function (this: CustomWorld, content: string) {
    await this.weeklyReportPage.fillRichTextContent(content);
});

Then("User verifies the selected week appears in the list", async function (this: CustomWorld) {
    await this.weeklyReportPage.verifySelectedWeekAppearsInList();
});

Then("User verifies today's date is shown as submit date", async function (this: CustomWorld) {
    await this.weeklyReportPage.verifyTodayAsSubmitDate();
});

Then("User verifies all visible rows have status {string}", async function (this: CustomWorld, status: string) {
    await this.weeklyReportPage.verifyAllVisibleRowsHaveStatus(status);
});

When("User verifies Plans Only filter changes the list", async function (this: CustomWorld) {
    await this.weeklyReportPage.verifyPlansOnlyFilterChangesTheList();
});
