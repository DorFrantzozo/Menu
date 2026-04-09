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
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  // build: {
  //   assetsDir: "assets",
  // }
  build: {
    assetsDir: "assets",
    minify: "esbuild", // ברירת מחדל אבל נוודא
    target: "esnext", // לנצל תכונות מודרניות בדפדפנים
    cssCodeSplit: true,
    sourcemap: false,
  },
});
