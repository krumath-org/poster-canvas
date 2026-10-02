import { beforeEach, describe, expect, it } from "vitest";
import { useProjectStore } from "./projectStore";
import { useEditorStore } from "./editorStore";
import { MemoryProjectRepository } from "@/lib/storage/localProjectRepository";
import { configureApp } from "@/lib/config";
import type { PosterLogoAsset } from "@/core/types";

const sampleLogo: PosterLogoAsset = {
  dataUrl: "data:image/png;base64,abc",
  fileName: "logo.png",
  mimeType: "image/png",
};

const headlineCode = (title: string) =>
  `export default function Poster(){ return <h1>${title}</h1>; }`;

describe("projectStore", () => {
  beforeEach(() => {
    configureApp({ projectRepository: new MemoryProjectRepository() });
    useProjectStore.setState({
      current: null,
      projects: [],
      loading: false,
      error: null,
      nameLocked: false,
    });
    useEditorStore.setState({ code: "", dirty: false, runNonce: 0 });
  });

  it("creates a project and syncs editor code on save", async () => {
    await useProjectStore.getState().newProject("Test");
    useEditorStore.getState().setCode("export default function Poster() { return null; }");
    await useProjectStore.getState().saveProject();

    const current = useProjectStore.getState().current;
    expect(current?.name).toBe("Test");
    expect(current?.code).toContain("export default function Poster");
    expect(useEditorStore.getState().dirty).toBe(false);
  });

  it("setCurrentName updates in memory and marks dirty without locking", async () => {
    await useProjectStore.getState().newProject();
    expect(useProjectStore.getState().nameLocked).toBe(false);
    useEditorStore.getState().markSaved();

    useProjectStore.getState().setCurrentName("From Code");
    expect(useProjectStore.getState().current?.name).toBe("From Code");
    expect(useProjectStore.getState().nameLocked).toBe(false);
    expect(useEditorStore.getState().dirty).toBe(true);
  });

  it("keeps auto-title unlocked after save/open when name matches code", async () => {
    await useProjectStore.getState().newProject();
    const code = headlineCode("KaTeX Math Lab");
    useEditorStore.getState().setCode(code);
    useProjectStore.getState().setCurrentName("KaTeX Math Lab");
    await useProjectStore.getState().saveProject();

    const id = useProjectStore.getState().current!.id;
    await useProjectStore.getState().openProject(id);
    expect(useProjectStore.getState().nameLocked).toBe(false);

    useProjectStore.getState().setCurrentName("Updated Lab");
    // Name no longer matches code → reopen locks.
    await useProjectStore.getState().saveProject();
    await useProjectStore.getState().openProject(id);
    expect(useProjectStore.getState().nameLocked).toBe(true);
  });

  it("unlocks name on template load and extracts title from code when possible", async () => {
    await useProjectStore.getState().newProject();
    useProjectStore.getState().loadTemplate(headlineCode("From Template"), 800, 800, "Catalog Name");
    expect(useProjectStore.getState().nameLocked).toBe(false);
    expect(useProjectStore.getState().current?.name).toBe("From Template");

    useProjectStore.getState().lockProjectName();
    expect(useProjectStore.getState().nameLocked).toBe(true);

    await useProjectStore.getState().newProject();
    expect(useProjectStore.getState().nameLocked).toBe(false);

    await useProjectStore.getState().saveProject();
    const id = useProjectStore.getState().current!.id;
    await useProjectStore.getState().openProject(id);
    expect(useProjectStore.getState().nameLocked).toBe(false);
  });

  it("createFromTemplate inserts a new project id", async () => {
    await useProjectStore.getState().newProject("First");
    const firstId = useProjectStore.getState().current!.id;

    await useProjectStore
      .getState()
      .createFromTemplate(headlineCode("Second Poster"), 1080, 1080, "Catalog");

    const current = useProjectStore.getState().current;
    expect(current?.id).not.toBe(firstId);
    expect(current?.name).toBe("Second Poster");
    expect(useProjectStore.getState().projects).toHaveLength(2);
    expect(useProjectStore.getState().nameLocked).toBe(false);
  });

  it("newProject flushes a dirty current project before creating the next", async () => {
    await useProjectStore.getState().newProject("Keep Me");
    const firstId = useProjectStore.getState().current!.id;
    useEditorStore.getState().setCode(headlineCode("Edited First"));
    expect(useEditorStore.getState().dirty).toBe(true);

    await useProjectStore.getState().newProject("Next");
    const projects = useProjectStore.getState().projects;
    expect(projects).toHaveLength(2);
    const first = projects.find((p) => p.id === firstId);
    expect(first?.code).toContain("Edited First");
  });

  it("setLogo initializes logoSlot and marks dirty", async () => {
    await useProjectStore.getState().newProject("Logo");
    useEditorStore.getState().markSaved();
    useProjectStore.getState().setLogo(sampleLogo);

    const current = useProjectStore.getState().current;
    expect(current?.assets?.logo).toEqual(sampleLogo);
    expect(current?.logoSlot).toMatchObject({
      corner: "top-left",
      maxHeight: 64,
      padding: 40,
    });
    expect(useEditorStore.getState().dirty).toBe(true);
  });

  it("setLogoSlot updates placement and clearLogo removes asset", async () => {
    await useProjectStore.getState().newProject("Logo");
    useProjectStore.getState().setLogo(sampleLogo);
    useProjectStore.getState().setLogoSlot({ corner: "bottom-right", maxHeight: 96 });

    expect(useProjectStore.getState().current?.logoSlot).toMatchObject({
      corner: "bottom-right",
      maxHeight: 96,
      padding: 40,
    });

    useProjectStore.getState().clearLogo();
    expect(useProjectStore.getState().current?.assets?.logo).toBeUndefined();
    expect(useProjectStore.getState().current?.logoSlot).toBeNull();
  });

  it("persists logo assets on save and keeps them across template load", async () => {
    await useProjectStore.getState().newProject("Branded");
    useProjectStore.getState().setLogo(sampleLogo);
    await useProjectStore.getState().saveProject();

    const id = useProjectStore.getState().current!.id;
    await useProjectStore.getState().openProject(id);
    expect(useProjectStore.getState().current?.assets?.logo?.fileName).toBe("logo.png");

    useProjectStore
      .getState()
      .loadTemplate("export default function Poster(){ return <div/> }", 800, 800, "T");
    expect(useProjectStore.getState().current?.assets?.logo?.fileName).toBe("logo.png");
    expect(useProjectStore.getState().current?.logoSlot?.corner).toBe("top-left");
  });
});
