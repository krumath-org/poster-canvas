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

  it("locks name on template load and unlocks for untitled opens", async () => {
    await useProjectStore.getState().newProject();
    useProjectStore
      .getState()
      .loadTemplate("export default function Poster(){ return <div/> }", 800, 800, "Template");
    expect(useProjectStore.getState().nameLocked).toBe(true);

    useProjectStore.getState().lockProjectName();
    expect(useProjectStore.getState().nameLocked).toBe(true);

    await useProjectStore.getState().newProject();
    expect(useProjectStore.getState().nameLocked).toBe(false);

    await useProjectStore.getState().saveProject();
    const id = useProjectStore.getState().current!.id;
    // Untitled stays unlocked; a custom name would lock on open.
    await useProjectStore.getState().openProject(id);
    expect(useProjectStore.getState().nameLocked).toBe(false);
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
