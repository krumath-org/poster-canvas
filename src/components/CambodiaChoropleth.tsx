import { useEffect, useMemo, useState } from "react";
import * as d3Geo from "d3-geo";
import type { FeatureCollection, Geometry } from "geojson";

type CambodiaGeoData = FeatureCollection<Geometry>;

/** App base is /poster-canvas/ (see vite.config.ts DEFAULT_BASE_PATH).
 *  `?v=2` busts cache after fixing clockwise ring winding (blue-square bug). */
const GEO_JSON_URL = "/poster-canvas/geo/cambodia-adm1.geojson?v=2";

export default function CambodiaChoropleth() {
  const [geoData, setGeoData] = useState<CambodiaGeoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(GEO_JSON_URL)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Map request failed: ${res.status}`);
        }

        const text = await res.text();

        if (text.startsWith("version https://git-lfs.github.com")) {
          throw new Error("GeoJSON source is an LFS pointer, not the real map file");
        }

        return JSON.parse(text) as CambodiaGeoData;
      })
      .then((data) => {
        if (!cancelled) {
          setGeoData(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load map data",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const pathGenerator = useMemo(() => {
    if (!geoData) {
      return null;
    }

    const projection = d3Geo.geoMercator().fitSize([600, 450], geoData);
    return d3Geo.geoPath(projection);
  }, [geoData]);

  if (error) {
    return <div className="text-sm text-red-500">Map failed to load: {error}</div>;
  }

  if (!geoData || !pathGenerator) {
    return <div className="text-sm text-slate-300">Loading map...</div>;
  }

  return (
    <svg viewBox="0 0 600 450" className="h-full w-full">
      {geoData.features.map((feature, idx) => (
        <path
          key={idx}
          d={pathGenerator(feature) || ""}
          className="fill-blue-400 stroke-white stroke-[1.5] transition-colors hover:fill-blue-600"
        />
      ))}
    </svg>
  );
}
