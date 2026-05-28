import { Page, expect, Locator } from "@playwright/test";
import { CommonLocator } from "./baseLocator";

export class BasePage {
    protected readonly page: Page;
    protected loc: CommonLocator;

    constructor(page: Page) {
        this.page = page;
        this.loc = new CommonLocator(page);
        this.page.setDefaultTimeout(60000);
    }

    switchToFrame(name: string): void {
        const frame = this.page.frameLocator(`iframe[title="${name}"]`);
        this.loc = new CommonLocator(frame);
    }

    switchToMain(): void {
        this.loc = new CommonLocator(this.page);
    }

    //#region Navigation
    async goto(url: string): Promise<void> {
        await this.page.goto(url);
        await this.pageAlready();
    }

    async reload(): Promise<void> {
        await this.page.reload();
        await this.pageAlready();
    }

    async pageAlready(): Promise<void> {
        await this.page.waitForLoadState("domcontentloaded");
        await this.page.waitForTimeout(2000);
    }

    sidebarItem = (name: string) => this.page.getByRole("link", { name, exact: true });

    async clickSidebarItem(name: string): Promise<void> {
        await this.sidebarItem(name).waitFor({ state: "visible" });
        await this.sidebarItem(name).click();
    }
    //#endregion

    //#region Status check
    private getStatusCheckFunction(status: string, locator: Locator): () => Promise<void> {
        const normalized = status.toLowerCase();
        const checks: Record<string, () => Promise<void>> = {
            visible: () => expect.soft(locator).toBeVisible(),
            hidden: () => expect.soft(locator).toBeHidden(),
            enabled: () => expect.soft(locator).toBeEnabled(),
            disabled: () => expect.soft(locator).toBeDisabled(),
            editable: () => expect.soft(locator).toBeEditable(),
            focused: () => expect.soft(locator).toBeFocused(),
            checked: () => expect.soft(locator).toBeChecked(),
            unchecked: () => expect.soft(locator).not.toBeChecked(),
        };
        const check = checks[normalized];
        if (!check) throw new Error(`Invalid Status: ${status}`);
        return check;
    }

    async verifyElementStatus(locator: Locator, status: string): Promise<void> {
        await locator.waitFor({ state: "attached" });
        const check = this.getStatusCheckFunction(status, locator);
        await check();
    }
    //#endregion

    //#region Input
    async fillInGeneralInputField(label: string, value: string | null): Promise<void> {
        if (value !== null) {
            const locator = this.loc.textbox(label);
            await locator.waitFor({ state: "visible" });
            await locator.fill("");
            await locator.fill(value);
            await this.page.waitForTimeout(1000);
            await this.page.keyboard.press("Escape");
        }
    }

    async fillInTextArea(label: string, value: string | null): Promise<void> {
        if (value !== null) {
            const locator = this.loc.textarea(label);
            await locator.waitFor({ state: "visible" });
            await locator.fill("");
            await locator.fill(value);
            await this.page.waitForTimeout(1000);
            await this.page.keyboard.press("Escape");
        }
    }

    async verifyTextFieldStatus(label: string, status: string): Promise<void> {
        const locator = this.loc.textbox(label);
        await this.verifyElementStatus(locator, status);
    }

    async verifyTextAreaStatus(label: string, status: string): Promise<void> {
        const locator = this.loc.textarea(label);
        await this.verifyElementStatus(locator, status);
    }

    async getTextFieldValue(label: string): Promise<string> {
        const locator = this.loc.textbox(label);
        await locator.waitFor({ state: "visible" });
        return await locator.inputValue();
    }

    async verifyTextFieldValue(label: string, expected: string): Promise<void> {
        const actual = await this.getTextFieldValue(label);
        expect.soft(actual).toBe(expected);
    }
    //#endregion

    //#region Button
    async clickOnBTNGeneral(name: string): Promise<void> {
        await this.pageAlready();
        const locator = this.loc.button(name).first();
        await locator.waitFor({ state: "visible" });
        await locator.click();
        await this.pageAlready();
    }

    async verifyButtonStatus(name: string, status: string): Promise<void> {
        await this.page.waitForTimeout(1000);
        const locator = this.loc.button(name).first();
        await this.verifyElementStatus(locator, status);
    }
    //#endregion

    //#region Radio
    async selectRadio(groupLabel: string, option: string): Promise<void> {
        const locator = this.loc.radio(groupLabel, option);
        await locator.waitFor({ state: "visible" });
        await locator.check();
    }

    async verifyRadioStatus(groupLabel: string, option: string, status: string): Promise<void> {
        const locator = this.loc.radio(groupLabel, option);
        await this.verifyElementStatus(locator, status);
    }
    //#endregion

    //#region Checkbox
    async setCheckbox(label: string, checked: boolean): Promise<void> {
        const locator = this.loc.checkbox(label);
        await locator.waitFor({ state: "visible" });
        const isChecked = await locator.isChecked();
        if (isChecked !== checked) {
            checked ? await locator.check() : await locator.uncheck();
        }
    }

    async verifyCheckboxStatus(label: string, status: string): Promise<void> {
        const locator = this.loc.checkbox(label);
        await this.verifyElementStatus(locator, status);
    }
    //#endregion

