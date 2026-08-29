import { Given } from "@cucumber/cucumber";
import type { CustomWorld } from "../support/world";
import { getAccessToken } from "../api/auth/authManager";

// Tu dong lay token qua refresh 
Given("I am authenticated on HRM", async function (this: CustomWorld) {
    const token = await getAccessToken();
    this.dynamicHeaders = { ...this.dynamicHeaders, authorization: `Bearer ${token}` };
});

// Giu ban theo account neu sau nay can nhieu role (tam thoi cung dung refresh chung)
Given("I am authenticated on HRM as {string}", async function (this: CustomWorld, _account: string) {
    const token = await getAccessToken();
    this.dynamicHeaders = { ...this.dynamicHeaders, authorization: `Bearer ${token}` };
});