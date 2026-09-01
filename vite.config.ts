import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(process.cwd(), "src") },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        // Monaco and TipTap are both large and both only needed once you open
        // a question, so they ride in their own chunks instead of the entry.
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("monaco-editor")) return "monaco";
          if (id.includes("@tiptap") || id.includes("prosemirror")) return "editor";
          if (id.includes("/react/") || id.includes("/react-dom/") || id.includes("/scheduler/"))
            return "vendor";
          return undefined;
        },
      },
    },
  },
});
