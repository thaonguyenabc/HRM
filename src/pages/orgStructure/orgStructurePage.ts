import { Page, expect } from "@playwright/test";
import { BasePage } from "../core/basePage";

export class OrgStructurePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    searchInput = this.page.locator('input[placeholder="Search people"]');
    personNode = (name: string) => this.page.locator(`text="${name}"`);
    orgResultsContainer = this.page.locator(".custom-scrollbar > div");

    async searchPerson(name: string): Promise<void> {
        await this.searchInput.waitFor({ state: "visible" });
        await this.searchInput.fill(name);
    }

    async verifyPersonVisible(name: string): Promise<void> {
        await expect(this.personNode(name)).toBeVisible();
    }

    async verifyNoResults(): Promise<void> {
        await this.orgResultsContainer.waitFor({ state: "attached" });
        await expect(this.orgResultsContainer).toBeEmpty();
    }

    async clickPerson(name: string): Promise<void> {
        await this.personNode(name).waitFor({ state: "visible" });
        await this.personNode(name).click();
    }

    profileOverview = this.page.getByText("Profile Overview");
    personRow = (name: string) =>
        this.page.locator(".flex.items-center.gap-2")
            .filter({ has: this.page.locator("span.truncate", { hasText: name }) })
            .first();
    roleBadge = (name: string, role: string) => this.personRow(name).locator("span.shrink-0", { hasText: role });

    async verifyRoleBadge(name: string, role: string): Promise<void> {
        await this.personRow(name).waitFor({ state: "visible" });
        await expect(this.roleBadge(name, role)).toBeVisible();
    }

    async verifyEmployeeUnderManager(manager: string, employee: string): Promise<void> {
        const managerRow = this.personRow(manager);
        const employeeRow = this.personRow(employee);
        await expect(managerRow).toBeVisible();
        await expect(employeeRow).toBeVisible();
        const isBelow = await managerRow.evaluate((el, empName) => {
            const emp = Array.from(document.querySelectorAll("span.truncate")).find(s => s.textContent?.trim() === empName)?.closest("div");
            if (!emp) return false;
            return !!(el.compareDocumentPosition(emp) & Node.DOCUMENT_POSITION_FOLLOWING);
        }, employee);
        expect(isBelow).toBeTruthy();
    }

    async verifyInProfileOverview(text: string): Promise<void> {
        await this.profileOverview.waitFor({ state: "visible" });
        await expect(this.page.getByText(text).first()).toBeVisible();
    }
}
