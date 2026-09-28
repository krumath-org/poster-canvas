import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { isPlayableUser } from "@/lib/authUser";
import { getBrowserUser, getSupabaseBrowserClient, signOutBrowser } from "@/lib/supabase.client";

export type KrumathAuthState = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

/**
 * Live KruMath account for the Account menu.
 * Hard Gate already ensures a playable user in production; this keeps the header in sync.
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

    void getBrowserUser()
      .then((u) => {
        if (cancelled) return;
        setUser(isPlayableUser(u) ? u : null);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
        setLoading(false);
      });

    const {
      data: { subscription },
    } = getSupabaseBrowserClient().auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      const next = session?.user ?? null;
      setUser(isPlayableUser(next) ? next : null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    if (import.meta.env.DEV) {
      setUser(null);
      return;
    }
    await signOutBrowser();
    setUser(null);
  }, []);

  return { user, loading, signOut };
}
