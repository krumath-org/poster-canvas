import { describe, expect, it } from "vitest";

import type { PosterProject } from "@/core/types";
import { projectToCloudRow, rowToProject } from "./posterCloudMapper";

const project: PosterProject = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "Demo",
  code: "export default function Poster(){ return null }",
  width: 1080,
  height: 1350,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  assets: {
    logo: {
      dataUrl: "data:image/png;base64,AAAA",
      fileName: "logo.png",
      mimeType: "image/png",
    },
  },
  logoSlot: { corner: "top-right", maxHeight: 64, padding: 40 },
};

describe("projectToCloudRow", () => {
  it("stores codes and metadata without logo binaries or export fields", () => {
    const row = projectToCloudRow(project, "user-1");
    expect(row).toEqual({
      id: project.id,
      user_id: "user-1",
      name: "Demo",
      code: project.code,
      width: 1080,
      height: 1350,
      logo_slot: { corner: "top-right", maxHeight: 64, padding: 40 },
      created_at: project.createdAt,
      updated_at: project.updatedAt,
    });
    expect(row).not.toHaveProperty("assets");
    expect(JSON.stringify(row)).not.toContain("data:image");
  });
});

describe("rowToProject", () => {
  it("maps DB rows without inventing stored logo binaries", () => {
    const mapped = rowToProject(projectToCloudRow(project, "user-1"));
    expect(mapped.assets).toEqual({});
    expect(mapped.logoSlot).toEqual({ corner: "top-right", maxHeight: 64, padding: 40 });
    expect(mapped.code).toBe(project.code);
  });
});
