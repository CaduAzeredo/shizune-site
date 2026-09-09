/**
 * O texto da rota `/`.
 *
 * Fonte: `projects/brain-launch/shizune-dev-texto-e-briefing.md` no Brain,
 * escrito pelo revisor e medido pelo executor em 2026-09-09. **Nenhuma frase
 * foi reescrita, encurtada ou cortada no caminho até aqui.** Se uma frase
 * precisar mudar, ela muda lá primeiro.
 *
 * Os NÚMEROS não estão neste arquivo. Eles vêm de `ficha.ts`, gerado por
 * `scripts/ficha.mjs` a partir do clone público na tag publicada. Aqui há a
 * frase em volta do número, e o comando que o reproduz.
 */
import type { Frase } from "./prosa";
import type { Ficha } from "./ficha";

export const REPOSITORIO = "https://github.com/CaduAzeredo/shizune";
export const CLONE = `git clone ${REPOSITORIO}.git`;

/** As três batidas do hero. O verbo carrega o peso; o sujeito recua. */
export const hero = {
  linhas: [
    { sujeito: "The machine ", verbo: "drafts." },
    { sujeito: "You ", verbo: "sign." },
    { sujeito: "The command ", verbo: "verifies." },
  ],
  /** A frase inteira, para o `<title>` da aba e para a conferência do e2e. */
  frase: "The machine drafts. You sign. The command verifies.",
  subtitulo: "Who decided — and can you prove it?",
} as const;

export const problema = {
  linhas: [
    "The watermark says what the machine wrote.",
    "The key says who pushed.",
    "Nobody records what the human decided — and that record is what Shizune is.",
  ],
} as const;

export const prova = {
  titulo: "The proof",
  legenda:
    "A real, unedited run of the validator's negative test on a clean public clone. " +
    "The output is in Portuguese — this is the actual capture, not a translation. " +
    "The package ships with an empty registry, so the validator alone proves nothing " +
    "to a newcomer; the negative test shows the validator rejecting what it must " +
    "reject. Reproduce it:",
  /** A tag entra pelo `ficha`; nenhum literal de versão vive no conteúdo. */
  comando: (f: Ficha): string =>
    `${CLONE}\ncd shizune && git checkout ${f.tag}\nnode scripts/test-validate-decisions.mjs`,
  secoes: [
    "Sections shown: ",
    { secao: "[negativo]" },
    " — a commit citing a decision that does not exist, a decision with no signer, " +
      "a signature whose SHA does not resolve. ",
    { secao: "[positivo]" },
    " — a well-formed citation passes. ",
    { secao: "[rascunho]" },
    " — a draft passes when nothing cites it, and fails when a commit does. " +
      "The rest of the run is collapsed.",
  ] as Frase,
} as const;

export const comoFunciona = {
  titulo: "How it works",
  chamada: "Three steps, and the number never moves.",
  passos: [
    {
      nome: "Draft.",
      texto: [
        "The decision exists as a numbered line, marked ",
        { literal: "rascunho, assinatura pendente" },
        " — a draft awaiting signature. It does not count yet, and a commit that cites it fails.",
      ] as Frase,
    },
    {
      nome: "Signature.",
      texto: [
        "A signer and the SHA of the approving commit enter the line, and its state becomes ",
        { literal: "vigente" },
        ". The decision now counts.",
      ] as Frase,
    },
    {
      nome: "Verification.",
      texto: [
        "The command cross-checks the written record against what git already knows: " +
          "the object exists, the citation resolves, the signer is there.",
      ] as Frase,
    },
  ],
} as const;

export const numeros = {
  titulo: "Numbers you can reproduce",
  chamada: "All three are measured on a clean public clone at the published tag.",
} as const;

export interface NumeroMedido {
  readonly valor: number;
  readonly texto: Frase;
  readonly comando: string;
}

/**
 * Os três números da `/`.
 *
 * Cada um é uma função da ficha, e não um literal: o valor, e o `7 run green,
 * 2 report n/a` do terceiro, saem da medição. Trocar de release é rodar
 * `npm run ficha` — ninguém reedita número à mão na véspera.
 */
export function numerosMedidos(f: Ficha): readonly NumeroMedido[] {
  return [
    {
      valor: f.asseracoes,
      texto: [
        { forte: "assertions" },
        " in the validator's negative test.",
      ] as Frase,
      comando: "grep -cE '^\\s*ok\\(' scripts/test-validate-decisions.mjs",
    },
    {
      valor: f.arquivos,
      texto: [{ forte: "files" }, " in the public package."] as Frase,
      comando: "git ls-files | wc -l",
    },
    {
      valor: f.doctor.total,
      texto: [
        { forte: "checks" },
        " in ",
        { literal: "doctor" },
        ` — ${f.doctor.executam} run green, ${f.doctor.na} report `,
        { literal: "n/a" },
        " on an exported tree, because the export and issue-lint checks only exist " +
          "in the tree the package is exported from.",
      ] as Frase,
      comando: "node scripts/doctor.mjs",
    },
  ];
}

export const comeco = {
  titulo: "Start",
  comando: CLONE,
  metodo: "Read the method →",
} as const;
