/**
 * O texto da rota `/evidence`.
 *
 * Fonte: a tela 12 do design (`projects/brain-launch/design/12-evidence-en.page.html`
 * no Brain). **Nenhuma frase do design foi reescrita.** Os valores e as marcas
 * "example" do design saíram: cada valor vem agora da ficha da release
 * (`ficha.ts`), e a frase "The value is an example until the release-day
 * measurement replaces it" saiu com eles, porque a medição do dia da release é
 * a que está na página.
 *
 * A regra da página: só entra prova que um estranho roda num repositório
 * público. Por isso nenhum número da instância privada aparece aqui.
 *
 * PROPAGAÇÃO — ver AGENTS.md § 8.
 */
export const cabeca = {
  rotulo: "/evidence",
  titulo: "Evidence",
  texto:
    "Every claim on this site, the command that checks it in the public repository, and when " +
    "it was last measured. If you can’t run it yourself, it is not here.",
} as const;

export const comoLer = {
  ancora: "state",
  titulo: "How to read the state",
  legenda: [
    { marca: "● reproduced", estado: "reproduzida" },
    { marca: "◐ outdated", estado: "desatualizada" },
    { marca: "◆ failed", estado: "falhou" },
    { marca: "○ not measured yet", estado: "nao-medida" },
  ],
  desatualizada: "Outdated",
  explicacao:
    " means the measurement is not from the SHA of the latest release. It says nothing about " +
    "how many days have passed.",
} as const;

export const afirmacoes = {
  ancora: "claims",
  titulo: "Claims you can run",
  chamada: "Each one runs in a clean clone of the public repository.",
  rotuloDoComando: "terminal · clean public clone",
  mostra: "shows:",
  naoMostra: "does not show:",
  validador: {
    titulo: "The validator refuses what it must",
    texto: "assertions in its own negative test, inside one file. Not a suite of separate tests.",
    mostra: "How many cases the validator must refuse or accept.",
    naoMostra: "That it is right beyond those cases.",
  },
  chaveDeMaquina: {
    titulo: "A machine key cannot sign a decision",
    texto:
      "The negative test points a decision at a commit signed by a key marked maquina, and " +
      "expects a refusal that names the key.",
    mostra: "That draft work and decisions are signed by different keys.",
    naoMostra: "Who held the human key.",
  },
  doctor: {
    titulo: "The doctor does not count n/a as passed",
    texto: "is the closing line on an exported tree: two steps have nothing to check there and say so.",
    mostra: "That every step either ran or said it could not.",
    naoMostra: "That the steps you skip would pass.",
  },
  pacote: {
    titulo: "What you clone",
    texto: "files in the public package.",
    mostra: "How much you clone.",
    naoMostra: "How good any of it is.",
  },
  contribuicoes: {
    titulo: "Contributions opened in public repositories",
    texto:
      "issues and pull requests opened by CaduAzeredo in four public agent-memory repositories. " +
      "The value is printed by the command, not typed here.",
    mostra:
      "That every contribution is public, with a link. How many were accepted is a separate " +
      "count: merged pull requests plus issues closed as completed.",
    naoMostra:
      "That the projects are worse than others: there was no comparison. It is not the evidence " +
      "notebook’s count of findings resolved by third parties, which counts findings.",
    rotuloDoComando: "terminal · runs against GitHub, needs gh signed in",
    ondeRoda: "runs against GitHub, not the clone",
  },
} as const;

export const naoAfirmamos = {
  ancora: "noclaim",
  titulo: "What we do not claim",
  itens: [
    { titulo: "◆ Human authorship", texto: "A signature shows which key signed, never who wrote the content." },
    { titulo: "◆ Savings", texto: "No gain in time, tokens or cost has been measured, so none is claimed." },
    { titulo: "◆ A good decision", texto: "The record proves a decision was signed, not that it was right." },
  ],
} as const;

export const encaixe = {
  ancora: "fits",
  rotulo: "Where Shizune fits",
  titulo: (porExtenso: string): string => `${porExtenso} neighbors. One missing link.`,
  texto:
    "Every neighbor we found records what the machine did, or holds an action until someone " +
    "approves. None of the ones we found ties that action to a signed human decision that a " +
    "command checks.",
  faixas: [
    { rotulo: "● the neighbors", texto: "Record what the machine did.", produto: false },
    { rotulo: "● the neighbors", texto: "Hold an action until someone approves.", produto: false },
    { rotulo: "◆ Shizune", texto: "Ties that action to a signed human decision, and a command checks it.", produto: true },
  ],
  nota:
    "A map of fit, not a comparison. Each row is a reading of a public source, with the link and " +
    "the date we read it. A row stays marked as a draft until its link is checked. If you know a " +
    "tool that closes the gap, open an issue and the row goes in.",
  colunas: ["Neighbor", "What it solves", "The gap", "Where Shizune connects", "Step"],
  fonte: "source",
  lidaEm: "read",
  semFonte: "‹primary link›",
  semData: "‹date›",
  rascunho: "draft · link to check",
  rodape: "The last column uses the roadmap’s steps.",
  verDegraus: "See the six steps →",
} as const;
