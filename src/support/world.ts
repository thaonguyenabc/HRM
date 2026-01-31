import { Browser, BrowserContext, Page } from "@playwright/test";
import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber";
import { BasePage } from "../pages/basePage";
import { config } from "../support/config";

export class CustomWorld extends World {
    // Playwright lifecycle (per scenario)
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;

    // Share data
    storageStatePath?: string;
    config = config;

    // Page Objects
    basePage!: BasePage;

    constructor(options: IWorldOptions) {
        super(options);
    }

    /**
     * Bind Playwright Page & init Page Objects
     * Called from Before hook
     */
    initPages(page: Page) {
        this.page = page;
        this.basePage = new BasePage(page);
    }
}

setWorldConstructor(CustomWorld);
