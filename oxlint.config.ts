import { defineConfig } from "oxlint";

export default defineConfig({
  $schema: "./node_modules/oxlint/configuration_schema.json",
  plugins: ["react"],
  rules: {
    "react/exhaustive-deps": "warn",
  },
});
