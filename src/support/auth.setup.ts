// import { chromium } from "@playwright/test";
// import path from "path";

// const authFile = path.join(__dirname, "../../.auth/user.json");

// (async () => {
//     const browser = await chromium.launch({ headless: false });
//     const context = await browser.newContext();
//     const page = await context.newPage();

//     // Vào trang app của bạn
//     await page.goto(process.env.BASE_URL!);

//     // Click "Sign in with MS"
//     await page.getByRole("button", { name: "Sign in with MS" }).click();

//     // Nhập email Microsoft
//     await page.fill('input[type="email"]', "thao.nguyen@abcdigital.io");
//     await page.click('input[type="submit"]'); // Next

//     // Nhập password
//     await page.fill('input[type="password"]', "Thao123456789@@");
//     await page.click('input[type="submit"]');

//     // Chờ đăng nhập xong (vào trang chính)
//     await page.waitForURL(/abcdigital/);

//     // Lưu session
//     await context.storageState({ path: authFile });

//     await browser.close();
//     console.log("Auth state saved to", authFile);
// })();
