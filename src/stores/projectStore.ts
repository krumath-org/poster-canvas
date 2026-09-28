import { create } from "zustand";
import type { PosterLogoAsset, PosterLogoSlot, PosterProject } from "@/core/types";
import { DEFAULT_SIZE } from "@/data/sizes";
import { STARTER_CODE } from "@/data/templates";
import { getProjectRepository } from "@/lib/config";
import { DEFAULT_LOGO_SLOT } from "@/lib/logoSlot";
import { useEditorStore } from "@/stores/editorStore";
import { usePreviewStore } from "@/stores/previewStore";
import { useUiStore } from "@/stores/uiStore";
import { toast } from "sonner";

export const DEFAULT_PROJECT_NAME = "Untitled Poster";

interface ProjectState {
  current: PosterProject | null;
  projects: PosterProject[];
  loading: boolean;
  error: string | null;
  /** Session-only: when true, auto-title from code is disabled. */
  nameLocked: boolean;
  loadProjects: () => Promise<void>;
  openProject: (id: string) => Promise<void>;
  newProject: (name?: string, width?: number, height?: number) => Promise<void>;
  saveProject: (options?: { quiet?: boolean }) => Promise<boolean>;
  duplicateProject: () => Promise<void>;
  renameProject: (name: string, id?: string) => Promise<void>;
  /** In-memory rename for autosave; does not lock or hit the repository. */
  setCurrentName: (name: string) => void;
  /** Stop auto-titling after the user edits the name. */
  lockProjectName: () => void;
  deleteProject: (id: string) => Promise<void>;
  setSize: (width: number, height: number) => void;
  loadTemplate: (code: string, width: number, height: number, name?: string) => void;
  setLogo: (asset: PosterLogoAsset) => void;
  setLogoSlot: (partial: Partial<PosterLogoSlot>) => void;
  clearLogo: () => void;
}

function now(): string {
  return new Date().toISOString();
}

function markProjectDirty(): void {
  const { code, setCode } = useEditorStore.getState();
  setCode(code);
}

