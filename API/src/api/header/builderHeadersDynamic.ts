type TableRow = { key: string; value: string };

export function buildHeadersDynamic(rows: TableRow[], resolve: (v: string) => string): Record<string, string> {
    const headers: Record<string, string> = {};
    for (const row of rows) {
        const key = String(row.key || "").trim();
        if (!key) continue;
        headers[key.toLowerCase()] = resolve(row.value ?? "");
    }
    if (!headers["content-type"]) headers["content-type"] = "application/json";
    return headers;
}
