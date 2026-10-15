/**
 * O texto da rota `/roadmap`.
 *
 * Fonte: a tela 13 do design (`projects/brain-launch/design/13-roadmap-en.page.html`
 * no Brain). Os degraus estão em `degraus.ts`; o estado de cada um vem da ficha
 * da release, a mesma fonte do livro razão.
 *
 * Uma frase do design mudou, porque ela foi escrita antes da release e deixou de
 * ser verdade quando a release saiu: "State as of today, before the next release.
 * When it ships, the first step turns to done and the next one to now". Com a
 * release publicada, o primeiro degrau JÁ é done. A frase nova diz o mesmo
 * mecanismo sem depender de qual degrau está em qual estado.
 *
 * PROPAGAÇÃO — ver AGENTS.md § 8.
 */
export const cabeca = {
  rotulo: "/roadmap",
  titulo: "Roadmap",
  texto: "Each step closes one threat and publishes one proof. Steps have names, not numbers.",
} as const;

export const degraus = {
  ancora: "steps",
  titulo: "The six steps",
  nota:
    "State as read from the release card of the latest release. When the next release ships, " +
    "the step in progress turns to done and the next one to now, in the same pull request that " +
    "updates this page.",
  oQueFecha: "What closes it",
  /** A marca do item que nomeia fornecedor de IA, até a fonte ser conferida. */
  rascunhoFornecedor: "draft · vendor name, source to check",
  prova: "Proof to publish",
  quandoFeito: "When it is done",
  registro: "The release notes and the CHANGELOG section become the record of this step.",
} as const;

export const feito = {
  ancora: "done",
  titulo: "Already done",
  /**
   * O que veio antes dos seis degraus. A data e a âncora do CHANGELOG são do
   * pacote: a seção da v0.4.1, de 2026-09-10, é a que trouxe a chave de máquina e
   * a conferência do assinante contra a chave.
   */
  antes: {
    titulo: "A trusted key that is not the owner’s",
    texto:
      "The validator checks who signed against the declared key, and a machine key can be " +
      "declared. Released on 2026-09-10.",
    ancoraNoChangelog: "CHANGELOG.md#041---2026-09-10",
  },
  /** Para cada degrau que a ficha marca como feito. A data é a da release da ficha. */
  degrauFeito: (data: string): string =>
    `Closed in the latest release, on ${data}. The release notes and the CHANGELOG section are its record.`,
  notas: "Release notes →",
  rodape:
    "The history in English lives in the release notes and the CHANGELOG. This list links to them.",
} as const;

export const cadeia = {
  ancora: "chain",
  rotulo: "outside the steps",
  titulo: "The chain: release to sites",
  texto:
    "Each site checks the latest public release on a schedule and opens a pull request on a " +
    "preview branch in its own repository. The pull request carries the release card’s diff and " +
    "passes the site’s gate. The merge stays with the owner. The browser never fetches anything live.",
  ameacaRotulo: "Threat",
  ameaca: "A credential that crosses repositories; a number that changes without anyone seeing.",
  provaRotulo: "Proof to publish",
  prova: "Seven negative tests run in test repositories. Without them, the chain is not claimed.",
} as const;

export const depois = {
  ancora: "later",
  titulo: "After the steps",
  item: {
    titulo: "A real-time approval panel",
    texto:
      "It signs on your device and never stores a key. Threat: the panel’s own new surface. " +
      "Proof: a penetration test before it opens.",
  },
} as const;
