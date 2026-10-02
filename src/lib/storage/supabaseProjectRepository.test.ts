import { beforeEach, describe, expect, it, vi } from "vitest";

import type { PosterProject } from "@/core/types";
import type { PosterCanvasDbRow } from "./posterCloudMapper";
import { projectToCloudRow } from "./posterCloudMapper";

const inserts: PosterCanvasDbRow[] = [];
const upserts: PosterCanvasDbRow[] = [];

function makeChain(handlers: {
  onInsert?: (row: PosterCanvasDbRow) => PosterCanvasDbRow;
  onUpsert?: (row: PosterCanvasDbRow) => PosterCanvasDbRow;
  onSelect?: () => PosterCanvasDbRow[];
  onMaybeSingle?: () => PosterCanvasDbRow | null;
}) {
  const state: { row?: PosterCanvasDbRow; op?: "insert" | "upsert" | "select" | "delete" } = {};
  const api: Record<string, unknown> = {};
  api.select = vi.fn(() => {
    state.op = state.op ?? "select";
    return api;
  });
  api.insert = vi.fn((row: PosterCanvasDbRow) => {
    state.op = "insert";
    state.row = row;
    return api;
  });
  api.upsert = vi.fn((row: PosterCanvasDbRow) => {
    state.op = "upsert";
    state.row = row;
    return api;
  });
  api.delete = vi.fn(() => {
    state.op = "delete";
    return api;
  });
  api.eq = vi.fn(() => api);
  api.order = vi.fn(async () => {
    const data = handlers.onSelect?.() ?? [];
    return { data, error: null };
  });
  api.maybeSingle = vi.fn(async () => {
    const data = handlers.onMaybeSingle?.() ?? null;
    return { data, error: null };
  });
  api.single = vi.fn(async () => {
    if (state.op === "insert" && state.row) {
      const saved = handlers.onInsert?.(state.row) ?? state.row;
      return { data: saved, error: null };
    }
    if (state.op === "upsert" && state.row) {
      const saved = handlers.onUpsert?.(state.row) ?? state.row;
      return { data: saved, error: null };
    }
    return { data: null, error: { message: "unexpected single()" } };
  });
  return api;
}

vi.mock("@/lib/supabase.client", () => ({
  getBrowserUser: vi.fn(async () => ({ id: "user-1", is_anonymous: false })),
  getSupabaseBrowserClient: vi.fn(() => ({
    from: vi.fn((table: string) => {
      expect(table).toBe("poster_canvas_projects");
      return makeChain({
        onInsert: (row) => {
          inserts.push(row);
          return row;
        },
        onUpsert: (row) => {
          upserts.push(row);
          return row;
        },
        onSelect: () => [...inserts, ...upserts],
        onMaybeSingle: () => inserts[0] ?? null,
      });
    }),
  })),
}));

const { SupabaseProjectRepository } = await import("./supabaseProjectRepository.client");

function sample(id: string, code: string): PosterProject {
  return {
    id,
    name: "Demo",
    code,
    width: 1080,
    height: 1350,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    assets: {},
    logoSlot: null,
  };
}

describe("SupabaseProjectRepository", () => {
  beforeEach(() => {
    inserts.length = 0;
    upserts.length = 0;
  });

  it("createProject inserts project.code into poster_canvas_projects", async () => {
    const repo = new SupabaseProjectRepository();
    const project = sample("11111111-1111-1111-1111-111111111111", "export default function A(){}");
    const saved = await repo.createProject(project);

    expect(inserts).toHaveLength(1);
    expect(inserts[0]?.code).toBe(project.code);
    expect(inserts[0]).toEqual(projectToCloudRow(project, "user-1"));
    expect(saved.code).toBe(project.code);
  });

  it("updateProject upserts the new code for the same id", async () => {
    const repo = new SupabaseProjectRepository();
    const project = sample(
      "22222222-2222-2222-2222-222222222222",
      "export default function B(){ return <h1>Next</h1>; }",
    );
    const saved = await repo.updateProject(project);

    expect(upserts).toHaveLength(1);
    expect(upserts[0]?.code).toBe(project.code);
    expect(upserts[0]?.id).toBe(project.id);
    expect(saved.code).toBe(project.code);
  });

  it("two createProject calls insert two distinct rows with their codes", async () => {
    const repo = new SupabaseProjectRepository();
    const a = sample("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "code-a");
    const b = sample("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "code-b");

    await repo.createProject(a);
    await repo.createProject(b);

    expect(inserts).toHaveLength(2);
    expect(inserts.map((row) => row.id).sort()).toEqual([a.id, b.id].sort());
    expect(inserts.map((row) => row.code).sort()).toEqual(["code-a", "code-b"]);
  });
});
