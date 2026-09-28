import { useEffect, useRef } from "react";

import { useEditorStore } from "@/stores/editorStore";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";

/** Light debounce within the 2–3s plan window — event-driven, not a polling interval. */
export const AUTOSAVE_DELAY_MS = 2500;

function fingerprint(
  project: {
    id: string;
    name: string;
    width: number;
    height: number;
    logoSlot?: unknown;
  },
  code: string,
): string {
  return JSON.stringify({
    id: project.id,
    name: project.name,
    code,
    width: project.width,
    height: project.height,
    logoSlot: project.logoSlot ?? null,
  });
}

/**
 * Debounced cloud/local autosave while the editor is dirty.
 * Skips identical payloads; coalesces edits during an in-flight save.
 */
export function useAutosaveProject(delayMs = AUTOSAVE_DELAY_MS): void {
  const dirty = useEditorStore((s) => s.dirty);
  const code = useEditorStore((s) => s.code);
  const current = useProjectStore((s) => s.current);
  const lastSavedRef = useRef("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightRef = useRef(false);
  const pendingRef = useRef(false);

  // After a successful save (manual or auto), remember the fingerprint.
  useEffect(() => {
    if (dirty || !current) return;
    lastSavedRef.current = fingerprint(current, code);
  }, [dirty, current, code]);

  useEffect(() => {
    if (!dirty || !current) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      void (async () => {
        const latest = useProjectStore.getState().current;
        const latestCode = useEditorStore.getState().code;
        if (!latest || !useEditorStore.getState().dirty) return;

        const key = fingerprint(latest, latestCode);
        if (key === lastSavedRef.current) {
          useEditorStore.getState().markSaved();
          useUiStore.getState().setSaveStatus("saved");
          return;
        }

        if (inFlightRef.current) {
          pendingRef.current = true;
          return;
        }

        inFlightRef.current = true;
        const ok = await useProjectStore.getState().saveProject({ quiet: true });
        inFlightRef.current = false;

        if (ok) {
          lastSavedRef.current = fingerprint(
            useProjectStore.getState().current ?? latest,
            useEditorStore.getState().code,
          );
        }

        if (pendingRef.current) {
          pendingRef.current = false;
          if (useEditorStore.getState().dirty) {
            // Schedule another pass for edits that landed during the save.
            useUiStore.getState().setSaveStatus("idle");
            useEditorStore.getState().setCode(useEditorStore.getState().code);
          }
        }
      })();
    }, delayMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    dirty,
    code,
    current?.id,
    current?.name,
    current?.width,
    current?.height,
    current?.logoSlot,
    delayMs,
  ]);
}
