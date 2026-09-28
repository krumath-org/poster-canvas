import { useEffect, useState } from "react";
import { Copy, Pencil, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { WithTooltip } from "@/components/ui/tooltip";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";

export function ProjectManagerDialog() {
  const open = useUiStore((s) => s.projectsOpen);
  const setOpen = useUiStore((s) => s.setProjectsOpen);
  const projects = useProjectStore((s) => s.projects);
  const current = useProjectStore((s) => s.current);
  const loadProjects = useProjectStore((s) => s.loadProjects);
  const openProject = useProjectStore((s) => s.openProject);
  const deleteProject = useProjectStore((s) => s.deleteProject);
  const duplicateProject = useProjectStore((s) => s.duplicateProject);
  const renameProject = useProjectStore((s) => s.renameProject);
  const lockProjectName = useProjectStore((s) => s.lockProjectName);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    if (open) void loadProjects();
  }, [open, loadProjects]);

  const commitRename = () => {
    if (!renameValue.trim() || !renameId) return;
    if (current?.id === renameId) lockProjectName();
    void renameProject(renameValue.trim(), renameId);
    setRenameId(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85dvh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Projects</DialogTitle>
          </DialogHeader>
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved projects yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {projects.map((project) => (
                <li key={project.id} className="flex items-center gap-2 py-3">
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => {
                      void openProject(project.id);
                      setOpen(false);
                    }}
                  >
                    <div className="truncate text-sm font-medium">{project.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {project.width} × {project.height} ·{" "}
                      {new Date(project.updatedAt).toLocaleString(undefined, {
                        timeZone: "Asia/Phnom_Penh",
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </div>
                  </button>
                  {current?.id === project.id && <span className="text-xs text-primary">Open</span>}
                  <WithTooltip label="Rename">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      aria-label="Rename"
                      onClick={() => {
                        setRenameId(project.id);
                        setRenameValue(project.name);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </WithTooltip>
                  <WithTooltip label="Duplicate">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      aria-label="Duplicate"
                      onClick={() => {
                        if (current?.id === project.id) void duplicateProject();
                        else void openProject(project.id).then(() => duplicateProject());
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </WithTooltip>
                  <WithTooltip label="Delete">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive"
                      aria-label="Delete"
                      onClick={() => setDeleteId(project.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </WithTooltip>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The project will be removed from local storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) void deleteProject(deleteId);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={Boolean(renameId)} onOpenChange={(o) => !o && setRenameId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
            }}
          />
          <Button type="button" onClick={commitRename}>
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
