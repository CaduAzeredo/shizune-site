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
  /**
   * Desenha a parte como painel, com o traçado de conteúdo ao lado do título.
   *
   * Vale **só dentro de `origens`**, e só numa parte. São dois painéis na rota,
   * e o segundo existe para ecoar o primeiro: a ressalva diz o que a assinatura
   * não prova; "What the project stopped believing" conta o dia em que o
   * projeto descobriu isso na própria pele. Mesma afirmação, dois registros —
   * um normativo, um narrativo —, e a mesma superfície é o que liga os dois.
   *
   * **Não haverá um terceiro.** Três painéis e três glifos seriam o abuso da
   * regra de lugares contados que já foi reprovada duas vezes.
   */
  readonly painel?: boolean;
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
 * A história — a última seção de CONTEÚDO da rota.
 *
 * Escrita pelo revisor em 2026-09-09 a partir do levantamento do executor, e
 * entra com quatro mudanças, todas ratificadas pelo operador no mesmo dia:
 *
 * 1. **"the next day"**, e não "two days later": a DEC-014 (nome) é de 02/09 e
 *    o ADR-044 (marca) é de 03/09 — um dia. O erro nasceu na prosa do
 *    levantamento, cuja tabela trazia as duas datas certas.
 * 2. **"one major model provider"**, e não "a large language model": foi um
 *    fornecedor, não a indústria. Continua sem nome, pelo ADR-035.
 * 3. **"Measured on 2026-09-01"** colado às 240 mil estrelas — contagem de
 *    estrela muda todo dia, e o número não pode depender do antecedente da
 *    frase anterior.
 * 4. **"measured on that machine"** colado aos 36 ms — é o tempo naquela
 *    máquina, não uma propriedade da assinatura. É a diferença entre medição e
 *    alegação.
 *
 * Cada marco tem data e está ancorado num ADR ou numa DEC. A origem é relato do
 * operador, rotulado como tal na própria seção, porque não existe em documento
 * versionado — e é esse fato que abre a história.
 *
 * FICA DE FORA, de propósito: o material de neurociência que o repositório
 * classifica como baixa evidência; nome de repositório de terceiro, de cliente
 * ou de fornecedor de IA; e qualquer afirmação de que assinatura prova autoria
 * humana. A frase sobre acreditar nisso está no passado e é desmentida na mesma
 * frase — é o ponto da seção, não um deslize.
 */
