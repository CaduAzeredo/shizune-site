#!/usr/bin/env node
/**
 * Contraste — medido, não anotado.
 *
 * O `tokens.css` do site pessoal traz o contraste de cada cor escrito à mão em
 * comentário. Isso era verdade no instante em que foi digitado e nada o mantém
 * verdade: trocar um hex não atualiza o comentário ao lado, e ninguém percebe
 * até alguém não conseguir ler a página. Aqui os comentários não trazem número
 * nenhum — o número é o que este script mede.
 *
 * DUAS COISAS QUE ESTE VERIFICADOR FAZ E O DO SITE PESSOAL NÃO FAZ, e as duas
 * nasceram de um buraco real encontrado ao portá-lo:
 *
 * 1. **Os escopos são DESCOBERTOS, não listados.** Lá, os quatro escopos
 *    (`:root`, `[data-mode="empresa"]`, `[data-invadido]`, `[data-rota=...]`)
 *    estão escritos no script; um quinto escopo entraria sem ser medido, e
 *    ninguém saberia. Aqui o script varre o arquivo, acha todo bloco que
 *    declara token, e mede TODOS. Hoje há um só — e é justamente com um só que
 *    a regra precisa nascer, senão o segundo a quebra sem aviso.
 *
 * 2. **Todo token de cor tem de aparecer em alguma medição.** Um token que
 *    entra na paleta e não é medido por par nenhum é uma cor sem régua. O
 *    script reprova por isso, com o nome do token.
 *
 * DUAS TABELAS, e a diferença entre elas importa:
 *
 * - `PARES` são pares de TEXTO. O mínimo é o da WCAG 2.1: 4,5:1 para texto
 *   normal, 3:1 para texto grande.
 * - `SEPARADORES` são pares NÃO textuais — borda sobre superfície. Aqui não há
 *   exigência da WCAG a invocar (1.4.11 cobre o que identifica componente e
 *   estado, e uma divisória não identifica nem um nem outro), então o piso é
 *   declarado pelo que ele é: 1,1:1, o suficiente para provar que a borda não
 *   é invisível. É um piso de sanidade, e está escrito como tal — não é uma
 *   alegação de conformidade.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARQ = path.join(RAIZ, "src/styles/tokens.css");

/**
 * Os pares que existem de fato na interface, com o mínimo de cada um. A tabela
 * é declarada aqui, e não inferida do CSS, porque só quem lê os componentes
 * sabe o que vira texto pequeno e o que vira preenchimento — e é exatamente
 * essa distinção que decide entre 4,5:1 e 3:1.
 */
const PARES = [
  { fg: "foreground", bg: "background", min: 4.5, uso: "corpo de texto" },
  { fg: "foreground", bg: "surface", min: 4.5, uso: "texto dentro de card" },
  {
    fg: "foreground",
    bg: "surface-elevated",
    min: 4.5,
    uso: "texto do terminal e barra do <details> aberta",
  },
  {
    fg: "muted-foreground",
    bg: "background",
    min: 4.5,
    uso: "texto secundário e legenda",
  },
  {
    fg: "muted-foreground",
    bg: "surface",
    min: 4.5,
    uso: "texto secundário em card e na barra do <details>",
  },
  {
    fg: "muted-foreground",
    bg: "surface-elevated",
    min: 4.5,
    uso: "A SAÍDA DO VALIDADOR — o maior bloco de texto pequeno do site",
  },
  {
    fg: "muted-foreground",
    bg: "surface-hover",
    min: 4.5,
    uso: "a barra do <details> durante a transição de hover",
  },
  { fg: "primary", bg: "background", min: 4.5, uso: "link, e o anel de foco" },
  { fg: "primary", bg: "surface", min: 4.5, uso: "link dentro de card" },
  {
    fg: "primary",
    bg: "surface-elevated",
    min: 4.5,
    uso: "o `ok` do validador — o que a página inteira existe para mostrar",
  },
  {
    fg: "primary-hover",
    bg: "background",
    min: 4.5,
    uso: "link em hover",
  },
  {
    fg: "primary-hover",
    bg: "surface",
    min: 4.5,
    uso: "link em hover dentro de card",
  },
  {
    fg: "primary-muted",
    bg: "background",
    min: 3.0,
    grande: true,
    uso: "só borda e texto grande",
  },
  {
    fg: "accent-amber",
    bg: "background",
    min: 4.5,
    uso: "o símbolo e os três números",
  },
  {
    fg: "accent-amber",
    bg: "surface",
    min: 4.5,
    uso: "os números dentro do card",
  },
  {
    fg: "accent-amber",
    bg: "surface-elevated",
    min: 4.5,
    uso: "os marcadores [seção] dentro do terminal",
  },
  {
    fg: "accent-amber-deep",
    bg: "background",
    min: 3.0,
    grande: true,
    uso: "fio quente e borda",
  },
  { fg: "status-alert", bg: "background", min: 4.5, uso: "o 404" },
];

/** Não textuais. Piso de sanidade declarado, não alegação de WCAG. */
const SEPARADORES = [
  { fg: "border", bg: "background", min: 1.1, uso: "divisória entre seções" },
  { fg: "border", bg: "surface", min: 1.05, uso: "borda do card" },
  {
    fg: "border-topo",
    bg: "surface",
    min: 1.05,
    uso: "a elevação do card — a borda de cima",
  },
  {
    fg: "border-topo-term",
    bg: "surface-elevated",
    min: 1.05,
    uso: "a elevação do terminal",
  },
];

