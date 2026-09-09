import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(raiz, "./src") },
  },
  build: {
    // O orçamento de peso é medido por `scripts/check-peso.mjs`, não avisado
    // pelo empacotador: um aviso que ninguém lê não é orçamento.
    reportCompressedSize: true,
  },
});