    //#region Toggle
    async setToggle(label: string, checked: boolean): Promise<void> {
        const locator = this.loc.toggle(label).first();
        await locator.waitFor({ state: "visible" });

        const testId = (await locator.getAttribute("data-testid")) || "";
        const isCurrentlyOn = testId.includes("toggle-") ? testId.includes("-on") : await locator.isChecked();

        if (isCurrentlyOn !== checked) await locator.click();
    }

    async verifyToggleStatus(label: string, status: string): Promise<void> {
        const locator = this.loc.toggle(label).first();
        await locator.waitFor({ state: "visible" });

        const testId = (await locator.getAttribute("data-testid")) || "";
        const normalized = status.toLowerCase();

        if (testId.includes("toggle-")) {
            const isCurrentlyOn = testId.includes("-on");
            if (normalized === "checked" || normalized === "on") {
                expect.soft(isCurrentlyOn, `Toggle '${label}' should be checked`).toBe(true);
            } else if (normalized === "unchecked" || normalized === "off") {
                expect.soft(isCurrentlyOn, `Toggle '${label}' should be unchecked`).toBe(false);
            } else {
                await this.verifyElementStatus(locator, status);
            }
        } else {
            await this.verifyElementStatus(locator, status);
        }
    }
    //#endregion

    //#region Text & Header
    async verifyText(text: string, state: string): Promise<void> {
        const locator = this.loc.containsText(text).first();
        if (state === "visible") {
            await expect(locator).toBeVisible({ timeout: 30000 });
        } else if (state === "hidden") {
            await expect(locator).toBeHidden({ timeout: 30000 });
        } else if (state === "attached") {
            await expect(locator).toBeAttached({ timeout: 30000 });
        } else {
            throw new Error(`Unsupported state: ${state}`);
        }
    }

    async verifyTextExact(text: string, state: string): Promise<void> {
        const locator = this.loc.text(text).first();
        if (state === "visible") {
            await expect(locator).toBeVisible({ timeout: 30000 });
        } else if (state === "hidden") {
            await expect(locator).toBeHidden({ timeout: 30000 });
        } else {
            throw new Error(`Unsupported state: ${state}`);
        }
    }

    async verifyHeaderState(header: string, state: string): Promise<void> {
        const locator = this.loc.header(header);
        const check = this.getStatusCheckFunction(state, locator);
        await check();
    }

    async verifyPageTitle(title: string): Promise<void> {
        const locator = this.loc.header(title);
        await expect(locator).toBeVisible();
    }
    //#endregion

    //#region Link & Section
    async clickLink(link: string): Promise<void> {
        const locator = this.loc.linkCustom(link);
        await locator.waitFor({ state: "visible" });
        await locator.click();
    }

    async clickOnSection(label: string): Promise<void> {
        const locator = this.loc.containsText(label);
        await locator.waitFor({ state: "visible" });
        await locator.click();
        await this.pageAlready();
    }
    //#endregion

    //#region URL
    async verifyURL(expected: string): Promise<void> {
        await this.page.waitForURL(`**${expected}**`, { timeout: 10000 });
        const actUrl = new URL(this.page.url());
        expect.soft(actUrl.pathname).toContain(expected);
    }
    //#endregion

    //#region Data-testid
    async verifyElementByDataTestId(testId: string, state: string): Promise<void> {
        const locator = this.loc.dataTestId(testId);
        const check = this.getStatusCheckFunction(state, locator);
        await check();
    }

    async clickElementByDataTestId(testId: string): Promise<void> {
        const locator = this.loc.dataTestId(testId);
        await locator.waitFor({ state: "visible" });
        await locator.click();
    }
    //#endregion

    //#region Dropdown
    async selectFirstDropdownOption(label: string): Promise<void> {
        const locator = this.loc.ddlOption(label).first();
        await locator.waitFor({ state: "visible" });
        await locator.click();
    }
    //#endregion

    //#region Image
    async verifyImageByAltText(altText: string): Promise<void> {
        const locator = this.loc.imageAlt(altText);
        await locator.waitFor({ state: "visible", timeout: 15000 });
    }
    //#endregion

    //#region Table
    async verifyColumnHeader(name: string, state: string): Promise<void> {
        const locator = this.page
            .getByRole("columnheader", { name })
            .first()
            .or(this.page.locator("th").filter({ hasText: name }).first());
        await this.verifyElementStatus(locator, state);
    }
    //#endregion

    get modal() {
        return this.page.locator('[data-testid="hrm-modal-backdrop"]').first();
    }

    async closeModal(): Promise<void> {
        const closeBtn = this.modal.locator('[aria-label*="lose" i]').first();
        const count = await closeBtn.count();
        if (count > 0) {
            await closeBtn.click();
        } else {
            await this.page.keyboard.press("Escape");
        }
        await this.page.waitForTimeout(700);
    }

    async verifyModalState(state: string): Promise<void> {
        if (state === "open") {
            await this.modal.waitFor({ state: "visible", timeout: 10000 });
            await expect(this.modal).toBeVisible();
        } else if (state === "closed") {
            await expect(this.modal).toBeHidden({ timeout: 10000 });
        } else {
            throw new Error(`Invalid modal state: ${state}. Use "open" or "closed".`);
        }
    }
    //#endregion
}
