#!/usr/bin/env node
/**
 * Scanner anti-slop — os vícios visuais de interface gerada por IA.
 *
 * Adaptado do scanner do `codeswithroh/tastemaker` (MIT) às regras que este
 * ecossistema já escreveu para si. A implementação é nossa; a ideia de que
 * "parecer feito por IA" é detectável mecanicamente é dele.
 *
 * O teto de saturação nasceu de um achado desconfortável: a skill oficial
 * `frontend-design` da Anthropic lista **"near-black + acid-green"** entre os
 * três padrões que denunciam design gerado por IA — e é perto desta paleta. O
 * que separa uma coisa da outra é a saturação: este verde é floresta (~44%),
 * não o verde de terminal falso (~100%).
 *
 * UM BURACO DO ORIGINAL, FECHADO AQUI. Lá, os tokens medidos eram enumerados
 * por sufixo — `primary`, `primary-muted`, `primary-deep`, `accent-amber`,
 * `accent-amber-deep`. Um token novo com outro sufixo passa sem ser medido, e
 * de fato passam dois no site pessoal (`--accent-blue` e `--secondary`, ambos
 * dentro do teto por sorte, não por medição). Aqui a régua é por PREFIXO: todo
 * token cujo nome começa por `primary` ou `accent` é medido, e o
 * `--primary-hover` deste site — que o padrão antigo teria deixado passar —
 * entra junto.
 *
 * O que fica FORA do teto, e por quê: os `status-*`. O teto existe para impedir
 * que a MARCA caia no vício "near-black + acid-green", não para proibir
 * vermelho de alarme. Cor de alerta é para alarmar. A exceção é por prefixo de
 * nome, e não por lista de cores, para que ela não possa ser usada para passar
 * contrabando na paleta de verdade — e o contraste dos `status-*` continua
 * sendo medido pelo `check-contrast`, junto com todos os outros.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TOKENS = path.join(RAIZ, "src/styles/tokens.css");

/** Onde cor não pode ser escrita à mão. */
const SEM_COR = [
  path.join(RAIZ, "src/components"),
  path.join(RAIZ, "src/pages"),
];
/** Onde os demais vícios são procurados. */
const INTERFACE = [
  path.join(RAIZ, "src/components"),
  path.join(RAIZ, "src/pages"),
  path.join(RAIZ, "src/content"),
];

const TETO_SATURACAO = 0.65;
const MEDIDOS = /^(primary|accent)/;

function arquivos(dirs, exts) {
  const saida = [];
  const anda = (dir) => {
    for (const nome of readdirSync(dir)) {
      const p = path.join(dir, nome);
      if (statSync(p).isDirectory()) anda(p);
      else if (exts.some((e) => nome.endsWith(e))) saida.push(p);
    }
  };
  for (const d of dirs) anda(d);
  return saida;
}

const rel = (p) => path.relative(RAIZ, p).replace(/\\/g, "/");
const achados = [];

/** Apaga comentários mantendo as linhas — ver a nota no check-motion. */
function semComentarios(texto) {
  return texto
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, antes) =>
      antes + " ".repeat(m.length - antes.length),
    );
}

function acusa(regra, arq, i, linha, porque) {
  achados.push({
    regra,
    arq: rel(arq),
    linha: i + 1,
    texto: linha.trim().slice(0, 96),
    porque,
  });
}

// ── 1. cor escrita à mão em componente ──────────────────────────────────────

for (const arq of arquivos(SEM_COR, [".tsx"])) {
  const bruto = readFileSync(arq, "utf8");
  const originais = bruto.split("\n");
  semComentarios(bruto)
    .split("\n")
    .forEach((linha, i) => {
      if (/#[0-9a-fA-F]{6}\b/.test(linha) || /\brgba?\(/.test(linha)) {
        acusa(
          "cor em .tsx",
          arq,
          i,
          originais[i],
          "a cor sai do token e para de acompanhar a paleta — use uma classe",
        );
      }
    });
}

// ── 2-4. os vícios de composição ────────────────────────────────────────────

