import { Page, expect } from "@playwright/test";
import { BasePage } from "../core/basePage";

export class WeeklyReportPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    selectedWeekRange: string = "";

    firstDataRowViewBtn = () =>
        this.page
            .locator("tbody tr")
            .filter({ hasText: /\d{2}\/\d{2}\/\d{4}/ })
            .first()
            .locator("button")
            .last();
    viewBtnInRow = (weekRange: string) => this.page.locator("tr").filter({ hasText: weekRange }).first().locator("button").last();
    selectWeekTrigger = this.page
        .locator('[role="dialog"]')
        .first()
        .getByRole("button", { name: "Select week" })
        .or(this.page.locator('[role="dialog"]').first().locator("button").filter({ hasText: "Select week" }));
    richTextEditor = this.page.locator('[role="dialog"]').first().locator('[contenteditable="true"]').first();
    plansOnlyClickable = this.page.getByRole("checkbox", { name: /Plans Only/i }).or(this.page.locator("label").filter({ hasText: "Plans Only" }));

    async getVisibleRowCount(): Promise<number> {
        await this.page.waitForTimeout(500);
        return await this.page
            .locator("tbody tr")
            .filter({ hasText: /\d{2}\/\d{2}\/\d{4}/ })
            .count();
    }

    // ---- Methods: View ----
    async clickViewFirstReport(): Promise<void> {
        const btn = this.firstDataRowViewBtn();
        await btn.waitFor({ state: "visible", timeout: 10000 });
        await btn.click();
        await this.page.waitForTimeout(1000);
    }

    async clickViewReportByWeek(weekRange: string): Promise<void> {
        const btn = this.viewBtnInRow(weekRange);
        await btn.waitFor({ state: "visible", timeout: 10000 });
        await btn.click();
        await this.page.waitForTimeout(1000);
    }

    // ---- Methods: Create ----
    async selectFirstAvailableWeek(): Promise<void> {
        await this.selectWeekTrigger.waitFor({ state: "visible", timeout: 10000 });
        await this.selectWeekTrigger.click();
        await this.page.waitForTimeout(700);

        const options = this.page
            .locator('[role="option"], [role="listitem"]')
            .filter({ hasText: /\d{2}\/\d{2}/ })
            .or(this.page.locator("li").filter({ hasText: /\d{2}\/\d{2}/ }));

        const count = await options.count();
        if (count > 0) {
            this.selectedWeekRange = ((await options.first().textContent()) ?? "").trim();
            await options.first().click();
            await this.page.waitForTimeout(500);
        } else {
            await this.page.keyboard.press("Escape");
        }
    }

    async fillRichTextContent(content: string): Promise<void> {
        await this.richTextEditor.waitFor({ state: "visible" });
        await this.richTextEditor.click();
        await this.page.keyboard.press("Control+a");
        await this.page.waitForTimeout(200);
        await this.page.keyboard.type(content);
    }

    // ---- Methods: Post-submit verification ----
    async verifySelectedWeekAppearsInList(): Promise<void> {
        if (!this.selectedWeekRange) return;
        // Use start-date portion for flexible format matching
        const startDate = this.selectedWeekRange.split(/[-–]/)[0].trim();
        await expect.soft(this.page.locator("tbody tr").filter({ hasText: startDate }).first()).toBeVisible({ timeout: 10000 });
    }

    async verifyTodayAsSubmitDate(): Promise<void> {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();
        const todayStr = `${dd}/${mm}/${yyyy}`;
        // The first row should be the newly submitted report
        const firstRow = this.page
            .locator("tbody tr")
            .filter({ hasText: /\d{2}\/\d{2}\/\d{4}/ })
            .first();
        await expect.soft(firstRow).toContainText(todayStr);
    }

    // ---- Methods: Filter ----
    async verifyAllVisibleRowsHaveStatus(status: string): Promise<void> {
        await this.page.waitForTimeout(1000);
        const rows = this.page.locator("tbody tr").filter({ hasText: /\d{2}\/\d{2}\/\d{4}/ });
        const count = await rows.count();
        expect.soft(count, `Expected at least 1 row after filtering by "${status}"`).toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
            await expect.soft(rows.nth(i)).toContainText(status);
        }
    }

    async verifyPlansOnlyFilterChangesTheList(): Promise<void> {
        const countBefore = await this.getVisibleRowCount();

        // Toggle Plans Only ON
        await this.plansOnlyClickable.first().click();
        await this.page.waitForTimeout(1000);
        const countAfterOn = await this.getVisibleRowCount();

        // Toggle Plans Only OFF to restore
        await this.plansOnlyClickable.first().click();
        await this.page.waitForTimeout(1000);
        const countAfterOff = await this.getVisibleRowCount();

        expect.soft(countAfterOn, `Plans Only filter should change the row count (was ${countBefore})`).not.toEqual(countBefore);

        expect.soft(countAfterOff, `Turning off Plans Only should restore the full list (expected ${countBefore})`).toEqual(countBefore);
    }
}
