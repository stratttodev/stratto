// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  adapter: vercel(),
  integrations: [react(), sitemap()],
  site: "https://stratto.dev",
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["reicon-react"],
    },
  },
});
