import { createIsomorphicFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";

import {
  clientPlayableAuthState,
  serverPlayableAuthState,
  type PlayableAuthState,
} from "@/lib/authUser";
import { publicAppPath, signInUrl } from "@/lib/krumathUrls";

const probePlayableAuth = createIsomorphicFn()
  .server(async () => {
    const { getServerUser } = await import("@/lib/supabase.server");
    return serverPlayableAuthState(await getServerUser());
  })
  .client(async () => {
    const { getBrowserUser } = await import("@/lib/supabase.client");
    return clientPlayableAuthState(await getBrowserUser());
  });

/**
 * Hard-gate Poster Studio routes and hand the outcome to the route context.
 *
 * The Worker may see no user on a fresh navigation even when a session cookie exists, so
 * it returns `unknown` rather than bouncing the user. The route renders an AuthGate for
 * that case and the browser finishes the check.
 */
export async function requirePlayableUser(routerPath: string): Promise<PlayableAuthState> {
  // Local editing has no krumath.com session. Gate only in production.
  if (import.meta.env.DEV) return { status: "authenticated", userId: "dev-local" };

  const state = await probePlayableAuth();
  if (state.status === "unauthenticated") {
    throw redirect({ href: signInUrl(publicAppPath(routerPath)) });
  }
  return state;
}
