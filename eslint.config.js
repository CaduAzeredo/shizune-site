import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "node_modules"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: { globals: globals.browser },
  },
  {
    // Os verificadores do portão são Node puro e rodam fora do empacotador.
    files: ["scripts/**/*.mjs"],
    extends: [js.configs.recommended],
    languageOptions: {
      /**
       * Node E navegador. Os verificadores rodam em Node, mas o corpo de cada
       * `page.evaluate(...)` é serializado e executado DENTRO da página — então
       * `document`, `window` e `getComputedStyle` são reais ali, e declarar só
       * os globais de Node encheria a saída de `no-undef` falso.
       */
      globals: { ...globals.node, ...globals.browser, axe: "readonly" },
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
]);
