import { setWorldConstructor, setDefaultTimeout, IWorldOptions, World } from "@cucumber/cucumber";
import { AxiosResponse } from "axios";
import { config } from "./config";
import { DynamicValueEngine } from "../common/utils/dynamicValueEngineUtils";

setDefaultTimeout(60000);

export class CustomWorld extends World {
    config = config;

    // -------- Request (dung dan qua cac step Given) --------
    dynamicHeaders: Record<string, string> = {};
    dynamicQuery?: Record<string, any>;
    pathParams?: Record<string, string>;
    requestPayload?: Record<string, any>;

    // -------- Response (When ghi vao, Then doc ra) --------
    response!: AxiosResponse;
    responseBody!: unknown;
    responseStatus!: number;
    responseHeaders!: any;
    error!: any;

    // -------- Bien de noi cac buoc qua {{...}} --------
    dynamicValues: Record<string, any> = {};

    constructor(options: IWorldOptions) {
        super(options);
    }

    resolveValue(raw: string): any {
        return new DynamicValueEngine(this.dynamicValues).resolve(raw);
    }
}

setWorldConstructor(CustomWorld);
