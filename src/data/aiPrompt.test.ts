import { describe, expect, it } from "vitest";
import { AI_PROMPT_TEMPLATES, buildAiPrompt, buildPosterAiPrompt } from "./aiPrompt";

describe("aiPrompt", () => {
  it("exports nine templates including 3d-scene", () => {
    expect(AI_PROMPT_TEMPLATES).toHaveLength(9);
    expect(AI_PROMPT_TEMPLATES.map((t) => t.id)).toEqual([
      "poster",
      "financial",
      "ui-mockup",
      "infographic",
      "education",
      "quote",
      "product",
      "slide",
      "3d-scene",
    ]);
  });

  it("uses the standard canvas for each format", () => {
    const expected: Record<string, [number, number]> = {
      poster: [1080, 1080],
      financial: [2480, 3508],
      "ui-mockup": [1440, 900],
      infographic: [1080, 1350],
      education: [2480, 3508],
      quote: [1080, 1080],
      product: [1080, 1350],
      slide: [1920, 1080],
      "3d-scene": [1080, 1350],
    };
    for (const template of AI_PROMPT_TEMPLATES) {
      const [w, h] = expected[template.id]!;
      expect(template.width).toBe(w);
      expect(template.height).toBe(h);
      const prompt = template.build(template.width, template.height);
      expect(prompt).toContain(`${w} × ${h}`);
      expect(prompt).toContain("Act as");
      expect(prompt).toContain("Font sizes (Tailwind like text-[60px] is fine):");
      expect(prompt).toContain("one complete");
      expect(prompt).toContain("```tsx");
      expect(prompt).toContain("Do not split the code across messages");
      expect(prompt).toContain("#2563EB");
      expect(prompt).toContain("user can change");
      expect(prompt).toContain("@react-three/fiber");
      expect(prompt).toContain("Canvas3D");
      expect(prompt).toContain("Battambang/Hanuman");
      expect(prompt).toContain("font-mono");
      expect(prompt).toContain("Kantumruy");
    }
  });

  it("buildAiPrompt defaults to the template size", () => {
    expect(buildAiPrompt("slide")).toContain("1920 × 1080");
    expect(buildAiPrompt("poster")).toContain("1080 × 1080");
    expect(buildAiPrompt("3d-scene")).toContain("1080 × 1350");
    expect(buildPosterAiPrompt()).toBe(buildAiPrompt("poster"));
  });

  it("keeps the large type scales", () => {
    expect(buildAiPrompt("poster")).toContain("Main headline: 68–80 px");
    expect(buildAiPrompt("slide")).toContain("Slide title: 72–88 px");
    expect(buildAiPrompt("slide")).toContain("Body / bullets: 34–42 px");
    expect(buildAiPrompt("financial")).toContain("Report title: 110–140 px");
    expect(buildAiPrompt("education")).toContain("Lesson title: 100–132 px");
    expect(buildAiPrompt("education")).toContain("Body / instructions: 40–52 px");
  });
});
