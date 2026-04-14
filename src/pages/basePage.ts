//locator và actions
import { Page, expect } from "@playwright/test";

export class BasePage {
    getSuccessMessage() {
        throw new Error("Method not implemented.");
    }
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
        this.page.setDefaultTimeout(30_000);
    }
    //#region Dynamic XPath locators
    //Click submenu item
    menuItem = (item: string) => this.page.locator(`xpath=(//ul[@role="menu"]//li[@role="menuitem"]//span[contains(text(),"${item}")])`);
    //Input by label
    txtGeneralInputField = (inputvalue: string) => this.page.locator(`xpath=(//div//input[@id='${inputvalue}'])`);
    //Click to the combobox
    selectById = (id: string) => this.page.locator(`select#${id}`);
    //Select combobox by id
    optionByText = (selectId: string, optionText: string) => this.page.locator(`xpath=//select[@id='${selectId}']/option[normalize-space()='${optionText}']`);
    //Select the radio button
    radioButton = (radiovalue: string) => this.page.locator(`xpath=(//input[@type='radio' and @value='${radiovalue}'])`);
    //Select link by text
    linkByText = (text: string) => this.page.locator(`xpath=(//a[normalize-space(text())="${text}"])`);
    //select product by name
    productByName = (name: string) => this.page.locator(`xpath=(//a[@class='product-title']//a[normalize-space(text())="${name}"])`);
    //Select the checkbox
    checkBox = (checkboxvalue: string) => this.page.locator(`xpath=(//input[@type='checkbox' and @value='${checkboxvalue}'])`);
    //Button by text
    btnByText = (text: string) => this.page.locator(`xpath=(//button[@type="submit" and normalize-space(text())="${text}"])`);
    //select country
    contrySelect = (countryname: string) => this.page.locator(`xpath=(//select[@id='country' and normalize-space(text())="${countryname}"])`);
    //select account type
    accountSelect = (accounttype: string) => this.page.locator(`xpath=(//select[@id='account' and normalize-space(text())="${accounttype}"])`);
    //#endregion
    //#endregion
    //#region Actions
    async goto(url: string): Promise<void> {
        await this.page.goto(url);
        await this.page.waitForLoadState("domcontentloaded", { timeout: 30000 });
    }

    async reload(): Promise<void> {
        await this.page.reload();
        await this.page.waitForLoadState("domcontentloaded");
    }

    async expectTextVisible(text: string): Promise<void> {
        await expect(this.page.getByText(text)).toBeVisible();
    }
    //#endregion
    //#region Dynamic locator actions
    // Click menu item
    async clickMenuItem(item: string): Promise<void> {
        await this.menuItem(item).waitFor({ state: "visible" });
        await this.menuItem(item).click();
    }
    // Fill input field
    async fillInGeneralInputField(inputId: string, value: string | null): Promise<void> {
        if (!value) return;

        const input = this.page
            .locator(`#${inputId}`)
            .filter({
                has: this.page.locator(":scope"),
            })
            .first();

        await input.waitFor({ state: "visible", timeout: 10000 });
        await input.fill(value);
    }

    //fill date in date input field
    async fillDate(fieldId: string, date: string) {
        const input = this.page.locator(`#${fieldId}`);

        const type = await input.getAttribute("type");

        if (type === "date") {
            // dd/mm/yyyy
            const [day, month, year] = date.split("/");

            // yyyy-mm-dd
            const formatted = `${year}-${month}-${day}`;

            await input.fill(formatted);
        } else {
            await input.fill(date);
        }
    }

    // Input value to forgot password email field
    async fillInGeneralInputFogotpassword(inputId: string, value: string | null): Promise<void> {
        if (!value) return;

        const form = this.page.locator("form").filter({
            has: this.page.getByRole("button", { name: /Reset Password/i }),
        });

        const input = form.locator(`#${inputId}`);

        await input.waitFor({ state: "visible" });
        await input.fill(value);
    }

    // Select value from combobox
    async selectDropdownByText(selectId: string, optionText: string | null): Promise<void> {
        if (!optionText) return;

        const select = this.page.locator(`select#${selectId}`);
        await select.waitFor({ state: "visible" });
        await select.selectOption({ label: optionText });
    }

    // RADIO
    radioLabel = (value: string) => this.page.locator("label", { hasText: value });
    // CHECKBOX
    checkboxLabel = (value: string) => this.page.locator("label", { hasText: value });

    // SELECT RADIO
    async selectRadioButton(value: string | null): Promise<void> {
        if (!value) return;

        const radio = this.radioLabel(value);
        await radio.waitFor({ state: "visible" });
        await radio.click();
    }

    // SELECT CHECKBOX
    async selectCheckBox(value: string | null): Promise<void> {
        if (!value) return;

        const checkbox = this.checkboxLabel(value);
        await checkbox.waitFor({ state: "visible" });
        await checkbox.click();
    }

    // Click on button by text
    async clickButton(text: string): Promise<void> {
        const button = this.btnByText(text);
        await button.waitFor({ state: "visible" });
        await button.click();
    }

    // Click on link by text
    async clickLinkByText(text: string): Promise<void> {
        const link = this.linkByText(text);
        await link.waitFor({ state: "visible" });
        await link.click();
    }

    // Click product detail link by text
    async clickProductdetail(text: string): Promise<void> {
        const link = this.productByName(text);
        await link.waitFor({ state: "visible" });
        await link.click();
    }

    // Get validation message by input id
    async getValidationMessage(inputId: string): Promise<string> {
        const input = this.page.locator(`#${inputId}`);
        await input.waitFor({ state: "attached" });
        return await input.evaluate((el: HTMLInputElement) => el.validationMessage);
    }

    // Check if field is invalid
    async isFieldInvalid(inputId: string): Promise<boolean> {
        const input = this.page.locator(`#${inputId}`);
        await input.waitFor({ state: "attached" });

        return await input.evaluate((el: HTMLInputElement) => !el.checkValidity());
    }

    // choose file to upload
    async uploadFile(inputId: string, fileName: string): Promise<void> {
        await this.page.locator(`#${inputId}`).setInputFiles(`C:/Users/Ngoc Huyen/Pictures/Screenshots/${fileName}`);
    }
    // Drag and drop
    async dragAndDrop(): Promise<void> {
        const dragItem = this.page.locator('[draggable="true"]');
        const dropZone = this.page.getByText("Drop Here");

        await dragItem.dragTo(dropZone);
    }
    //verify drag and drop success
    async verifyDragSuccess(): Promise<void> {
        const dropZone = this.page.locator('div:has-text("Drop")').nth(0);
        await expect(dropZone).toContainText("Drag Me");
    }
    //#endregion
}
