import type { AppRouterClient } from "@datango/api/routers/index";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

export const link = new RPCLink({
  url: `${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_PATTERN}`,
  fetch(_url, options) {
    return fetch(_url, {
      ...options,
      credentials: "include",
    });
  },
});

export const client: AppRouterClient = createORPCClient(link);

export const apiClient = createTanstackQueryUtils(client);
