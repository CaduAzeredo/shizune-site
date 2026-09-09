#!/usr/bin/env node
/**
 * Depois do build: o 404 que devolve 404.
 *
 * Uma SPA hospedada do jeito padrão reescreve TODO caminho desconhecido para o
 * `index.html` e devolve **200**. O visitante vê a página de erro certa e o
 * robô, o monitor e o `curl` veem sucesso. Esse é exatamente o defeito que o
 * item 45 da fila do Brain registrou depois de dois dias de diagnóstico lendo
 * código de status em vez do corpo da resposta — e seria constrangedor
 * publicá-lo no site que existe para pegá-lo.
 *
 * Então aqui não há reescrita geral. O `vercel.json` reescreve só `/method`, e
 * este script escreve o `404.html` que a hospedagem serve, **com status 404**,
 * para todo o resto. O arquivo é o mesmo `index.html` com o head trocado: a
 * mesma aplicação sobe e a rota `*` desenha a página de erro.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(RAIZ, "dist");

const html = readFileSync(path.join(DIST, "index.html"), "utf8");

const TITULO = "Not found — Shizune";
const DESCRICAO = "This page does not exist.";

let quatroQuatro = html
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${TITULO}</title>`)
  .replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="description" content="${DESCRICAO}" />`,
  )
  // A canônica do index apontaria o 404 para a home. Ela sai, e entra o
  // `noindex`: um 404 indexado compete com a página certa na busca.
  .replace(/<link\s+rel="canonical"[\s\S]*?\/?>/, '<meta name="robots" content="noindex" />');

if (quatroQuatro === html) {
  console.error(
    "erro: nenhuma substituição aconteceu no index.html — o formato do head mudou.\n" +
      "      O 404 sairia com o título e a canônica da home. Corrija antes de publicar.",
  );
  process.exit(1);
}

for (const [rotulo, marca] of [
  ["título", `<title>${TITULO}</title>`],
  ["robots", 'content="noindex"'],
]) {
  if (!quatroQuatro.includes(marca)) {
    console.error(`erro: o 404.html saiu sem ${rotulo}.`);
    process.exit(1);
  }
}
if (quatroQuatro.includes('rel="canonical"')) {
  console.error("erro: o 404.html saiu com a canônica da home.");
  process.exit(1);
}

quatroQuatro = quatroQuatro.replace(
  "<body>",
  "<!-- Servido com status 404 pela hospedagem. Ver scripts/pos-build.mjs. -->\n  <body>",
);

writeFileSync(path.join(DIST, "404.html"), quatroQuatro, "utf8");
console.log("pós-build: dist/404.html escrito (título, noindex, sem canônica). Resultado: OK");
