import { createFileRoute } from "@tanstack/react-router";
import CambodiaChoropleth from "@/components/CambodiaChoropleth";

export const Route = createFileRoute("/cambodia-map")({
  component: CambodiaMapPage,
});

function CambodiaMapPage() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Cambodia provinces</h1>
        <p className="text-sm text-slate-600">
          Official ADM1 provincial boundaries loaded from the GeoBoundaries dataset.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
        <div className="h-[500px] w-full">
          <CambodiaChoropleth />
        </div>
      </div>
    </div>
  );
}
