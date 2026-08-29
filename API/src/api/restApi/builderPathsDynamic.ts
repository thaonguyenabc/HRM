type Params = Record<string, string | number | boolean>;

export function resolvePathTemplate(template: string, params: Params | undefined, resolve: (s: string) => string): string {
    let path = template || "";

    if (params) {
        Object.keys(params).forEach((k) => {
            const replacer = encodeURIComponent(String(params[k]));
            path = path.replace(new RegExp(`:${escapeRegExp(k)}\\b`, "g"), replacer);
        });
    }

    path = resolve(path);
    path = path.replace(/([^:]\/)\/+/g, "$1"); // gop dau / thua
    return path;
}

function escapeRegExp(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
