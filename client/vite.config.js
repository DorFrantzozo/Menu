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
    assetsInlineLimit: (filePath, content) => {
      // Print-menu allergen icons (assets/img/print/ only — NOT the ones Allergies.jsx
      // and IconDescription.jsx use on the live public menu) must always be inlined as
      // base64. They're rendered right before window.print() fires, with no guarantee a
      // separate network request for them finishes before the browser's print snapshot.
      if (/\/assets\/img\/print\/(milk|gluten|pregnant|vegetable)\.png$/.test(filePath)) {
        return true;
      }
      return undefined; // fall back to the default size-based limit for everything else
    },
  },
});
