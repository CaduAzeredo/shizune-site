#!/usr/bin/env node
/**
 * Orçamento de peso — do PRIMEIRO DESENHO, e não do diretório inteiro.
 *
 * O que conta: o `index.html` mais tudo que ele referencia de forma bloqueante
 * ou imediata — o CSS e os módulos JS. É o que precisa chegar antes de a
 * página existir. O que NÃO conta: o `404.html` (que ninguém carrega no caminho
 * feliz), o sitemap, o robots, e a arte de OG, que só o robô de rede social
 * busca.
 *
 * As fontes do Google não entram na conta porque não estão no pacote — e essa é
 * justamente a razão de o número ser impresso com a ressalva ao lado, em vez de
 * um "OK" limpo que esconderia duas famílias tipográficas vindas de fora.
 *
 * O teto de 115 KB gzip é o do site pessoal, que carrega GSAP, Three e Lenis.
 * Este site não carrega nenhum dos três, então o teto é um limite superior
 * folgado — e o script imprime a folga para que ela seja vista encolher.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(RAIZ, "dist");

/** Teto do primeiro desenho, em bytes gzip. */
const TETO = 115 * 1024;

if (!statSync(DIST, { throwIfNoEntry: false })) {
  console.error("erro: não há dist/. Rode o build antes de medir o peso.");
  process.exit(1);
}

const html = readFileSync(path.join(DIST, "index.html"), "utf8");

// O que o index.html puxa de dentro do pacote, na ordem em que aparece.
const referenciados = [
  ...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g),
].map((m) => m[1]);

if (referenciados.length === 0) {
  console.error(
    "erro: o index.html não referencia nada em /assets/ — a leitura do build mudou.",
  );
  process.exit(1);
}

const gz = (buf) => gzipSync(buf, { level: 9 }).length;
const kb = (n) => `${(n / 1024).toFixed(2)} KB`;

const camadas = [
  {
    nome: "index.html",
    bytes: Buffer.byteLength(html),
    gzip: gz(Buffer.from(html)),
  },
];

for (const ref of referenciados) {
  const arq = path.join(DIST, ref.replace(/^\//, ""));
  const conteudo = readFileSync(arq);
  camadas.push({
    nome: ref.replace("/assets/", ""),
    bytes: conteudo.length,
    gzip: gz(conteudo),
  });
}

const total = camadas.reduce((s, c) => s + c.gzip, 0);

console.log(`\n  primeiro desenho — o que chega antes de a página existir`);
console.log(`  ${"─".repeat(70)}`);
for (const c of camadas) {
  console.log(
    `  ${c.nome.padEnd(34)} ${kb(c.bytes).padStart(11)}  →  ${kb(c.gzip).padStart(10)} gzip`,
  );
}
console.log(`  ${"─".repeat(70)}`);
console.log(`  ${"total".padEnd(34)} ${"".padStart(11)}     ${kb(total).padStart(10)} gzip`);

// O que existe no pacote e NÃO entra na conta, dito por nome.
const fora = readdirSync(DIST).filter(
  (n) => n !== "assets" && n !== "index.html",
);
console.log(
  `\n  fora da conta (não bloqueiam o primeiro desenho): ${fora.join(", ") || "—"}`,
);
console.log(
  "  fora do pacote: DM Sans e JetBrains Mono, servidas pelo Google Fonts",
);

console.log("");
if (total > TETO) {
  console.error(
    `peso: ${kb(total)} gzip no primeiro desenho, acima do teto de ${kb(TETO)}. Resultado: FALHOU`,
  );
  process.exit(1);
}

const folga = TETO - total;
console.log(
  `peso: ${kb(total)} gzip no primeiro desenho, teto ${kb(TETO)}, folga ${kb(folga)}. Resultado: OK`,
);
