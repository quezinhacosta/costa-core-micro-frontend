import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  onSuccess: async () => {
    mkdirSync(resolve(__dirname, "dist"), { recursive: true });
    copyFileSync(resolve(__dirname, "src/tokens.css"), resolve(__dirname, "dist/tokens.css"));
  },
});
