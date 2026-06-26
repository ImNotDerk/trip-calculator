import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // GitHub Pages serves from /<repo-name>/, not the domain root.
  // Change this if your repo name differs from "trip-calculator".
  base: "/trip-calculator/",
  plugins: [react(), tailwindcss()],
});
