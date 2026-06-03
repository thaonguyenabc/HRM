import { Page } from "@playwright/test";
import { BasePage } from "../core/basePage";

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    microsoftAccount = (email: string) => this.page.locator(`[data-test-id="${email}"]`);
    emailInput = this.page.locator('input[type="email"]');
    passwordInput = this.page.locator('input[type="password"]');
    submitButton = this.page.locator('input[type="submit"]');
    staySignedInYes = this.page.getByRole("button", { name: "Yes" });
    errorMessage = this.page.locator("#usernameError, #passwordError");

    async clickLoginButton(name: string): Promise<void> {
        await this.loc.button(name).waitFor({ state: "visible", timeout: 10000 });
        await this.loc.button(name).click();
    }

    async pickMicrosoftAccount(email: string): Promise<void> {
        const account = this.microsoftAccount(email);
        const accountShown = await account.waitFor({ state: "visible", timeout: 8000 })
            .then(() => true).catch(() => false);

        if (accountShown) {
            await account.click();
            return;
        }

        // Không có account picker → nhập email thủ công
        await this.emailInput.waitFor({ state: "visible", timeout: 15000 });
        await this.emailInput.fill(email);
        await this.submitButton.click();
    }

    async enterPassword(password: string): Promise<void> {
        const shown = await this.passwordInput.waitFor({ state: "visible", timeout: 8000 })
            .then(() => true).catch(() => false);
        if (shown) {
            await this.passwordInput.fill(password);
            await this.submitButton.click();
        }
        // Không hiện → MS đã auto-login (account "Signed in"), bỏ qua
    }

    async handleStaySignedIn(): Promise<void> {
        try {
            await this.staySignedInYes.waitFor({ state: "visible", timeout: 5000 });
            await this.staySignedInYes.click();
        } catch {
            // không hiện → bỏ qua
        }
    }

    async getErrorMessage(): Promise<string> {
        await this.errorMessage.waitFor({ state: "visible", timeout: 5000 });
        return await this.errorMessage.innerText();
    }
}
