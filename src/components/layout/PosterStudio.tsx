import { useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { SizePickerDialog } from "@/components/layout/SizePickerDialog";
import { StatusBar } from "@/components/layout/StatusBar";
import { StudioLayoutShell } from "@/components/layout/StudioLayout";
import { OnboardingDialog } from "@/components/onboarding/OnboardingDialog";
import { ProjectManagerDialog } from "@/components/projects/ProjectManagerDialog";
import { TemplatesDialog } from "@/components/templates/TemplatesDialog";
import { usePreviewRender } from "@/hooks/usePreviewRender";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSandboxBridge } from "@/hooks/useSandboxBridge";
import { useAutosaveProject } from "@/hooks/useAutosaveProject";
import { hasCompletedOnboarding } from "@/lib/onboarding";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";

export function PosterStudio() {
  const { bridge, iframeRef } = useSandboxBridge();
  const initTheme = useUiStore((s) => s.setTheme);
  const setOnboardingOpen = useUiStore((s) => s.setOnboardingOpen);
  const loadProjects = useProjectStore((s) => s.loadProjects);
  const openProject = useProjectStore((s) => s.openProject);
  const newProject = useProjectStore((s) => s.newProject);

  const initialized = useRef(false);
  const onboardingChecked = useRef(false);

  useKeyboardShortcuts();
  usePreviewRender(bridge);
  useAutosaveProject();

  useEffect(() => {
    initTheme(useUiStore.getState().theme);
  }, [initTheme]);

  // Open the most recently updated project, or create one. Avoids flooding
  // Supabase with a new blank row on every production reload.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    void (async () => {
      await loadProjects();
      const projects = useProjectStore.getState().projects;
      if (projects.length > 0) {
        await openProject(projects[0]!.id);
        return;
      }
      await newProject();
    })();
  }, [loadProjects, openProject, newProject]);

  useEffect(() => {
    if (onboardingChecked.current) return;
    onboardingChecked.current = true;
    if (hasCompletedOnboarding()) return;
    const timer = window.setTimeout(() => {
      setOnboardingOpen(true);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [setOnboardingOpen]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <AppHeader bridge={bridge} />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <StudioLayoutShell iframeRef={iframeRef} />
        </main>
        <StatusBar />
        <TemplatesDialog />
        <ProjectManagerDialog />
        <SizePickerDialog />
        <OnboardingDialog />
        <CommandPalette bridge={bridge} />
        <Toaster position="bottom-right" />
      </div>
    </TooltipProvider>
  );
}
