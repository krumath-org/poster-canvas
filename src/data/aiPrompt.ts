export type AiPromptTemplateId =
  | "poster"
  | "financial"
  | "ui-mockup"
  | "infographic"
  | "education"
  | "quote"
  | "product"
  | "slide";

export interface AiPromptTemplate {
  id: AiPromptTemplateId;
  label: string;
  description: string;
  /** Most-used canvas for this format. */
  width: number;
  height: number;
  /** Shown in the prompt next to the pixel size. */
  sizeHint: string;
  build: (width: number, height: number) => string;
}

const OUTPUT_RULE = `Return one complete \`\`\`tsx code block with the full component only.
Do not split the code across messages. No explanation before or after.`;

function fontBlock(lines: string[]): string {
  return `- Font sizes (Tailwind like text-[60px] is fine):
${lines.map((line) => `  - ${line}`).join("\n")}`;
}

function detailsBlock(title: string, fields: string[]): string {
  return `${title}:
${fields.map((f) => `- ${f}`).join("\n")}`;
}

function buildPrompt(opts: {
  role: string;
  task: string;
  width: number;
  height: number;
  sizeHint: string;
  look: string;
  fonts: string[];
  extras?: string[];
  detailsTitle: string;
  details: string[];
}): string {
  const extras =
    opts.extras && opts.extras.length > 0
      ? `\n${opts.extras.map((line) => `- ${line}`).join("\n")}`
      : "";

  return `Act as ${opts.role}. Create ${opts.task} as React/TSX for Poster Studio.

Requirements:
- One default-exported Poster component
- Fixed size: ${opts.width} × ${opts.height} (${opts.sizeHint})
- HTML + Tailwind and/or @poster/core; no React import; no other packages
- Fill the whole canvas
- ${opts.look}
- Default colors: Modern White EdTech theme — centered on #2563EB royal blue with sky-blue gradients (user can change via Colors below)
${fontBlock(opts.fonts)}${extras}
- Optional: import { Logo } from "@poster/core" for a brand mark

${detailsBlock(opts.detailsTitle, opts.details)}

${OUTPUT_RULE}`;
}

