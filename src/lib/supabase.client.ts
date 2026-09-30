import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";

import { getKrumathSupabaseCookieOptions } from "@/lib/krumathCookies";

let client: SupabaseClient | undefined;

function supabaseEnv(): { url: string; key: string } {
  const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
  const key = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined;
  if (!url || !key) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  }
  return { url, key };
}

/**
 * Browser client for the shared KruMath Supabase project.
 *
 * Session store is `@supabase/ssr` cookies (`sb-<project-ref>-auth-token…`) at
 * `path=/` with `domain=.krumath.com` — the same store the main site writes. Using a
 * bare `createClient` here read `localStorage`, which krumath.com no longer writes.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  const { url, key } = supabaseEnv();
  if (client) return client;

  const cookieOptions = getKrumathSupabaseCookieOptions(
    typeof window !== "undefined" ? window.location.hostname : undefined,
    typeof window !== "undefined" ? window.location.protocol === "https:" : true,
  );

  client = createBrowserClient(url, key, {
    ...(cookieOptions ? { cookieOptions } : {}),
    isSingleton: false,
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      flowType: "pkce",
      // Match KruMath apps/web: bypass navigator.locks so getSession cannot hang
      // the Hard Gate spinner ("AbortError: Lock broken by another request").
      lock: async <R>(_name: string, _acquireTimeout: number, fn: () => Promise<R>): Promise<R> =>
        await fn(),
    },
  });
  return client;
}

/**
 * Signed-in user from the shared browser session, or null.
 *
 * `getSession()` is deliberate: it reads the cookie without a network round-trip, so a
 * flaky auth server cannot sign a legitimate user out of the gate.
 */
export async function getBrowserUser(): Promise<User | null> {
  const { data } = await getSupabaseBrowserClient().auth.getSession();
  return data.session?.user ?? null;
}

/** Clears the shared KruMath Supabase session cookie (same store as apps/web). */
export async function signOutBrowser(): Promise<void> {
  await getSupabaseBrowserClient().auth.signOut();
}
