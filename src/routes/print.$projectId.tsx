import { createFileRoute } from "@tanstack/react-router";
import { createClientOnlyFn } from "@tanstack/react-start";
import { useEffect, useRef, useCallback, useState } from "react";
import { SandboxBridge } from "@/core/renderer";
import { preprocess } from "@/core/compiler/preprocess";
import { configureApp, getProjectRepository } from "@/lib/config";
import { shouldUseLogoOverlay } from "@/lib/logoSlot";
import { publicUrl } from "@/lib/publicUrl";
import type { PosterProject } from "@/core/types";

const wireCloudRepository = createClientOnlyFn(async () => {
  const { SupabaseProjectRepository } = await import(
    "@/lib/storage/supabaseProjectRepository.client"
  );
  configureApp({ projectRepository: new SupabaseProjectRepository() });
});

// A4 at 96 DPI (CSS pixels): 210mm x 297mm
// 1 inch = 25.4 mm, 96 px/in -> 210/25.4*96 ~= 794 px, 297/25.4*96 ~= 1123 px
const A4_CSS_WIDTH_PX = 794;
const A4_CSS_HEIGHT_PX = 1123;

export const Route = createFileRoute("/print/$projectId")({
  loader: async ({ params }) => {
    try {
      const project = await getProjectRepository().getProject(params.projectId);
      return { project };
    } catch {
      return { project: null };
    }
  },
  head: () => ({
    meta: [{ title: "Print — Poster Studio" }],
  }),
  component: PrintPage,
});

