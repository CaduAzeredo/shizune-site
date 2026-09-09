#!/usr/bin/env node
/**
 * A arte gerada: favicon 16/32/48 e a imagem de OG.
 *
 * Duas técnicas diferentes, e a diferença tem motivo:
 *
 * - **Os favicons saem do SVG por `sharp`.** São só traçado, sem texto, então
 *   não dependem de fonte nenhuma. E cada tamanho é rasterizado a partir de um
 *   SVG PRÓPRIO, com a espessura da escala do operador (2 a 16px · 1.5 em
 *   18–24 · 1.25 em 32+) — reduzir um PNG de 48 para 16 daria um traço de
 *   0,4px e um borrão, que é justamente o que a variante compacta existe para
 *   evitar.
 *
 * - **A OG sai de uma página renderizada no navegador.** Ela tem o lockup, e
 *   lockup é tipografia: DM Sans e JetBrains Mono, nas espessuras certas.
 *   Rasterizar texto por `sharp` dependeria de a fonte estar instalada na
 *   máquina de quem roda o script, e o resultado mudaria de máquina para
 *   máquina sem ninguém perceber. O navegador busca a fonte de verdade.
 *
 * O conteúdo da OG é a FRASE DO HERO mais o lockup, sobre `#0a0e10`. O dossiê
 * pedia só o lockup; o operador acrescentou a frase em 2026-09-09, e a razão
 * vale registrar: a OG aparece em compartilhamento, **sem contexto nenhum**, e
 * um lockup sozinho não diz o que a coisa é. A frase é a mesma da página, com o
 * mesmo tratamento — sujeito recuado, verbo carregando o peso — e é conferida
 * contra `src/content/home.ts` logo abaixo. Nada de frase de venda, nada de
 * número, nada de captura.
 */
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";
import { chromium } from "playwright-core";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLICO = path.join(RAIZ, "public");
mkdirSync(PUBLICO, { recursive: true });

const FUNDO = "#0a0e10";
const AMBAR = "#dec39c";
const VERDE = "#3fa372";
const CLARO = "#edf2ef";
const MUDO = "#8a9a92";

const CAMINHO_COMPACTO =
  "M1.5 12C1.5 6.5 3 3.5 5 3.5C7 3.5 7 18 8.5 18C10 18 10 9 11.5 9C12.7 9 13.4 12 14.5 12L22.5 12";

/** A regra de espessura do operador, 2026-09-09. A mesma de `src/lib/glifo.ts`. */
const espessura = (t) => (t <= 16 ? 2 : t <= 24 ? 1.5 : 1.25);

/**
 * A cópia é conferida, não confiada.
 *
 * Este script é Node e não consegue importar o TypeScript da aplicação, então o
 * traçado existe duas vezes. Duas cópias de uma identidade divergem — é questão
 * de tempo, e a divergência sairia no favicon, que é onde ninguém olha. Então o
 * script LÊ o arquivo da aplicação e reprova se as duas não forem idênticas.
 */
{
  const fonte = readFileSync(path.join(RAIZ, "src/lib/glifo.ts"), "utf8");
  const m = fonte.match(/CAMINHO_COMPACTO\s*=\s*\n?\s*"([^"]+)"/);
  if (!m) {
    console.error("erro: não achei CAMINHO_COMPACTO em src/lib/glifo.ts.");
    process.exit(1);
  }
  if (m[1] !== CAMINHO_COMPACTO) {
    console.error(
      "erro: o traçado deste script divergiu do da aplicação.\n" +
        `       app:    ${m[1]}\n` +
        `       script: ${CAMINHO_COMPACTO}\n` +
        "       O favicon sairia com uma forma que a página não usa.",
    );
    process.exit(1);
  }
  console.log("  traçado conferido contra src/lib/glifo.ts — idêntico");
}

/**
 * A frase da OG é a frase da página — conferida, pelo mesmo motivo do traçado.
 * Uma arte de compartilhamento que promete uma frase e o site entrega outra é
 * um defeito que ninguém vê até estar publicado.
 */
const FRASE = [
  { sujeito: "The machine ", verbo: "drafts." },
  { sujeito: "You ", verbo: "sign." },
  { sujeito: "The command ", verbo: "verifies." },
];

{
  const fonte = readFileSync(path.join(RAIZ, "src/content/home.ts"), "utf8");
  const m = fonte.match(/frase:\s*"([^"]+)"/);
  const daArte = FRASE.map((l) => l.sujeito + l.verbo).join(" ");
  if (!m) {
    console.error("erro: não achei `frase:` em src/content/home.ts.");
    process.exit(1);
  }
  if (m[1] !== daArte) {
    console.error(
      "erro: a frase desta arte divergiu da frase da página.\n" +
        `       página: ${m[1]}\n` +
        `       arte:   ${daArte}`,
    );
    process.exit(1);
  }
  console.log("  frase conferida contra src/content/home.ts — idêntica");
}

