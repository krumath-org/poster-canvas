import { createClientOnlyFn } from "@tanstack/react-start";
import { useEffect, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { clientPlayableAuthState, type PlayableAuthState } from "@/lib/authUser";
import { publicAppPath, signInUrl } from "@/lib/krumathUrls";

/**
 * Resolving the session needs browser storage, so this is client-only — which also keeps
 * the `supabase.client` module out of the server bundle.
 */
const resolvePlayableAuth = createClientOnlyFn(async (): Promise<PlayableAuthState> => {
  const { getBrowserUser } = await import("@/lib/supabase.client");
  return clientPlayableAuthState(await getBrowserUser());
});

type AuthGateProps = {
  /** Outcome of the route's `beforeLoad`, which the server can only ever report as `unknown`. */
  initial: PlayableAuthState;
  /** Router path, used to build the `returnUrl` when the visitor really is signed out. */
  routerPath: string;
  children: ReactNode;
};

/**
 * Nothing inside the studio renders until a KruMath account is confirmed.
 *
 * SSR reports `unknown` because the Worker cannot be sure the cookie has been flushed
 * onto a fresh navigation. The browser resolves that here and redirects only when the
 * absence of a session is conclusive.
 */
export function AuthGate({ initial, routerPath, children }: AuthGateProps) {
  const [state, setState] = useState<PlayableAuthState>(initial);

  useEffect(() => {
    if (state.status === "authenticated") return;

    let cancelled = false;
    // Fail closed if resolution never completes (e.g. storage/lock stall).
    const timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      window.location.replace(signInUrl(publicAppPath(routerPath)));
    }, 8000);

    void (async () => {
      if (state.status === "unauthenticated") {
        window.clearTimeout(timeoutId);
        window.location.replace(signInUrl(publicAppPath(routerPath)));
        return;
      }

      // status === "unknown": resolve from the shared session cookie.
      const resolved = await resolvePlayableAuth().catch(() => null);
      if (cancelled) return;
      window.clearTimeout(timeoutId);
      if (resolved && resolved.status === "authenticated") {
        setState(resolved);
        return;
      }
      window.location.replace(signInUrl(publicAppPath(routerPath)));
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [state.status, routerPath]);

  if (state.status === "authenticated") return <>{children}</>;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background text-sm text-muted-foreground"
    >
      <Loader2 className="size-5 animate-spin" aria-hidden="true" />
      <span>Checking your KruMath account…</span>
    </div>
  );
}
