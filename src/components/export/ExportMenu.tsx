import type { ReactElement } from "react";
import type { ExportFormat } from "@/core/types";
import type { SandboxBridge } from "@/core/renderer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WithTooltip } from "@/components/ui/tooltip";
import { exportPoster } from "@/lib/exportPoster";
import { publicUrl } from "@/lib/publicUrl";
import { useProjectStore } from "@/stores/projectStore";
import { toast } from "sonner";

const GROUPS: {
  label: string;
  formats: { format: ExportFormat; label: string; tooltip?: string }[];
}[] = [
  {
    label: "Image",
    formats: [
      { format: "png", label: "PNG" },
      { format: "jpg", label: "JPG" },
      { format: "webp", label: "WebP" },
    ],
  },
  {
    label: "Vector",
    formats: [{ format: "svg", label: "SVG" }],
  },
  {
    label: "Editable",
    formats: [
      {
        format: "psd",
        label: "PSD",
        tooltip:
          "Layered bitmap PSD. Use @poster/core components (Text, Image, …) for per-element layers.",
      },
      {
        format: "pptx",
        label: "PPTX",
        tooltip:
          "Native-objects PPTX. Use @poster/core components for editable text and images.",
      },
    ],
  },
  {
    label: "Document",
    formats: [], // rendered manually below (Quick PDF + Professional PDF)
  },
  {
    label: "Data",
    formats: [
      { format: "csv", label: "CSV" },
      { format: "xlsx", label: "XLSX" },
    ],
  },
];

interface ExportMenuProps {
  bridge: SandboxBridge | null;
  children: ReactElement;
}

export function ExportMenu({ bridge, children }: ExportMenuProps) {
  const projectId = useProjectStore((s) => s.current?.id);

  const handleExport = (format: ExportFormat) => {
    if (!bridge) {
      toast.error("Preview not ready");
      return;
    }
    void exportPoster(bridge, format);
  };

  const handleProfessionalPdf = async () => {
    const current = useProjectStore.getState().current;
    if (!current?.id) {
      toast.error("Save your project first to use Professional PDF export");
      return;
    }
    await useProjectStore.getState().saveProject({ quiet: true });
    const targetUrl = publicUrl(`print/${encodeURIComponent(current.id)}`);
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <DropdownMenu>
      <WithTooltip label="Export">
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      </WithTooltip>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {GROUPS.map((group, gi) => (
          <div key={group.label}>
            {gi > 0 ? <DropdownMenuSeparator /> : null}
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {group.label}
            </DropdownMenuLabel>
            {group.label === "Document" ? (
              // PDF split: Quick PDF (raster A4) + Professional PDF (browser print)
              <>
                <WithTooltip
                  label="A4 portrait · 300 DPI · Fast download · WebGL supported"
                  side="left"
                >
                  <DropdownMenuItem onClick={() => void handleExport("pdf")}>
                    Quick PDF
                  </DropdownMenuItem>
                </WithTooltip>
                <WithTooltip
                  label="Real vector text · Selectable · Sharp at any zoom · Opens print dialog"
                  side="left"
                >
                  <DropdownMenuItem onClick={handleProfessionalPdf}>
                    Professional PDF
                  </DropdownMenuItem>
                </WithTooltip>
              </>
            ) : (
              group.formats.map(({ format, label, tooltip }) => {
                const item = (
                  <DropdownMenuItem key={format} onClick={() => void handleExport(format)}>
                    {label}
                  </DropdownMenuItem>
                );
                return tooltip ? (
                  <WithTooltip key={format} label={tooltip} side="left">
                    {item}
                  </WithTooltip>
                ) : (
                  item
                );
              })
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
