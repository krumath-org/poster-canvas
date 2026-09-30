import type { PosterTemplate } from "@/core/types";

export const STARTER_CODE = `import { Poster, Image } from "@poster/core";

export default function App() {
  const features = [
    {
      icon: "📚",
      text: "លំហាត់ជាង ៥០,០០០+ (ថ្នាក់ទី ៧-១២) សម្រាប់អនុវត្ត",
    },
    {
      icon: "🔬",
      text: "គ្រប់មុខវិជ្ជា ទាំងផ្នែកវិទ្យាសាស្ត្រពិត និងវិទ្យាសាស្ត្រសង្គម",
    },
    {
      icon: "🤖",
      text: "ជំនួយការ AI Chatbot ជួយដោះស្រាយ និងពន្យល់ភ្លាមៗ",
    },
    {
      icon: "🎯",
      text: "ត្រៀមប្រឡងបាក់ឌុប ឌីប្លូម ប្រចាំឆមាស និង ប្រចាំខែ",
    },
    {
      icon: "📱",
      text: "រៀនបានគ្រប់ទីកន្លែង តាមទូរស័ព្ទ ថេប្លេត ឬកុំព្យូទ័រ",
      fullWidth: true,
    },
  ];

  return (
    <Poster background="linear-gradient(to bottom right, #F8FAFC, #EFF6FF, #DBEAFE)" color="#0F172A" className="p-14 flex flex-col justify-between box-border select-none font-sans">
      {/* Ambient Glows */}
      <div className="absolute -top-24 -right-24 w-[480px] h-[480px] bg-[#3B82F6]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[420px] h-[420px] bg-[#60A5FA]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Mathematical Elements */}
      <div className="absolute top-20 right-16 text-[#2563EB]/15 text-8xl font-serif font-black pointer-events-none rotate-6">
        ∑
      </div>
      <div className="absolute top-28 right-56 text-[#2563EB]/10 text-4xl font-mono font-bold pointer-events-none -rotate-12">
        lim(x→∞)
      </div>
      <div className="absolute top-[38%] right-12 text-[#2563EB]/15 text-5xl font-mono font-semibold pointer-events-none rotate-12">
        f'(x) = dy/dx
      </div>
      <div className="absolute top-[40%] left-8 text-[#2563EB]/15 text-8xl font-serif font-bold pointer-events-none -rotate-6">
        π
      </div>
      <div className="absolute top-24 left-1/3 text-[#2563EB]/10 text-5xl font-serif italic pointer-events-none">
        ∫ eˣ dx
      </div>
      <div className="absolute bottom-52 left-14 text-[#2563EB]/15 text-6xl font-mono font-bold pointer-events-none rotate-12">
        Δx → 0
      </div>
      <div className="absolute bottom-40 right-20 text-[#2563EB]/15 text-7xl font-serif font-black pointer-events-none -rotate-6">
        √a² + b²
      </div>
      <div className="absolute bottom-28 right-72 text-[#2563EB]/10 text-5xl font-mono font-bold pointer-events-none">
        θ ≈ 3.14159
      </div>
      <div className="absolute top-1/2 right-1/4 text-[#2563EB]/10 text-7xl font-serif font-bold pointer-events-none rotate-45">
        ∞
      </div>
      <div className="absolute bottom-60 right-1/3 text-[#2563EB]/10 text-4xl font-mono pointer-events-none">
        ± √Δ / 2a
      </div>

      {/* Top Header: Brand & Identity */}
      <header className="relative z-10 flex items-center justify-between gap-6">
        <div className="inline-flex items-center gap-3.5 bg-white/90 backdrop-blur-md px-7 py-4 rounded-full border border-blue-100 shadow-sm" data-poster-layer="text" data-poster-layer-name="Brand Badge">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-2xl font-bold text-[#1E3A8A] tracking-wide">
            បច្ចេកវិទ្យា AI ជំនួយការរៀន
          </span>
        </div>
        <Image src="../KruMath_Horizontal.png" alt="KruMath Logo" className="h-16 w-auto object-contain shrink-0 drop-shadow-sm" />
      </header>

      {/* Hero Section */}
      <main className="relative z-10 my-auto flex flex-col gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 bg-[#2563EB]/10 text-[#2563EB] text-2xl font-bold px-5 py-2.5 rounded-2xl border border-[#2563EB]/20" data-poster-layer="text" data-poster-layer-name="Tag Line">
            <span>📐</span> KruMath Interactive — សប្បាយរៀន | ងាយយល់
          </div>

          <h1 className="text-[74px] font-black leading-[1.2] tracking-tight text-[#0F172A]" data-poster-layer="text" data-poster-layer-name="Headline">
            រៀននៅសាលា <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#0284C7] to-[#0EA5E9]">
              អ​នុវត្តនៅលើ KruMath
            </span>
          </h1>

          <p className="text-[26px] text-[#475569] font-medium max-w-3xl leading-relaxed" data-poster-layer="text" data-poster-layer-name="Description">
            មិនបាច់ហត់រកសៀវភៅលំហាត់ច្រើននាំតែវិលមុខទេ! នៅលើគេហទំព័រ KruMath មានគ្រប់ទាំងអស់ចាប់ពីថ្នាក់ទី ៧ ដល់ទី ១២។
          </p>
        </div>

        {/* 5 Feature Points Grid */}
        <div className="grid grid-cols-2 gap-4 pt-1">
          {features.map((item, idx) => (
            <div
              key={idx}
              data-poster-layer="text"
              data-poster-layer-name={\`Feature \${idx + 1}\`}
              className={\`flex items-center gap-4 bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl border border-blue-100 shadow-sm shadow-blue-950/5 \${
                item.fullWidth ? "col-span-2" : ""
              }\`}
            >
              {/* Enlarged Icon Badge */}
              <span className="flex items-center justify-center min-w-[58px] h-[58px] rounded-2xl bg-blue-50 text-[#2563EB] text-[34px] font-bold shrink-0">
                {item.icon}
              </span>

              {/* Text: Enlarged specifically for the full-width item */}
              <span
                className={\`font-bold text-[#1E293B] leading-snug \${
                  item.fullWidth ? "text-[27px]" : "text-[23px]"
                }\`}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Action Bar */}
      <footer className="relative z-10 bg-white rounded-3xl p-6 border border-blue-100 shadow-xl shadow-blue-500/10 flex items-center justify-between">
        <div className="pl-4" data-poster-layer="text" data-poster-layer-name="Website URL">
          <p className="text-lg uppercase tracking-wider font-bold text-[#64748B]">
            បង្កើតគណនីដោយឥតគិតថ្លៃ
          </p>
          <p className="text-4xl font-black text-[#2563EB] tracking-tight">
            www.KruMath.com
          </p>
        </div>

        <div className="bg-[#2563EB] hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-[26px] shadow-lg shadow-blue-600/30 flex items-center gap-4 cursor-pointer transition-colors" data-poster-layer="text" data-poster-layer-name="CTA Button">
          <span>ចុះឈ្មោះចូលរៀនឥឡូវនេះ</span>
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.8}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
      </footer>
    </Poster>
  );
}
`;

