import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    outDir: "dist",
    dts: true,
    clean: true,
    splitting: false,
    sourcemap: true,
    minify: false,
    treeshake: true,
    outExtension({ format }) {
      return {
        js: ".mjs",
        dts: ".d.mts",
      };
    },
  },
  {
    entry: ["src/index.ts"],
    format: ["cjs"],
    outDir: "dist",
    dts: true,
    clean: false,
    splitting: false,
    sourcemap: true,
    minify: false,
    treeshake: true,
    outExtension({ format }) {
      return {
        js: ".cjs",
        dts: ".d.cts",
      };
    },
  },
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    outDir: "dist",
    dts: true,
    clean: false,
    splitting: false,
    sourcemap: true,
    minify: false,
    treeshake: true,
    outExtension({ format }) {
      return {
        js: ".js",
        dts: ".d.ts",
      };
    },
  },
]);
