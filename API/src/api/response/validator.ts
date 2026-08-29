import { expect } from "@playwright/test";
import { AxiosResponse } from "axios";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import fs from "node:fs";
import path from "node:path";
import { getValueByPath } from "../../common/utils/dynamicUtils";

// ===== JSON Schema (AJV) =====
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const compiledCache: Record<string, any> = {};

function loadSchema(name: string): any {
    const file = path.resolve(__dirname, "schemas", `${name}.json`);
    if (!fs.existsSync(file)) throw new Error(`Schema file not found: ${file}`);
    return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function assertSchema(schemaName: string, data: any): void {
    let validate = compiledCache[schemaName];
    if (!validate) {
        validate = ajv.compile(loadSchema(schemaName));
        compiledCache[schemaName] = validate;
    }
    const valid = validate(data);
    if (!valid) {
        const msg = (validate.errors || []).map((e: any) => `- ${e.instancePath || "(root)"} ${e.message}`).join("\n");
        throw new Error(`Schema '${schemaName}' validation failed:\n${msg}`);
    }
}

// ===== Cac assertion khac =====
export class ApiValidator {
    static statusCode(response: AxiosResponse, expected: number) {
        if (response.status !== expected) {
            console.log(`❌ Expected ${expected} | Received ${response.status}`);
            console.log(JSON.stringify(response.data, null, 2));
        }
        expect(response.status).toBe(expected);
    }

    static bodyContains(body: any, text: string) {
        expect(JSON.stringify(body)).toContain(text);
    }

    static containsJson(body: any, rows: { key: string; value: any }[]) {
        rows.forEach(({ key, value }) => {
            const actual = getValueByPath(body, key);
            const expected = this.parseValue(value);
            expect(actual).toEqual(expected);
        });
    }

    static arrayLengthGreaterThan(body: any, path: string, min: number) {
        const arr = getValueByPath(body, path);
        expect(Array.isArray(arr)).toBeTruthy();
        expect(arr.length).toBeGreaterThan(min);
    }

    private static parseValue(v: any): any {
        if (v === "true") return true;
        if (v === "false") return false;
        if (v === "null") return null;
        if (!isNaN(Number(v))) return Number(v);
        return v;
    }
}