const VICIOS = [
  {
    regra: "gradiente em texto",
    re: /\bbg-clip-text\b|-webkit-background-clip:\s*text/,
    porque: "título com gradiente é o clichê nº 1 de interface gerada por IA",
  },
  {
    regra: "mancha de blur",
    re: /\bblur-(2xl|3xl)\b/,
    porque: "o borrão colorido de fundo é o segundo clichê — aqui não há fundo decorado",
  },
  {
    regra: "gradiente decorativo",
    re: /\bbg-gradient-to-|\blinear-gradient\(|\bradial-gradient\(/,
    porque: "sem gradiente: a única profundidade desta página é a borda de cima do card",
  },
  {
    regra: "emoji na interface",
    /**
     * `™` (U+2122) e `©` (U+00A9) saem da varredura, e a exceção é pelo
     * caractere, com nome e motivo. Os dois são do `Extended_Pictographic` do
     * Unicode por herança histórica, mas nenhum dos dois é ícone: são sinais
     * tipográficos de texto corrido, e o `™` é OBRIGATÓRIO no fecho deste site
     * pela política de marca. Um scanner que acusa a política que o site tem
     * de cumprir treina quem o lê a ignorá-lo.
     */
    limpar: (l) => l.replace(/[™©]/g, ""),
    re: /\p{Extended_Pictographic}/u,
    porque: "ícone é SVG traçado, que escala e recolore; emoji não faz nem um nem outro",
  },
  {
    regra: "marca registrada",
    re: /®|\bregistered\b|\bmarca registrada\b/i,
    porque:
      "trava de conteúdo: ® e 'registered' nunca, porque a marca não foi concedida — ™ pode",
  },
];

for (const arq of arquivos(INTERFACE, [".tsx", ".ts"])) {
  const bruto = readFileSync(arq, "utf8");
  const originais = bruto.split("\n");
  semComentarios(bruto)
    .split("\n")
    .forEach((linha, i) => {
      for (const v of VICIOS) {
        const alvo = v.limpar ? v.limpar(linha) : linha;
        if (v.re.test(alvo)) acusa(v.regra, arq, i, originais[i], v.porque);
      }
    });
}

// ── 5. teto de saturação dos acentos ────────────────────────────────────────

function saturacao(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return 0;
  return d / (1 - Math.abs(2 * l - 1));
}

const css = semComentarios(readFileSync(TOKENS, "utf8"));
const acentos = [...css.matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{6})/g)]
  .map(([, nome, hex]) => ({ nome, hex: hex.toLowerCase() }))
  .filter((t) => MEDIDOS.test(t.nome));

if (acentos.length === 0) {
  console.error(
    "erro: nenhum token de acento (--primary*, --accent*) encontrado em tokens.css",
  );
  process.exit(1);
}

const saturados = acentos
  .map((t) => ({ ...t, s: saturacao(t.hex) }))
  .filter((t) => t.s > TETO_SATURACAO);

// ── saída ───────────────────────────────────────────────────────────────────

if (achados.length === 0 && saturados.length === 0) {
  const medidas = acentos
    .map((t) => `--${t.nome} ${(saturacao(t.hex) * 100).toFixed(0)}%`)
    .join(", ");
  console.log(`  saturação (teto ${TETO_SATURACAO * 100}%): ${medidas}`);
  console.log(
    "anti-slop: cor em componente, gradiente, blur, emoji e saturação. Resultado: OK",
  );
  process.exit(0);
}

for (const a of achados) {
  console.error(`  FALHA  [${a.regra}]  ${a.arq}:${a.linha}`);
  console.error(`         ${a.texto}`);
  console.error(`         ↑ ${a.porque}`);
}
for (const s of saturados) {
  console.error(
    `  FALHA  [saturação]  --${s.nome} = ${s.hex} → ${(s.s * 100).toFixed(0)}% ` +
      `(teto ${TETO_SATURACAO * 100}%)`,
  );
  console.error(
    "         ↑ acento saturado demais: é o vício 'near-black + acid-green'",
  );
}
console.error(
  `\nanti-slop: ${achados.length + saturados.length} achado(s). Resultado: FALHOU`,
);
process.exit(1);
