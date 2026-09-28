import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WithTooltip } from "@/components/ui/tooltip";
import { useViewportTier } from "@/hooks/use-viewport-tier";
import { useEditorStore } from "@/stores/editorStore";
import { usePreviewStore } from "@/stores/previewStore";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  idle: "Idle",
  compiling: "Compiling…",
  rendering: "Rendering…",
  ready: "Ready",
  error: "Error",
};

const STATUS_COLOR: Record<string, string> = {
  idle: "bg-muted-foreground",
  compiling: "bg-amber-400",
  rendering: "bg-amber-400",
  ready: "bg-emerald-500",
  error: "bg-destructive",
};

export function StatusBar() {
  const tier = useViewportTier();
  const compact = tier !== "large";
  const status = usePreviewStore((s) => s.status);
  const diagnostics = usePreviewStore((s) => s.diagnostics);
  const previewStale = usePreviewStore((s) => s.previewStale);
  const current = useProjectStore((s) => s.current);
  const dirty = useEditorStore((s) => s.dirty);
  const saveStatus = useUiStore((s) => s.saveStatus);
  const consoleExpanded = useUiStore((s) => s.consoleExpanded);
  const setConsoleExpanded = useUiStore((s) => s.setConsoleExpanded);

  const errors = diagnostics.filter((d) => d.severity === "error");
  const warnings = diagnostics.filter((d) => d.severity === "warning");
  const width = current?.width ?? 1080;
  const height = current?.height ?? 1350;
  const consoleLabel = consoleExpanded ? "Collapse console" : "Expand console";

  useEffect(() => {
    if (errors.length > 0) setConsoleExpanded(true);
  }, [errors.length, setConsoleExpanded]);

  return (
    <div className="studio-statusbar shrink-0 border-t border-border bg-[var(--statusbar-bg)]">
      <div className="flex h-7 items-center gap-3 px-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className={cn("h-2 w-2 rounded-full", STATUS_COLOR[status])} />
          {STATUS_LABEL[status]}
        </span>
        {errors.length > 0 && (
          <button
            type="button"
            className="text-destructive hover:underline"
            onClick={() => setConsoleExpanded(!consoleExpanded)}
          >
            {errors.length} error{errors.length !== 1 ? "s" : ""}
          </button>
        )}
        {warnings.length > 0 && !errors.length && (
          <span>
            {warnings.length} warning{warnings.length !== 1 ? "s" : ""}
          </span>
        )}
        <WithTooltip label={`${width} × ${height}`}>
          <span className="ml-auto cursor-default tabular-nums">
            {compact ? `${width}×${height}` : `${width} × ${height}`}
          </span>
        </WithTooltip>
        {previewStale &&
          (compact ? (
            <WithTooltip label="Preview out of date">
              <span
                className="inline-block h-2 w-2 shrink-0 cursor-default rounded-full bg-amber-400"
                aria-label="Preview out of date"
              />
            </WithTooltip>
          ) : (
            <span>Preview out of date</span>
          ))}
        {saveStatus === "saving" &&
          (compact ? (
            <WithTooltip label="Saving…">
              <span className="cursor-default" aria-label="Saving">
                …
              </span>
            </WithTooltip>
          ) : (
            <span>Saving…</span>
          ))}
        {saveStatus === "saved" && !dirty &&
          (compact ? (
            <WithTooltip label="Saved">
              <span className="cursor-default text-emerald-600 dark:text-emerald-400" aria-label="Saved">
                ✓
              </span>
            </WithTooltip>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400">Saved</span>
          ))}
        {saveStatus === "error" &&
          (compact ? (
            <WithTooltip label="Save failed">
              <span className="cursor-default text-destructive" aria-label="Save failed">
                !
              </span>
            </WithTooltip>
          ) : (
            <span className="text-destructive">Save failed</span>
          ))}
        {dirty && saveStatus !== "saving" &&
          (compact ? (
            <WithTooltip label="Unsaved changes">
              <span className="cursor-default" aria-label="Unsaved changes">
                ●
              </span>
            </WithTooltip>
          ) : (
            <span>Unsaved</span>
          ))}
        {(errors.length > 0 || warnings.length > 0) && (
          <WithTooltip label={consoleLabel}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0"
              onClick={() => setConsoleExpanded(!consoleExpanded)}
              aria-label={consoleLabel}
            >
              {consoleExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronUp className="h-3 w-3" />
              )}
            </Button>
          </WithTooltip>
        )}
      </div>
      {consoleExpanded && diagnostics.length > 0 && (
        <div className="max-h-32 overflow-auto border-t border-border px-3 py-2 font-mono text-xs">
          {diagnostics.map((d, i) => (
            <div
              key={`${d.kind}-${d.line}-${i}`}
              className={cn(
                "py-0.5",
                d.severity === "error" ? "text-destructive" : "text-amber-600 dark:text-amber-400",
              )}
            >
              {d.line != null && `[${d.line}:${d.column ?? 1}] `}
              {d.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
