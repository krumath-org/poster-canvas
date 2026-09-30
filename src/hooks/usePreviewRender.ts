import { useEffect } from "react";
import { preprocess } from "@/core/compiler/preprocess";
import type { SandboxBridge } from "@/core/renderer";
import { shouldUseLogoOverlay } from "@/lib/logoSlot";
import { useEditorStore } from "@/stores/editorStore";
import { usePreviewStore } from "@/stores/previewStore";
import { useProjectStore } from "@/stores/projectStore";

/**
 * Renders the preview only when Run / reload / size-assets change — not while typing.
 */
export function usePreviewRender(bridge: SandboxBridge | null): void {
  const runNonce = useEditorStore((s) => s.runNonce);
  const current = useProjectStore((s) => s.current);
  const reloadNonce = usePreviewStore((s) => s.reloadNonce);

  useEffect(() => {
    if (!bridge) return;
    // Mobile Preview tab mounts the iframe late; wait for attach + sandbox-ready → run().
    if (!bridge.isAttached) return;

    const code = useEditorStore.getState().code;
    const width = current?.width ?? 1080;
    const height = current?.height ?? 1350;
    const assets = current?.assets ?? {};
    const logoSlot = shouldUseLogoOverlay(code, current?.logoSlot)
      ? (current?.logoSlot ?? null)
      : null;

    usePreviewStore.getState().setStatus("compiling");
    const { code: processed, diagnostics, features } = preprocess(code);
    const errors = diagnostics.filter((d) => d.severity === "error");
    if (errors.length > 0) {
      bridge.clear();
      usePreviewStore.getState().setStatus("error");
      usePreviewStore.getState().setDiagnostics(errors);
      usePreviewStore.getState().setPreviewStale(false);
      return;
    }
    usePreviewStore.getState().setStatus("rendering");
    usePreviewStore.getState().setDiagnostics(diagnostics);
    bridge.render({ code: processed, width, height, assets, logoSlot, features });
  }, [
    bridge,
    runNonce,
    reloadNonce,
    current?.width,
    current?.height,
    current?.assets,
    current?.logoSlot,
  ]);
}
