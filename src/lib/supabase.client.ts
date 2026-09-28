import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

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
 * Uses the supabase-js default storage key (`sb-<project-ref>-auth-token`) in
 * localStorage — the same key the main site writes. krumath.com keeps its session in
 * localStorage rather than `@supabase/ssr` cookies, so a cookie-backed browser client
 * cannot see a signed-in user at all.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  const { url, key } = supabaseEnv();
  client ??= createClient(url, key, {
    auth: {
      persistSession: true,
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
 * `getSession()` is deliberate: it reads storage without a network round-trip, so a
 * flaky auth server cannot sign a legitimate user out of the gate.
 */
export async function getBrowserUser(): Promise<User | null> {
  const { data } = await getSupabaseBrowserClient().auth.getSession();
  return data.session?.user ?? null;
}

/** Clears the shared KruMath Supabase session (same localStorage key as apps/web). */
export async function signOutBrowser(): Promise<void> {
  await getSupabaseBrowserClient().auth.signOut();
}
