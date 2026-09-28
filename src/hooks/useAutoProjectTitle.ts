import { useEffect, useRef } from "react";

import { extractPosterTitle } from "@/lib/extractPosterTitle";
import { useEditorStore } from "@/stores/editorStore";
import { useProjectStore } from "@/stores/projectStore";

/** Debounce so title extraction does not run on every keystroke. */
export const AUTO_TITLE_DELAY_MS = 700;

/**
 * While the project name is unlocked, keep `current.name` aligned with a
 * heuristic title extracted from poster TSX. Persistence goes through dirty + autosave.
 */
export function useAutoProjectTitle(delayMs = AUTO_TITLE_DELAY_MS): void {
  const code = useEditorStore((s) => s.code);
  const projectId = useProjectStore((s) => s.current?.id);
  const nameLocked = useProjectStore((s) => s.nameLocked);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!projectId || nameLocked) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const { current, nameLocked: locked, setCurrentName } = useProjectStore.getState();
      if (!current || locked) return;

      const title = extractPosterTitle(useEditorStore.getState().code);
      if (!title || title === current.name) return;
      setCurrentName(title);
    }, delayMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [code, projectId, nameLocked, delayMs]);
}
