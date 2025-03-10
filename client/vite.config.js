import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": dirname(fileURLToPath(import.meta.url)) + "/src",
    },
  },
  build: {
    assetsDir: "assets",
  }
});