function svgFavicon(tamanho) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${tamanho}" height="${tamanho}">
  <rect width="24" height="24" rx="5" fill="${FUNDO}"/>
  <path d="${CAMINHO_COMPACTO}" fill="none" stroke="${AMBAR}"
        stroke-width="${espessura(tamanho)}" stroke-linecap="round"/>
</svg>`;
}

// ── favicons ────────────────────────────────────────────────────────────────

const TAMANHOS = [16, 32, 48, 180];

for (const t of TAMANHOS) {
  const nome = t === 180 ? "apple-touch-icon.png" : `favicon-${t}.png`;
  const png = await sharp(Buffer.from(svgFavicon(t)))
    .resize(t, t)
    .png({ compressionLevel: 9 })
    .toBuffer();
  writeFileSync(path.join(PUBLICO, nome), png);
  console.log(
    `  ${nome.padEnd(24)} ${String(t).padStart(3)}px · traço ${espessura(t)} · ${png.length} B`,
  );
}

// ── a imagem de OG ──────────────────────────────────────────────────────────

const paginaOg = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300..600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; padding: 0; }
  body { width: 1200px; height: 630px; background: ${FUNDO}; color: ${CLARO};
         font-family: "DM Sans", sans-serif; -webkit-font-smoothing: antialiased;
         display: flex; flex-direction: column; justify-content: center;
         padding: 0 84px; box-sizing: border-box; }
  /* O mesmo tratamento da página: o sujeito recua, o verbo carrega. */
  .frase { margin: 0; font-size: 60px; line-height: 1.16; font-weight: 400;
           letter-spacing: -0.032em; color: ${MUDO}; }
  .frase b { font-weight: 600; color: ${CLARO}; }
  .fio { height: 1px; background: #1e2a2b; margin: 44px 0 26px; }
  .rodape { display: flex; align-items: center; justify-content: space-between; }
  .lock { display: flex; align-items: center; gap: 13px; }
  .prompt { display: inline-flex; align-items: center; justify-content: center;
            width: 38px; height: 38px; border: 1.5px solid ${VERDE}; border-radius: 8px;
            color: ${VERDE}; font-family: "JetBrains Mono", monospace;
            font-size: 16px; font-weight: 700; line-height: 1; }
  .nome { font-size: 27px; font-weight: 600; letter-spacing: -0.015em; }
  .barra { font-size: 27px; font-weight: 300; color: ${VERDE}; }
  .seg { font-family: "JetBrains Mono", monospace; font-size: 21px; color: ${MUDO}; }
  .comp { font-size: 20px; color: ${MUDO}; }
</style></head><body>
  <svg viewBox="0 0 24 24" width="88" height="88" fill="none" stroke="${AMBAR}"
       stroke-width="1.25" stroke-linecap="round" style="margin-bottom: 34px;">
    <path d="${CAMINHO_COMPACTO}"/>
  </svg>
  <p class="frase">${FRASE.map((l) => `${l.sujeito}<b>${l.verbo}</b>`).join("<br>")}</p>
  <div class="fio"></div>
  <div class="rodape">
    <span class="lock">
      <span class="prompt">&gt;_</span>
      <span class="nome">Cadu Azeredo</span>
      <span class="barra">/</span>
      <span class="seg">shizune</span>
    </span>
    <span class="comp">Apache-2.0 · Shizune™</span>
  </div>
</body></html>`;

const BRAVE = path.join(
  process.env.LOCALAPPDATA ?? "",
  "BraveSoftware/Brave-Browser/Application/brave.exe",
);

const navegador = await chromium.launch({ executablePath: BRAVE });
try {
  const pagina = await navegador.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await pagina.setContent(paginaOg, { waitUntil: "networkidle" });
  // Sem isto o tipo pode ser capturado no fallback do sistema, e a arte sai
  // com a métrica errada sem que nada acuse.
  await pagina.evaluate(() => document.fonts.ready);
  const png = await pagina.screenshot({ type: "png" });
  writeFileSync(path.join(PUBLICO, "og.png"), png);
  console.log(`  og.png                   1200×630 · ${(png.length / 1024).toFixed(1)} KB`);
} finally {
  await navegador.close();
}

console.log("\narte: favicons 16/32/48, apple-touch-icon e og.png. Resultado: OK");