function createBlankProject(
  name = DEFAULT_PROJECT_NAME,
  width = DEFAULT_SIZE.width,
  height = DEFAULT_SIZE.height,
): PosterProject {
  const ts = now();
  return {
    id: crypto.randomUUID(),
    name,
    code: STARTER_CODE,
    width,
    height,
    createdAt: ts,
    updatedAt: ts,
    assets: {},
    logoSlot: null,
  };
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  current: null,
  projects: [],
  loading: false,
  error: null,
  nameLocked: false,

  loadProjects: async () => {
    set({ loading: true, error: null });
    try {
      const projects = await getProjectRepository().getProjects();
      set({ projects, loading: false });
    } catch (err) {
      const message = String(err);
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  openProject: async (id) => {
    set({ loading: true, error: null });
    try {
      const project = await getProjectRepository().getProject(id);
      if (!project) {
        set({ loading: false, error: "Project not found" });
        toast.error("Project not found");
        return;
      }
      useEditorStore.getState().resetCode(project.code);
      usePreviewStore.getState().reloadSandbox();
      set({
        current: project,
        loading: false,
        nameLocked: project.name !== DEFAULT_PROJECT_NAME,
      });
    } catch (err) {
      const message = String(err);
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  newProject: async (name, width, height) => {
    const project = createBlankProject(
      name,
      width ?? DEFAULT_SIZE.width,
      height ?? DEFAULT_SIZE.height,
    );
    set({ loading: true, error: null });
    try {
      await getProjectRepository().createProject(project);
      useEditorStore.getState().resetCode(project.code);
      usePreviewStore.getState().reloadSandbox();
      const projects = await getProjectRepository().getProjects();
      set({ current: project, projects, loading: false, nameLocked: false });
    } catch (err) {
      const message = String(err);
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  saveProject: async (options) => {
    const quiet = options?.quiet === true;
    const { current } = get();
    if (!current) {
      if (!quiet) toast.error("Nothing to save — create or open a project first");
      return false;
    }
    if (!quiet) set({ loading: true, error: null });
    useUiStore.getState().setSaveStatus("saving");
    try {
      const code = useEditorStore.getState().code;
      const updated: PosterProject = {
        ...current,
        code,
        updatedAt: now(),
      };
      await getProjectRepository().updateProject(updated);
      useEditorStore.getState().markSaved();
      const projects = await getProjectRepository().getProjects();
      // Cloud repo strips logo binaries; restore in-memory session assets after save.
      const saved = projects.find((p) => p.id === updated.id) ?? updated;
      const withSessionAssets: PosterProject = {
        ...saved,
        assets: current.assets?.logo ? current.assets : (saved.assets ?? {}),
        logoSlot: current.logoSlot ?? saved.logoSlot ?? null,
      };
      set({ current: withSessionAssets, projects, loading: false });
      useUiStore.getState().setSaveStatus("saved");
      if (!quiet) toast.success(`Saved “${updated.name}”`);
      return true;
    } catch (err) {
      const message = String(err);
      set({ loading: false, error: message });
      useUiStore.getState().setSaveStatus("error");
      if (!quiet) toast.error(message);
      return false;
    }
  },

  duplicateProject: async () => {
    const { current } = get();
    if (!current) return;
    const code = useEditorStore.getState().code;
    const ts = now();
    const copy: PosterProject = {
      ...current,
      id: crypto.randomUUID(),
      name: `${current.name} (copy)`,
      code,
      assets: current.assets ? { ...current.assets } : {},
      logoSlot: current.logoSlot ? { ...current.logoSlot } : null,
      createdAt: ts,
      updatedAt: ts,
    };
    set({ loading: true, error: null });
    try {
      await getProjectRepository().createProject(copy);
      useEditorStore.getState().resetCode(copy.code);
      usePreviewStore.getState().reloadSandbox();
      const projects = await getProjectRepository().getProjects();
      set({ current: copy, projects, loading: false, nameLocked: true });
    } catch (err) {
      set({ loading: false, error: String(err) });
    }
  },

  renameProject: async (name: string, id?: string) => {
    const { current, projects } = get();
    const target = id ? (projects.find((p) => p.id === id) ?? current) : current;
    if (!target) return;
    const updated: PosterProject = { ...target, name, updatedAt: now() };
    set({ loading: true, error: null });
    try {
      await getProjectRepository().updateProject(updated);
      const nextProjects = await getProjectRepository().getProjects();
      set({
        current: get().current?.id === updated.id ? updated : get().current,
        projects: nextProjects,
        loading: false,
      });
    } catch (err) {
      set({ loading: false, error: String(err) });
    }
  },

  setCurrentName: (name) => {
    const { current } = get();
    if (!current || current.name === name) return;
    set({
      current: { ...current, name, updatedAt: now() },
    });
    markProjectDirty();
  },

  lockProjectName: () => {
    set({ nameLocked: true });
  },

  deleteProject: async (id) => {
    set({ loading: true, error: null });
    try {
      await getProjectRepository().deleteProject(id);
      const projects = await getProjectRepository().getProjects();
      const { current } = get();
      if (current?.id === id) {
        useEditorStore.getState().resetCode(STARTER_CODE);
        usePreviewStore.getState().reloadSandbox();
        set({ current: null, projects, loading: false, nameLocked: false });
      } else {
        set({ projects, loading: false });
      }
    } catch (err) {
      set({ loading: false, error: String(err) });
    }
  },

  setSize: (width, height) => {
    const { current } = get();
    if (!current) return;
    const updated: PosterProject = { ...current, width, height, updatedAt: now() };
    set({ current: updated });
    markProjectDirty();
    usePreviewStore.getState().reloadSandbox();
  },

  loadTemplate: (code, width, height, name) => {
    const { current } = get();
    if (current) {
      // Keep assets / logoSlot so branding survives template swaps.
      const updated: PosterProject = {
        ...current,
        code,
        width,
        height,
        name: name ?? current.name,
        updatedAt: now(),
      };
      set({ current: updated, nameLocked: true });
    } else {
      const ts = now();
      set({
        current: {
          id: crypto.randomUUID(),
          name: name ?? DEFAULT_PROJECT_NAME,
          code,
          width,
          height,
          createdAt: ts,
          updatedAt: ts,
          assets: {},
          logoSlot: null,
        },
        nameLocked: true,
      });
    }
    useEditorStore.getState().resetCode(code);
    usePreviewStore.getState().reloadSandbox();
    markProjectDirty();
  },

  setLogo: (asset) => {
    const { current } = get();
    if (!current) return;
    const updated: PosterProject = {
      ...current,
      assets: { ...current.assets, logo: asset },
      logoSlot: current.logoSlot ?? { ...DEFAULT_LOGO_SLOT },
      updatedAt: now(),
    };
    set({ current: updated });
    markProjectDirty();
  },

  setLogoSlot: (partial) => {
    const { current } = get();
    if (!current) return;
    const base = current.logoSlot ?? { ...DEFAULT_LOGO_SLOT };
    const updated: PosterProject = {
      ...current,
      logoSlot: { ...base, ...partial },
      updatedAt: now(),
    };
    set({ current: updated });
    markProjectDirty();
  },

  clearLogo: () => {
    const { current } = get();
    if (!current) return;
    const assets = { ...current.assets };
    delete assets.logo;
    const updated: PosterProject = {
      ...current,
      assets,
      logoSlot: null,
      updatedAt: now(),
    };
    set({ current: updated });
    markProjectDirty();
  },
}));
