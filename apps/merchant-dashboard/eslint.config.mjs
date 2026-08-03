import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// eslint-config-next@15.x is authored in the legacy eslintrc format, so it
// must be bridged into ESLint 9's flat config with FlatCompat.
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: ["**/.next/**", "**/out/**", "**/build/**", "**/next-env.d.ts"],
  },
  {
    rules: {
      // The dashboard deliberately uses `any` for untyped Hyperswitch API
      // payloads. Keep the TypeScript-aware unused-vars checks (from
      // next/typescript) but allow explicit `any`.
      "@typescript-eslint/no-explicit-any": "off",
      // Inter is loaded once from Google Fonts in the root layout <head>
      // (App Router applies it to every page). Using next/font instead would
      // add a build-time fetch of Google Fonts inside Docker/CI builds, so we
      // keep the <link> and silence this Pages-Router-oriented font rule.
      "@next/next/no-page-custom-font": "off",
    },
  },
];

export default eslintConfig;
