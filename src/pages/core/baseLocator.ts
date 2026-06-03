import { Page, Locator, FrameLocator } from "@playwright/test";

export class CommonLocator {
    constructor(private page: Page | FrameLocator) {}

    /* ===================== INPUT / TEXTBOX ===================== */
    textbox = (name: string) =>
        this.page
            .getByRole("textbox", { name })
            .or(this.page.getByLabel(name))
            .or(this.page.getByPlaceholder(name))
            .or(this.page.locator(`[data-testid*="${name}"]`).locator("input, textarea, [role='textbox']"))
            .or(this.page.locator(`xpath=//span[contains(normalize-space(.),'${name}')]/input[1]`))
            .or(this.page.locator(`xpath=//input[@placeholder="${name}"]`));

    textarea = (name: string) =>
        this.page
            .getByRole("textbox", { name })
            .or(this.page.getByLabel(name))
            .or(this.page.getByPlaceholder(name))
            .or(this.page.locator(`[data-testid*="${name}"]`).locator("textarea, [role='textbox']"))
            .or(this.page.locator(`textarea[data-testid*="${name}"], [role='textbox'][data-testid*="${name}"]`))
            .or(this.page.locator(`xpath=//input[@placeholder="${name}"]`));

    /* ===================== BUTTON ===================== */
    button = (name: string) =>
        this.page
            .getByRole("button", { name })
            .or(this.page.locator("button", { hasText: name }));

    /* ===================== DROPDOWN / SELECT ===================== */
    combobox = (name: string) =>
        this.page
            .getByRole("combobox", { name })
            .or(this.page.getByLabel(name))
            .or(this.page.getByText(name))
            .or(this.page.locator(`xpath=//div[contains(text(), "${name}")]`));

    ddlOption = (name: string) =>
        this.page
            .getByRole("option", { name })
            .or(this.page.getByText(name, { exact: true }))
            .or(this.page.locator(`xpath=//button[contains(text(), "${name}")]`));

    /* ===================== RADIO ===================== */
    radio = (name: string, option: string) => this.page.locator(""); // update later on

    /* ===================== CHECKBOX ===================== */
    checkbox = (name: string) => this.page.getByRole("checkbox", { name }).or(this.page.getByLabel(name));

    /* ===================== TOGGLE / SWITCH ===================== */
    toggle = (name: string) =>
        this.page
            .getByRole("switch", { name })
            .or(this.page.getByLabel(name))
            .or(this.page.locator("div").filter({ hasText: name }).locator('svg[data-testid^="toggle-"]'))
            .or(
                this.page
                    .locator("div")
                    .filter({ has: this.page.getByText(name, { exact: true }) })
                    .locator('svg[data-testid^="toggle-"]'),
            );

    /* ===================== MODAL / DIALOG ===================== */
    dialog = (title: string) => this.page.getByRole("dialog", { name: title });

    dialogButton = (title: string, button: string) => this.dialog(title).getByRole("button", { name: button });

    /* ===================== ERROR / VALIDATION ===================== */
    alert = (text: string) => this.page.getByRole("alert").filter({ hasText: text }).or(this.page.getByText(text));

    fieldError = (fieldName: string) => this.page.getByLabel(fieldName).locator("..").getByRole("alert");

    /* ===================== TABLE ===================== */
    row = (text: string) => this.page.getByRole("row", { name: text });

    cell = (rowText: string, column: string) => this.row(rowText).getByRole("cell", { name: column });

    columnHeader = (name: string) =>
        this.page
            .getByRole("columnheader", { name })
            .first()
            .or(this.page.locator("th").filter({ hasText: name }).first());

    /* ===================== TEXT ===================== */
    text = (text: string) => this.page.getByText(text, { exact: true });

    containsText = (text: string) => this.page.getByText(text);

    /* ===================== LINK ===================== */
    linkCustom = (text: string) =>
        this.page
            .getByRole("link", { name: text })
            .or(this.page.getByRole("button", { name: text }))
            .or(this.page.locator("//span[contains(@class,'link')]", { hasText: text }));

    /* ===================== TAB ===================== */
    tab = (name: string) => this.page.getByRole("tab", { name: new RegExp(name) });

    /* ===================== TITLE ===================== */
    title = (text: string) => this.page.getByRole("heading", { name: text, level: 6 });

    /* ===================== HEADER ===================== */
    header = (text: string) =>
        this.page
            .getByRole("heading", { name: text, level: 1 })
            .or(this.page.locator('[data-testid="headertext"]', { hasText: text }));

    /* ===================== DATA TEST ID ===================== */
    dataTestId = (text: string) => this.page.locator(`[data-testid="${text}"]`);

    /* ===================== IMAGE ===================== */
    imageAlt = (altText: string) => this.page.getByAltText(altText);
}
