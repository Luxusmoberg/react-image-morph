import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  root: "demo",
  build: {
    outDir: "../dist-demo",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      react: resolve(__dirname, "node_modules/react"),
      "react-dom": resolve(__dirname, "node_modules/react-dom"),
    },
  },
});

// Separate config for lib build (run via `vite build --config vite.lib.config.ts`)
export const libConfig = {
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
    },
    outDir: "dist",
    emptyOutDir: true,
  },
};