export const origens = {
  titulo: "Origins",
  partes: [
    {
      titulo: "It started as the opposite of what it is",
      paragrafos: [
        [
          "Shizune began as a memory problem. The operator wanted an assistant that " +
            "could be spoken to and would act — and, underneath it, somewhere to keep " +
            "what he could not hold in his head. His own words: he wanted to store " +
            "things because his memory is bad.",
        ],
        [
          "Two projects needed to stay in sync. Notes accumulated across tools that " +
            "did not talk to each other. The question being asked was: how does the " +
            "machine remember?",
        ],
        [
          "What came out answers the opposite question: how does a human prove what " +
            "they decided? Not a store that remembers for you — a record that counts " +
            "only once you sign it.",
        ],
        [
          "There is a detail worth admitting here. This project exists to record " +
            "decisions, and the decision that started it is the only one with no " +
            "record. The first architecture decision, dated 2026-08-25, names the " +
            "repository and states its purpose; it does not say why the name was " +
            "chosen, and nothing written down explains the intent behind it. The " +
            "account above is the operator's, from memory, recorded here as that and " +
            "nothing more.",
        ],
      ],
    },
    {
      titulo: "The record came before the history",
      paragrafos: [
        [
          "For two days the project deliberately had no version control — a written " +
            "decision, ADR-004, postponed it. Documents were being kept before commits " +
            "were. On 2026-08-27, ADR-017 reversed that, and the first commit landed " +
            "two days after the first decision.",
        ],
        ["The order is backwards from the intuitive one, and it is documented."],
      ],
    },
    {
      titulo: "The question that turned it into a product",
      paragrafos: [
        [
          "On 2026-08-02, one major model provider began watermarking the text its " +
            "models generate. That answered a question — which tool touched this text " +
            "— and the source itself was explicit that it could not answer a different " +
            "one: a watermark can indicate a model was likely involved at some point, " +
            "and no more.",
        ],
        [
          "On 2026-09-01, that gap became the axis of the project. The watermark says " +
            "what the machine wrote. The key says who pushed. Nobody was recording " +
            "what the human decided.",
        ],
        [
          { rotulo: "Measured on 2026-09-01:" },
          " the three largest projects in the scaffolding layer carried more than " +
            "240,000 stars between them, and none treated a decision as something that " +
            "could be required. The scaffold stopped being the product and became a " +
            "commodity. If this project has a single turning point, it is that one.",
        ],
      ],
    },
    {
      titulo: "The record, then the validator",
      paragrafos: [
        [
          "The numbered DEC-NNN record was fixed on 2026-09-01 and entered version " +
            "control the next day. The validator and its negative test were born in " +
            "the same commit — the test is not an afterthought to the tool; they are " +
            "the same age.",
        ],
        [
          "The draft state arrived with it, to settle a problem the record creates for " +
            "itself: a decision is signed by a SHA that does not exist until the " +
            "decision is signed. So the machine drafts, the human signs, and the SHA " +
            "activates.",
        ],
        [
          "The authorship frontier followed on 2026-09-02, and on 2026-09-05 the rule " +
            "that a trusted key is required to sign — declared by the instance, never " +
            "by the script.",
        ],
      ],
    },
    {
      titulo: "The name",
      paragrafos: [
        [
          "The product was called something else first. On 2026-09-01 a candidate name " +
            "was rejected at the availability gate: the .dev domain was taken by a " +
            "product in the same category, which a suffix does not fix. That rejection " +
            "produced a rule — availability is checked before a name is proposed, " +
            "never after one is chosen.",
        ],
        [
          "Shizune (静音, quiet sound) cleared the gate on 2026-09-02. The brand " +
            "followed the next day, and the gap is the point: the old naming decision " +
            "was still in force, and applying a new name to the package while an older " +
            "decision fixed the old one would have made the repository claim two " +
            "brands at once. The decision comes first.",
        ],
      ],
    },
    {
      titulo: "What the project stopped believing",
      painel: true,
      paragrafos: [
        [
          "This is the part worth reading closely, because it is where the caveat " +
            "above comes from.",
        ],
        [
          "For a time, this project believed that a commit signed with a key proved a " +
            "human was present. On 2026-09-04, that was tested and found false: the " +
            "private key had no passphrase, so any process running as the user — " +
            "including an agent session — could sign in 36 milliseconds with no prompt, ",
          { rotulo: "measured on that machine" },
          ". A decision that had been treated as signed was reverted to draft, and the " +
            'commit that "signed" it was declared invalid as a signature.',
        ],
        [
          "Two days later, four earlier decisions were re-signed, because their " +
            "original signatures were commits carrying no key at all. The defect was " +
            "written into each line rather than corrected quietly.",
        ],
        [
          "And in September, a two-day diagnosis reached the wrong cause because the " +
            "method failed before the diagnosis did: for two days, a status code was " +
            "being read instead of the body of the response. The rule that came out of " +
            "it — check the string in the body, never the status alone — is now " +
            "enforced by the tests of this very site.",
        ],
        [
          "None of that is incidental. A tool that claims to verify has to survive " +
            "being verified, and each of those was found by running a command, not by " +
            "reading carefully.",
        ],
      ],
    },
    {
      titulo: "Where the study came from",
      paragrafos: [
        [
          "The ADR format comes from Michael Nygard's 2011 note on documenting " +
            "architecture decisions — the foundation the rest is built on. The working " +
            "pipeline was shaped by published material on agent engineering; the skill " +
            "format follows the documented specification. Documentation structure " +
            "follows Diátaxis; commits follow Conventional Commits; the changelog " +
            "follows Keep a Changelog; versions follow SemVer.",
        ],
        ["The full reference list ships with the package."],
      ],
    },
    {
      titulo: "Still open",
      paragrafos: [
        [
          "The signing mechanism is a written open question: SSH, GPG, or something " +
            "built on an existing transparency system. It is recorded as open rather " +
            "than settled.",
        ],
      ],
    },
  ] as readonly SecaoDeTexto[],
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
