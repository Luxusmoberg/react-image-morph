// Vite config for the showcase site (separate from lib build)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  root: "site",
  base: "/react-image-morph/",
  build: {
    outDir: "../dist-site",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      react: resolve(__dirname, "node_modules/react"),
      "react-dom": resolve(__dirname, "node_modules/react-dom"),
      "react-image-morph": resolve(__dirname, "src/index.ts"),
    },
  },
});