import { useEffect, useRef } from "react";
import { clampZoom, fitScale } from "@/data/sizes";
import { effectiveScale, usePreviewStore } from "@/stores/previewStore";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";
import { publicUrl } from "@/lib/publicUrl";

interface PreviewCanvasProps {
  iframeRef: (node: HTMLIFrameElement | null) => void;
}

const BACKGROUND_CLASS: Record<string, string> = {
  dark: "bg-neutral-900",
  light: "bg-neutral-100",
  checker:
    "bg-[length:16px_16px] bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[position:0_0,0_8px,8px_-8px,-8px_0px] bg-white",
};

const PREVIEW_PADDING = 48;
const WHEEL_ZOOM_SENSITIVITY = 0.0015;

export function PreviewCanvas({ iframeRef }: PreviewCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const current = useProjectStore((s) => s.current);
  const width = current?.width ?? 1080;
  const height = current?.height ?? 1350;
  const fitMode = usePreviewStore((s) => s.fitMode);
  const zoom = usePreviewStore((s) => s.zoom);
  const fitScaleValue = usePreviewStore((s) => s.fitScale);
  const showGrid = usePreviewStore((s) => s.showGrid);
  const background = usePreviewStore((s) => s.background);
  const status = usePreviewStore((s) => s.status);
  const uiTheme = useUiStore((s) => s.theme);
  const reloadNonce = usePreviewStore((s) => s.reloadNonce);
  const setFitScale = usePreviewStore((s) => s.setFitScale);
  const setZoom = usePreviewStore((s) => s.setZoom);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width: vw, height: vh } = entry.contentRect;
      setFitScale(fitScale({ width, height }, { width: vw, height: vh }, PREVIEW_PADDING));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height, setFitScale]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();

      const state = usePreviewStore.getState();
      const oldScale = effectiveScale(state);
      const factor = Math.exp(-event.deltaY * WHEEL_ZOOM_SENSITIVITY);
      const newScale = clampZoom(oldScale * factor);
      if (newScale === oldScale) return;

      const rect = el.getBoundingClientRect();
      const cx = event.clientX - rect.left + el.scrollLeft;
      const cy = event.clientY - rect.top + el.scrollTop;
      const ratio = newScale / oldScale;

      setZoom(newScale);

      requestAnimationFrame(() => {
        el.scrollLeft = cx * ratio - (event.clientX - rect.left);
        el.scrollTop = cy * ratio - (event.clientY - rect.top);
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [setZoom]);

  const scale = effectiveScale({ fitMode, fitScale: fitScaleValue, zoom });
  const scaledW = width * scale;
  const scaledH = height * scale;
  const followsAppTheme = background !== "checker" && background === uiTheme;
  const isLoading = status === "compiling" || status === "rendering";

  return (
    <div
      ref={containerRef}
      className={cn(
        "studio-preview-panel relative h-full w-full overflow-auto",
        !followsAppTheme && BACKGROUND_CLASS[background],
      )}
    >
      {showGrid && (
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      )}
      {/* Avoid flex centering on the scrollport — it clips oversized posters. */}
      <div
        className="grid place-items-center p-6"
        style={{
          width: `max(100%, ${scaledW + PREVIEW_PADDING}px)`,
          height: `max(100%, ${scaledH + PREVIEW_PADDING}px)`,
        }}
      >
        <div
          className="relative overflow-hidden shadow-2xl"
          style={{
            width: scaledW,
            height: scaledH,
          }}
          aria-busy={isLoading || undefined}
        >
          <iframe
            key={reloadNonce}
            ref={iframeRef}
            src={`${publicUrl("sandbox/index.html")}?v=khmer-fonts-9`}
            title="Poster preview"
            sandbox="allow-scripts allow-same-origin"
            className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
            style={{
              width,
              height,
              transform: `scale(${scale})`,
            }}
          />
          {isLoading && (
            <div className="pointer-events-none absolute inset-0 z-10 bg-background/50">
              <div className="preview-loading-bar absolute inset-x-0 top-0 h-0.5 overflow-hidden">
                <div className="preview-loading-bar-inner h-full w-1/3 bg-foreground/70" />
              </div>
              <span className="sr-only">Rendering preview…</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
