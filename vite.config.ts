import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA, type ManifestOptions } from "vite-plugin-pwa";
import manifest from "./public/manifest.json";

// https://vite.dev/config/
export default defineConfig({
  base: "/remember-kanji/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: manifest as ManifestOptions,
    }),
  ],
});
