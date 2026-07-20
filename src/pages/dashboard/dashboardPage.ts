import { Page, expect } from "@playwright/test";
import { BasePage } from "../core/basePage";

export class DashboardPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private statCard = (label: string) =>
        this.page.locator('[class*="h-[110px]"]').filter({ hasText: label });

    async verifyStatCardShowsNumber(label: string): Promise<void> {
        const value = await this.statCard(label).getByText(/^\d+$/).textContent();
        expect.soft(value?.trim(), `Stat card "${label}" should show a number`).toMatch(/^\d+$/);
    }

    async verifyStatCardMatchesSubtext(label: string): Promise<void> {
        const card = this.statCard(label);
        const value = Number((await card.getByText(/^\d+$/).textContent())?.trim());
        const subtext = (await card.getByText(/Reports:\s*\d+/).textContent())?.trim() ?? "";
        const parts = (subtext.match(/\d+/g) ?? []).map(Number);
        expect.soft(parts.length, `Stat card "${label}" subtext should contain numbers, got "${subtext}"`).toBeGreaterThan(0);
        const sum = parts.reduce((a, b) => a + b, 0);
        expect.soft(sum, `Stat card "${label}" total (${value}) should equal sum of subtext ${JSON.stringify(parts)}`).toBe(value);
    }

    async clickPrimaryLineManagerCard(): Promise<void> {
        const card = this.page
            .getByText("Primary Line Manager", { exact: true })
            .locator("..")
            .locator('[class*="cursor-pointer"]');
        await card.waitFor({ state: "visible" });
        await card.click();
    }

}
