import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from "@/data/templates";
import { useEditorStore } from "@/stores/editorStore";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";
import { useState } from "react";

export function TemplatesDialog() {
  const open = useUiStore((s) => s.templatesOpen);
  const setOpen = useUiStore((s) => s.setTemplatesOpen);
  const dirty = useEditorStore((s) => s.dirty);
  const loadTemplate = useProjectStore((s) => s.loadTemplate);
  const createFromTemplate = useProjectStore((s) => s.createFromTemplate);
  const [pending, setPending] = useState<(typeof TEMPLATES)[number] | null>(null);

  const applyAsNew = (template: (typeof TEMPLATES)[number]) => {
    void createFromTemplate(template.code, template.width, template.height, template.name);
    setOpen(false);
    setPending(null);
  };

  const applyReplace = (template: (typeof TEMPLATES)[number]) => {
    loadTemplate(template.code, template.width, template.height, template.name);
    setOpen(false);
    setPending(null);
  };

  const onSelect = (template: (typeof TEMPLATES)[number]) => {
    if (dirty) {
      setPending(template);
      return;
    }
    applyAsNew(template);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85dvh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Templates</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                className="rounded-md border border-border p-4 text-left transition-colors hover:bg-accent"
                onClick={() => onSelect(template)}
              >
                <div className="text-sm font-medium">{template.name}</div>
                <div className="text-xs text-muted-foreground">{template.category}</div>
                <p className="mt-2 text-xs text-muted-foreground">{template.description}</p>
                <div className="mt-2 text-xs tabular-nums text-muted-foreground">
                  {template.width} × {template.height}
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(pending)} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apply template?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Create a new project from this template, or replace the
              current project’s code.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="outline"
              onClick={() => pending && applyReplace(pending)}
            >
              Replace current
            </Button>
            <AlertDialogAction onClick={() => pending && applyAsNew(pending)}>
              New project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
