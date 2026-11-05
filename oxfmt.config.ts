import { defineConfig } from "oxfmt";

export default defineConfig({
  ignorePatterns: [
    "dist/**",
    ".output/**",
    ".wrangler/**",
    ".tanstack/**",
    "src/routeTree.gen.ts",
    ".agents/**",
  ],
});
