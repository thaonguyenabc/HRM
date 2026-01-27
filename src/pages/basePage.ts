import { Page, expect } from "@playwright/test";

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
        this.page.setDefaultTimeout(30_000);
    }

    async goto(url: string): Promise<void> {
        await this.page.goto(url);
        await this.page.waitForLoadState("domcontentloaded");
    }

    async reload(): Promise<void> {
        await this.page.reload();
        await this.page.waitForLoadState("domcontentloaded");
    }

    async expectTextVisible(text: string): Promise<void> {
        await expect(this.page.getByText(text)).toBeVisible();
    }
}
