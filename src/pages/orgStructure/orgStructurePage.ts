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
        await this.personNode(name).waitFor({ state: "visible", timeout: 10000 });
        await this.personNode(name).click();
    }

    async hoverPerson(name: string): Promise<void> {
        const row = this.personRow(name);
        await row.waitFor({ state: "visible" });
        await row.hover();
    }

    async expandPersonNode(name: string): Promise<void> {
        const row = this.personRow(name);
        await row.waitFor({ state: "visible" });
        // Walk up DOM from the name span to find the nearest button (expand toggle)
        await this.page.evaluate((personName) => {
            const spans = Array.from(document.querySelectorAll("span"));
            const target = spans.find(s => s.textContent?.trim() === personName);
            if (!target) return;
            let el: Element | null = target;
            for (let i = 0; i < 6; i++) {
                el = el?.parentElement ?? null;
                if (!el) break;
                const btn = el.querySelector("button");
                if (btn) {
                    const expanded = btn.getAttribute("aria-expanded");
                    if (expanded !== "true") (btn as HTMLElement).click();
                    return;
                }
            }
        }, name);
        await this.page.waitForTimeout(500);
    }

    profileOverview = this.page.getByText("Profile Overview");
    personRow = (name: string) =>
        this.page.locator(".flex.items-center.gap-2")
            .filter({ has: this.page.locator("span.truncate", { hasText: name }) })
            .first();
    roleBadge = (name: string, role: string) => this.personRow(name).getByText(role, { exact: true });

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
