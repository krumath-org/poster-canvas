import { lazy, Suspense, useEffect, useRef } from "react";
import type { editor as MonacoEditor } from "monaco-editor";
import { CopyAiPromptMenu } from "@/components/editor/CopyAiPromptMenu";
import { MobileCodeEditor } from "@/components/editor/MobileCodeEditor";
import type { Diagnostic } from "@/core/types";
import { useViewportTier } from "@/hooks/use-viewport-tier";
import { configureMonacoForPosterTsx, POSTER_EDITOR_PATH } from "@/lib/monacoTsx";
import { monacoThemeFor } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editorStore";
import { usePreviewStore } from "@/stores/previewStore";
import { useUiStore } from "@/stores/uiStore";

const Monaco = lazy(() =>
  import("@monaco-editor/react").then((mod) => ({
    default: mod.default,
  })),
);

interface CodeEditorProps {
  className?: string;
}

function diagnosticsToMarkers(diagnostics: Diagnostic[]): MonacoEditor.IMarkerData[] {
  return diagnostics
    .filter((d) => d.line != null)
    .map((d) => ({
      severity: d.severity === "error" ? 8 : 4,
      message: d.message,
      startLineNumber: d.line ?? 1,
      startColumn: d.column ?? 1,
      endLineNumber: d.line ?? 1,
      endColumn: (d.column ?? 1) + 1,
    }));
}

export function CodeEditor({ className }: CodeEditorProps) {
  const tier = useViewportTier();
  const code = useEditorStore((s) => s.code);
  const setCode = useEditorStore((s) => s.setCode);
  const diagnostics = usePreviewStore((s) => s.diagnostics);
  const theme = useUiStore((s) => s.theme);
  const monacoTheme = monacoThemeFor(theme);
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (tier === "small") return;
    const monaco = (window as Window & { monaco?: typeof import("monaco-editor") }).monaco;
    if (!monaco) return;
    monaco.editor.setTheme(monacoTheme);
  }, [monacoTheme, tier]);

  useEffect(() => {
    if (tier === "small") return;
    const editor = editorRef.current;
    if (!editor) return;
    const model = editor.getModel();
    if (!model) return;
    const monaco = (window as Window & { monaco?: typeof import("monaco-editor") }).monaco;
    if (!monaco) return;
    monaco.editor.setModelMarkers(model, "poster", diagnosticsToMarkers(diagnostics));
  }, [diagnostics, tier]);

  if (tier === "small") {
    return (
      <div
        className={cn(
          "relative min-h-0 overflow-hidden",
          className ?? "studio-editor-panel h-full w-full",
        )}
      >
        <MobileCodeEditor />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative min-h-0 overflow-hidden",
        className ?? "studio-editor-panel h-full w-full",
      )}
    >
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading editor…
          </div>
        }
      >
        <Monaco
          height="100%"
          path={POSTER_EDITOR_PATH}
          defaultLanguage="typescript"
          theme={monacoTheme}
          value={code}
          beforeMount={configureMonacoForPosterTsx}
          onChange={(value) => setCode(value ?? "")}
          onMount={(editor, monaco) => {
            editorRef.current = editor;
            (window as Window & { monaco?: typeof monaco }).monaco = monaco;
            configureMonacoForPosterTsx(monaco);
            editor.updateOptions({
              fontSize: 13,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              tabSize: 2,
              automaticLayout: true,
              // Escape overflow:hidden ancestors so Find/suggest/hover aren't clipped
              // or stacked under panel chrome (and stay clickable).
              fixedOverflowWidgets: true,
            });
            editor.addAction({
              id: "poster.run",
              label: "Run poster",
              keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
              run: () => {
                useEditorStore.getState().run();
              },
            });
            const model = editor.getModel();
            if (model) {
              monaco.editor.setModelMarkers(
                model,
                "poster",
                diagnosticsToMarkers(usePreviewStore.getState().diagnostics),
              );
            }
          }}
          options={{
            padding: { top: 12 },
            fixedOverflowWidgets: true,
          }}
        />
      </Suspense>

      <div className="pointer-events-none absolute bottom-3 right-12 z-20">
        <div className="pointer-events-auto">
          <CopyAiPromptMenu />
        </div>
      </div>
    </div>
  );
}
