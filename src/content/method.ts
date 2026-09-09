/**
 * O texto da rota `/method`.
 *
 * Fonte: `projects/brain-launch/shizune-dev-texto-e-briefing.md` no Brain.
 * **Nenhuma frase foi reescrita, encurtada ou cortada no caminho até aqui.**
 *
 * Os números desta rota são de outra natureza, e isso está escrito na página:
 * eles vêm de uma instância privada e **não saem de clone nenhum**. Por isso
 * carregam o rótulo "Measured in a private instance, <data>" colado ao número,
 * e por isso não há comando ao lado deles — o comando rodaria numa árvore que
 * o leitor não tem, e um comando que ninguém pode rodar é decoração.
 */
import type { Frase } from "./prosa";

/** Rotulado à mão, de propósito: não sai de clone. Ver o cabeçalho. */
export const MEDIDO_EM_INSTANCIA = "Measured in a private instance, 2026-09-09:";

export const oQueE = {
  titulo: "What this is",
  texto:
    "A thin decision-registry layer on top of git. It records what was decided " +
    "as numbered lines, and cross-checks that record against what git already knows.",
} as const;

export interface SecaoDeTexto {
  readonly titulo: string;
  readonly paragrafos: readonly Frase[];
}

export const secoes: readonly SecaoDeTexto[] = [
  {
    titulo: "The registry",
    paragrafos: [
      [
        "Each decision is one numbered line — ",
        { literal: "DEC-NNN" },
        " — carrying its text, its state, its signer, and the SHA of the commit that approved it.",
      ],
      [
        "A number is assigned once and never reassigned. A decision that is withdrawn " +
          "or superseded keeps its number; the number is the handle, not the status.",
      ],
    ],
  },
  {
    titulo: "The states",
    paragrafos: [
      [
        "A row carries its state in the ",
        { literal: "Status" },
        " column. There are two: ",
        { literal: "rascunho, assinatura pendente" },
        " — the draft, which exists and does not count — and ",
        { literal: "vigente" },
        ", which a signer and a SHA turn it into. A decision that is superseded " +
          "changes its status; it never changes its number.",
      ],
      [
        "A line changes state when it is signed. What changes is the state and the " +
          "signer; the number stays where it was.",
      ],
    ],
  },
];

export const oQueReprova = {
  titulo: "What fails",
  abertura: [
    "A commit can cite a decision through a ",
    { literal: "Decision:" },
    " trailer. The validator reads the trailer in lower case and with surrounding " +
      "spaces. Three of the failures below need no trailer at all: they are defects " +
      "in the record itself.",
  ] as Frase,
  chamada: "It fails when:",
  casos: [
    "the commit cites a decision that does not exist in the registry;",
    "a decision line has no signer;",
    "a decision's SHA does not resolve to an object in the tree;",
    "a commit cites a decision that is still a draft;",
    "a line has neither a signer nor the draft state.",
  ],
  fecho:
    "It does not fail on an example inside a fenced code block. A fabricated SHA " +
    "used to illustrate the format is documentation, not a decision, and the " +
    "validator counts it as neither.",
} as const;

export const fronteira: SecaoDeTexto = {
  titulo: "The authorship frontier",
  paragrafos: [
    [
      "The registry can declare an authorship frontier. After that point, a commit " +
        "without a signature from a trusted key fails, and the run says so in those " +
        "terms — the failure is explained by the frontier, and the verification " +
        "environment is printed alongside it.",
    ],
    [
      "Outside frontier mode, a commit without a key is reported as a warning. " +
        "It does not fail the run.",
    ],
  ],
};

export const exigencia: SecaoDeTexto = {
  titulo: "The instance declares the requirement",
  paragrafos: [
    [
      "Shizune ships no trust list of its own. An instance declares, in a file, that " +
        "signing a decision requires a trusted key. The same citation that passes " +
        "without that declaration fails with it.",
    ],
    [
      "When it fails, the run states that the requirement came from the instance and " +
        "not from the framework, and prints the commit's ",
      { literal: "%G?" },
      " code. A declared requirement the validator does not recognise is itself a " +
        "failure — an unknown token does not pass silently.",
    ],
  ],
};

/**
 * A ressalva. É a seção mais longa e a mais importante da rota, e a única que
 * ganha painel próprio — sem borda colorida à esquerda, que é tique de página
 * gerada. Ela existe para dizer o que a assinatura NÃO prova, e o site inteiro
 * depende de ela estar ali.
 */
export const ressalva = {
  titulo: "What a signature does and does not show",
  paragrafos: [
    "A verified commit shows that a trusted key signed it. It does not show that a " +
      "particular human wrote the content, and it is not evidence of authorship.",
    "The three layers do not replace one another. The watermark says what the machine " +
      "wrote. The key says who pushed. The registry says what the human decided.",
  ],
  adjacente:
    "Adjacent projects draw the same line. Sigstore's threat model separates a " +
    "signature coming from a controlled identity from the question of whether that " +
    "identity should be trusted — the signature is evidence about a key, and trust " +
    "is a policy you still have to state.",
  instancia: [
    { rotulo: MEDIDO_EM_INSTANCIA },
    " the instance's own key has required a passphrase since 2026-09-06. That is a " +
      "fact about one instance's configuration, not a property of the tool.",
  ] as Frase,
} as const;

export const testeNegativo = {
  titulo: "The negative test",
  texto:
    "The validator's behaviour is proven by a test that constructs records which must " +
    "be rejected, asserts the rejection, and then reports a passing run. It also " +
    "guards its own instruments: that the trailer extractor actually extracted, that " +
    "a text with no trailer counts zero citations, that a summary line does not " +
    "report success when the result was a failure.",
} as const;

export const entrega = {
  titulo: "What the method delivers",
  texto:
    "A numbered record of decisions with a handle that never moves; a cross-check " +
    "between what is written and what the tree contains; a trust boundary declared " +
    "by the instance rather than assumed by the tool; and a validator whose refusals " +
    "are themselves tested.",
  instancia: [
    { rotulo: MEDIDO_EM_INSTANCIA },
    " 19 decisions, of which 14 are current and 5 are drafts. Seven contributions " +
      "sent to third-party repositories, two accepted.",
  ] as Frase,
} as const;

/**
 * A seção não tem assinatura própria, e a ausência é deliberada.
 *
 * O texto final da rota, como o revisor o escreveu, fechava com a linha
 * "Shizune — by Cadu Azeredo". O rodapé global diz a mesma coisa sessenta
 * pixels abaixo, e a forma composta aparecia duas vezes seguidas na mesma tela
 * — que é exatamente o vício que a regra do rodapé único existe para impedir.
 *
 * Decisão do operador, 2026-09-09, depois que o portão contou quatro marcas
 * nesta rota e três nas outras: **a linha do texto sai, o rodapé global fica.**
 * A colisão foi erro do revisor ao escrever o texto, e a regra do rodapé único
 * ganha. Não recoloque a linha aqui: quem assina a página é o rodapé.
 */
export const licenca = {
  titulo: "License and name",
  texto: [
    "Apache-2.0. Shizune™. The licence covers the code and does not license the name " +
      "— the repository's ",
    { literal: "README.md" },
    " states the naming policy under “Trademark and naming”.",
  ] as Frase,
} as const;