// ── leitura dos tokens ──────────────────────────────────────────────────────

const semComentarios = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

function tokensDe(texto) {
  const mapa = new Map();
  for (const m of texto.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    mapa.set(m[1], m[2].trim());
  }
  return mapa;
}

/**
 * Descobre todo bloco de nível superior que declara token, na ordem do arquivo.
 * O primeiro (`:root`) é a base; os demais herdam dela e sobrescrevem — que é
 * como a cascata os aplica.
 */
function escopos(css) {
  const achados = [];
  let i = 0;
  while (i < css.length) {
    const abre = css.indexOf("{", i);
    if (abre < 0) break;
    let profundidade = 1;
    let j = abre + 1;
    while (j < css.length && profundidade > 0) {
      if (css[j] === "{") profundidade++;
      else if (css[j] === "}") profundidade--;
      j++;
    }
    const seletor = css.slice(i, abre).trim().replace(/\s+/g, " ");
    const corpo = css.slice(abre + 1, j - 1);
    const tokens = tokensDe(corpo);
    if (tokens.size > 0 && seletor !== "" && !seletor.startsWith("@")) {
      achados.push({ seletor, tokens });
    }
    i = j;
  }
  return achados;
}

function resolver(mapa, nome, vistos = new Set()) {
  if (vistos.has(nome)) return null; // ciclo de var() — não trava, reprova
  vistos.add(nome);
  const bruto = mapa.get(nome);
  if (!bruto) return null;
  const ref = bruto.match(/^var\(\s*--([\w-]+)\s*\)$/);
  if (ref) return resolver(mapa, ref[1], vistos);
  return /^#[0-9a-fA-F]{6}$/.test(bruto) ? bruto.toLowerCase() : null;
}

// ── contraste WCAG 2.1 ──────────────────────────────────────────────────────

function canal(v) {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminancia(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function razao(a, b) {
  const la = luminancia(a);
  const lb = luminancia(b);
  const [alto, baixo] = la > lb ? [la, lb] : [lb, la];
  return (alto + 0.05) / (baixo + 0.05);
}

// ── execução ────────────────────────────────────────────────────────────────

const css = semComentarios(readFileSync(ARQ, "utf8"));
const blocos = escopos(css);

if (blocos.length === 0 || blocos[0].seletor !== ":root") {
  console.error(
    "erro: o primeiro bloco de src/styles/tokens.css deveria ser `:root`, e é " +
      `\`${blocos[0]?.seletor ?? "(nenhum)"}\`.`,
  );
  process.exit(1);
}

const base = blocos[0].tokens;
const MODOS = blocos.map((b, i) => {
  if (i === 0) return [`${b.seletor}  (base)`, base];
  const mapa = new Map(base);
  for (const [k, v] of b.tokens) mapa.set(k, v);
  return [b.seletor, mapa];
});

// ── nenhum token de cor fica sem régua ─────────────────────────────────────

const medidos = new Set();
for (const p of [...PARES, ...SEPARADORES]) {
  medidos.add(p.fg);
  medidos.add(p.bg);
}

const semRegua = [];
for (const [nome] of base) {
  if (!resolver(base, nome)) continue; // não é cor
  if (!medidos.has(nome)) semRegua.push(nome);
}

// ── medição ────────────────────────────────────────────────────────────────

let falhas = 0;
let naoResolvidos = 0;
let medicoes = 0;

function medir(rotulo, mapa, tabela, cabecalho) {
  console.log(`\n  ${rotulo} — ${cabecalho}`);
  console.log(`  ${"─".repeat(76)}`);

  for (const par of tabela) {
    const fg = resolver(mapa, par.fg);
    const bg = resolver(mapa, par.bg);

    if (!fg || !bg) {
      naoResolvidos++;
      console.log(
        `  ??      --${par.fg} sobre --${par.bg}  — token ausente ou não resolvido`,
      );
      continue;
    }

    medicoes++;
    const r = razao(fg, bg);
    const passa = r >= par.min;
    if (!passa) falhas++;

    const marca = passa ? "ok   " : "FALHA";
    const alvo = par.grande ? `>=${par.min} (grande)` : `>=${par.min}`;
    console.log(
      `  ${marca}  ${r.toFixed(2).padStart(6)}:1  ${alvo.padEnd(16)} ` +
        `--${par.fg} sobre --${par.bg}`,
    );
    if (!passa) console.log(`          ↑ ${par.uso}`);
  }
}

for (const [rotulo, mapa] of MODOS) {
  medir(rotulo, mapa, PARES, "texto (WCAG 2.1)");
  medir(rotulo, mapa, SEPARADORES, "não textual (piso de sanidade declarado)");
}

console.log("");

if (semRegua.length > 0) {
  for (const nome of semRegua) {
    console.error(
      `  FALHA  [sem régua]  --${nome} é cor e não aparece em par nenhum.`,
    );
    console.error(
      "          ↑ cor sem medição é cor sem régua: acrescente o par em PARES ou SEPARADORES",
    );
  }
}

if (falhas || naoResolvidos || semRegua.length) {
  console.error(
    `\ncontraste: ${falhas} par(es) reprovando, ${naoResolvidos} não resolvido(s), ` +
      `${semRegua.length} token(s) sem régua. Resultado: FALHOU`,
  );
  process.exit(1);
}

console.log(
  `contraste: ${medicoes} medições em ${MODOS.length} escopo(s) descoberto(s) ` +
    `(${MODOS.map(([r]) => r.split(" ")[0]).join(", ")}). Resultado: OK`,
);
