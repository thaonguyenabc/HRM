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

    // Dùng cho feature khác — dùng chung shared context, session luôn sống
    async launchBrowserWithStorageSession() {
        if (!this.authenticatedContext) {
            throw new Error("Chưa có session. Chạy: npx ts-node src/support/auth.setup.ts");
        }

        this.context = this.authenticatedContext;
        this.page = await this.context.newPage();
        await this.page.goto(this.config.baseUrl, { waitUntil: "domcontentloaded" });

        // Nếu session hết hạn → tự login lại
        await this.page.waitForTimeout(2000);
        if (this.page.url().includes("login")) {
            const loginPage = new LoginPage(this.page);
            await loginPage.clickLoginButton("Sign in with MS");
            await loginPage.pickMicrosoftAccount(this.config.credentials.email);
            await loginPage.enterPassword(this.config.credentials.password);
            await loginPage.handleStaySignedIn();
            await this.page.waitForURL(/abcdigital/);
        }

        this.basePage = new BasePage(this.page);
        this.loginPage = new LoginPage(this.page);
        this.orgStructurePage = new OrgStructurePage(this.page);
    }
}

setWorldConstructor(CustomWorld);
