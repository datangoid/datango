import type { createAuth } from "@datango/auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: `${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_PATTERN}/auth`,
  plugins: [inferAdditionalFields<typeof createAuth>()],
});
