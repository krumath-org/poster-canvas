import { beforeEach, describe, expect, it } from "vitest";
import {
  LocalProjectRepository,
  MemoryProjectRepository,
  normalizeProject,
} from "./localProjectRepository";
import type { PosterProject } from "@/core/types";

const STORAGE_KEY = "poster-studio.projects.v1";

function sample(id: string, overrides: Partial<PosterProject> = {}): PosterProject {
  const ts = "2026-01-01T00:00:00.000Z";
  return {
    id,
    name: `Project ${id}`,
    code: "export default function Poster() { return null; }",
    width: 1080,
    height: 1350,
    createdAt: ts,
    updatedAt: ts,
    ...overrides,
  };
}

describe("normalizeProject", () => {
  it("fills assets and logoSlot defaults for legacy records", () => {
    const normalized = normalizeProject(sample("legacy"));
    expect(normalized.assets).toEqual({});
    expect(normalized.logoSlot).toBeNull();
  });
});

describe("MemoryProjectRepository", () => {
  it("creates and lists projects", async () => {
    const repo = new MemoryProjectRepository();
    await repo.createProject(sample("a"));
    const projects = await repo.getProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0]?.id).toBe("a");
  });

  it("updates and deletes projects", async () => {
    const repo = new MemoryProjectRepository();
    const project = sample("b");
    await repo.createProject(project);
    await repo.updateProject({ ...project, name: "Renamed" });
    expect((await repo.getProject("b"))?.name).toBe("Renamed");
    await repo.deleteProject("b");
    expect(await repo.getProject("b")).toBeNull();
  });
});

describe("LocalProjectRepository", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("serializes concurrent create and update without dropping siblings", async () => {
    const repo = new LocalProjectRepository();
    const p1 = sample("p1", { updatedAt: "2026-01-01T00:00:00.000Z" });
    await repo.createProject(p1);

    const updateP1 = repo.updateProject({
      ...p1,
      code: "export default function Poster(){ return <h1>Updated</h1>; }",
      updatedAt: "2026-01-01T00:00:01.000Z",
    });
    const createP2 = repo.createProject(
      sample("p2", { updatedAt: "2026-01-01T00:00:02.000Z" }),
    );

    await Promise.all([updateP1, createP2]);

    const projects = await repo.getProjects();
    expect(projects.map((p) => p.id).sort()).toEqual(["p1", "p2"]);
    expect(projects.find((p) => p.id === "p1")?.code).toContain("Updated");
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")).toHaveLength(2);
  });
});