export const AI_PROMPT_TEMPLATES: AiPromptTemplate[] = [
  {
    id: "poster",
    label: "Poster",
    description: "1080 × 1080 · social square",
    width: 1080,
    height: 1080,
    sizeHint: "Instagram / social square",
    build: (width, height) =>
      buildPrompt({
        role: "an expert poster designer",
        task: "a scroll-stopping poster",
        width,
        height,
        sizeHint: "Instagram / social square",
        look: "Real poster look — big type, clear layout, strong colors; not a website",
        fonts: [
          "Main headline: 68–80 px",
          "Section/card headings: 38–46 px",
          "Main body text: 28–32 px",
          "Supporting text: 24–28 px",
          "Labels / badges: 20–24 px",
          "CTA / website: 30–38 px",
        ],
        detailsTitle: "Poster details",
        details: [
          "Type: [event / social post / announcement / quote / product / educational]",
          "Title: [MAIN TITLE]",
          "Subtitle: [optional]",
          "Extra text: [date, place, CTA, short body]",
          "Language: [English / Khmer / both]",
          "Style: [minimal / bold / corporate / playful / dark / clean]",
          "Colors: [leave blank for default Modern White EdTech (#2563EB + sky-blue gradients), or describe your own]",
          "Must include: [anything important]",
          "Must avoid: [anything you don't want]",
        ],
      }),
  },
  {
    id: "financial",
    label: "Financial report",
    description: "2480 × 3508 · A4 portrait",
    width: 2480,
    height: 3508,
    sizeHint: "A4 portrait @ 300 dpi",
    build: (width, height) =>
      buildPrompt({
        role: "an expert financial report designer",
        task: "a one-page financial report",
        width,
        height,
        sizeHint: "A4 portrait @ 300 dpi",
        look: "Board-ready one-pager — clear KPIs, readable tables/charts, professional color",
        fonts: [
          "Report title: 110–140 px",
          "Section headings: 60–76 px",
          "KPI / metric numbers: 130–180 px",
          "KPI labels: 34–42 px",
          "Table headers: 36–46 px",
          "Table cells / body text: 34–44 px",
          "Footnotes / source / legal: 26–32 px",
        ],
        extras: [
          "Prefer Metric, Table, BarChart, LineChart, PieChart, Grid, Stack, Text, Divider from @poster/core",
        ],
        detailsTitle: "Report details",
        details: [
          "Company / product: [name]",
          "Period: [Q1 2026 / FY2025 / month]",
          "Headline metrics: [revenue, growth %, users, …]",
          "Chart focus: [bars / line trend / pie mix]",
          "Table rows: [categories or line items]",
          "Language: [English / Khmer / both]",
          "Style: [corporate / clean / dark / minimal]",
          "Colors: [leave blank for default Modern White EdTech (#2563EB + sky-blue gradients), or describe your own]",
          "Must include: [anything important]",
          "Must avoid: [anything you don't want]",
        ],
      }),
  },
  {
    id: "ui-mockup",
    label: "Website UI mockup",
    description: "1440 × 900 · desktop",
    width: 1440,
    height: 900,
    sizeHint: "Desktop landing mock",
    build: (width, height) =>
      buildPrompt({
        role: "an expert product UI designer",
        task: "a static website or app UI mockup",
        width,
        height,
        sizeHint: "Desktop landing mock",
        look: "Looks like a real product screenshot (nav, hero, sections) — not a marketing poster",
        fonts: [
          "Page / hero title: 40–52 px",
          "Section headings: 24–28 px",
          "Body / paragraph: 16–18 px",
          "Nav / labels / captions: 14–16 px",
          "Buttons / primary CTA: 16–18 px",
          "Small / helper / legal: 12–14 px",
        ],
        extras: [
          "One frozen frame only — no scrolling, no real interactivity",
        ],
        detailsTitle: "UI details",
        details: [
          "Product: [name / what it does]",
          "Screen type: [landing page / dashboard / mobile app / pricing / signup]",
          "Sections: [hero, features, pricing, testimonials, footer, …]",
          "Primary CTA: [text]",
          "Language: [English / Khmer / both]",
          "Style: [SaaS / minimal / playful / dark / corporate]",
          "Colors: [leave blank for default Modern White EdTech (#2563EB + sky-blue gradients), or describe your own]",
          "Must include: [anything important]",
          "Must avoid: [anything you don't want]",
        ],
      }),
  },
  {
    id: "infographic",
    label: "Infographic",
    description: "1080 × 1350 · feed portrait",
    width: 1080,
    height: 1350,
    sizeHint: "Instagram 4:5 portrait",
    build: (width, height) =>
      buildPrompt({
        role: "an expert information designer",
        task: "a bold infographic",
        width,
        height,
        sizeHint: "Instagram 4:5 portrait",
        look: "Big numbers first, short labels, clear top-to-bottom flow",
        fonts: [
          "Main headline: 72–88 px",
          "Section headings: 40–52 px",
          "Stat / big number: 90–124 px",
          "Body text: 26–32 px",
          "Labels / captions: 20–24 px",
          "Source / footer: 18–22 px",
        ],
        extras: ["Prefer Metric, Progress, Grid, Stack, Badge when helpful"],
        detailsTitle: "Infographic details",
        details: [
          "Topic: [what this explains]",
          "Structure: [stats row / process steps / comparison / timeline]",
          "Key numbers: [list]",
          "Language: [English / Khmer / both]",
          "Style: [bold / clean / playful / dark / corporate]",
          "Colors: [leave blank for default Modern White EdTech (#2563EB + sky-blue gradients), or describe your own]",
          "Must include: [anything important]",
          "Must avoid: [anything you don't want]",
        ],
      }),
  },
  {
    id: "education",
    label: "Educational",
    description: "2480 × 3508 · A4 worksheet",
    width: 2480,
    height: 3508,
    sizeHint: "A4 portrait @ 300 dpi",
    build: (width, height) =>
      buildPrompt({
        role: "an expert educational materials designer",
        task: "an educational poster or worksheet",
        width,
        height,
        sizeHint: "A4 portrait @ 300 dpi",
        look: "Clear lesson sheet — scannable sections, room for examples",
        fonts: [
          "Lesson title: 100–132 px",
          "Section headings: 60–76 px",
          "Body / instructions: 40–52 px",
          "Supporting / captions: 32–40 px",
          "Labels / badges: 30–38 px",
          "Display math (BlockMath): 68–96 px",
          "Inline math: match surrounding text size",
        ],
        extras: [
          "For formulas use KaTeX via Math / BlockMath from @poster/core (or $...$ / $$...$$ in Text) — do not fake math with Unicode",
        ],
        detailsTitle: "Lesson details",
        details: [
          "Subject: [math / science / language / other]",
          "Title: [MAIN TITLE]",
          "Audience: [grade / age / exam]",
          "Sections: [definition, examples, practice, tips]",
          "Formulas to include: [TeX or describe]",
          "Language: [English / Khmer / both]",
          "Style: [clean / playful / academic / dark]",
          "Colors: [leave blank for default Modern White EdTech (#2563EB + sky-blue gradients), or describe your own]",
          "Must include: [anything important]",
          "Must avoid: [anything you don't want]",
        ],
      }),
  },
  {
    id: "quote",
    label: "Quote",
    description: "1080 × 1080 · quote card",
    width: 1080,
    height: 1080,
    sizeHint: "Instagram square",
    build: (width, height) =>
      buildPrompt({
        role: "an expert editorial typography designer",
        task: "a quote card",
        width,
        height,
        sizeHint: "Instagram square",
        look: "Quote dominates; generous space; attribution secondary",
        fonts: [
          "Quote text: 64–88 px",
          "Attribution: 26–34 px",
          "Kicker / labels: 20–24 px",
          "Footer / handle / CTA: 20–28 px",
        ],
        detailsTitle: "Quote details",
        details: [
          "Quote: [the line]",
          "Attribution: [name / role]",
          "Kicker: [optional short label]",
          "Language: [English / Khmer / both]",
          "Style: [minimal / bold / dark / soft / editorial]",
          "Colors: [leave blank for default Modern White EdTech (#2563EB + sky-blue gradients), or describe your own]",
          "Must include: [anything important]",
          "Must avoid: [anything you don't want]",
        ],
      }),
  },
  {
    id: "product",
    label: "Product promo",
    description: "1080 × 1350 · feed ad",
    width: 1080,
    height: 1350,
    sizeHint: "Instagram 4:5 feed ad",
    build: (width, height) =>
      buildPrompt({
        role: "an expert product marketing designer",
        task: "a product promo",
        width,
        height,
        sizeHint: "Instagram 4:5 feed ad",
        look: "Clear offer, benefit-led headline, one strong CTA",
        fonts: [
          "Product name / headline: 68–84 px",
          "Price / key figure: 52–72 px",
          "Body / features: 28–34 px",
          "Supporting text: 22–26 px",
          "Labels / badges: 20–24 px",
          "CTA: 30–40 px",
        ],
        detailsTitle: "Product details",
        details: [
          "Product: [name]",
          "Headline: [promise or offer]",
          "Price / offer: [optional]",
          "Features: [3–5 short bullets]",
          "CTA: [button or URL text]",
          "Language: [English / Khmer / both]",
          "Style: [bold / clean / playful / luxury / dark]",
          "Colors: [leave blank for default Modern White EdTech (#2563EB + sky-blue gradients), or describe your own]",
          "Must include: [anything important]",
          "Must avoid: [anything you don't want]",
        ],
      }),
  },
  {
    id: "slide",
    label: "Presentation slide",
    description: "1920 × 1080 · 16:9",
    width: 1920,
    height: 1080,
    sizeHint: "16:9 widescreen slide",
    build: (width, height) =>
      buildPrompt({
        role: "an expert presentation designer",
        task: "a single presentation slide",
        width,
        height,
        sizeHint: "16:9 widescreen slide",
        look: "One idea, sparse layout, large type for projection — not a website",
        fonts: [
          "Slide title: 72–88 px",
          "Section / card headings: 42–56 px",
          "Body / bullets: 34–42 px",
          "Supporting / captions: 24–30 px",
          "Labels / footer: 20–24 px",
          "CTA / URL: 30–38 px",
        ],
        extras: [
          "Title + 3–5 bullets or one visual max; leave margin for projection",
        ],
        detailsTitle: "Slide details",
        details: [
          "Title: [MAIN TITLE]",
          "Bullets or visual: [describe]",
          "Footer: [presenter / date / page]",
          "Language: [English / Khmer / both]",
          "Style: [corporate / minimal / bold / dark]",
          "Colors: [leave blank for default Modern White EdTech (#2563EB + sky-blue gradients), or describe your own]",
          "Must include: [anything important]",
          "Must avoid: [anything you don't want]",
        ],
      }),
  },
];

export function buildAiPrompt(id: AiPromptTemplateId, width?: number, height?: number): string {
  const template = AI_PROMPT_TEMPLATES.find((t) => t.id === id);
  if (!template) throw new Error(`Unknown AI prompt template: ${id}`);
  return template.build(width ?? template.width, height ?? template.height);
}

/** @deprecated Prefer buildAiPrompt("poster") */
export function buildPosterAiPrompt(width?: number, height?: number): string {
  return buildAiPrompt("poster", width, height);
}
