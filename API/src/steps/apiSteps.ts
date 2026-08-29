import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import type { CustomWorld } from "../support/world";
import { buildHeadersDynamic } from "../api/header/builderHeadersDynamic";
import { buildQueryFromTable } from "../api/queryParams/builderQueryDynamic";
import { executeRequest } from "../api/restApi/requestExecutor";
import { ApiEndpointKey } from "../api/endpoints/apiEndpoints";
import { assertSchema, ApiValidator } from "../api/response/validator";
import { getValueByPath } from "../common/utils/dynamicUtils";

type TableRow = { key: string; value: string };

// ---------- Setup bien / random ----------
Given("I generate random uuid as {string}", function (this: CustomWorld, key: string) {
    this.dynamicValues[key] = require("crypto").randomUUID();
});

Given("I set shared values:", function (this: CustomWorld, table: DataTable) {
    for (const r of table.hashes() as TableRow[]) {
        const key = String(r.key || "").trim();
        if (key) this.dynamicValues[key] = this.resolveValue(String(r.value ?? ""));
    }
});

// ---------- Dung request ----------
Given("I build dynamic headers with:", function (this: CustomWorld, table: DataTable) {
    const rows = table.hashes() as TableRow[];
    this.dynamicHeaders = { ...this.dynamicHeaders, ...buildHeadersDynamic(rows, this.resolveValue.bind(this)) };
});

Given("I build dynamic query params with:", function (this: CustomWorld, table: DataTable) {
    const rows = table.hashes() as TableRow[];
    this.dynamicQuery = buildQueryFromTable(rows, this.resolveValue.bind(this));
});

Given("I set path params:", function (this: CustomWorld, table: DataTable) {
    this.pathParams = {};
    for (const r of table.hashes() as TableRow[]) {
        const k = String(r.key || "").trim();
        if (k) this.pathParams[k] = this.resolveValue(String(r.value ?? ""));
    }
});

// ---------- Gui ----------
When("I send {string} request to {string}", async function (this: CustomWorld, method: string, endpoint: ApiEndpointKey) {
    await executeRequest(this, method, endpoint);
});

// ---------- Assert ----------
Then("The response status should be {int}", function (this: CustomWorld, expected: number) {
    ApiValidator.statusCode(this.response, expected);
});

Then("response matches schema {string}", function (this: CustomWorld, schemaName: string) {
    assertSchema(schemaName, this.responseBody);
});

Then("The response body should contain text: {string}", function (this: CustomWorld, text: string) {
    ApiValidator.bodyContains(this.responseBody, text);
});

Then("The response should contain:", function (this: CustomWorld, table: DataTable) {
    ApiValidator.containsJson(this.responseBody, table.hashes() as TableRow[]);
});

Then("The array {string} should have length greater than {int}", function (this: CustomWorld, path: string, min: number) {
    ApiValidator.arrayLengthGreaterThan(this.responseBody, path, min);
});

Then("I extract from response:", function (this: CustomWorld, table: DataTable) {
    const rows = table.hashes() as { variable: string; path: string }[];
    for (const row of rows) {
        const variable = String(row.variable || "").trim();
        const fieldPath = String(row.path || "").trim();
        if (!variable || !fieldPath) continue;
        const value = getValueByPath(this.responseBody, fieldPath);
        if (value === undefined) throw new Error(`❌ Field '${fieldPath}' not found in response`);
        this.dynamicValues[variable] = value;
    }
});
