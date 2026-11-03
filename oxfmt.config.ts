import { defineConfig } from "oxfmt";

export default defineConfig({
  sortImports: true,
  ignorePatterns: ["dist/**", ".output/**", ".wrangler/**", ".tanstack/**", "src/routeTree.gen.ts"],
});
