import type { User } from "@supabase/supabase-js";

/**
 * Tri-state view of "may this visitor use Poster Studio?".
 *
 * `unknown` is deliberately not a synonym for signed out. The Worker can see the shared
 * session cookie, but a request that arrives before the browser's client-side refresh
 * has run (or on a navigation that has not flushed it yet) carries no user, so absence
 * proves nothing. Only the browser can resolve `unknown`.
 */
export type PlayableAuthState =
  | { status: "authenticated"; userId: string }
  | { status: "unauthenticated" }
  | { status: "unknown" };

export function isPlayableUser(user: User | null): user is User {
  if (!user) return false;
  if (user.is_anonymous) return false;
  return true;
}

/**
 * Browser outcome. Storage is readable here, so the absence of a session is conclusive.
 */
export function clientPlayableAuthState(user: User | null): PlayableAuthState {
  return isPlayableUser(user)
    ? { status: "authenticated", userId: user.id }
    : { status: "unauthenticated" };
}

/**
 * Server outcome. Cookies are the only credential the Worker can see, so "no user"
 * must not be reported as `unauthenticated` — that is what sent signed-in players
 * back to /sign-in.
 */
export function serverPlayableAuthState(user: User | null): PlayableAuthState {
  return isPlayableUser(user)
    ? { status: "authenticated", userId: user.id }
    : { status: "unknown" };
}
