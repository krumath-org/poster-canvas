import type { PosterProject, ProjectRepository } from "@/core/types";

const STORAGE_KEY = "poster-studio.projects.v1";

/** Fill defaults for projects saved before assets/logoSlot existed. */
export function normalizeProject(project: PosterProject): PosterProject {
  return {
    ...project,
    assets: project.assets ?? {},
    logoSlot: project.logoSlot ?? null,
  };
}

function readAll(): PosterProject[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as PosterProject[]).map(normalizeProject);
  } catch {
    return [];
  }
}

function writeAll(projects: PosterProject[]): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

/**
 * Browser implementation of {@link ProjectRepository}.
 * Swap this for a remote repository (see docs/integration.md) without
 * touching the editor.
 *
 * Mutations are serialized so concurrent autosave + New cannot drop siblings.
 */
export class LocalProjectRepository implements ProjectRepository {
  private writeChain: Promise<void> = Promise.resolve();

  private enqueue<T>(fn: () => T): Promise<T> {
    const run = this.writeChain.then(() => fn());
    this.writeChain = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }

  async getProjects(): Promise<PosterProject[]> {
    return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getProject(id: string): Promise<PosterProject | null> {
    return readAll().find((p) => p.id === id) ?? null;
  }

  async createProject(project: PosterProject): Promise<PosterProject> {
    return this.enqueue(() => {
      const all = readAll();
      all.push(project);
      writeAll(all);
      return project;
    });
  }

  async updateProject(project: PosterProject): Promise<PosterProject> {
    return this.enqueue(() => {
      const all = readAll();
      const index = all.findIndex((p) => p.id === project.id);
      if (index === -1) all.push(project);
      else all[index] = project;
      writeAll(all);
      return project;
    });
  }

  async deleteProject(id: string): Promise<void> {
    return this.enqueue(() => {
      writeAll(readAll().filter((p) => p.id !== id));
    });
  }
}

/** In-memory repository — used by tests and by SSR where storage is absent. */
export class MemoryProjectRepository implements ProjectRepository {
  private items = new Map<string, PosterProject>();

  async getProjects(): Promise<PosterProject[]> {
    return [...this.items.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  async getProject(id: string): Promise<PosterProject | null> {
    return this.items.get(id) ?? null;
  }
  async createProject(project: PosterProject): Promise<PosterProject> {
    this.items.set(project.id, project);
    return project;
  }
  async updateProject(project: PosterProject): Promise<PosterProject> {
    this.items.set(project.id, project);
    return project;
  }
  async deleteProject(id: string): Promise<void> {
    this.items.delete(id);
  }
}
