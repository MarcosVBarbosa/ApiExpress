import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier";
export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],

    plugins: {
      js,
    },

    extends: ["js/recommended"],

    languageOptions: {
      globals: globals.node,
      ecmaVersion: 2022,
      sourceType: "module",
    },

    rules: {
      // 🔹 Regras básicas
      "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
      "no-console": "warn",
      eqeqeq: "error",

      // 🔹 Flexibilidade para Node/Express
      "class-methods-use-this": "off",
      "no-param-reassign": "off",
      camelcase: "off",

      // 🔹 Boas práticas
      "prefer-const": "error",
      "no-var": "error",
    },
  },
  prettier,
]);
