import { Hyperdrive, KVNamespace, Worker } from "alchemy/cloudflare";
export declare const server: Worker<{
    readonly DATABASE: Hyperdrive;
    readonly SESSIONS_KV: KVNamespace;
    readonly ALCHEMY_STAGE: string;
    readonly WEB_URL: string;
    readonly API_URL: string;
    readonly MAIN_URL: string;
    readonly WEB_DOMAIN: string;
    readonly API_DOMAIN: string;
    readonly MAIN_DOMAIN: string;
    readonly API_PATTERN: string;
    readonly AUTH_SECRET: string;
}, Rpc.WorkerEntrypointBranded>;
export declare const web: Worker<{
    VITE_WEB_DOMAIN: string;
    VITE_WEB_URL: string;
    VITE_API_URL: string;
    VITE_API_PATTERN: string;
} & {
    ASSETS: import("alchemy/cloudflare").Assets;
}>;
