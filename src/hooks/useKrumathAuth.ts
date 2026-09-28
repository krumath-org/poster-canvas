import { createClientOnlyFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { isPlayableUser } from "@/lib/authUser";

export type KrumathAuthState = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const readPlayableUser = createClientOnlyFn(async (): Promise<User | null> => {
  const { getBrowserUser } = await import("@/lib/supabase.client");
  const u = await getBrowserUser();
  return isPlayableUser(u) ? u : null;
});

const subscribeAuth = createClientOnlyFn(
  async (onChange: (user: User | null) => void): Promise<() => void> => {
    const { getSupabaseBrowserClient } = await import("@/lib/supabase.client");
    const {
      data: { subscription },
    } = getSupabaseBrowserClient().auth.onAuthStateChange((_event, session: Session | null) => {
      const next = session?.user ?? null;
      onChange(isPlayableUser(next) ? next : null);
    });
    return () => subscription.unsubscribe();
  },
);

const signOutShared = createClientOnlyFn(async (): Promise<void> => {
  const { signOutBrowser } = await import("@/lib/supabase.client");
  await signOutBrowser();
});

/**
 * Live KruMath account for the Account menu.
 * All supabase.client access goes through createClientOnlyFn for SSR safety.
 */
export function useKrumathAuth(): KrumathAuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (import.meta.env.DEV) {
      setUser({ id: "dev-local", email: "dev@localhost", is_anonymous: false } as User);
      setLoading(false);
      return;
    }

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    void (async () => {
      try {
        const u = await readPlayableUser();
        if (cancelled) return;
        setUser(u);
        setLoading(false);
      } catch {
        if (cancelled) return;
        setUser(null);
        setLoading(false);
      }

      unsubscribe = await subscribeAuth((next) => {
        if (cancelled) return;
        setUser(next);
        setLoading(false);
      });
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const signOut = useCallback(async () => {
    if (import.meta.env.DEV) {
      setUser(null);
      return;
    }
    await signOutShared();
    setUser(null);
  }, []);

  return { user, loading, signOut };
}