function PrintPage() {
  const { projectId } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const [project, setProject] = useState<PosterProject | null>(loaderData?.project ?? null);
  const [loadingProject, setLoadingProject] = useState(!loaderData?.project);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const bridgeRef = useRef<SandboxBridge | null>(null);
  const [status, setStatus] = useState<"loading" | "rendered" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const hasPrintedRef = useRef(false);

  // Client-side project retrieval (essential because SSR loader has no localStorage)
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!import.meta.env.DEV) {
        try {
          await wireCloudRepository();
        } catch {
          // ignore in dev/offline
        }
      }
      try {
        const repo = getProjectRepository();
        const p = await repo.getProject(projectId);
        if (cancelled) return;
        if (p) {
          setProject(p);
        }
      } catch (err) {
        console.error("Failed to load project for print", err);
      } finally {
        if (!cancelled) {
          setLoadingProject(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  // Connect SandboxBridge whenever project is ready
  useEffect(() => {
    if (!project) return;

    setStatus("loading");
    setErrorMsg("");

    const bridge = new SandboxBridge({
      onReady: () => {
        const { code: processed, features } = preprocess(project.code);
        const logoSlot = shouldUseLogoOverlay(project.code, project.logoSlot ?? null)
          ? (project.logoSlot ?? null)
          : null;
        bridge.render({
          code: processed,
          width: project.width,
          height: project.height,
          assets: project.assets ?? {},
          logoSlot,
          features,
        });
      },
      onRendered: () => {
        setStatus("rendered");
      },
      onCompileError: (diag) => {
        setStatus("error");
        setErrorMsg(diag.message);
      },
      onRuntimeError: (diag) => {
        setStatus("error");
        setErrorMsg(diag.message);
      },
    });

    bridgeRef.current = bridge;
    if (iframeRef.current) {
      bridge.attach(iframeRef.current);
    }

    return () => {
      bridge.destroy();
      bridgeRef.current = null;
    };
  }, [project]);

  const attachIframe = useCallback((node: HTMLIFrameElement | null) => {
    iframeRef.current = node;
    if (!node) {
      bridgeRef.current?.detach();
      return;
    }
    if (bridgeRef.current) {
      bridgeRef.current.attach(node);
    }
  }, []);

  const handleIframeLoad = useCallback(() => {
    // If sandbox loaded, ping it to trigger onReady
    bridgeRef.current?.ping();
  }, []);

  useEffect(() => {
    if (status === "rendered" && !hasPrintedRef.current) {
      hasPrintedRef.current = true;
      const id = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [status]);

  if (loadingProject && !project) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#6b7280",
          fontFamily: "system-ui, sans-serif",
          fontSize: 15,
        }}
      >
        Loading project…
      </div>
    );
  }

  if (!project) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#ef4444",
          fontFamily: "system-ui, sans-serif",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 600 }}>Project not found</span>
        <span style={{ fontSize: 13, color: "#9ca3af" }}>
          Please make sure the project exists and is saved.
        </span>
      </div>
    );
  }

  const iframeScale = A4_CSS_WIDTH_PX / project.width;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
            html, body {
              width: 100%;
              height: 100%;
              background: #e5e7eb;
              font-family: system-ui, sans-serif;
            }
            .ps-print-wrap {
              display: flex;
              flex-direction: column;
              align-items: center;
              min-height: 100vh;
              padding: 32px 16px 48px;
              gap: 20px;
            }
            .ps-print-toolbar {
              display: flex;
              align-items: center;
              gap: 12px;
              background: #1f2937;
              color: #f9fafb;
              padding: 10px 20px;
              border-radius: 10px;
              font-size: 13px;
              box-shadow: 0 4px 16px rgba(0,0,0,0.3);
              width: ${A4_CSS_WIDTH_PX}px;
            }
            .ps-print-toolbar strong {
              font-weight: 600;
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .ps-print-status {
              font-size: 12px;
              padding: 3px 10px;
              border-radius: 9999px;
              background: #374151;
              color: #d1d5db;
              white-space: nowrap;
            }
            .ps-print-status.ready { background: #065f46; color: #6ee7b7; }
            .ps-print-status.error { background: #7f1d1d; color: #fca5a5; }
            .ps-print-btn {
              background: #2563eb;
              color: #fff;
              border: none;
              border-radius: 6px;
              padding: 6px 16px;
              font-size: 13px;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.15s;
              white-space: nowrap;
            }
            .ps-print-btn:hover:not(:disabled) { background: #1d4ed8; }
            .ps-print-btn:disabled { background: #4b5563; cursor: not-allowed; }
            .ps-print-card {
              width: ${A4_CSS_WIDTH_PX}px;
              height: ${A4_CSS_HEIGHT_PX}px;
              background: #fff;
              box-shadow: 0 8px 40px rgba(0,0,0,0.25);
              border-radius: 2px;
              overflow: hidden;
              position: relative;
            }
            .ps-print-hint {
              font-size: 12px;
              color: #6b7280;
              text-align: center;
              max-width: ${A4_CSS_WIDTH_PX}px;
              line-height: 1.6;
            }
            @media print {
              @page {
                size: A4 portrait;
                margin: 0;
              }
              html, body {
                width: 210mm !important;
                height: 297mm !important;
                margin: 0 !important;
                padding: 0 !important;
                background: #fff !important;
                overflow: hidden !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .ps-print-wrap {
                padding: 0 !important;
                margin: 0 !important;
                gap: 0 !important;
                min-height: 0 !important;
                display: block !important;
              }
              .ps-print-toolbar,
              .ps-print-hint {
                display: none !important;
              }
              .ps-print-card {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 210mm !important;
                height: 297mm !important;
                box-shadow: none !important;
                border-radius: 0 !important;
                overflow: hidden !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .ps-print-card iframe {
                width: ${project.width}px !important;
                height: ${project.height}px !important;
                transform: scale(${iframeScale}) !important;
                transform-origin: 0 0 !important;
                display: block !important;
              }
            }
          `,
        }}
      />

      <div className="ps-print-wrap">
        <div className="ps-print-toolbar">
          <strong title={project.name}>{project.name} — Professional PDF</strong>
          <span
            className={`ps-print-status ${
              status === "rendered" ? "ready" : status === "error" ? "error" : ""
            }`}
          >
            {status === "loading"
              ? "Rendering…"
              : status === "rendered"
                ? "Ready to print"
                : `Error: ${errorMsg}`}
          </span>
          <button
            className="ps-print-btn"
            disabled={status !== "rendered"}
            onClick={() => window.print()}
          >
            Save as PDF
          </button>
        </div>

        <div className="ps-print-card">
          <iframe
            ref={attachIframe}
            onLoad={handleIframeLoad}
            src={`${publicUrl("sandbox/index.html")}?v=khmer-mono-14`}
            title={`Print preview — ${project.name}`}
            sandbox="allow-scripts allow-same-origin"
            style={{
              width: project.width,
              height: project.height,
              transform: `scale(${iframeScale})`,
              transformOrigin: "top left",
              border: "none",
              display: "block",
            }}
          />
        </div>

        <p className="ps-print-hint">
          When the print dialog opens: select <strong>Paper: A4</strong>,{" "}
          <strong>Margins: None</strong>, enable{" "}
          <strong>Background graphics</strong>, then click{" "}
          <strong>Save as PDF</strong>.
        </p>
      </div>
    </>
  );
}