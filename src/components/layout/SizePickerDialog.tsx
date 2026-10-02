import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { POSTER_SIZES, SIZE_GROUPS, findSizePreset } from "@/data/sizes";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";
import { useEffect, useState } from "react";

export function SizePickerDialog() {
  const open = useUiStore((s) => s.sizePickerOpen);
  const setOpen = useUiStore((s) => s.setSizePickerOpen);
  const current = useProjectStore((s) => s.current);
  const setSize = useProjectStore((s) => s.setSize);
  const [width, setWidth] = useState(current?.width ?? 1080);
  const [height, setHeight] = useState(current?.height ?? 1350);

  useEffect(() => {
    if (open) {
      setWidth(current?.width ?? 1080);
      setHeight(current?.height ?? 1350);
    }
  }, [open, current?.width, current?.height]);

  const apply = () => {
    setSize(Math.max(1, width), Math.max(1, height));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Poster Size</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {SIZE_GROUPS.map((group) => {
            const presets = POSTER_SIZES.filter((p) => p.group === group);
            if (presets.length === 0) return null;
            return (
              <div key={group} className="grid gap-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {group}
                </p>
                {presets.map((preset) => (
                  <Button
                    key={preset.id}
                    type="button"
                    variant={width === preset.width && height === preset.height ? "secondary" : "outline"}
                    className="justify-between"
                    onClick={() => {
                      setWidth(preset.width);
                      setHeight(preset.height);
                    }}
                  >
                    <span>{preset.label}</span>
                    <span className="text-muted-foreground">
                      {preset.width} × {preset.height}
                    </span>
                  </Button>
                ))}
              </div>
            );
          })}
        </div>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            apply();
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                min={1}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                min={1}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
            </div>
          </div>
          {!findSizePreset(width, height) && (
            <p className="text-xs text-muted-foreground">Custom size</p>
          )}
          <Button type="submit">Apply</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
