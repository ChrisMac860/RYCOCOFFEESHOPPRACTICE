import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
// Deployment base lives in one place (also used by the prerender step).
// See scripts/site.config.mjs for switching to a custom domain.
import { basePath } from "./scripts/site.config.mjs";

export default defineConfig({
  plugins: [react()],
  base: basePath,
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    globals: true,
  },
});
