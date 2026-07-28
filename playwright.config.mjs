import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./frontend/tests",
  fullyParallel: false,
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev -- --hostname localhost --port 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
