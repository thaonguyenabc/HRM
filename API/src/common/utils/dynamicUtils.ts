/**
 * Parse chuoi tu DataTable thanh gia tri co kieu dung.
 *  "true"/"false" -> boolean, "null" -> null, so -> number, con lai -> string.
 * Truoc do dich placeholder {{...}} qua ham resolve.
 */
export function parseDynamicValue(raw: string, resolve: (v: string) => string): any {
    if (raw === undefined || raw === null) return raw;

    const resolved = resolve(String(raw));
    if (typeof resolved !== "string") return resolved;

    const t = resolved.trim();
    if (t.length === 0) return "";
    if (t === "true") return true;
    if (t === "false") return false;
    if (t === "null") return null;

    const n = Number(t);
    if (!Number.isNaN(n) && t !== "") return n;

    return t;
}

/**
 * Doc gia tri long trong object theo path dang "data.items[0].id".
 * Tra ve undefined neu khong ton tai.
 */
export function getValueByPath(obj: any, path: string): any {
    if (!obj || !path) return undefined;

    const normalized = path
        .replace(/^\$\./, "")
        .replace(/^\$/, "")
        .replace(/\[(\d+)\]/g, ".$1");

    return normalized
        .split(".")
        .filter(Boolean)
        .reduce((cur, key) => (cur == null ? undefined : cur[key]), obj);
}
