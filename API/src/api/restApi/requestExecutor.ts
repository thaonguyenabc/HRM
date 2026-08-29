import axios from "axios";
import { CustomWorld } from "../../support/world";
import { config } from "../../support/config";
import { ApiEndpoints, ApiEndpointKey } from "../endpoints/apiEndpoints";
import { resolvePathTemplate } from "./builderPathsDynamic";

export async function executeRequest(world: CustomWorld, method: string, endpointKey: ApiEndpointKey): Promise<void> {
    const resolver = world.resolveValue.bind(world);

    const rawPath = ApiEndpoints[endpointKey];
    if (!rawPath) throw new Error(`❌ Endpoint '${endpointKey}' not found in ApiEndpoints`);

    const url = resolvePathTemplate(rawPath, world.pathParams, resolver);

    const client = axios.create({
        baseURL: config.baseUrl,
        timeout: 30000,
        headers: { "Content-Type": "application/json" },
    });

    console.log("→", method.toUpperCase(), `${config.baseUrl}${url}`);

    const response = await client.request({
        method: method.toLowerCase(),
        url,
        data: world.requestPayload,
        params: world.dynamicQuery,
        headers: world.dynamicHeaders,
        validateStatus: () => true, // khong throw khi 4xx/5xx -> tu assert status
    });

    world.response = response;
    world.responseBody = response.data;
    world.responseStatus = response.status;
    world.responseHeaders = response.headers;
}
