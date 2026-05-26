import { Browser, BrowserContext, Page } from "@playwright/test";
import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber";
import { config } from "../support/config";
import { BasePage } from "../pages/core/basePage";
import { OrgStructurePage } from "../pages/orgStructure/orgStructurePage";
import { LoginPage } from "../pages/login/loginPage";
export class CustomWorld extends World {
    browser!: Browser;
    context!: BrowserContext;
    authenticatedContext!: BrowserContext; // shared context, inject từ hooks
    page!: Page;
    basePage!: BasePage;
    loginPage!: LoginPage;
    orgStructurePage!: OrgStructurePage;
    config = config;

    constructor(options: IWorldOptions) {
        super(options);
    }

    // Dùng cho feature Login — mở context mới, không load session
    async launchBrowserWithoutStorageSession() {
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
        await this.page.goto(this.config.baseUrl, { waitUntil: "domcontentloaded" });
        this.basePage = new BasePage(this.page);
        this.loginPage = new LoginPage(this.page);
        this.orgStructurePage = new OrgStructurePage(this.page);
    }

    // Dùng cho feature khác — dùng chung shared context, session được hooks.ts quản lý
    async launchBrowserWithStorageSession() {
        this.context = this.authenticatedContext;
        const existing = this.context.pages();
        const livePage = existing.find(p => !p.isClosed());

        if (livePage) {
            this.page = livePage;
        } else {
            this.page = await this.context.newPage();
        }

        // Navigate every scenario — sessionStorage is preserved on same tab (same origin)
        // With tokens in sessionStorage, MSAL loads app without redirect
        await this.page.goto(this.config.baseUrl, { waitUntil: "networkidle" });

        const needsLogin = await this.page.getByRole("button", { name: "Sign in with MS" })
            .isVisible({ timeout: 3000 }).catch(() => false);
        if (needsLogin) {
            const tempLogin = new LoginPage(this.page);
            await tempLogin.clickLoginButton("Sign in with MS");
            await tempLogin.pickMicrosoftAccount(this.config.credentials.email);
            await tempLogin.enterPassword(this.config.credentials.password);
            await tempLogin.handleStaySignedIn();
            await this.page.waitForURL(/abcdigital/);
            await this.page.waitForLoadState("networkidle");
        }

        this.basePage = new BasePage(this.page);
        this.loginPage = new LoginPage(this.page);
        this.orgStructurePage = new OrgStructurePage(this.page);
    }
}

setWorldConstructor(CustomWorld);
