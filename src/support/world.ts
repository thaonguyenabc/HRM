import { Browser, BrowserContext, Page } from "@playwright/test";
import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber";
import { config } from "../support/config";
import { BasePage } from "../pages/basePage";
import * as fs from "fs";
import * as path from "path";

const AUTH_FILE = path.join(process.cwd(), ".auth/user.json");

export class CustomWorld extends World {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;
    basePage!: BasePage;
    config = config;

    constructor(options: IWorldOptions) {
        super(options);
    }

    // Dùng cho feature Login — mở browser trống, không load session
    async launchBrowserWithoutStorageSession() {
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
        await this.page.goto(this.config.baseUrl, { waitUntil: "networkidle" });
        this.basePage = new BasePage(this.page);
    }

    // Dùng cho feature khác — mở browser có session, vào thẳng app
    async launchBrowserWithStorageSession() {
        // Nếu chưa có file session → báo lỗi
        if (!fs.existsSync(AUTH_FILE)) {
            throw new Error("Chưa có session. Chạy feature Login trước để tạo file .auth/user.json");
        }

        this.context = await this.browser.newContext({
            storageState: AUTH_FILE,
        });
        this.page = await this.context.newPage();
        await this.page.goto(this.config.baseUrl, { waitUntil: "networkidle" });
        this.basePage = new BasePage(this.page);
    }
}

setWorldConstructor(CustomWorld);
