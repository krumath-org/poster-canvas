import { createClientOnlyFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { configureApp } from "@/lib/config";
import { useUiStore } from "@/stores/uiStore";
import { PosterStudio } from "./PosterStudio";

/**
 * Wire Supabase codes repo only in the browser (never analyzed into the SSR graph).
 */
const wireCloudRepository = createClientOnlyFn(async () => {
  const { SupabaseProjectRepository } = await import(
    "@/lib/storage/supabaseProjectRepository.client"
  );
  configureApp({ projectRepository: new SupabaseProjectRepository() });
});

/**
 * Poster Studio requires browser APIs (Monaco, iframe, localStorage).
 * Production also wires the Supabase codes repository here so SSR never
 * imports `supabase.client` (TanStack import-protection).
 */
export function ClientPosterStudio() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!import.meta.env.DEV) {
        await wireCloudRepository();
      }
      if (cancelled) return;
      useUiStore.getState().setTheme(useUiStore.getState().theme);
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading Poster Studio…
      </div>
    );
  }

  return <PosterStudio />;
}
