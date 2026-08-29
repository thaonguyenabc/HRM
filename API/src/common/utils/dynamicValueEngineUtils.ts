import crypto from "crypto";

/**
 * Dich cac placeholder {{...}} trong chuoi.
 *  - {{tenBien}}   -> lay tu context (dynamicValues)
 *  - {{$uuid}}     -> sinh uuid
 *  - {{$timestamp}}-> Date.now()
 *  - {{$now}}      -> ISO datetime hien tai
 *  - {{$today}}    -> ngay hom nay (YYYY-MM-DD)
 *  - {{$today+7d}} -> cong/tru so ngay
 */
export class DynamicValueEngine {
    constructor(private context: Record<string, any> = {}) {}

    resolve(raw: any): any {
        if (typeof raw !== "string") return raw;

        // full match: ca chuoi la 1 placeholder -> tra ve dung kieu (number/object...)
        const exact = raw.match(/^\{\{(.+?)\}\}$/);
        if (exact) return this.resolveExpression(exact[1].trim());

        // inline: co placeholder xen giua chuoi -> thay bang string
        return raw.replace(/\{\{(.+?)\}\}/g, (_, key: string) => String(this.resolveExpression(key.trim())));
    }

    private resolveExpression(key: string): any {
        if (key.startsWith("$")) return this.resolveEngine(key.slice(1));
        if (this.context[key] !== undefined) return this.context[key];
        throw new Error(`Variable '${key}' not found in dynamicValues`);
    }

    private resolveEngine(key: string): any {
        switch (key) {
            case "uuid":
                return crypto.randomUUID();
            case "timestamp":
                return Date.now();
            case "now":
                return new Date().toISOString();
            case "today":
                return new Date().toISOString().slice(0, 10);
        }

        // pattern: today+Nd / today-Nd
        const m = key.match(/^today([+-])(\d+)d$/);
        if (m) {
            const sign = m[1] === "-" ? -1 : 1;
            const days = Number(m[2]);
            const d = new Date();
            d.setDate(d.getDate() + sign * days);
            return d.toISOString().slice(0, 10);
        }

        throw new Error(`Engine function '$${key}' not supported`);
    }
}
