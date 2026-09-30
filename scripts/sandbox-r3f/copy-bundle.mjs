import { cpSync, mkdirSync, rmSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const src = path.join(root, "dist-sandbox-r3f");
const dest = path.join(root, "public/sandbox/vendor/r3f");

if (!existsSync(src)) {
  console.error("dist-sandbox-r3f missing — run vite build first");
  process.exit(1);
}

mkdirSync(dest, { recursive: true });
for (const name of readdirSync(dest)) {
  rmSync(path.join(dest, name), { recursive: true, force: true });
}
cpSync(src, dest, { recursive: true });
console.log(`Copied ${readdirSync(dest).length} file(s) → public/sandbox/vendor/r3f`);