export const TEMPLATES: PosterTemplate[] = [
  {
    id: "cambodia-provinces-map",
    name: "Cambodia Provinces Map",
    category: "Featured",
    description: "ADM1 SVG choropleth with d3-geo; cache-busted GeoJSON and fixed ring winding.",
    width: 1080,
    height: 1080,
    code: `export default function Poster() {
  const [paths, setPaths] = useState([]);
  const [error, setError] = useState(null);

  // Edit any province color here (name must match GeoJSON adm1_name).
  const PROVINCE_COLORS = {
    "Banteay Meanchey": "#38bdf8",
    Battambang: "#0ea5e9",
    "Kampong Cham": "#6366f1",
    "Kampong Chhnang": "#8b5cf6",
    "Kampong Speu": "#a855f7",
    "Kampong Thom": "#d946ef",
    Kampot: "#ec4899",
    Kandal: "#f43f5e",
    Kep: "#f97316",
    "Koh Kong": "#eab308",
    Kratie: "#84cc16",
    "Mondul Kiri": "#22c55e",
    "Oddar Meanchey": "#14b8a6",
    Pailin: "#06b6d4",
    "Phnom Penh": "#3b82f6",
    "Preah Sihanouk": "#2563eb",
    "Preah Vihear": "#4f46e5",
    "Prey Veng": "#7c3aed",
    Pursat: "#db2777",
    "Ratanak Kiri": "#e11d48",
    Siemreap: "#ea580c",
    "Stung Treng": "#ca8a04",
    "Svay Rieng": "#65a30d",
    Takeo: "#16a34a",
    "Tboung Khmum": "#0d9488",
  };

  useEffect(() => {
    let cancelled = false;

    function reverseExterior(geom) {
      if (!geom) return geom;
      if (geom.type === "Polygon") {
        return {
          ...geom,
          coordinates: geom.coordinates.map((ring, i) =>
            i === 0 ? ring.slice().reverse() : ring,
          ),
        };
      }
      if (geom.type === "MultiPolygon") {
        return {
          ...geom,
          coordinates: geom.coordinates.map((poly) =>
            poly.map((ring, i) => (i === 0 ? ring.slice().reverse() : ring)),
          ),
        };
      }
      return geom;
    }

    (async () => {
      try {
        const d3Geo = await import("https://esm.sh/d3-geo@3");
        const res = await fetch("/poster-canvas/geo/cambodia-adm1.geojson?v=2");
        if (!res.ok) throw new Error("Map request failed: " + res.status);

        const raw = await res.json();
        // HDX rings are sometimes clockwise; d3 then fills the whole SVG (blue square).
        // Only flip when a feature looks inverted (area near a full sphere).
        const features = raw.features.map((f) => {
          const inverted = d3Geo.geoArea(f) > 1;
          return inverted
            ? { ...f, geometry: reverseExterior(f.geometry) }
            : f;
        });
        const geoData = { type: "FeatureCollection", features };

        const projection = d3Geo.geoMercator().fitSize([900, 900], geoData);
        const pathGenerator = d3Geo.geoPath(projection);
        const next = geoData.features.map((feature, idx) => {
          const name = feature.properties?.adm1_name || "Province";
          return {
            key: idx,
            d: pathGenerator(feature) || "",
            name,
            fill: PROVINCE_COLORS[name] || "#94a3b8",
          };
        });

        if (!cancelled) setPaths(next);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load map");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-50 text-slate-900 flex flex-col box-border select-none font-sans">
      <div className="px-14 pt-12 pb-4">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-700/80">
          Kingdom of Cambodia
        </p>
        <h1 className="mt-2 text-5xl font-black tracking-tight">
          25 Provinces
        </h1>
        <p className="mt-3 text-lg text-slate-600 max-w-2xl">
          Each province has its own color — edit PROVINCE_COLORS in the code.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-10 pb-12">
        {error ? (
          <div className="text-red-500 text-lg">Map failed to load: {error}</div>
        ) : paths.length === 0 ? (
          <div className="text-slate-400 text-lg">Loading map...</div>
        ) : (
          <svg
            viewBox="0 0 900 900"
            className="w-full h-full max-h-[900px]"
            data-poster-layer="shape"
            data-poster-layer-name="Cambodia Map"
          >
            {paths.map((p) => (
              <path
                key={p.key}
                d={p.d}
                fill={p.fill}
                stroke="#ffffff"
                strokeWidth={1.5}
              >
                <title>{p.name}</title>
              </path>
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}
`,
  },
  {
    id: "3d-product-hero",
    name: "3D Product Hero",
    category: "3D",
    description: "Hybrid Canvas3D mesh hero with @poster/core typography overlay.",
    width: 1080,
    height: 1350,
    code: `import { Poster, Text, Canvas3D } from "@poster/core";
import { Environment, ContactShadows, Center, Float } from "@react-three/drei";

function HeroMesh() {
  return (
    <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.6}>
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[1.15, 0]} />
        <meshStandardMaterial color="#2563EB" metalness={0.35} roughness={0.28} />
      </mesh>
    </Float>
  );
}

export default function PosterApp() {
  return (
    <Poster className="relative w-full h-full overflow-hidden bg-gradient-to-b from-slate-50 via-sky-50 to-blue-100 text-slate-900">
      <div className="absolute inset-0">
        <Canvas3D
          camera={{ position: [0, 0.4, 4.2], fov: 42 }}
          frameloop="demand"
          gl={{ antialias: true }}
        >
          <color attach="background" args={["#eff6ff"]} />
          <ambientLight intensity={0.55} />
          <directionalLight position={[4, 6, 3]} intensity={1.15} castShadow />
          <Environment preset="city" />
          <Center>
            <HeroMesh />
          </Center>
          <ContactShadows position={[0, -1.35, 0]} opacity={0.45} scale={8} blur={2.4} />
        </Canvas3D>
      </div>

      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-14">
        <div>
          <Text size={22} className="tracking-[0.2em] uppercase text-blue-700/80 font-semibold">
            Poster Studio · 3D
          </Text>
          <Text size={72} className="mt-4 font-black leading-[0.95] tracking-tight text-slate-900">
            Shape
            <br />
            the future
          </Text>
        </div>
        <div className="flex items-end justify-between gap-6">
          <Text size={28} className="max-w-[22rem] text-slate-600 leading-snug">
            Export-safe WebGL hero with Canvas3D — frozen for print-ready PNG.
          </Text>
          <div className="rounded-full bg-[#2563EB] text-white px-8 py-4 text-[28px] font-bold shadow-lg shadow-blue-500/30">
            Learn more
          </div>
        </div>
      </div>
    </Poster>
  );
}
`,
  },
  {
    id: "website-ui-mockup",
    name: "Website UI Mockup",
    category: "UI",
    description: "EduPulse.ai dashboard mockup with telemetry charts and interventions.",
    width: 1440,
    height: 900,
    code: `import { Logo } from "@poster/core";

export default function Poster() {
  return (
    <div className="w-[1440px] h-[900px] bg-slate-50 text-slate-900 overflow-hidden relative flex flex-col justify-between font-sans select-none antialiased border border-slate-200">
      {/* Background ambient color blurs */}
      <div className="absolute -top-24 -left-20 w-[520px] h-[520px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[560px] h-[560px] bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-[600px] h-[350px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Bar */}
      <header className="h-[64px] px-8 bg-white/95 border-b border-slate-200/80 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Logo className="w-5 h-5 text-white" />
            </div>
            <span className="text-[20px] font-black tracking-tight text-slate-900">
              EduPulse<span className="text-[#2563EB]">.ai</span>
            </span>
            <span className="ml-1 px-2 py-0.5 text-[12px] font-semibold text-[#2563EB] bg-blue-50 border border-blue-200/60 rounded-full">
              v4.2 Cloud
            </span>
          </div>

          <nav className="flex items-center gap-6 text-[15px] font-medium text-slate-600">
            <span className="text-[#2563EB] font-semibold cursor-pointer">Cohort Overview</span>
            <span className="hover:text-slate-900 cursor-pointer">Telemetry & AI</span>
            <span className="hover:text-slate-900 cursor-pointer">Curriculum Mastery</span>
            <span className="hover:text-slate-900 cursor-pointer">Interventions</span>
            <span className="hover:text-slate-900 cursor-pointer">Enterprise API</span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-[13px] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telemetry Stream Active</span>
          </div>
          <span className="text-[15px] font-medium text-slate-700 hover:text-slate-900 px-3 cursor-pointer">
            Sign In
          </span>
          <button className="h-[40px] px-5 rounded-lg bg-[#2563EB] text-white text-[16px] font-semibold shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
            <span>Launch Free Trial</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-between px-8 py-3 z-10 overflow-hidden">
        {/* Hero Section */}
        <section className="flex items-center justify-between shrink-0 mb-2">
          <div className="max-w-[850px]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#2563EB] text-[13px] font-bold tracking-wide uppercase mb-1.5">
              <span>Adaptive Learning Telemetry</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span className="text-slate-500 font-medium lowercase">real-time cognitive analytics</span>
            </div>
            <h1 className="text-[44px] font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Turn Student Engagement Into{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] via-sky-500 to-indigo-600">
                Predictable Academic Success
              </span>
            </h1>
            <p className="text-[16px] text-slate-600 mt-1 max-w-[780px] leading-snug">
              Unified intelligence dashboard aggregating 140K+ student interactions. Identify curriculum friction points,
              automate personalized learning pathways, and predict dropouts 3 weeks in advance.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2.5">
            <div className="flex items-center gap-3">
              <button className="h-[46px] px-6 rounded-xl bg-gradient-to-r from-[#2563EB] to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white text-[16px] font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Launch Live Dashboard</span>
              </button>
              <button className="h-[46px] px-5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[16px] font-semibold shadow-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Book Live Demo</span>
              </button>
            </div>
            <div className="flex items-center gap-3 text-[13px] text-slate-500">
              <span className="flex items-center gap-1 text-amber-500 font-semibold">
                {"★".repeat(5)} <span className="text-slate-700 font-bold ml-1">4.9/5</span>
              </span>
              <span>·</span>
              <span>Trusted by 450+ Higher-Ed Institutions</span>
            </div>
          </div>
        </section>

        {/* Live Data Dashboard Section */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xl shadow-blue-900/5 flex flex-col gap-3.5">
          {/* Section Heading & Filter Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-3">
              <h2 className="text-[25px] font-bold text-slate-900 tracking-tight">
                Global Learning Intelligence
              </h2>
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#2563EB] text-[13px] font-bold">
                Cohort 2026-A
              </span>
              <span className="text-[14px] text-slate-500">
                Last updated: 2 mins ago
              </span>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[13px] font-medium text-slate-600">
                <span className="px-3 py-1 bg-white text-slate-900 rounded-md font-semibold shadow-sm">All Fields</span>
                <span className="px-3 py-1 hover:text-slate-900 cursor-pointer">Computer Science</span>
                <span className="px-3 py-1 hover:text-slate-900 cursor-pointer">Data & AI</span>
                <span className="px-3 py-1 hover:text-slate-900 cursor-pointer">Health Sciences</span>
              </div>
              <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-700 flex items-center gap-1.5">
                <span>🗓 Jan 10 – Sep 3, 2026</span>
              </div>
            </div>
          </div>

          {/* Top Row: 4 Colorful Metric Cards */}
          <div className="grid grid-cols-4 gap-3.5">
            {/* Card 1: Royal Blue / Total Learners */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50/70 via-white to-blue-50/20 border border-blue-100 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-slate-600">Active Learners</span>
                <span className="px-2 py-0.5 rounded-full text-[12px] font-bold bg-blue-100 text-[#2563EB]">
                  +19.4%
                </span>
              </div>
              <div className="text-[28px] font-extrabold text-slate-900 mt-1">142,850</div>
              <div className="flex items-center justify-between mt-1 text-[12px] text-slate-500">
                <span>94.8% sync completion</span>
                <span className="font-semibold text-blue-700">8.2k this week</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] to-sky-400" />
            </div>

            {/* Card 2: Emerald Green / Mastery Rate */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/20 border border-emerald-100 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-slate-600">Avg. Mastery Velocity</span>
                <span className="px-2 py-0.5 rounded-full text-[12px] font-bold bg-emerald-100 text-emerald-700">
                  +6.8%
                </span>
              </div>
              <div className="text-[28px] font-extrabold text-slate-900 mt-1">89.4%</div>
              <div className="flex items-center justify-between mt-1 text-[12px] text-slate-500">
                <span>Target: 85.0%</span>
                <span className="font-semibold text-emerald-700">Exceeding +4.4%</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
            </div>

            {/* Card 3: Amber / Interventions Needed */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-50/70 via-white to-amber-50/20 border border-amber-100 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-slate-600">Dropout Risk Flags</span>
                <span className="px-2 py-0.5 rounded-full text-[12px] font-bold bg-amber-100 text-amber-800">
                  -14 today
                </span>
              </div>
              <div className="text-[28px] font-extrabold text-amber-600 mt-1">38 Cases</div>
              <div className="flex items-center justify-between mt-1 text-[12px] text-slate-500">
                <span>92% resolved via AI Tutor</span>
                <span className="font-semibold text-amber-700">4 urgent</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400" />
            </div>

            {/* Card 4: Purple / Study Hours */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-50/70 via-white to-purple-50/20 border border-purple-100 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-slate-600">Daily Study Engagement</span>
                <span className="px-2 py-0.5 rounded-full text-[12px] font-bold bg-purple-100 text-purple-700">
                  +34m surge
                </span>
              </div>
              <div className="text-[28px] font-extrabold text-slate-900 mt-1">4.2 hrs<span className="text-[18px] font-semibold text-slate-500">/day</span></div>
              <div className="flex items-center justify-between mt-1 text-[12px] text-slate-500">
                <span>Peak: 8:00 PM – 11:30 PM</span>
                <span className="font-semibold text-purple-700">High focus</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
            </div>
          </div>

          {/* Bottom Row: Dual Data Views (Telemetry Graph & Real-time Cohort Panel) */}
          <div className="grid grid-cols-12 gap-3.5">
            {/* Main Area Chart (7 Cols) */}
            <div className="col-span-7 bg-slate-50/60 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h3 className="text-[16px] font-bold text-slate-800">
                    Weekly Cohort Progress vs. Cognitive Retention
                  </h3>
                  <p className="text-[13px] text-slate-500">Interactive telemetry curve across standard 12-week semester</p>
                </div>
                <div className="flex items-center gap-4 text-[13px] font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                    <span className="text-slate-700">AI Modules</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <span className="text-slate-700">Live Workshops</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span className="text-slate-700">Peer Labs</span>
                  </div>
                </div>
              </div>

              {/* Chart SVG Canvas */}
              <div className="relative w-full h-[185px]">
                <svg viewBox="0 0 760 170" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.38" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Gridlines */}
                  <line x1="0" y1="20" x2="760" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="760" y2="60" stroke="#E2E8F0" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="760" y2="100" stroke="#E2E8F0" strokeDasharray="3 3" />
                  <line x1="0" y1="140" x2="760" y2="140" stroke="#E2E8F0" strokeDasharray="3 3" />

                  {/* Purple Area (Peer Labs) */}
                  <path
                    d="M 0 150 C 90 145, 180 135, 270 125 C 360 115, 450 90, 540 85 C 630 80, 700 95, 760 70 L 760 160 L 0 160 Z"
                    fill="url(#purpleGrad)"
                  />
                  <path
                    d="M 0 150 C 90 145, 180 135, 270 125 C 360 115, 450 90, 540 85 C 630 80, 700 95, 760 70"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="2.5"
                  />

                  {/* Sky Blue Area (Live Workshops) */}
                  <path
                    d="M 0 135 C 100 120, 190 95, 280 80 C 370 65, 460 75, 550 50 C 640 25, 700 45, 760 30 L 760 160 L 0 160 Z"
                    fill="url(#skyGrad)"
                  />
                  <path
                    d="M 0 135 C 100 120, 190 95, 280 80 C 370 65, 460 75, 550 50 C 640 25, 700 45, 760 30"
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth="2.5"
                  />

                  {/* Royal Blue Area (AI Modules - Core) */}
                  <path
                    d="M 0 120 C 80 100, 160 65, 250 50 C 340 35, 420 40, 510 22 C 600 10, 680 20, 760 12 L 760 160 L 0 160 Z"
                    fill="url(#blueGrad)"
                  />
                  <path
                    d="M 0 120 C 80 100, 160 65, 250 50 C 340 35, 420 40, 510 22 C 600 10, 680 20, 760 12"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="3.2"
                  />

                  {/* Interactive Tooltip Pin on Peak (Week 8) */}
                  <line x1="510" y1="22" x2="510" y2="155" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx="510" cy="22" r="5" fill="#2563EB" stroke="#ffffff" strokeWidth="2.5" />
                  
                  {/* Tooltip Box */}
                  <g transform="translate(435, 30)">
                    <rect width="150" height="52" rx="8" fill="#0F172A" opacity="0.95" />
                    <text x="12" y="20" fill="#94A3B8" fontSize="11" fontWeight="600">WEEK 8 · MID-TERM SURGE</text>
                    <text x="12" y="38" fill="#38BDF8" fontSize="14" fontWeight="700">96.8k hrs (+34.2%)</text>
                  </g>
                </svg>

                {/* X-Axis labels */}
                <div className="flex justify-between text-[12px] font-semibold text-slate-500 pt-1 px-1">
                  <span>Wk 1</span>
                  <span>Wk 2</span>
                  <span>Wk 3</span>
                  <span>Wk 4</span>
                  <span>Wk 5</span>
                  <span>Wk 6</span>
                  <span>Wk 7</span>
                  <span className="text-[#2563EB] font-bold">Wk 8 (Peak)</span>
                  <span>Wk 9</span>
                  <span>Wk 10</span>
                  <span>Wk 11</span>
                  <span>Wk 12</span>
                </div>
              </div>
            </div>

            {/* Right Column: Breakdown Donut & High-Risk Interventions (5 Cols) */}
            <div className="col-span-5 flex flex-col gap-3">
              {/* Department Distribution Mini Widget */}
              <div className="bg-slate-50/60 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* SVG Donut Chart */}
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-200"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Segment 1: Royal Blue 42% */}
                      <path
                        className="text-[#2563EB]"
                        strokeDasharray="42, 100"
                        strokeWidth="4.2"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Segment 2: Sky 28% */}
                      <path
                        className="text-sky-400"
                        strokeDasharray="28, 100"
                        strokeDashoffset="-44"
                        strokeWidth="4.2"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Segment 3: Emerald 18% */}
                      <path
                        className="text-emerald-500"
                        strokeDasharray="18, 100"
                        strokeDashoffset="-74"
                        strokeWidth="4.2"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-[12px] font-black text-slate-800">92%</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[14px] font-bold text-slate-900">Program Engagement</div>
                    <div className="text-[12px] text-slate-500">Distribution by Academic Track</div>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                    <span className="text-slate-600 font-medium">CS & AI: <strong>42%</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <span className="text-slate-600 font-medium">Applied Data: <strong>28%</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-slate-600 font-medium">BioTech: <strong>18%</strong></span>
                  </div>
                </div>
              </div>

              {/* Priority Interventions Feed */}
              <div className="bg-slate-50/60 border border-slate-200/80 rounded-xl p-3 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[14px] font-bold text-slate-800">
                    Real-Time Student Interventions
                  </span>
                  <span className="text-[12px] text-[#2563EB] font-semibold cursor-pointer hover:underline">
                    View All (38) →
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Student Row 1 */}
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200/70 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-[#2563EB] text-[12px] font-bold flex items-center justify-center">
                        SK
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-slate-900 leading-tight">Sophea Keo</div>
                        <div className="text-[11px] text-slate-500">Neural Systems II · Unit 4</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200">
                        AI Tutor Sent
                      </span>
                      <span className="text-[12px] font-bold text-slate-700">74%</span>
                    </div>
                  </div>

                  {/* Student Row 2 */}
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200/70 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-[12px] font-bold flex items-center justify-center">
                        MR
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-slate-900 leading-tight">Marcus Rivera</div>
                        <div className="text-[11px] text-slate-500">Distributed DBs · Lab 3</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        Risk Flag: 81%
                      </span>
                      <span className="text-[12px] font-bold text-slate-700">42%</span>
                    </div>
                  </div>

                  {/* Student Row 3 */}
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200/70 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-[12px] font-bold flex items-center justify-center">
                        AT
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-slate-900 leading-tight">Amina Traore</div>
                        <div className="text-[11px] text-slate-500">Full-Stack Cloud · Capstone</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Exam Qualified
                      </span>
                      <span className="text-[12px] font-bold text-slate-700">98%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer / Helper Bar */}
      <footer className="h-[44px] px-8 bg-white/90 border-t border-slate-200/80 flex items-center justify-between text-[13px] text-slate-500 shrink-0 z-20">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-slate-700">Campus Integrations:</span>
          <span className="hover:text-slate-900 cursor-pointer">Canvas LMS</span>
          <span>·</span>
          <span className="hover:text-slate-900 cursor-pointer">Blackboard Learn</span>
          <span>·</span>
          <span className="hover:text-slate-900 cursor-pointer">Moodle 4.x</span>
          <span>·</span>
          <span className="hover:text-slate-900 cursor-pointer">Google Classroom</span>
        </div>

        <div className="flex items-center gap-4 text-[13px]">
          <span className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            99.98% Telemetry Uptime
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-400">FERPA & SOC-2 Type II Certified</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-medium">© 2026 EduPulse Inc.</span>
        </div>
      </footer>
    </div>
  );
}
`,
  },
  {
    id: "katex-math-lab",
    name: "KaTeX Math Lab",
    category: "Education",
    description: "Showcase inline/display math, matrices, aligned equations, and chemistry.",
    width: 1080,
    height: 1350,
    code: `import { Poster, Text, Math, BlockMath, Stack } from "@poster/core";

export default function App() {
  return (
    <Poster background="#0f172a" color="#e2e8f0" className="p-16 box-border">
      <Stack gap={28} className="h-full justify-between">
        <div>
          <Text size={28} color="#38bdf8" className="tracking-[0.2em] uppercase">
            Poster Studio · KaTeX
          </Text>
          <Text size={72} weight={700} className="mt-4">
            Math that renders
          </Text>
          <Text size={36} color="#94a3b8" className="mt-3">
            {"Inline in Text: $e^{i\\\\pi}+1=0$ · also \\\\(\\\\frac{a}{b}\\\\)"}
          </Text>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-slate-700 p-10">
          <Text size={32} weight={600} className="mb-6 text-sky-300">
            Display and matrix
          </Text>
          <BlockMath
            color="#f8fafc"
            tex={String.raw\`\\sum_{n=1}^{N} n = \\frac{N(N+1)}{2}\`}
          />
          <div className="mt-8">
            <BlockMath
              color="#f8fafc"
              tex={String.raw\`\\begin{pmatrix}a & b \\\\ c & d\\end{pmatrix}\`}
            />
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-slate-700 p-10">
          <Text size={32} weight={600} className="mb-6 text-emerald-300">
            Aligned and chemistry
          </Text>
          <BlockMath
            color="#f8fafc"
            tex={String.raw\`\\begin{aligned} a &= b + c \\\\ x^2 &= \\sqrt{y} \\end{aligned}\`}
          />
          <div className="mt-8 flex items-center gap-4">
            <Text size={36}>Reaction:</Text>
            <Math tex={String.raw\`\\ce{CO2 + H2O}\`} color="#f8fafc" />
          </div>
        </div>

        <Text size={28} color="#64748b">
          Prefer {"<Math />"} / {"<BlockMath />"} or $…$ inside {"<Text>"}. Lone $50 stays text.
        </Text>
      </Stack>
    </Poster>
  );
}
`,
  },
  {
    id: "phnom-penh-boulevards",
    name: "Phnom Penh Boulevards",
    category: "Education",
    description: "Six main boulevards guide for new students in Phnom Penh.",
    width: 1080,
    height: 1080,
    code: `export default function Poster() {
  const boulevards = [
    {
      num: "01",
      name: "មហាវិថី សហព័ន្ធរុស្ស៊ី",
      tag: "តំបន់សាកលវិទ្យាល័យធំៗ",
      badgeColor: "bg-sky-100 text-sky-950 border-sky-300",
      landmarks: ["RUPP (ភូមិន្ទ)", "ITC (តិចណូ)", "IFL (ភាសា)", "ព្រលានយន្តហោះចាស់"],
    },
    {
      num: "02",
      name: "មហាវិថី ព្រះមុនីវង្ស",
      tag: "សរសៃឈាមកណ្តាលក្រុង",
      badgeColor: "bg-blue-100 text-blue-950 border-blue-300",
      landmarks: ["ស្ថានីយរថភ្លើង", "ផ្សារធំថ្មី", "ពេទ្យកាល់ម៉ែត", "ស្ពានច្បារអំពៅ"],
    },
    {
      num: "03",
      name: "មហាវិថី ព្រះនរោត្តម",
      tag: "រដ្ឋបាល & ច្បាប់",
      badgeColor: "bg-indigo-100 text-indigo-950 border-indigo-300",
      landmarks: ["វិមានឯករាជ្យ", "សាលាច្បាប់ (RULE)", "ស្ពានក្បាលថ្នល់", "ក្រសួងអប់រំ"],
    },
    {
      num: "04",
      name: "មហាវិថី ម៉ៅសេទុង",
      tag: "ពាណិជ្ជកម្ម & សាលារៀន",
      badgeColor: "bg-cyan-100 text-cyan-950 border-cyan-300",
      landmarks: ["ផ្សារដើមគ", "ស្ថានទូតចិន", "ផ្សារបឹងកេងកង", "ស្ពានអាកាស ៧មករា"],
    },
    {
      num: "05",
      name: "មហាវិថី ព្រះស៊ីសុវត្ថិ",
      tag: "មាត់ទន្លេ & លំហែកាយ",
      badgeColor: "bg-teal-100 text-teal-950 border-teal-300",
      landmarks: ["មាត់ទន្លេបួនមុខ", "ព្រះបរមរាជវាំង", "ផ្សាររាត្រី", "សាលាវិចិត្រសិល្បៈ"],
    },
    {
      num: "06",
      name: "មហាវិថី សម្តេចហ៊ុនសែន",
      tag: "ផ្លូវ ៦០ ម៉ែត្រ",
      badgeColor: "bg-emerald-100 text-emerald-950 border-emerald-300",
      landmarks: ["ផ្សារទំនើប អ៊ីអន ៣", "ផ្លូវ ២៧១", "ច្រកចេញក្រវាត់ក្រុង", "តំបន់ពង្រីកក្រុង"],
    },
  ];

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-white via-sky-50 to-sky-100 text-slate-900 font-sans flex flex-col justify-between p-7 select-none">

      {/* Background Glows */}
      <div className="absolute -top-12 -right-12 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-96 h-96 bg-cyan-200/50 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <header className="relative z-10 shrink-0">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-600/10 border-2 border-sky-400/50 text-sky-950 text-base font-bold mb-1">
          <span className="text-lg">🎓</span>
          <span className="text-[20px]">សម្រាប់និស្សិតថ្មីមកពីខេត្ត</span>
        </div>

        <h1 className="text-[52px] font-black text-slate-950 tracking-tight leading-tight">
          ផ្លូវសំខាន់ៗនៅទីក្រុងភ្នំពេញ
        </h1>

        <p className="text-xl font-bold text-sky-900 mt-0.5 text-right">
          ស្គាល់ ៦ មហាវិថីស្នូល ធ្វើដំណើរទៅរៀនមិនបារម្ភរឿងវង្វេងផ្លូវ
        </p>
      </header>

      {/* Main 6 Boulevards Grid */}
      <main className="relative z-10 flex-1 grid grid-cols-2 grid-rows-3 gap-3.5 my-2.5">
        {boulevards.map((item) => (
          <div
            key={item.num}
            className="h-full bg-white/95 backdrop-blur-md rounded-2xl p-3.5 px-5 border-2 border-sky-200/90 shadow-[0_4px_16px_rgba(2,132,199,0.06)] flex flex-col justify-start gap-2.5"
          >

            {/* Top Area: Number & Street Name */}
            <div className="flex items-center gap-3">
              <span className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-sky-600 text-white font-mono font-black text-2xl shadow-sm">
                {item.num}
              </span>

              <h2 className="text-[32px] font-black text-slate-950 leading-tight tracking-tight truncate">
                {item.name}
              </h2>
            </div>

            {/* Tag */}
            <div>
              <span
                className={\`inline-block text-base font-semibold px-2.5 py-1 rounded-md border \${item.badgeColor}\`}
              >
                {item.tag}
              </span>
            </div>

            {/* Landmark Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
              {item.landmarks.map((landmark, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 text-[20px] font-normal leading-tight px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 min-w-0"
                >
                  <span className="text-rose-500 text-base shrink-0">
                    📍
                  </span>

                  <span className="truncate">
                    {landmark}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Student Survival Tips Footer */}
      <footer className="relative z-10 shrink-0 bg-white backdrop-blur-md rounded-2xl border-2 border-sky-300 p-3.5 px-6 flex items-center justify-between shadow-sm">

        <div className="flex items-center gap-4">

          {/* Footer Icon */}
          <div className="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-3xl shadow-sm">
            💡
          </div>

          <div>
            {/* Footer Heading */}
            <p className="text-lg font-bold text-sky-900 uppercase tracking-wide">
              គន្លឹះចាំផ្លូវងាយៗនៅភ្នំពេញ
            </p>

            {/* Footer Main Text */}
            <p className="text-[22px] font-normal text-slate-800 leading-snug">
              • ផ្លូវលេខ{" "}
              <span className="text-sky-700 font-bold underline underline-offset-4">
                សេស
              </span>{" "}
              (កើត ⇄ លិច) | ផ្លូវលេខ{" "}
              <span className="text-sky-700 font-bold underline underline-offset-4">
                គូ
              </span>{" "}
              (ជើង ⇄ ត្បូង)
            </p>
          </div>
        </div>

        {/* Google Maps Button */}
        <div className="flex items-center gap-2 bg-sky-50 px-5 py-2.5 rounded-xl border-2 border-sky-300 text-xl font-bold text-sky-950">
          <span className="text-2xl">🛵</span>
          <span>បើក Google Maps</span>
        </div>

      </footer>
    </div>
  );
}
`,
  },
  {
    id: "corporate",
    name: "Corporate Announcement",
    category: "Corporate",
    description: "Aura Learning Systems enterprise offer with features and CTA.",
    width: 1080,
    height: 1350,
    code: `import { Logo } from "@poster/core";

export default function Poster() {
  return (
    <div className="relative w-[1080px] h-[1350px] overflow-hidden bg-slate-950 font-sans text-white flex flex-col justify-between p-[64px] select-none">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[160px] -right-[160px] w-[640px] h-[640px] rounded-full bg-[#2563EB]/30 blur-[140px]" />
        <div className="absolute top-[480px] -left-[200px] w-[580px] h-[580px] rounded-full bg-sky-500/20 blur-[160px]" />
        <div className="absolute -bottom-[120px] right-[100px] w-[500px] h-[500px] rounded-full bg-blue-600/25 blur-[130px]" />
        {/* Subtle Engineering Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.07]" 
          style={{
            backgroundImage: \`linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)\`,
            backgroundSize: '48px 48px'
          }} 
        />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 pb-[36px]">
        <div className="flex items-center gap-4">
          <div className="w-[56px] h-[56px] rounded-2xl bg-[#2563EB] flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Logo className="w-8 h-8 fill-current" />
          </div>
          <div>
            <p className="text-[24px] font-bold tracking-tight text-white uppercase">AURA LEARNING SYSTEMS</p>
            <p className="text-[20px] font-medium text-slate-400">Next-Gen Enterprise EdTech</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-sky-400 text-[22px] font-semibold tracking-wide uppercase">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          Official Announcement
        </span>
      </header>

      {/* Hero Headline & Value Proposition */}
      <section className="relative z-10 mt-[24px]">
        <div className="inline-block mb-3">
          <span className="text-[24px] font-semibold uppercase tracking-widest text-sky-400">
            Enterprise Learning Cloud 2026
          </span>
        </div>
        
        <h1 className="text-[76px] font-extrabold leading-[1.08] tracking-tight text-white mb-6">
          Elevate Workforce <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-white">
            Intelligence at Scale.
          </span>
        </h1>

        <p className="text-[26px] leading-[1.45] text-slate-300 max-w-[920px]">
          Equip your teams with adaptive AI curricula, verified credential pathways, and real-time competency analytics across global operations.
        </p>
      </section>

      {/* Offer Highlight Box */}
      <section className="relative z-10 bg-gradient-to-r from-blue-600/30 via-[#2563EB]/20 to-transparent border border-blue-500/30 rounded-3xl p-[36px] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[22px] font-semibold uppercase tracking-wider text-sky-300 mb-1">
              Global Rollout Exclusive
            </p>
            <p className="text-[64px] font-black tracking-tight text-white leading-none">
              40% Off <span className="text-[44px] font-bold text-sky-400">Annual Licensing</span>
            </p>
          </div>
          <div className="text-right border-l border-white/15 pl-[40px]">
            <p className="text-[26px] font-bold text-white">First 100 Enterprises</p>
            <p className="text-[22px] text-slate-400">Complimentary migration & bespoke SLA</p>
          </div>
        </div>
      </section>

      {/* Core Capabilities / Feature Bullets */}
      <section className="relative z-10 grid grid-cols-3 gap-6">
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-[30px] flex flex-col justify-between backdrop-blur-md">
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 text-sky-400 flex items-center justify-center mb-5">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[30px] font-bold text-white mb-2 leading-tight">Adaptive AI Paths</h3>
            <p className="text-[24px] text-slate-400 leading-snug">Personalized upskilling matching team performance metrics in real time.</p>
          </div>
        </div>

        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-[30px] flex flex-col justify-between backdrop-blur-md">
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 text-sky-400 flex items-center justify-center mb-5">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[30px] font-bold text-white mb-2 leading-tight">Executive Telemetry</h3>
            <p className="text-[24px] text-slate-400 leading-snug">Comprehensive skill-gap visibility for leadership and talent planning.</p>
          </div>
        </div>

        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-[30px] flex flex-col justify-between backdrop-blur-md">
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 text-sky-400 flex items-center justify-center mb-5">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[30px] font-bold text-white mb-2 leading-tight">SOC-2 Type II</h3>
            <p className="text-[24px] text-slate-400 leading-snug">Bank-grade data isolation, single sign-on, and GDPR-compliant infrastructure.</p>
          </div>
        </div>
      </section>

      {/* Footer & Primary Call to Action */}
      <footer className="relative z-10 pt-[24px]">
        <div className="flex items-center justify-between bg-white rounded-3xl p-5 pl-10 shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[26px] font-bold text-slate-900 tracking-tight">
              Ready to modernize corporate capability?
            </span>
            <span className="text-[22px] font-medium text-slate-500">
              aura.io/enterprise-briefing • Valid through Q3 2026
            </span>
          </div>

          <button className="bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] transition-all text-white font-bold text-[34px] px-10 py-5 rounded-2xl flex items-center gap-3 shadow-lg shadow-blue-600/30">
            <span>Schedule Briefing</span>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
`,
  },
  {
    id: "social",
    name: "Social Media Post",
    category: "Social",
    description: "SkillPro AI engineering cohort promo with pricing and CTA.",
    width: 1080,
    height: 1350,
    code: `import { Logo } from "@poster/core";

export default function Poster() {
  return (
    <div className="relative w-[1080px] h-[1350px] min-w-[1080px] min-h-[1350px] max-w-[1080px] max-h-[1350px] overflow-hidden bg-[#0A1128] text-white font-sans flex flex-col justify-between p-[64px]">
      {/* Background Decorative Ambient Glows & Grid */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Glow Spheres */}
        <div className="absolute -top-[140px] -right-[120px] w-[560px] h-[560px] rounded-full bg-[#38BDF8] opacity-25 blur-[120px]" />
        <div className="absolute top-[380px] -left-[160px] w-[620px] h-[620px] rounded-full bg-[#2563EB] opacity-35 blur-[140px]" />
        <div className="absolute -bottom-[100px] right-[100px] w-[520px] h-[520px] rounded-full bg-[#F59E0B] opacity-20 blur-[130px]" />
        
        {/* Subtle Geometric Grid Lines */}
        <div 
          className="absolute inset-0 opacity-[0.07]" 
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
        />
      </div>

      {/* Top Section: Navigation / Brand & Urgency Badge */}
      <header className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-[16px]">
          <div className="w-[60px] h-[60px] rounded-[18px] bg-gradient-to-tr from-[#2563EB] via-[#38BDF8] to-white p-[2px] shadow-lg shadow-blue-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#0B1536] rounded-[16px] flex items-center justify-center">
              <Logo className="w-[34px] h-[34px] text-[#38BDF8]" />
            </div>
          </div>
          <div>
            <div className="text-[32px] font-black tracking-tight leading-none text-white">
              Skill<span className="text-[#38BDF8]">Pro</span>
            </div>
            <div className="text-[20px] font-semibold tracking-wider text-slate-300 uppercase mt-[4px]">
              EdTech Masterclass
            </div>
          </div>
        </div>

        {/* Promo Pop Badge */}
        <div className="inline-flex items-center gap-[10px] px-[24px] py-[12px] rounded-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white shadow-xl shadow-amber-500/25 border border-amber-300/40">
          <span className="w-[12px] h-[12px] rounded-full bg-white animate-pulse" />
          <span className="text-[22px] font-extrabold uppercase tracking-wider">
            Cohorts Enrolling Now
          </span>
        </div>
      </header>

      {/* Center Section: Core Hook, Headline & Price Card */}
      <main className="relative z-10 flex flex-col gap-[36px] my-auto">
        {/* Pre-headline Pill */}
        <div className="self-start inline-flex items-center gap-[12px] bg-blue-500/15 border border-blue-400/30 backdrop-blur-md px-[22px] py-[10px] rounded-full">
          <span className="text-[24px]">🚀</span>
          <span className="text-[22px] font-bold tracking-wide text-[#7DD3FC] uppercase">
            Become an Industry-Ready AI Engineer
          </span>
        </div>

        {/* Hero Headline (68–84px) */}
        <h1 className="text-[78px] font-black leading-[1.08] tracking-tight text-white drop-shadow-sm">
          Master Full-Stack <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#60A5FA] to-[#A78BFA]">
            AI Engineering
          </span>{" "}
          in 8 Weeks.
        </h1>

        {/* Supporting Hook Subhead (22–26px) */}
        <p className="text-[26px] font-normal leading-relaxed text-slate-200 max-w-[940px]">
          Skip years of trial and error. Build, deploy, and scale 6 production-grade LLM applications with direct mentorship from Silicon Valley leaders.
        </p>

        {/* Offer / Pricing Box & Value Proposition (Key Figure: 52–72px) */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#1E293B]/90 via-[#0F172A]/90 to-[#1E3A8A]/60 border-2 border-blue-400/40 p-[36px] shadow-2xl backdrop-blur-xl flex items-center justify-between">
          <div className="flex flex-col gap-[6px]">
            <span className="text-[22px] font-bold uppercase tracking-wider text-[#F59E0B]">
              Early Bird Special • Limited Seats
            </span>
            <div className="flex items-baseline gap-[18px]">
              <span className="text-[72px] font-black text-white tracking-tight leading-none">
                $199
              </span>
              <span className="text-[34px] font-medium text-slate-400 line-through">
                $499
              </span>
              <span className="px-[14px] py-[6px] rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[22px] font-extrabold">
                SAVE 60%
              </span>
            </div>
            <span className="text-[22px] text-slate-300 font-medium">
              One-time payment • Guaranteed lifetime curriculum updates
            </span>
          </div>

          <div className="text-right hidden sm:flex flex-col items-end border-l border-white/10 pl-[36px]">
            <div className="text-[54px] font-extrabold text-[#38BDF8] leading-none">
              4.9/5
            </div>
            <div className="text-[22px] text-amber-300 mt-[6px]">
              ★★★★★
            </div>
            <div className="text-[20px] font-semibold text-slate-300 uppercase tracking-wider mt-[4px]">
              Over 2,400 Reviews
            </div>
          </div>
        </div>

        {/* Feature Bullets (28–34px) */}
        <div className="flex flex-col gap-[18px] pt-[8px]">
          <div className="flex items-center gap-[20px]">
            <div className="w-[42px] h-[42px] rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/40 flex items-center justify-center shrink-0">
              <svg className="w-[24px] h-[24px] text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-[30px] font-semibold text-slate-100">
              <strong className="text-white font-extrabold">6 Real-World Capstones</strong> with full code reviews
            </span>
          </div>

          <div className="flex items-center gap-[20px]">
            <div className="w-[42px] h-[42px] rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/40 flex items-center justify-center shrink-0">
              <svg className="w-[24px] h-[24px] text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-[30px] font-semibold text-slate-100">
              <strong className="text-white font-extrabold">Weekly 1-on-1 Sessions</strong> with Principal AI Architects
            </span>
          </div>

          <div className="flex items-center gap-[20px]">
            <div className="w-[42px] h-[42px] rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/40 flex items-center justify-center shrink-0">
              <svg className="w-[24px] h-[24px] text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-[30px] font-semibold text-slate-100">
              <strong className="text-white font-extrabold">Career Pipeline Direct Access</strong> to 80+ hiring tech partners
            </span>
          </div>
        </div>
      </main>

      {/* Bottom Section: Strong CTA & Social Proof / Trust Footnote */}
      <footer className="relative z-10 flex flex-col gap-[28px] pt-[20px]">
        {/* Strong CTA (30–40px) */}
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-1 rounded-[24px] bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#F59E0B] opacity-75 blur-md group-hover:opacity-100 transition duration-300" />
          <button className="relative w-full py-[30px] px-[40px] rounded-[22px] bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#0284C7] hover:brightness-110 active:scale-[0.99] transition duration-200 flex items-center justify-center gap-[18px] shadow-2xl border border-white/30 text-white">
            <span className="text-[36px] font-black uppercase tracking-wider">
              Claim Your 60% Discount Now
            </span>
            <svg className="w-[36px] h-[36px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Footnote Trust & Urgency (22–26px) */}
        <div className="flex items-center justify-between text-slate-300 text-[24px] font-medium px-[8px]">
          <div className="flex items-center gap-[12px]">
            <svg className="w-[26px] h-[26px] text-[#38BDF8]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>14-Day 100% Money-Back Guarantee</span>
          </div>
          <div className="text-[#FBBF24] font-bold flex items-center gap-[8px]">
            <span>⏳</span> Offer expires in 48 hours
          </div>
        </div>
      </footer>
    </div>
  );
}
`,
  },
  {
    id: "infographic",
    name: "Business Infographic",
    category: "Infographic",
    description: "Dark growth directive with KPIs, phases, and channel ROI bars.",
    width: 1080,
    height: 1350,
    code: `export default function Poster() {
  return (
    <div className="w-[1080px] h-[1350px] relative overflow-hidden bg-[#0E0405] text-white flex flex-col justify-between p-12 select-none font-sans box-border">
      {/* Background Gradients & Grid */}
      <div className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[440px] -left-28 w-[460px] h-[460px] bg-yellow-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-20 right-8 w-[480px] h-[480px] bg-red-700/20 rounded-full blur-[140px] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* HEADER SECTION */}
      <header className="relative z-10">
        <div className="flex items-center justify-between pb-4 border-b border-red-500/25">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
            <span className="bg-red-600 text-yellow-300 font-extrabold uppercase text-[20px] tracking-wider px-3.5 py-1 rounded">
              2026 Growth Directive
            </span>
          </div>
          <span className="text-yellow-400/90 font-bold uppercase tracking-widest text-[20px]">
            Executive Briefing • Q3 Report
          </span>
        </div>

        <div className="mt-6">
          <h1 className="text-[76px] font-black uppercase tracking-tight leading-[1.04] text-white">
            REVENUE VELOCITY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">
              SCALE MATRIX
            </span>
          </h1>
          <p className="mt-3.5 text-[26px] text-zinc-300 font-medium leading-snug max-w-[960px]">
            Hyper-scale systems achieve{" "}
            <span className="text-yellow-300 font-bold">3.4× pipeline acceleration</span>{" "}
            by synchronizing dynamic pricing cycles with algorithmic lead routing.
          </p>
        </div>
      </header>

      {/* HERO KEY STATS ROW */}
      <section className="relative z-10 grid grid-cols-3 gap-5">
        {/* Card 1 */}
        <div className="bg-gradient-to-b from-[#200A0D] to-[#140608] border-2 border-red-600/40 rounded-2xl p-5 flex flex-col justify-between">
          <span className="text-red-400 uppercase font-bold text-[20px] tracking-wider">
            Pipeline Surge
          </span>
          <div className="my-1.5 flex items-baseline">
            <span className="text-[52px] text-yellow-400 font-extrabold leading-none mr-0.5">
              +
            </span>
            <span className="text-[92px] font-black text-yellow-400 leading-none tracking-tight">
              340
            </span>
            <span className="text-[52px] text-yellow-400 font-extrabold leading-none ml-0.5">
              %
            </span>
          </div>
          <p className="text-[26px] text-zinc-300 font-semibold leading-tight">
            Year-over-year qualified inbound surge
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-gradient-to-b from-[#2A0E12] to-[#18070A] border-2 border-yellow-500/50 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-yellow-400 uppercase font-bold text-[20px] tracking-wider">
              Retention
            </span>
            <span className="bg-yellow-400 text-black text-[18px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider leading-none">
              Peak
            </span>
          </div>
          <div className="my-1.5 flex items-baseline">
            <span className="text-[92px] font-black text-white leading-none tracking-tight">
              94.2
            </span>
            <span className="text-[52px] text-yellow-400 font-extrabold leading-none ml-0.5">
              %
            </span>
          </div>
          <p className="text-[26px] text-zinc-300 font-semibold leading-tight">
            Net revenue retention in tier-1 enterprise
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-gradient-to-b from-[#200A0D] to-[#140608] border-2 border-red-600/40 rounded-2xl p-5 flex flex-col justify-between">
          <span className="text-red-400 uppercase font-bold text-[20px] tracking-wider">
            Capital Saved
          </span>
          <div className="my-1.5 flex items-baseline">
            <span className="text-[52px] text-yellow-400 font-extrabold leading-none mr-0.5">
              $
            </span>
            <span className="text-[92px] font-black text-yellow-400 leading-none tracking-tight">
              18
            </span>
            <span className="text-[52px] text-yellow-400 font-extrabold leading-none ml-0.5">
              M
            </span>
          </div>
          <p className="text-[26px] text-zinc-300 font-semibold leading-tight">
            Automated customer acquisition offset
          </p>
        </div>
      </section>

      {/* 3-STAGE EXECUTION ENGINE */}
      <section className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[42px] font-black uppercase tracking-tight text-white flex items-center gap-3">
            <span className="w-3.5 h-8 bg-yellow-400 rounded-sm inline-block" />
            Execution Architecture
          </h2>
          <span className="text-[20px] text-yellow-400 font-bold uppercase tracking-widest">
            3-Stage Model
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="bg-[#190709] border border-red-700/40 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-red-900/50">
              <span className="text-yellow-400 font-black text-[22px]">PHASE 01</span>
              <span className="text-red-400 font-extrabold text-[20px]">ACQUIRE</span>
            </div>
            <div className="mt-2.5">
              <p className="text-[26px] font-bold text-white leading-snug">
                Precision Ingestion
              </p>
              <p className="text-[26px] text-zinc-300 mt-1 leading-snug">
                AI filters 40% low-intent leads at intake.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#1F090C] border-2 border-yellow-500/40 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-yellow-500/30">
              <span className="text-yellow-400 font-black text-[22px]">PHASE 02</span>
              <span className="text-yellow-300 font-extrabold text-[20px]">ACCELERATE</span>
            </div>
            <div className="mt-2.5">
              <p className="text-[26px] font-bold text-white leading-snug">
                Instant Conversion
              </p>
              <p className="text-[26px] text-zinc-300 mt-1 leading-snug">
                Sales cycle drops from 47 to 11 days.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#190709] border border-red-700/40 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-red-900/50">
              <span className="text-yellow-400 font-black text-[22px]">PHASE 03</span>
              <span className="text-red-400 font-extrabold text-[20px]">COMPOUND</span>
            </div>
            <div className="mt-2.5">
              <p className="text-[26px] font-bold text-white leading-snug">
                Automatic Uplift
              </p>
              <p className="text-[26px] text-zinc-300 mt-1 leading-snug">
                Usage triggers 2.1× expansion deals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* METRIC BREAKDOWN PROGRESS BARS */}
      <section className="relative z-10 bg-[#160608] border-2 border-red-600/30 rounded-2xl p-5">
        <h2 className="text-[40px] font-black uppercase tracking-tight text-white mb-4">
          Efficiency By Channel
        </h2>

        <div className="space-y-3.5">
          {/* Channel 1 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-white text-[26px] font-bold">
                Direct Enterprise Engine
              </span>
              <span className="text-yellow-400 text-[26px] font-black">88% ROI</span>
            </div>
            <div className="w-full h-4 bg-red-950/70 rounded-full overflow-hidden border border-red-800/40">
              <div className="h-full bg-gradient-to-r from-red-600 via-amber-400 to-yellow-400 rounded-full w-[88%]" />
            </div>
          </div>

          {/* Channel 2 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-white text-[26px] font-bold">
                Partner Ecosystems
              </span>
              <span className="text-yellow-400 text-[26px] font-black">72% ROI</span>
            </div>
            <div className="w-full h-4 bg-red-950/70 rounded-full overflow-hidden border border-red-800/40">
              <div className="h-full bg-gradient-to-r from-red-600 via-yellow-500 to-yellow-400 rounded-full w-[72%]" />
            </div>
          </div>

          {/* Channel 3 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-white text-[26px] font-bold">
                Automated Expansion
              </span>
              <span className="text-yellow-400 text-[26px] font-black">64% ROI</span>
            </div>
            <div className="w-full h-4 bg-red-950/70 rounded-full overflow-hidden border border-red-800/40">
              <div className="h-full bg-gradient-to-r from-red-600 to-yellow-500 rounded-full w-[64%]" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 pt-4 border-t border-red-600/30 flex items-center justify-between text-[20px] text-zinc-400 font-medium">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-sm rotate-45" />
          <span>Source: Global Revenue Intelligence Index (1,420 Firms)</span>
        </div>
        <div className="text-yellow-400 font-bold uppercase tracking-wider">
          CONFIDENTIAL • FOR INTERNAL USE ONLY
        </div>
      </footer>
    </div>
  );
}
`,
  },
  {
    id: "dashboard",
    name: "Data Dashboard Poster",
    category: "Data",
    description: "EduVance Q1 board financial report with KPIs, charts, and division table.",
    width: 2480,
    height: 3508,
    code: `import {
  Logo,
  Metric,
  Table,
  BarChart,
  LineChart,
  PieChart,
  Grid,
  Stack,
  Text,
  Divider,
} from "@poster/core";

export default function Poster() {
  const barData = [
    { label: "Q1 2025", revenue: 111.2, ebitda: 32.6 },
    { label: "Q2 2025", revenue: 118.5, ebitda: 36.1 },
    { label: "Q3 2025", revenue: 127.3, ebitda: 39.8 },
    { label: "Q4 2025", revenue: 136.9, ebitda: 43.5 },
    { label: "Q1 2026", revenue: 142.8, ebitda: 46.2 },
  ];

  const pieData = [
    { name: "Enterprise Workforce L&D", value: 45.0, color: "#2563EB", amount: "$64.2M" },
    { name: "Higher Ed Cloud Campus", value: 26.9, color: "#0284C7", amount: "$38.4M" },
    { name: "AI & Tech Certifications", value: 18.3, color: "#38BDF8", amount: "$26.1M" },
    { name: "K-12 Adaptive Learning", value: 9.8, color: "#818CF8", amount: "$14.1M" },
  ];

  const tableHeaders = [
    "Business Division",
    "Q1 2026 Actual",
    "Q1 2025 Actual",
    "Plan Target",
    "Variance ($ / %)",
    "YoY Growth",
    "EBITDA Margin",
  ];

  const tableRows = [
    [
      "Enterprise Workforce Solutions",
      "$64.2M",
      "$48.5M",
      "$61.0M",
      "+$3.2M (+5.2%)",
      "+32.4%",
      "41.2%",
    ],
    [
      "Higher Education Cloud Campus",
      "$38.4M",
      "$31.8M",
      "$37.5M",
      "+$0.9M (+2.4%)",
      "+20.8%",
      "34.5%",
    ],
    [
      "AI & Professional Certifications",
      "$26.1M",
      "$18.2M",
      "$24.0M",
      "+$2.1M (+8.8%)",
      "+43.4%",
      "29.8%",
    ],
    [
      "K-12 Adaptive STEM Platforms",
      "$14.1M",
      "$12.7M",
      "$13.5M",
      "+$0.6M (+4.4%)",
      "+11.0%",
      "22.4%",
    ],
    [
      "Consolidated EduVance Group",
      "$142.8M",
      "$111.2M",
      "$136.0M",
      "+$6.8M (+5.0%)",
      "+28.4%",
      "32.4%",
    ],
  ];

  return (
    <div className="w-[2480px] h-[3508px] bg-slate-50 text-slate-900 font-sans p-[96px] flex flex-col justify-between select-none relative overflow-hidden">
      {/* Subtle Background Geometry */}
      <div className="absolute top-0 right-0 w-[1400px] h-[1400px] bg-gradient-to-bl from-blue-100/70 via-sky-50/50 to-transparent rounded-full -mr-[350px] -mt-[350px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[1300px] h-[1300px] bg-gradient-to-tr from-blue-100/60 via-slate-100/40 to-transparent rounded-full -ml-[350px] -mb-[350px] pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <div className="w-[136px] h-[136px] rounded-[32px] bg-gradient-to-tr from-[#1D4ED8] via-[#2563EB] to-[#38BDF8] flex items-center justify-center shadow-2xl shadow-blue-500/25">
              <Logo name="EduVance" className="w-[96px] h-[96px] text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-4 mb-3">
                <span className="text-[34px] font-extrabold tracking-[0.24em] text-[#2563EB] uppercase">
                  EduVance Global Holdings Inc.
                </span>
                <span className="text-[32px] font-bold text-slate-300">•</span>
                <span className="text-[32px] font-bold text-slate-500 uppercase tracking-widest">
                  Nasdaq: EDVC
                </span>
              </div>
              <h1 className="text-[128px] font-black tracking-tight text-slate-900 leading-[1.05]">
                Q1 2026 Executive Financial Report
              </h1>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-4">
            <div className="flex items-center space-x-4">
              <span className="px-7 py-3 rounded-full bg-blue-50 border-2 border-blue-200 text-[#2563EB] text-[32px] font-extrabold tracking-wide">
                BOARD DECK • Q1 REVIEW
              </span>
              <span className="px-7 py-3 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-700 text-[32px] font-extrabold tracking-wide">
                AUDITED COMPLIANT
              </span>
            </div>
            <p className="text-[36px] font-semibold text-slate-500">
              Three Months Ended March 31, 2026 • Currency: USD ($)
            </p>
          </div>
        </div>

        <Divider className="mt-10 mb-8 border-t-4 border-slate-200/90" />
      </header>

      {/* HEADLINE KPI METRICS */}
      <section className="relative z-10">
        <div className="grid grid-cols-4 gap-8">
          {/* KPI 1 */}
          <div className="bg-white rounded-[32px] p-[48px] shadow-xl shadow-slate-200/60 border border-slate-200/80 relative overflow-hidden flex flex-col justify-between h-[480px]">
            <div className="h-3.5 w-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8] absolute top-0 left-0" />
            <div className="flex justify-between items-start">
              <Text className="text-[36px] font-bold tracking-wider text-slate-500 uppercase">
                Total Revenue
              </Text>
              <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-[32px] font-black">
                ↑ 28.4%
              </span>
            </div>
            <div>
              <div className="text-[138px] font-black tracking-tight text-slate-900 leading-none">
                $142.8M
              </div>
              <p className="text-[34px] font-semibold text-slate-500 mt-5">
                +$31.6M vs Q1 2025 ($111.2M)
              </p>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-white rounded-[32px] p-[48px] shadow-xl shadow-slate-200/60 border border-slate-200/80 relative overflow-hidden flex flex-col justify-between h-[480px]">
            <div className="h-3.5 w-full bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] absolute top-0 left-0" />
            <div className="flex justify-between items-start">
              <Text className="text-[36px] font-bold tracking-wider text-slate-500 uppercase">
                Annual Recurring Rev (ARR)
              </Text>
              <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-[32px] font-black">
                ↑ 34.1%
              </span>
            </div>
            <div>
              <div className="text-[138px] font-black tracking-tight text-slate-900 leading-none">
                $512.4M
              </div>
              <p className="text-[34px] font-semibold text-slate-500 mt-5">
                Net Retention Rate: 124%
              </p>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-white rounded-[32px] p-[48px] shadow-xl shadow-slate-200/60 border border-slate-200/80 relative overflow-hidden flex flex-col justify-between h-[480px]">
            <div className="h-3.5 w-full bg-gradient-to-r from-[#2563EB] to-[#6366F1] absolute top-0 left-0" />
            <div className="flex justify-between items-start">
              <Text className="text-[36px] font-bold tracking-wider text-slate-500 uppercase">
                Adjusted EBITDA
              </Text>
              <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-[32px] font-black">
                +310 bps
              </span>
            </div>
            <div>
              <div className="text-[138px] font-black tracking-tight text-slate-900 leading-none">
                $46.2M
              </div>
              <p className="text-[34px] font-semibold text-slate-500 mt-5">
                32.4% Margin (Q1 25: 29.3%)
              </p>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-white rounded-[32px] p-[48px] shadow-xl shadow-slate-200/60 border border-slate-200/80 relative overflow-hidden flex flex-col justify-between h-[480px]">
            <div className="h-3.5 w-full bg-gradient-to-r from-[#38BDF8] to-emerald-400 absolute top-0 left-0" />
            <div className="flex justify-between items-start">
              <Text className="text-[36px] font-bold tracking-wider text-slate-500 uppercase">
                Active Global Learners
              </Text>
              <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-[32px] font-black">
                ↑ 28.2%
              </span>
            </div>
            <div>
              <div className="text-[138px] font-black tracking-tight text-slate-900 leading-none">
                8.42M
              </div>
              <p className="text-[34px] font-semibold text-slate-500 mt-5">
                +1.85M net paid additions YoY
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CHARTS GRID (2 COLUMNS) */}
      <section className="relative z-10">
        <div className="grid grid-cols-12 gap-8">
          {/* Revenue & Margin Trajectory (7 cols) */}
          <div className="col-span-7 bg-white rounded-[36px] p-[56px] shadow-xl shadow-slate-200/60 border border-slate-200/80 flex flex-col justify-between h-[1120px]">
            <div>
              <div className="flex justify-between items-baseline mb-4">
                <h2 className="text-[72px] font-black text-slate-900 tracking-tight">
                  Revenue & EBITDA Trajectory
                </h2>
                <span className="text-[34px] font-bold text-[#2563EB]">
                  5-Quarter Growth Trend ($M)
                </span>
              </div>
              <p className="text-[36px] font-normal text-slate-500">
                Quarter-over-quarter expansion driven by enterprise upskilling adoption & long-term SaaS renewals.
              </p>
            </div>

            {/* Custom High-Res Visual Chart Area */}
            <div className="w-full bg-slate-50/90 rounded-[28px] p-10 border border-slate-200/70">
              <div className="h-[620px] flex items-end justify-between px-10 pb-4 relative">
                {/* Horizontal Guide Lines with side labels */}
                <div className="absolute inset-x-8 top-[12%] border-b-2 border-dashed border-slate-300/70 flex justify-between items-end">
                  <span className="text-[28px] font-bold text-slate-400 -mt-8">$150M</span>
                  <span className="text-[28px] font-bold text-slate-400 -mt-8">$150M</span>
                </div>
                <div className="absolute inset-x-8 top-[44%] border-b-2 border-dashed border-slate-300/70 flex justify-between items-end">
                  <span className="text-[28px] font-bold text-slate-400 -mt-8">$100M</span>
                  <span className="text-[28px] font-bold text-slate-400 -mt-8">$100M</span>
                </div>
                <div className="absolute inset-x-8 top-[74%] border-b-2 border-dashed border-slate-300/70 flex justify-between items-end">
                  <span className="text-[28px] font-bold text-slate-400 -mt-8">$50M</span>
                  <span className="text-[28px] font-bold text-slate-400 -mt-8">$50M</span>
                </div>

                {barData.map((item, index) => {
                  const revHeight = (item.revenue / 160) * 490;
                  const ebitdaHeight = (item.ebitda / 160) * 490;
                  return (
                    <div key={index} className="flex flex-col items-center relative z-10 w-[170px]">
                      <div className="flex items-end space-x-3 w-full justify-center">
                        {/* Revenue Bar */}
                        <div className="flex flex-col items-center">
                          <span className="text-[34px] font-extrabold text-[#1D4ED8] mb-3">
                            \${item.revenue}
                          </span>
                          <div
                            style={{ height: \`\${revHeight}px\` }}
                            className="w-[56px] rounded-t-2xl bg-gradient-to-t from-[#1D4ED8] via-[#2563EB] to-[#38BDF8] shadow-lg shadow-blue-500/25"
                          />
                        </div>
                        {/* EBITDA Bar */}
                        <div className="flex flex-col items-center">
                          <span className="text-[32px] font-extrabold text-emerald-600 mb-3">
                            \${item.ebitda}
                          </span>
                          <div
                            style={{ height: \`\${ebitdaHeight}px\` }}
                            className="w-[56px] rounded-t-2xl bg-gradient-to-t from-emerald-600 to-teal-400 shadow-lg shadow-emerald-500/25"
                          />
                        </div>
                      </div>
                      <span className="text-[36px] font-bold text-slate-800 mt-7 tracking-wide">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chart Legend */}
              <div className="flex justify-center items-center space-x-16 mt-8 pt-6 border-t-2 border-slate-200">
                <div className="flex items-center space-x-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1D4ED8] to-[#38BDF8]" />
                  <span className="text-[36px] font-bold text-slate-700">Gross Revenue ($M)</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400" />
                  <span className="text-[36px] font-bold text-slate-700">Adj. EBITDA ($M)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue by Segment Donut / Breakdown (5 cols) */}
          <div className="col-span-5 bg-white rounded-[36px] p-[56px] shadow-xl shadow-slate-200/60 border border-slate-200/80 flex flex-col justify-between h-[1120px]">
            <div>
              <div className="flex justify-between items-baseline mb-4">
                <h2 className="text-[72px] font-black text-slate-900 tracking-tight">
                  Revenue Mix
                </h2>
                <span className="text-[34px] font-bold text-sky-600">Q1 2026 Segments</span>
              </div>
              <p className="text-[36px] font-normal text-slate-500">
                Diversified software and platform subscriptions across 4 primary institutional tiers.
              </p>
            </div>

            {/* Visual SVG Donut + Data Rows */}
            <div className="flex items-center justify-between px-2">
              <div className="relative w-[380px] h-[380px] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Segment 1: 45.0% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#2563EB"
                    strokeWidth="16"
                    strokeDasharray="45 55"
                    strokeDashoffset="0"
                  />
                  {/* Segment 2: 26.9% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#0284C7"
                    strokeWidth="16"
                    strokeDasharray="26.9 73.1"
                    strokeDashoffset="-45"
                  />
                  {/* Segment 3: 18.3% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#38BDF8"
                    strokeWidth="16"
                    strokeDasharray="18.3 81.7"
                    strokeDashoffset="-71.9"
                  />
                  {/* Segment 4: 9.8% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#818CF8"
                    strokeWidth="16"
                    strokeDasharray="9.8 90.2"
                    strokeDashoffset="-90.2"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[54px] font-black text-slate-900 leading-none">$142.8M</span>
                  <span className="text-[30px] font-extrabold text-slate-400 mt-2 uppercase tracking-wider">Total</span>
                </div>
              </div>

              <div className="space-y-4 flex-1 ml-10">
                {pieData.map((seg, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-8 h-8 rounded-full flex-shrink-0"
                        style={{ backgroundColor: seg.color }}
                      />
                      <div>
                        <div className="text-[36px] font-bold text-slate-800 leading-tight">
                          {seg.name}
                        </div>
                        <div className="text-[32px] font-semibold text-slate-400">
                          {seg.amount}
                        </div>
                      </div>
                    </div>
                    <span className="text-[40px] font-black text-slate-900">
                      {seg.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50/90 rounded-[24px] p-7 border border-blue-200/70">
              <p className="text-[34px] font-medium text-blue-900 leading-relaxed">
                <strong className="font-extrabold text-[#2563EB]">Core Takeaway:</strong> Enterprise workforce upskilling grew 32.4% YoY, now representing 45% of gross revenue with an annualized cohort churn rate below 2.8%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED DIVISION PERFORMANCE TABLE */}
      <section className="bg-white rounded-[36px] p-[56px] shadow-xl shadow-slate-200/60 border border-slate-200/80 relative z-10 flex-1 flex flex-col justify-between my-6">
        <div>
          <div className="flex justify-between items-baseline mb-6">
            <div>
              <h2 className="text-[72px] font-black text-slate-900 tracking-tight">
                Operating Division Financial Breakdown
              </h2>
              <p className="text-[36px] font-normal text-slate-500 mt-2">
                Consolidated segment reporting against internal Q1 board budget plan & prior year actuals.
              </p>
            </div>
            <span className="text-[34px] font-bold px-8 py-3 rounded-full bg-slate-100 text-slate-700">
              ALL METRICS GAAP AUDITED
            </span>
          </div>

          <div className="w-full overflow-hidden rounded-[26px] border border-slate-200">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gradient-to-r from-slate-900 via-[#1E3A8A] to-[#1D4ED8] text-white">
                  {tableHeaders.map((header, idx) => (
                    <th
                      key={idx}
                      className={\`py-8 px-8 text-[40px] font-black uppercase tracking-wider \${
                        idx === 0 ? "text-left" : "text-right"
                      }\`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tableRows.map((row, rowIdx) => {
                  const isTotal = rowIdx === tableRows.length - 1;
                  return (
                    <tr
                      key={rowIdx}
                      className={
                        isTotal
                          ? "bg-blue-50/90 font-black border-t-4 border-blue-600"
                          : rowIdx % 2 === 0
                          ? "bg-white"
                          : "bg-slate-50/70"
                      }
                    >
                      {row.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className={\`py-8 px-8 text-[38px] \${
                            cellIdx === 0
                              ? isTotal
                                ? "font-black text-blue-950 text-left text-[40px]"
                                : "font-bold text-slate-800 text-left"
                              : "text-right font-semibold text-slate-700"
                          } \${
                            cellIdx === 4
                              ? "text-emerald-700 font-extrabold"
                              : cellIdx === 5
                              ? "text-[#2563EB] font-extrabold"
                              : ""
                          }\`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FOOTER / AUDIT & LEGAL INFORMATION */}
      <footer className="relative z-10 pt-6 border-t-2 border-slate-200">
        <div className="flex justify-between items-center text-[30px] text-slate-400 font-medium tracking-wide">
          <div>
            <span className="font-bold text-slate-700">EduVance Global Holdings Inc. (NASDAQ: EDVC)</span> • Strategic Finance & Investor Relations Department • Q1 2026 Board Record
          </div>
          <div className="flex items-center space-x-8">
            <span>Non-GAAP Reconciliation Certified</span>
            <span>•</span>
            <span>Document Ref: BDR-2026-Q1-FINAL</span>
            <span>•</span>
            <span className="font-bold text-slate-700">Page 1 of 1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
`,
  },
  {
    id: "quote",
    name: "Quote Poster",
    category: "Minimal",
    description: "Editorial education quote with attribution and logo.",
    width: 1080,
    height: 1080,
    code: `import { Logo } from "@poster/core";

export default function Poster() {
  return (
    <div className="relative w-[1080px] h-[1080px] bg-slate-50 text-slate-900 flex flex-col justify-between p-[88px] overflow-hidden select-none font-sans">
      {/* Editorial Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:36px_36px] opacity-60 pointer-events-none" />
      <div className="absolute -top-[160px] -right-[160px] w-[620px] h-[620px] bg-gradient-to-br from-blue-500/20 via-sky-400/10 to-transparent rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-[200px] -left-[140px] w-[660px] h-[660px] bg-gradient-to-tr from-indigo-500/15 via-blue-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Watermark Editorial Quote Glyph */}
      <div className="absolute top-[180px] left-[68px] text-[280px] leading-none font-serif font-black text-blue-100/50 select-none pointer-events-none">
        “
      </div>

      {/* Top Meta Bar */}
      <header className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/90 border border-blue-200/80 shadow-[0_4px_16px_rgba(37,99,235,0.06)] backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
          <span className="text-[22px] font-bold tracking-[0.2em] uppercase text-[#2563EB]">
            Future of Pedagogy
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span className="text-[22px] font-semibold tracking-wider uppercase">
            Issue 04
          </span>
          <span className="text-slate-300">•</span>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
            <Logo className="w-6 h-6" />
          </div>
        </div>
      </header>

      {/* Main Quote Body */}
      <main className="relative z-10 my-auto pr-6">
        <blockquote className="text-[72px] font-black tracking-tight text-slate-900 leading-[1.14]">
          “Technology will never replace great educators. But in their hands, it{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-blue-600 to-sky-500">
            amplifies the spark
          </span>{" "}
          to every single learner.”
        </blockquote>

        {/* Attribution Block */}
        <div className="mt-10 flex items-center gap-6">
          <div className="w-1.5 h-16 bg-gradient-to-b from-[#2563EB] to-sky-400 rounded-full" />
          <div>
            <cite className="not-italic text-[32px] font-extrabold text-slate-900 tracking-tight block">
              Dr. Aris Thorne
            </cite>
            <span className="text-[26px] font-medium text-slate-500 mt-0.5 block">
              Director of Cognitive Systems, Institute for Future Learning
            </span>
          </div>
        </div>
      </main>

      {/* Editorial Footer */}
      <footer className="relative z-10 flex items-center justify-between border-t border-slate-200/90 pt-7 text-[24px] text-slate-500 font-medium">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-900">PosterStudio</span>
          <span className="text-slate-300">/</span>
          <span>Voices in Education</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-[#2563EB] font-semibold tracking-wide">
            @posterstudio.io
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-400">Curated Weekly</span>
        </div>
      </footer>
    </div>
  );
}
`,
  },
  {
    id: "product",
    name: "Product Promotion",
    category: "Commerce",
    description: "Aura Vitality nootropic drink offer with benefits and CTA.",
    width: 1080,
    height: 1350,
    code: `import { Logo } from "@poster/core";

export default function Poster() {
  return (
    <div className="w-[1080px] h-[1350px] relative overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#1E3A8A] to-[#2563EB] text-white flex flex-col justify-between p-[72px] font-sans antialiased box-border select-none">
      {/* Background Decorative Glows */}
      <div className="absolute -top-[140px] -right-[140px] w-[560px] h-[560px] rounded-full bg-sky-400/25 blur-[120px] pointer-events-none" />
      <div className="absolute top-[480px] -left-[160px] w-[500px] h-[500px] rounded-full bg-[#2563EB]/40 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[100px] right-[40px] w-[420px] h-[420px] rounded-full bg-cyan-300/20 blur-[110px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center p-2.5 shadow-lg">
            <Logo className="w-full h-full text-white" />
          </div>
          <span className="text-[26px] font-extrabold tracking-wider uppercase text-white/95">
            AURA VITALITY
          </span>
        </div>

        <div className="px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-inner">
          <span className="text-[22px] font-bold uppercase tracking-widest text-sky-200">
            ✦ New Formula Drop
          </span>
        </div>
      </header>

      {/* Hero Content Section */}
      <main className="relative z-10 flex flex-col gap-6 my-auto">
        {/* Category Label */}
        <div className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[24px] font-semibold tracking-widest uppercase text-sky-200">
            Smart Nootropic Hydration
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[78px] font-black leading-[1.06] tracking-tight text-white drop-shadow-sm max-w-[940px]">
          Pure Clarity. <br />
          <span className="bg-gradient-to-r from-sky-200 via-white to-cyan-200 bg-clip-text text-transparent">
            Zero Sugar. Zero Crash.
          </span>
        </h1>

        {/* Visual Showcase Card */}
        <div className="mt-2 w-full rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 shadow-2xl flex items-center justify-between gap-6">
          {/* Can / Product Visual Mock */}
          <div className="relative w-[280px] h-[320px] rounded-2xl bg-gradient-to-tr from-[#1D4ED8] via-[#2563EB] to-sky-400 p-1 flex items-center justify-center shadow-inner">
            <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-slate-900/60 via-blue-950/40 to-slate-950/70 border border-white/25 flex flex-col items-center justify-between p-6 text-center">
              <span className="text-[20px] uppercase font-bold tracking-widest text-cyan-300">
                Aura Spark
              </span>
              <div className="flex flex-col items-center">
                <span className="text-[52px] font-black tracking-tight text-white leading-none">
                  FOCUS
                </span>
                <span className="text-[22px] font-medium tracking-wide text-sky-200 mt-1">
                  Crisp Yuzu Citrus
                </span>
              </div>
              <div className="px-4 py-1.5 rounded-full bg-white/20 text-[20px] font-semibold text-white">
                355 mL • 12 FL OZ
              </div>
            </div>
          </div>

          {/* Bulleted Key Benefits */}
          <div className="flex-1 flex flex-col justify-center gap-4 pl-4">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[30px] font-semibold text-slate-100">
                120mg Clean Caffeine + L-Theanine
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[30px] font-semibold text-slate-100">
                0g Added Sugar & Only 5 Calories
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[30px] font-semibold text-slate-100">
                Full Spectrum Hydration Electrolytes
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[30px] font-semibold text-slate-100">
                Clinically Backed B-Vitamin Complex
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Offer & Call to Action Footer */}
      <footer className="relative z-10 flex flex-col gap-6 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between gap-6">
          {/* Price & Offer Area */}
          <div className="flex flex-col">
            <span className="text-[22px] font-bold uppercase tracking-wider text-sky-300">
              Introductory 12-Pack Offer
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-[68px] font-black leading-none text-white tracking-tight">
                $24.99
              </span>
              <span className="text-[34px] font-medium line-through text-white/50">
                $36.00
              </span>
              <span className="ml-2 px-3 py-1 rounded-md bg-cyan-400/20 border border-cyan-300/40 text-[22px] font-bold text-cyan-200">
                Save 30%
              </span>
            </div>
          </div>

          {/* Strong Primary CTA Button */}
          <div className="cursor-pointer bg-white hover:bg-sky-50 text-[#1E3A8A] px-10 py-6 rounded-2xl font-black text-[34px] tracking-tight shadow-2xl shadow-blue-900/50 flex items-center gap-3 transition-transform active:scale-[0.98]">
            <span>Claim Starter Pack</span>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>

        {/* Supporting Trust & Urgency Bar */}
        <div className="flex items-center justify-between text-[24px] text-sky-200/80 font-medium">
          <span>✓ Free Express Shipping on First Orders</span>
          <span>•</span>
          <span>100% Refreshment Guarantee</span>
          <span>•</span>
          <span>Cancel Anytime</span>
        </div>
      </footer>
    </div>
  );
}
`,
  },
  {
    id: "education",
    name: "Educational Poster",
    category: "Education",
    description: "LearnHub promo with feature cards and free CTA.",
    width: 1080,
    height: 1350,
    code: `export default function Poster() {
  return (
    <div className="relative flex h-[1350px] w-[1080px] overflow-hidden bg-white font-sans text-slate-900">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-sky-100" />

      <div className="absolute -right-[180px] -top-[170px] h-[560px] w-[560px] rounded-full bg-blue-600/10" />
      <div className="absolute -left-[220px] bottom-[170px] h-[520px] w-[520px] rounded-full bg-sky-400/10" />

      <div className="relative z-10 flex h-full w-full flex-col px-[76px] py-[68px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[18px]">
            <div className="flex h-[62px] w-[62px] items-center justify-center rounded-[18px] bg-blue-600 shadow-lg shadow-blue-600/20">
              <div className="h-[27px] w-[27px] rounded-full border-[7px] border-white" />
            </div>
            <div>
              <div className="text-[26px] font-bold tracking-tight text-blue-700">
                LEARNHUB
              </div>
              <div className="text-[20px] font-medium text-slate-500">
                Smarter learning, better results
              </div>
            </div>
          </div>

          <div className="rounded-full bg-blue-600 px-[25px] py-[12px] text-[21px] font-bold text-white">
            NEW
          </div>
        </div>

        <div className="mt-[88px] max-w-[900px]">
          <div className="mb-[26px] inline-flex rounded-full bg-blue-100 px-[25px] py-[12px] text-[22px] font-bold text-blue-700">
            YOUR NEXT LEVEL STARTS HERE
          </div>

          <h1 className="max-w-[900px] text-[82px] font-extrabold leading-[0.98] tracking-[-3px] text-slate-950">
            Learn faster.
            <br />
            <span className="text-blue-600">Achieve more.</span>
          </h1>

          <p className="mt-[34px] max-w-[780px] text-[32px] font-medium leading-[1.35] text-slate-600">
            Build practical skills with focused lessons, simple tools, and
            learning that fits your goals.
          </p>
        </div>

        <div className="mt-[58px] grid grid-cols-2 gap-[20px]">
          <div className="rounded-[28px] border border-blue-100 bg-white/90 p-[28px] shadow-[0_18px_45px_rgba(37,99,235,0.08)]">
            <div className="mb-[18px] flex h-[48px] w-[48px] items-center justify-center rounded-[15px] bg-blue-100 text-[25px] font-bold text-blue-600">
              ✓
            </div>
            <div className="text-[30px] font-bold text-slate-900">
              Learn at your pace
            </div>
            <div className="mt-[8px] text-[23px] leading-[1.3] text-slate-500">
              Short, focused lessons made for busy learners.
            </div>
          </div>

          <div className="rounded-[28px] border border-blue-100 bg-white/90 p-[28px] shadow-[0_18px_45px_rgba(37,99,235,0.08)]">
            <div className="mb-[18px] flex h-[48px] w-[48px] items-center justify-center rounded-[15px] bg-sky-100 text-[25px] font-bold text-blue-600">
              ★
            </div>
            <div className="text-[30px] font-bold text-slate-900">
              Practical skills
            </div>
            <div className="mt-[8px] text-[23px] leading-[1.3] text-slate-500">
              Learn skills you can apply immediately.
            </div>
          </div>

          <div className="rounded-[28px] border border-blue-100 bg-white/90 p-[28px] shadow-[0_18px_45px_rgba(37,99,235,0.08)]">
            <div className="mb-[18px] flex h-[48px] w-[48px] items-center justify-center rounded-[15px] bg-blue-100 text-[25px] font-bold text-blue-600">
              ↗
            </div>
            <div className="text-[30px] font-bold text-slate-900">
              Track your progress
            </div>
            <div className="mt-[8px] text-[23px] leading-[1.3] text-slate-500">
              Stay motivated and see how far you have come.
            </div>
          </div>

          <div className="rounded-[28px] border border-blue-100 bg-white/90 p-[28px] shadow-[0_18px_45px_rgba(37,99,235,0.08)]">
            <div className="mb-[18px] flex h-[48px] w-[48px] items-center justify-center rounded-[15px] bg-sky-100 text-[25px] font-bold text-blue-600">
              ♢
            </div>
            <div className="text-[30px] font-bold text-slate-900">
              Learn anywhere
            </div>
            <div className="mt-[8px] text-[23px] leading-[1.3] text-slate-500">
              Access your learning whenever you need it.
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-[40px]">
          <div>
            <div className="text-[22px] font-semibold uppercase tracking-[2px] text-slate-500">
              Start today
            </div>
            <div className="mt-[4px] text-[64px] font-extrabold leading-none text-blue-600">
              FREE
            </div>
            <div className="mt-[8px] text-[22px] font-medium text-slate-500">
              No complicated setup. Just start learning.
            </div>
          </div>

          <div className="flex h-[92px] items-center rounded-[24px] bg-blue-600 px-[42px] text-[34px] font-bold text-white shadow-[0_18px_35px_rgba(37,99,235,0.28)]">
            START LEARNING →
          </div>
        </div>
      </div>
    </div>
  );
}
`,
  },
  {
    id: "financial",
    name: "Financial Report",
    category: "Data",
    description: "Q1 executive review with KPIs, charts, and variance table.",
    width: 2480,
    height: 3508,
    code: `export default function Poster() {
  const rows = [
    { name: "Tuition & Subscriptions", actual: "$1.42M", budget: "$1.35M", variance: "+5.2%" },
    { name: "Enterprise Programs", actual: "$820K", budget: "$780K", variance: "+5.1%" },
    { name: "Content & Services", actual: "$310K", budget: "$335K", variance: "-7.5%" },
    { name: "Other Income", actual: "$95K", budget: "$85K", variance: "+11.8%" },
  ];

  const bars = [
    { label: "Q1", value: 68 },
    { label: "Q2", value: 76 },
    { label: "Q3", value: 84 },
    { label: "Q4", value: 94 },
  ];

  const kpis = [
    { label: "Total Revenue", value: "$2.65M", change: "+8.4%", note: "vs. Q1 2025" },
    { label: "Gross Margin", value: "71.8%", change: "+2.6 pts", note: "vs. prior year" },
    { label: "Active Users", value: "184K", change: "+14.2%", note: "year over year" },
    { label: "EBITDA", value: "$612K", change: "+11.7%", note: "vs. Q1 2025" },
  ];

  const mix = [
    ["Tuition & Subscriptions", "54%", "#2563EB"],
    ["Enterprise Programs", "31%", "#38BDF8"],
    ["Content & Services", "12%", "#93C5FD"],
    ["Other Income", "3%", "#CBD5E1"],
  ];

  const insights = [
    {
      type: "blue",
      eyebrow: "Growth Driver",
      title: "Enterprise Programs",
      body: "Strong institutional demand lifted enterprise revenue above plan.",
    },
    {
      type: "green",
      eyebrow: "Profitability",
      title: "Margin Expansion",
      body: "Gross margin improved by 2.6 points through better product mix and delivery efficiency.",
    },
    {
      type: "gray",
      eyebrow: "Watch Item",
      title: "Content & Services",
      body: "Revenue is below budget; management should review pipeline, pricing and delivery timing.",
    },
  ];

  return (
    <>
      <style>{\`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
        }

        body {
          background: #ffffff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .poster {
          width: 100%;
          min-height: 100vh;
          background: #ffffff;
          color: #0F172A;
          overflow: hidden;
          line-height: 1.2;
        }

        /* =========================
           HEADER
        ========================= */

        .header {
          position: relative;
          overflow: hidden;
          background: linear-gradient(
            135deg,
            #2563EB 0%,
            #2563EB 48%,
            #38BDF8 100%
          );
          color: #ffffff;
          padding:
            clamp(32px, 5vw, 100px)
            clamp(20px, 6vw, 150px)
            clamp(28px, 4vw, 80px);
        }

        .header-blob1,
        .header-blob2 {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          pointer-events: none;
        }

        .header-blob1 {
          right: -8%;
          top: -15%;
          width: clamp(160px, 30vw, 480px);
          height: clamp(160px, 30vw, 480px);
        }

        .header-blob2 {
          right: 10%;
          bottom: -40%;
          width: clamp(180px, 32vw, 520px);
          height: clamp(180px, 32vw, 520px);
        }

        .header-inner {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: clamp(16px, 3vw, 40px);
        }

        .header-eyebrow {
          font-size: clamp(13px, 1.65vw, 26px);
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: clamp(8px, 1.5vw, 20px);
        }

        .header-title {
          font-size: clamp(46px, 9.5vw, 118px);
          font-weight: 900;
          line-height: 0.98;
          letter-spacing: -0.03em;
        }

        .header-subtitle {
          margin-top: clamp(8px, 1.5vw, 20px);
          font-size: clamp(19px, 3vw, 50px);
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
        }

        .header-badge {
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.15);
          border-radius: clamp(12px, 2vw, 28px);
          padding:
            clamp(12px, 2vw, 28px)
            clamp(16px, 2.5vw, 40px);
          text-align: right;
          white-space: nowrap;
          backdrop-filter: blur(4px);
        }

        .header-badge-label {
          font-size: clamp(12px, 1.3vw, 21px);
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.75);
        }

        .header-badge-value {
          font-size: clamp(28px, 4.7vw, 66px);
          font-weight: 700;
          margin-top: 4px;
        }

        .header-badge-sub {
          font-size: clamp(13px, 1.45vw, 24px);
          color: rgba(255, 255, 255, 0.8);
          margin-top: 2px;
        }

        .header-footer {
          position: relative;
          margin-top: clamp(20px, 3vw, 48px);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .header-footer-text {
          min-width: 0;
          font-size: clamp(14px, 1.65vw, 28px);
          color: rgba(255, 255, 255, 0.85);
        }

        .confidential {
          flex-shrink: 0;
          background: #ffffff;
          color: #2563EB;
          border-radius: 999px;
          padding:
            clamp(6px, 0.8vw, 12px)
            clamp(14px, 1.8vw, 28px);
          font-size: clamp(13px, 1.45vw, 24px);
          font-weight: 700;
          white-space: nowrap;
        }

        /* =========================
           SECTIONS
        ========================= */

        .section {
          padding:
            clamp(24px, 4vw, 70px)
            clamp(20px, 6vw, 150px)
            0;
        }

        .section-head {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: clamp(20px, 3vw, 42px);
        }

        .section-title {
          font-size: clamp(28px, 4.7vw, 70px);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.025em;
        }

        .section-sub {
          font-size: clamp(14px, 1.65vw, 30px);
          color: #64748B;
          margin-top: 8px;
          line-height: 1.35;
        }

        .section-rule {
          height: 6px;
          width: clamp(80px, 15vw, 260px);
          background: #2563EB;
          border-radius: 999px;
          flex-shrink: 0;
          margin-bottom: 4px;
        }

        /* =========================
           KPI
        ========================= */

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(min(100%, 200px), 1fr)
          );
          gap: clamp(12px, 2vw, 28px);
        }

        .kpi-card {
          min-width: 0;
          border: 1px solid #E2E8F0;
          border-radius: clamp(16px, 2.5vw, 32px);
          background: #ffffff;
          padding: clamp(16px, 2.5vw, 40px);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.07);
        }

        .kpi-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .kpi-label {
          min-width: 0;
          font-size: clamp(15px, 1.75vw, 32px);
          font-weight: 600;
          color: #475569;
        }

        .kpi-dot {
          width: clamp(10px, 1.2vw, 18px);
          height: clamp(10px, 1.2vw, 18px);
          border-radius: 50%;
          background: #2563EB;
          flex-shrink: 0;
        }

        .kpi-dot--sky {
          background: #38BDF8;
        }

        .kpi-value {
          margin-top: clamp(12px, 2vw, 28px);
          font-size: clamp(32px, 7vw, 104px);
          font-weight: 900;
          line-height: 0.98;
          letter-spacing: -0.04em;
          white-space: nowrap;
        }

        .kpi-footer {
          margin-top: clamp(10px, 1.5vw, 22px);
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: clamp(8px, 1vw, 14px);
        }

        .kpi-badge {
          background: #DCFCE7;
          color: #16A34A;
          border-radius: 999px;
          padding:
            clamp(4px, 0.6vw, 9px)
            clamp(10px, 1.2vw, 18px);
          font-size: clamp(13px, 1.4vw, 26px);
          font-weight: 700;
          white-space: nowrap;
        }

        .kpi-note {
          font-size: clamp(13px, 1.3vw, 24px);
          color: #64748B;
          white-space: nowrap;
        }

        /* =========================
           CHARTS
        ========================= */

        .charts-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(12px, 2vw, 36px);
        }

        @media (min-width: 700px) {
          .charts-row {
            grid-template-columns: 1.3fr 0.7fr;
          }
        }

        .chart-card {
          min-width: 0;
          border: 1px solid #E2E8F0;
          border-radius: clamp(16px, 2.5vw, 32px);
          background: #ffffff;
          padding: clamp(16px, 2.5vw, 48px);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
        }

        .chart-card--muted {
          background: #F8FAFC;
        }

        .chart-head {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .chart-title {
          font-size: clamp(23px, 3.5vw, 60px);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.025em;
        }

        .chart-sub {
          font-size: clamp(14px, 1.55vw, 28px);
          color: #64748B;
          margin-top: 6px;
          line-height: 1.35;
        }

        .chart-tag {
          flex-shrink: 0;
          background: #EFF6FF;
          color: #2563EB;
          border-radius: clamp(8px, 1vw, 16px);
          padding:
            clamp(5px, 0.7vw, 12px)
            clamp(10px, 1.2vw, 22px);
          font-size: clamp(13px, 1.4vw, 26px);
          font-weight: 700;
          white-space: nowrap;
        }

        /* =========================
           BAR CHART
        ========================= */

        .bar-wrap {
          margin-top: clamp(24px, 3.5vw, 55px);
          display: flex;
          align-items: flex-end;
          gap: clamp(8px, 2vw, 36px);
          border-bottom: 3px solid #CBD5E1;
          padding:
            0
            clamp(8px, 2vw, 24px)
            clamp(8px, 1vw, 16px);
          height: clamp(160px, 28vw, 380px);
        }

        .bar-col {
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          height: 100%;
          justify-content: flex-end;
        }

        .bar-pct {
          font-size: clamp(13px, 1.65vw, 28px);
          font-weight: 700;
          color: #475569;
          margin-bottom: 6px;
        }

        .bar-rect {
          width: clamp(20px, 5vw, 80px);
          border-radius:
            clamp(6px, 1vw, 18px)
            clamp(6px, 1vw, 18px)
            0
            0;
        }

        .bar-label {
          margin-top: clamp(6px, 1vw, 16px);
          font-size: clamp(14px, 1.65vw, 30px);
          font-weight: 600;
          color: #475569;
        }

        .bar-summary {
          margin-top: clamp(16px, 2vw, 32px);
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(8px, 1.5vw, 20px);
        }

        .bar-summary-label {
          font-size: clamp(12px, 1.2vw, 24px);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #94A3B8;
        }

        .bar-summary-value {
          font-size: clamp(19px, 2.6vw, 42px);
          font-weight: 700;
          margin-top: 4px;
          line-height: 1.1;
          white-space: nowrap;
        }

        /* =========================
           DONUT
        ========================= */

        .donut-wrap {
          margin-top: clamp(24px, 3.5vw, 55px);
          display: flex;
          justify-content: center;
        }

        .donut {
          position: relative;
          width: clamp(140px, 24vw, 280px);
          height: clamp(140px, 24vw, 280px);
          border-radius: 50%;
          background: conic-gradient(
            #2563EB 0deg 193deg,
            #38BDF8 193deg 304deg,
            #93C5FD 304deg 346deg,
            #CBD5E1 346deg 360deg
          );
        }

        .donut-hole {
          position: absolute;
          inset: 24%;
          border-radius: 50%;
          background: #F8FAFC;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .donut-inner-label {
          font-size: clamp(9px, 1.25vw, 20px);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #94A3B8;
          text-align: center;
        }

        .donut-inner-value {
          font-size: clamp(16px, 3.4vw, 50px);
          font-weight: 900;
          color: #0F172A;
          margin-top: 2px;
          line-height: 1;
          white-space: nowrap;
        }

        /* =========================
           MIX LEGEND
        ========================= */

        .mix-legend {
          margin-top: clamp(20px, 3vw, 48px);
          display: flex;
          flex-direction: column;
          gap: clamp(10px, 1.5vw, 22px);
        }

        .mix-row {
          min-width: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: clamp(8px, 1vw, 16px);
        }

        .mix-dot-name {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: clamp(8px, 1vw, 14px);
        }

        .mix-dot {
          width: clamp(10px, 1.2vw, 18px);
          height: clamp(10px, 1.2vw, 18px);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .mix-name {
          min-width: 0;
          font-size: clamp(14px, 1.65vw, 28px);
          font-weight: 500;
          color: #475569;
          line-height: 1.25;
        }

        .mix-pct {
          flex-shrink: 0;
          font-size: clamp(15px, 1.75vw, 30px);
          font-weight: 700;
          color: #0F172A;
        }

        /* =========================
           TABLE
        ========================= */

        .table-card {
          min-width: 0;
          border: 1px solid #E2E8F0;
          border-radius: clamp(16px, 2.5vw, 32px);
          background: #ffffff;
          padding: clamp(16px, 2.5vw, 48px);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
        }

        .table-head-row {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: clamp(16px, 2vw, 36px);
        }

        .above-plan {
          flex-shrink: 0;
          background: #DCFCE7;
          color: #16A34A;
          border-radius: 999px;
          padding:
            clamp(5px, 0.7vw, 10px)
            clamp(12px, 1.5vw, 24px);
          font-size: clamp(13px, 1.4vw, 26px);
          font-weight: 700;
          white-space: nowrap;
        }

        .table-wrap {
          width: 100%;
          overflow: hidden;
          border-radius: clamp(10px, 1.5vw, 20px);
          border: 1px solid #E2E8F0;
        }

        .tbl {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }

        .tbl-header {
          background: #EFF6FF;
        }

        .tbl th,
        .tbl td {
          padding:
            clamp(10px, 1.5vw, 24px)
            clamp(10px, 1.5vw, 26px);
          font-size: clamp(14px, 1.65vw, 30px);
          line-height: 1.2;
        }

        .tbl th:first-child,
        .tbl td:first-child {
          width: 45%;
        }

        .tbl th:not(:first-child),
        .tbl td:not(:first-child) {
          width: 18.33%;
          text-align: right;
        }

        .tbl th {
          color: #1E3A8A;
          font-weight: 700;
          font-size: clamp(14px, 1.65vw, 32px);
        }

        .tbl td {
          color: #334155;
          font-weight: 500;
        }

        .tbl td:first-child {
          white-space: nowrap;
        }

        .tbl td.actual {
          font-weight: 700;
          color: #0F172A;
        }

        .tbl td.budget {
          color: #64748B;
        }

        .tbl td.var-pos {
          font-weight: 700;
          color: #16A34A;
        }

        .tbl td.var-neg {
          font-weight: 700;
          color: #DC2626;
        }

        .tbl-total {
          background: #F8FAFC;
        }

        .tbl-total td {
          font-weight: 800;
          font-size: clamp(15px, 1.75vw, 32px);
        }

        .tbl-total td.total-label {
          color: #0F172A;
        }

        .tbl-total td.total-actual {
          color: #2563EB;
        }

        .tbl-total td.total-budget {
          color: #475569;
        }

        .tbl-total td.total-var {
          color: #16A34A;
        }

        .tbl tr:not(:last-child) td {
          border-bottom: 1px solid #E2E8F0;
        }

        /* =========================
           INSIGHTS
           Fixed bottom-card layout
        ========================= */

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(12px, 2vw, 28px);
        }

        .insight-card {
          min-width: 0;
          min-height: clamp(150px, 12vw, 220px);
          border-radius: clamp(14px, 2vw, 28px);
          padding:
            clamp(16px, 2vw, 32px)
            clamp(18px, 2.2vw, 36px);
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          overflow: hidden;
        }

        .insight-card--blue {
          background: #EFF6FF;
        }

        .insight-card--green {
          background: #F0FDF4;
        }

        .insight-card--gray {
          background: #F8FAFC;
        }

        .insight-eyebrow {
          font-size: clamp(11px, 1.15vw, 20px);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          line-height: 1.15;
          white-space: nowrap;
        }

        .insight-eyebrow--blue {
          color: #2563EB;
        }

        .insight-eyebrow--green {
          color: #16A34A;
        }

        .insight-eyebrow--gray {
          color: #64748B;
        }

        .insight-title {
          margin-top: clamp(7px, 0.8vw, 12px);
          font-size: clamp(18px, 2.1vw, 34px);
          font-weight: 700;
          color: #0F172A;
          line-height: 1.12;
          letter-spacing: -0.015em;
        }

        .insight-body {
          margin-top: clamp(7px, 0.8vw, 12px);
          font-size: clamp(12px, 1.35vw, 22px);
          font-weight: 400;
          color: #475569;
          line-height: 1.38;
          overflow-wrap: break-word;
          word-break: normal;
          max-width: 100%;
        }

        /* =========================
           FOOTER
        ========================= */

        .footer {
          margin-top: clamp(26px, 4vw, 60px);
          border-top: 2px solid #E2E8F0;
          padding:
            clamp(14px, 1.8vw, 26px)
            clamp(20px, 6vw, 150px)
            clamp(20px, 2.5vw, 38px);
        }

        .footer-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 8px 24px;
        }

        .footer-text {
          min-width: 0;
          font-size: clamp(10px, 1.05vw, 18px);
          color: #64748B;
          line-height: 1.3;
        }

        .footer-note {
          max-width: 100%;
          font-size: clamp(9px, 0.95vw, 16px);
          color: #94A3B8;
          margin-top: 6px;
          line-height: 1.35;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 900px) {
          .insights-grid {
            grid-template-columns: 1fr;
          }

          .insight-card {
            min-height: auto;
          }
        }

        @media (max-width: 699px) {
          .header-inner {
            flex-direction: column;
          }

          .header-badge {
            text-align: left;
          }

          .section-rule {
            display: none;
          }

          .kpi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .insights-grid {
            grid-template-columns: 1fr;
          }

          .tbl th,
          .tbl td {
            padding:
              clamp(8px, 1.8vw, 14px)
              clamp(7px, 1.5vw, 12px);
            font-size: clamp(11px, 2vw, 16px);
          }

          .tbl th {
            font-size: clamp(11px, 2vw, 17px);
          }

          .tbl td:first-child {
            white-space: normal;
          }
        }

        @media (max-width: 460px) {
          .kpi-grid {
            grid-template-columns: 1fr;
          }

          .bar-summary {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .bar-summary-value {
            font-size: 20px;
          }

          .footer-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      \`}</style>

      <div className="poster">

        {/* HEADER */}
        <div className="header">
          <div className="header-blob1" />
          <div className="header-blob2" />

          <div className="header-inner">
            <div>
              <div className="header-eyebrow">
                Financial Performance Report
              </div>

              <div className="header-title">
                EduCore
              </div>

              <div className="header-subtitle">
                Q1 2026 Executive Financial Review
              </div>
            </div>

            <div className="header-badge">
              <div className="header-badge-label">
                Reporting Period
              </div>

              <div className="header-badge-value">
                Q1 2026
              </div>

              <div className="header-badge-sub">
                January — March 2026
              </div>
            </div>
          </div>

          <div className="header-footer">
            <div className="header-footer-text">
              Board-level summary of revenue, growth, users and operating performance
            </div>

            <div className="confidential">
              CONFIDENTIAL
            </div>
          </div>
        </div>

        {/* EXECUTIVE SNAPSHOT */}
        <div className="section">
          <div className="section-head">
            <div>
              <div className="section-title">
                Executive Snapshot
              </div>

              <div className="section-sub">
                Core financial and operating indicators for the quarter
              </div>
            </div>

            <div className="section-rule" />
          </div>

          <div className="kpi-grid">
            {kpis.map((item, i) => (
              <div className="kpi-card" key={item.label}>
                <div className="kpi-card-head">
                  <div className="kpi-label">
                    {item.label}
                  </div>

                  <div
                    className={\`kpi-dot\${
                      i === 1 ? " kpi-dot--sky" : ""
                    }\`}
                  />
                </div>

                <div className="kpi-value">
                  {item.value}
                </div>

                <div className="kpi-footer">
                  <span className="kpi-badge">
                    {item.change}
                  </span>

                  <span className="kpi-note">
                    {item.note}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHARTS */}
        <div className="section">
          <div className="charts-row">

            {/* REVENUE TREND */}
            <div className="chart-card">
              <div className="chart-head">
                <div>
                  <div className="chart-title">
                    Revenue Trend
                  </div>

                  <div className="chart-sub">
                    Quarterly revenue progression
                  </div>
                </div>

                <div className="chart-tag">
                  +8.4% YoY
                </div>
              </div>

              <div className="bar-wrap">
                {bars.map((bar, i) => (
                  <div className="bar-col" key={bar.label}>
                    <div className="bar-pct">
                      {bar.value}%
                    </div>

                    <div
                      className="bar-rect"
                      style={{
                        height: \`\${bar.value}%\`,
                        background:
                          i === bars.length - 1
                            ? "linear-gradient(180deg,#38BDF8 0%,#2563EB 100%)"
                            : "linear-gradient(180deg,#93C5FD 0%,#2563EB 100%)",
                      }}
                    />

                    <div className="bar-label">
                      {bar.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bar-summary">
                {[
                  ["Q1", "$2.65M"],
                  ["Run Rate", "$10.8M"],
                  ["Target", "$10.2M"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="bar-summary-label">
                      {label}
                    </div>

                    <div className="bar-summary-value">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REVENUE MIX */}
            <div className="chart-card chart-card--muted">
              <div className="chart-title">
                Revenue Mix
              </div>

              <div className="chart-sub">
                Contribution by business line
              </div>

              <div className="donut-wrap">
                <div className="donut">
                  <div className="donut-hole">
                    <div>
                      <div className="donut-inner-label">
                        Revenue
                      </div>

                      <div className="donut-inner-value">
                        $2.65M
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mix-legend">
                {mix.map(([label, value, color]) => (
                  <div className="mix-row" key={label}>
                    <div className="mix-dot-name">
                      <div
                        className="mix-dot"
                        style={{ backgroundColor: color }}
                      />

                      <div className="mix-name">
                        {label}
                      </div>
                    </div>

                    <div className="mix-pct">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* REVENUE PERFORMANCE */}
        <div className="section">
          <div className="table-card">

            <div className="table-head-row">
              <div>
                <div className="section-title">
                  Revenue Performance
                </div>

                <div className="section-sub">
                  Actual performance compared with quarterly budget
                </div>
              </div>

              <div className="above-plan">
                3 of 4 lines above plan
              </div>
            </div>

            <div className="table-wrap">
              <table className="tbl">
                <thead className="tbl-header">
                  <tr>
                    <th>Revenue Category</th>
                    <th>Actual</th>
                    <th>Budget</th>
                    <th>Variance</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row) => (
                    <tr key={row.name}>
                      <td>{row.name}</td>

                      <td className="actual">
                        {row.actual}
                      </td>

                      <td className="budget">
                        {row.budget}
                      </td>

                      <td
                        className={
                          row.variance.startsWith("+")
                            ? "var-pos"
                            : "var-neg"
                        }
                      >
                        {row.variance}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className="tbl-total">
                  <tr>
                    <td className="total-label">
                      Total Revenue
                    </td>

                    <td className="total-actual">
                      $2.65M
                    </td>

                    <td className="total-budget">
                      $2.55M
                    </td>

                    <td className="total-var">
                      +3.9%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

          </div>
        </div>

        {/* INSIGHTS */}
        <div className="section">
          <div className="insights-grid">
            {insights.map((item) => (
              <div
                key={item.title}
                className={\`insight-card insight-card--\${item.type}\`}
              >
                <div
                  className={\`insight-eyebrow insight-eyebrow--\${item.type}\`}
                >
                  {item.eyebrow}
                </div>

                <div className="insight-title">
                  {item.title}
                </div>

                <div className="insight-body">
                  {item.body}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer">
          <div className="footer-row">
            <div className="footer-text">
              Source: Management accounts • Internal financial reporting
            </div>

            <div className="footer-text">
              Prepared for Board Review • 03 April 2026
            </div>
          </div>

          <div className="footer-note">
            Figures are presented in USD and may include rounding differences.
            This report is for internal management use only.
          </div>
        </div>

      </div>
    </>
  );
}
`,
  },
  {
    id: "cambodia",
    name: "Cambodia Themed",
    category: "Featured",
    description: "25 provinces across 4 geographic zones with key metrics.",
    width: 1080,
    height: 1350,
    code: `export default function Poster() {
  return (
    <div className="w-[1080px] h-[1350px] relative overflow-hidden bg-gradient-to-b from-[#1E3A8A] via-[#2563EB] to-[#1D4ED8] text-white px-12 pt-10 pb-12 flex flex-col justify-between font-sans select-none box-border">

      {/* Background Subtle Geometry / Glow */}
      <div className="absolute -top-24 -right-24 w-[460px] h-[460px] bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-[480px] h-[480px] bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* 1. HEADER SECTION */}
      <div className="relative z-10 flex flex-col gap-2">

        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-300 animate-pulse" />
            <span className="text-[19px] font-bold tracking-widest text-sky-100 uppercase">
              Administrative & Regional Guide • ភូមិសាស្ត្រ
            </span>
      </div>

          <span className="text-[20px] font-semibold text-sky-200 tracking-wide">
            Kingdom of Cambodia
          </span>
        </div>

        <h1 className="text-[72px] font-black tracking-tight leading-[1.02] text-white drop-shadow-sm mt-1">
          CAMBODIA'S <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-white to-sky-300">
            25 PROVINCES
          </span>
        </h1>

        <p className="text-[24px] text-blue-100 font-normal leading-snug max-w-[950px]">
          A structured breakdown of Cambodia's 1 autonomous municipality and 24 provinces across 4 key geographic zones.
        </p>
      </div>


      {/* 2. TOP KEY METRICS ROW */}
      <div className="relative z-10 grid grid-cols-3 gap-5">

        {/* Metric 1 */}
        <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-xl flex flex-col justify-between border border-white">
          <div className="text-[17px] font-black tracking-wider uppercase text-blue-700">
            Total Divisions
          </div>

          <div className="text-[82px] font-black leading-none text-[#1D4ED8] my-1">
            25
          </div>

          <div className="text-[18px] font-bold text-slate-600 leading-tight">
            1 Capital + 24 Provinces
          </div>
        </div>


        {/* Metric 2 */}
        <div className="bg-white/15 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/20 flex flex-col justify-between">
          <div className="text-[17px] font-black tracking-wider uppercase text-sky-200">
            Geographic Zones
          </div>

          <div className="text-[82px] font-black leading-none text-white my-1">
            4
          </div>

          <div className="text-[18px] font-semibold text-sky-100 leading-tight">
            Lowlands • Tonle Sap • Coast • Highlands
          </div>
        </div>


        {/* Metric 3 */}
        <div className="bg-white/15 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/20 flex flex-col justify-between">
          <div className="text-[17px] font-black tracking-wider uppercase text-sky-200">
            National Land Area
          </div>

          <div className="text-[82px] font-black leading-none text-sky-300 my-1">
            181K
          </div>

          <div className="text-[18px] font-semibold text-sky-100 leading-tight">
            km² • 69,898 sq mi
          </div>
        </div>

      </div>


      {/* 3. MAIN 4 GEOGRAPHIC REGIONS (2x2 GRID) */}
      <div className="relative z-10 flex flex-col gap-2.5">

        <div className="flex items-center justify-between">
          <h2 className="text-[38px] font-extrabold tracking-tight text-white leading-none">
            Provincial Distribution by Zone
          </h2>

          <span className="text-[19px] font-medium text-sky-200">
            National Institute of Statistics (NIS)
          </span>
        </div>


        <div className="grid grid-cols-2 gap-3.5">

          {/* Zone 1: Central Plains */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex flex-col justify-between">

            <div className="flex items-start justify-between">
              <div>
                <span className="text-[17px] font-bold text-sky-300 uppercase tracking-wider">
                  Zone 01 • វាលរាប
                </span>

                <h3 className="text-[25px] font-black text-white leading-tight">
                  Central Lowland Plains
                </h3>
              </div>

              <span className="text-[40px] font-black text-sky-200 leading-none">
                8
              </span>
            </div>

            <p className="text-[19px] text-blue-100 mt-1.5 leading-snug">
              <strong className="text-white">Provinces:</strong> Phnom Penh, Kandal, Kampong Cham, Tbong Khmum, Prey Veng, Svay Rieng, Takeo, Kampong Chhnang
            </p>

            <div className="mt-2 pt-1.5 border-t border-white/15 flex justify-between text-[17px] text-sky-200 font-medium">
              <span>High Population Density</span>
              <span>Economic Heart</span>
            </div>

          </div>


          {/* Zone 2: Tonle Sap Basin */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex flex-col justify-between">

            <div className="flex items-start justify-between">
              <div>
                <span className="text-[17px] font-bold text-sky-300 uppercase tracking-wider">
                  Zone 02 • បឹងទន្លេសាប
                </span>

                <h3 className="text-[25px] font-black text-white leading-tight">
                  Tonle Sap Basin
                </h3>
              </div>

              <span className="text-[40px] font-black text-sky-200 leading-none">
                5
              </span>
            </div>

            <p className="text-[19px] text-blue-100 mt-1.5 leading-snug">
              <strong className="text-white">Provinces:</strong> Siem Reap, Battambang, Pursat, Kampong Thom, Banteay Meanchey
            </p>

            <div className="mt-2 pt-1.5 border-t border-white/15 flex justify-between text-[17px] text-sky-200 font-medium">
              <span>National Rice Bowl</span>
              <span>Angkor Heritage</span>
            </div>

          </div>


          {/* Zone 3: Coastal Region */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex flex-col justify-between">

            <div className="flex items-start justify-between">
              <div>
                <span className="text-[17px] font-bold text-sky-300 uppercase tracking-wider">
                  Zone 03 • ឆ្នេរសមុទ្រ
                </span>

                <h3 className="text-[25px] font-black text-white leading-tight">
                  Gulf Coastline Zone
                </h3>
              </div>

              <span className="text-[40px] font-black text-sky-200 leading-none">
                4
              </span>
            </div>

            <p className="text-[19px] text-blue-100 mt-1.5 leading-snug">
              <strong className="text-white">Provinces:</strong> Preah Sihanouk, Kampot, Koh Kong, Kep
            </p>

            <div className="mt-2 pt-1.5 border-t border-white/15 flex justify-between text-[17px] text-sky-200 font-medium">
              <span>440 km Coastline</span>
              <span>Deep-Sea Ports</span>
            </div>

          </div>


          {/* Zone 4: Plateaus & Highlands */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex flex-col justify-between">

            <div className="flex items-start justify-between">
              <div>
                <span className="text-[17px] font-bold text-sky-300 uppercase tracking-wider">
                  Zone 04 • ភ្នំ និងខ្ពង់រាប
                </span>

                <h3 className="text-[25px] font-black text-white leading-tight">
                  Plateau & Highlands
                </h3>
              </div>

              <span className="text-[40px] font-black text-sky-200 leading-none">
                8
              </span>
            </div>

            <p className="text-[19px] text-blue-100 mt-1.5 leading-snug">
              <strong className="text-white">Provinces:</strong> Mondulkiri, Ratanakiri, Kratie, Stung Treng, Preah Vihear, Oddar Meanchey, Kampong Speu, Pailin
            </p>

            <div className="mt-2 pt-1.5 border-t border-white/15 flex justify-between text-[17px] text-sky-200 font-medium">
              <span>Ecotourism & Forest</span>
              <span>Agro-Industry</span>
            </div>

          </div>

        </div>
      </div>


      {/* 4. STRATEGIC HUB SPOTLIGHTS */}
      <div className="relative z-10 bg-slate-900/35 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex flex-col gap-2">

        <div className="text-[17px] font-bold uppercase tracking-wider text-sky-300">
          Primary Provincial Economic Anchors
        </div>

        <div className="grid grid-cols-3 gap-3">

          {/* Phnom Penh */}
          <div className="bg-white/10 rounded-xl p-3 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="text-[22px] font-extrabold text-white">
                Phnom Penh
              </div>

              <div className="text-[17px] text-sky-200 font-medium">
                Autonomous Capital
              </div>
            </div>

            <div className="text-[18px] text-blue-100 mt-1 leading-snug">
              Hub for national governance, finance, and services (~2.3M pop.).
            </div>
          </div>


          {/* Siem Reap */}
          <div className="bg-white/10 rounded-xl p-3 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="text-[22px] font-extrabold text-white">
                Siem Reap
              </div>

              <div className="text-[17px] text-sky-200 font-medium">
                Cultural Hub
              </div>
            </div>

            <div className="text-[18px] text-blue-100 mt-1 leading-snug">
              Gateway to Angkor temples; primary international tourism base.
            </div>
          </div>


          {/* Preah Sihanouk */}
          <div className="bg-white/10 rounded-xl p-3 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="text-[22px] font-extrabold text-white">
                Preah Sihanouk
              </div>

              <div className="text-[17px] text-sky-200 font-medium">
                Maritime Gateway
              </div>
            </div>

            <div className="text-[18px] text-blue-100 mt-1 leading-snug">
              Kingdom's deep-sea commercial port and multi-purpose SEZ.
            </div>
          </div>

        </div>
      </div>


      {/* 5. FOOTER SECTION WITH COMFORTABLE BOTTOM MARGIN */}
      <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/20 text-[18px] text-blue-200">

        <div className="font-semibold">
          Source: Ministry of Interior & National Institute of Statistics (NIS)
        </div>

        <div className="flex items-center gap-3 text-sky-300 font-medium">
          <span>Cambodia Geography Series</span>
          <span>•</span>
          <span>Updated Overview</span>
        </div>

      </div>

    </div>
  );
}
`,
  },
];
