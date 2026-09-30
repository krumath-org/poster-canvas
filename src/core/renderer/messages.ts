import type {
  Diagnostic,
  ExportFormat,
  PosterLogoSlot,
  PosterProjectAssets,
} from "@/core/types";

/** Messages sent from the parent app into the sandbox iframe. */
export type ParentToSandboxMessage =
  | {
      target: "poster-sandbox";
      type: "render";
      code: string;
      width: number;
      height: number;
      assets?: PosterProjectAssets;
      logoSlot?: PosterLogoSlot | null;
      features?: { r3f?: boolean };
    }
  | {
      target: "poster-sandbox";
      type: "clear";
    }
  | {
      target: "poster-sandbox";
      type: "export";
      format: ExportFormat;
      scale?: number;
      requestId: string;
    };

/** Messages emitted by the sandbox back to the parent app. */
export type SandboxToParentMessage =
  | { source: "poster-sandbox"; type: "sandbox-ready" }
  | { source: "poster-sandbox"; type: "rendered" }
  | {
      source: "poster-sandbox";
      type: "compile-error";
      diagnostic: Diagnostic;
    }
  | { source: "poster-sandbox"; type: "runtime-error"; diagnostic: Diagnostic }
  | {
      source: "poster-sandbox";
      type: "export-done";
      requestId: string;
      format: ExportFormat;
      data: string;
      mimeType: string;
    }
  | {
      source: "poster-sandbox";
      type: "export-failed";
      requestId: string;
      message: string;
    };

export function isSandboxMessage(data: unknown): data is SandboxToParentMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    "source" in data &&
    (data as { source: unknown }).source === "poster-sandbox"
  );
}
