#!/usr/bin/env node
/**
 * Auditoria de movimento — o portão que o operador escreveu, virado em código.
 *
 * A lista do que NÃO entra foi ditada em 2026-09-09 e é fechada: rolagem
 * sequestrada · parallax · entrada por rolagem · cursor customizado · WebGL ou
 * 3D · transição de página cinematográfica · rolagem suave · glassmorphism ·
 * qualquer animação em laço · qualquer coisa que reaja ao cursor. Mais duas
 * regras antigas do site pessoal (`transition: all` e animação escrita em
 * componente) e a exigência do operador de que não exista `keydown` em
 * `document` ou `window`.
 *
 * Uma decisão de implementação que vale escrever: **os comentários são apagados
 * antes da varredura**, preservando as linhas. Sem isso, a frase "sem gradiente"
 * escrita num comentário para explicar a regra é acusada pela própria regra —
 * aconteceu na conferência do desenho, e um verificador que acusa a
 * documentação da regra treina quem o lê a ignorá-lo.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FONTE = path.join(RAIZ, "src");
const ESTILOS = path.join(RAIZ, "src/styles");

function arquivos(dir, exts) {
  const saida = [];
  for (const nome of readdirSync(dir)) {
    const p = path.join(dir, nome);
    if (statSync(p).isDirectory()) saida.push(...arquivos(p, exts));
    else if (exts.some((e) => nome.endsWith(e))) saida.push(p);
  }
  return saida;
}

const rel = (p) => path.relative(RAIZ, p).replace(/\\/g, "/");

/** Apaga comentários mantendo o número de linhas e as posições. */
function semComentarios(texto, comLinha) {
  let fora = texto.replace(/\/\*[\s\S]*?\*\//g, (m) =>
    m.replace(/[^\n]/g, " "),
  );
  if (comLinha) {
    fora = fora.replace(/(^|[^:])\/\/[^\n]*/g, (m, antes) =>
      antes + " ".repeat(m.length - antes.length),
    );
  }
  return fora;
}

const achados = [];

function acusa(regra, arq, i, linha, porque) {
  achados.push({
    regra,
    arq: rel(arq),
    linha: i + 1,
    texto: linha.trim().slice(0, 96),
    porque,
  });
}

/** As regras que se aplicam linha a linha, sobre o texto sem comentários. */
const REGRAS = [
  {
    regra: "transition-all",
    exts: [".css", ".ts", ".tsx"],
    re: /transition:\s*all\b|\btransition-all\b/,
    porque: "anima propriedade que ninguém escolheu — nomeie o que deve animar",
  },
  {
    regra: "animação em componente",
    exts: [".tsx"],
    re: /style=\{\{[^}]*\banimation[A-Za-z]*\s*:/,
    porque: "movimento mora no CSS, onde a rede global o alcança",
  },
  {
    regra: "animação em laço",
    exts: [".css", ".ts", ".tsx"],
    re: /animation-iteration-count:\s*infinite|animation:[^;]*\binfinite\b/,
    porque: "nada em laço: o movimento desta página acontece uma vez, na entrada",
  },
  {
    regra: "rolagem suave",
    exts: [".css", ".ts", ".tsx"],
    re: /scroll-behavior:\s*smooth|behavior:\s*["']smooth["']/,
    porque: "rolagem sequestrada — o leitor lê código antes de texto",
  },
  {
    regra: "reação ao cursor",
    exts: [".ts", ".tsx"],
    re: /addEventListener\(\s*["'](?:mousemove|pointermove|wheel|scroll)["']/,
    porque: "nada reage ao cursor nem à rolagem: sem parallax, sem entrada por rolagem",
  },
  {
    regra: "teclado global",
    exts: [".ts", ".tsx"],
    re: /\b(?:document|window)\s*\.\s*addEventListener\(\s*["']key(?:down|up|press)["']/,
    porque:
      "ordem do operador: nenhum keydown em document ou window — atalho global rouba a tecla de quem usa leitor de tela",
  },
  {
    regra: "entrada por rolagem",
    exts: [".ts", ".tsx"],
    re: /\bIntersectionObserver\b/,
    porque: "a dobra entra no carregamento, não quando a rolagem chega nela",
  },
  {
    regra: "3D",
    exts: [".ts", ".tsx"],
    re: /\bfrom\s+["'](?:three|@react-three\/|ogl|babylonjs)|getContext\(\s*["']webgl/,
    porque: "sem WebGL, sem cena 3D",
  },
  {
    regra: "glassmorphism",
    exts: [".css", ".tsx"],
    re: /backdrop-filter|\bbackdrop-blur\b/,
    porque: "vidro é o clichê que este público reconhece e fecha a aba",
  },
];

for (const arq of arquivos(FONTE, [".css", ".ts", ".tsx"])) {
  const ext = path.extname(arq);
  const bruto = readFileSync(arq, "utf8");
  const linhas = semComentarios(bruto, ext !== ".css").split("\n");
  const originais = bruto.split("\n");

  for (const r of REGRAS) {
    if (!r.exts.includes(ext)) continue;
    linhas.forEach((linha, i) => {
      if (r.re.test(linha)) acusa(r.regra, arq, i, originais[i], r.porque);
    });
  }
}

// ── a rede global existe e cobre tudo ───────────────────────────────────────

const folhas = arquivos(ESTILOS, [".css"]);
let redeEm = null;

for (const arq of folhas) {
  const css = semComentarios(readFileSync(arq, "utf8"), false);
  const bloco = css.match(
    /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)\s*\{([\s\S]*?)\n\}/,
  );
  if (!bloco) continue;
  if (/^\s*\*\s*[,{]/m.test(bloco[1])) {
    redeEm = arq;
    break;
  }
  achados.push({
    regra: "rede global",
    arq: rel(arq),
    linha: 0,
    texto: "(não atinge `*`)",
    porque:
      "o bloco existe mas não é universal — o que ninguém lembrar de listar fica de fora",
  });
}

if (!redeEm && !achados.some((a) => a.regra === "rede global")) {
  achados.push({
    regra: "rede global",
    arq: "src/styles/",
    linha: 0,
    texto: "(ausente)",
    porque:
      "sem @media (prefers-reduced-motion: reduce) atingindo `*`, toda animação nova nasce descoberta",
  });
}

// ── saída ───────────────────────────────────────────────────────────────────

if (achados.length === 0) {
  console.log(`  rede global de prefers-reduced-motion: ${rel(redeEm)}`);
  console.log(
    `movimento: ${REGRAS.length} regras do portão mais a rede global. Resultado: OK`,
  );
  process.exit(0);
}

for (const a of achados) {
  const onde = a.linha ? `${a.arq}:${a.linha}` : a.arq;
  console.error(`  FALHA  [${a.regra}]  ${onde}`);
  console.error(`         ${a.texto}`);
  console.error(`         ↑ ${a.porque}`);
}
console.error(`\nmovimento: ${achados.length} achado(s). Resultado: FALHOU`);
process.exit(1);
