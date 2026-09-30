import type { Diagnostic, ExportFormat, PosterLogoSlot, PosterProjectAssets } from "@/core/types";
import { isSandboxMessage } from "./messages";

export interface SandboxBridgeCallbacks {
  onReady?: () => void;
  onRendered?: () => void;
  onCompileError?: (diagnostic: Diagnostic) => void;
  onRuntimeError?: (diagnostic: Diagnostic) => void;
}

export interface ExportPayloadResult {
  format: ExportFormat;
  data: string;
  mimeType: string;
}

interface PendingExport {
  resolve: (value: ExportPayloadResult) => void;
  reject: (reason: Error) => void;
  timeoutId: ReturnType<typeof setTimeout>;
}

const EXPORT_TIMEOUT_MS = 120_000;

export class SandboxBridge {
  private iframe: HTMLIFrameElement | null = null;
  private ready = false;
  private readonly pendingExports = new Map<string, PendingExport>();
  private readonly callbacks: SandboxBridgeCallbacks;
  private readonly messageHandler: (event: MessageEvent) => void;

  constructor(callbacks: SandboxBridgeCallbacks = {}) {
    this.callbacks = callbacks;
    this.messageHandler = (event: MessageEvent) => this.handleMessage(event);
    if (typeof window !== "undefined") {
      window.addEventListener("message", this.messageHandler);
    }
  }

  attach(iframe: HTMLIFrameElement): void {
    this.iframe = iframe;
    this.ready = false;
  }

  detach(): void {
    this.iframe = null;
    this.ready = false;
  }

  get isAttached(): boolean {
    return this.iframe !== null;
  }

  get isReady(): boolean {
    return this.ready;
  }

  destroy(): void {
    if (typeof window !== "undefined") {
      window.removeEventListener("message", this.messageHandler);
    }
    for (const pending of this.pendingExports.values()) {
      clearTimeout(pending.timeoutId);
      pending.reject(new Error("Sandbox bridge destroyed"));
    }
    this.pendingExports.clear();
    this.iframe = null;
    this.ready = false;
  }

  render(payload: {
    code: string;
    width: number;
    height: number;
    assets?: PosterProjectAssets;
    logoSlot?: PosterLogoSlot | null;
    features?: { r3f?: boolean };
  }): void {
    this.post({ type: "render", ...payload });
  }

  clear(): void {
    this.post({ type: "clear" });
  }

  export(payload: {
    format: ExportFormat;
    scale?: number;
    requestId: string;
  }): Promise<ExportPayloadResult> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingExports.delete(payload.requestId);
        reject(new Error("Export timed out"));
      }, EXPORT_TIMEOUT_MS);

      this.pendingExports.set(payload.requestId, {
        resolve,
        reject,
        timeoutId,
      });

      this.post({ type: "export", ...payload });
    });
  }

  private post(message: Record<string, unknown>): void {
    const win = this.iframe?.contentWindow;
    if (!win) return;
    win.postMessage({ target: "poster-sandbox", ...message }, "*");
  }

  private handleMessage(event: MessageEvent): void {
    const win = this.iframe?.contentWindow;
    if (!win || event.source !== win) return;

    const data = event.data;
    if (!isSandboxMessage(data)) return;

    switch (data.type) {
      case "sandbox-ready":
        this.ready = true;
        this.callbacks.onReady?.();
        break;
      case "rendered":
        this.callbacks.onRendered?.();
        break;
      case "compile-error":
        this.callbacks.onCompileError?.(data.diagnostic);
        break;
      case "runtime-error":
        this.callbacks.onRuntimeError?.(data.diagnostic);
        break;
      case "export-done": {
        const pending = this.pendingExports.get(data.requestId);
        if (pending) {
          clearTimeout(pending.timeoutId);
          this.pendingExports.delete(data.requestId);
          pending.resolve({
            format: data.format,
            data: data.data,
            mimeType: data.mimeType,
          });
        }
        break;
      }
      case "export-failed": {
        const pending = this.pendingExports.get(data.requestId);
        if (pending) {
          clearTimeout(pending.timeoutId);
          this.pendingExports.delete(data.requestId);
          pending.reject(new Error(data.message));
        }
        break;
      }
    }
  }
}
