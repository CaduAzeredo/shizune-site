/**
 * O texto da rota `/method`.
 *
 * Fonte: a tela 11 do design (`projects/brain-launch/design/11-method.page.html`
 * no Brain), conferida pela verificação de 15/10. **Nenhuma frase do design foi
 * reescrita.** Uma diferença, declarada aqui:
 *
 * - "Where the method ran" traz as duas contagens do design E, abaixo delas, a
 *   lista das sete contribuições com link, que vivia nesta rota desde 16/09. A
 *   regra do operador para contribuição em página é "com link, o estado de cada
 *   uma, a data da medição e o comando" (16/09) — a contagem sozinha não cumpre
 *   a parte do link.
 *
 * O estado da lista foi relido em 15/10 (ver o bloco `contribuicoes`).
 *
 * Saíram desta rota, na troca para o design de 15/10 (o texto antigo continua no
 * histórico do git, e volta se o operador pedir): a história das origens, a
 * fronteira de autoria, a exigência declarada pela instância, o parágrafo sobre
 * o modelo de ameaça do Sigstore e a contagem de decisões medida na instância
 * privada.
 *
 * As contagens de contribuição rodam contra o GitHub, e não contra o clone: o
 * valor, o comando e o dia da medição estão aqui, e a página diz que roda contra
 * o GitHub. A soma é por `awk`: o design usava `bc`, que não existe em toda
 * máquina — no Git Bash do Windows não existe, e o comando falhava ali.
 *
 * PROPAGAÇÃO — ver AGENTS.md § 8.
 */
import type { Frase } from "./prosa";

export const oQueE = {
  ancora: "what",
  rotulo: "/method",
  titulo: "The method",
  texto:
    "A thin decision-registry layer on top of git. It records what was decided as numbered " +
    "lines, and cross-checks that record against what git already knows.",
  papeis: [
    { quem: "the machine", verbo: "drafts", resto: " the decision" },
    { quem: "you", verbo: "sign", resto: " it with your key" },
    { quem: "the command", verbo: "verifies", resto: " the record against git" },
  ],
} as const;

export const registro = {
  ancora: "registry",
  titulo: "The registry",
  chamada:
    "Each decision is one numbered line, DEC-NNN, with its text, its state, its signer and the " +
    "SHA of the commit that approved it. A number is assigned once and never reused.",
  rascunho: { rotulo: "a draft · does not count", linha: "DEC-‹NNN› · rascunho, assinatura pendente" },
  vigente: { rotulo: "signed · counts", linha: "DEC-‹NNN› · vigente · ‹signer› · ‹sha›" },
  nota: 'Only two states. "Superseded" is a rule in prose, never a state: the old decision keeps its number.',
} as const;

export const oQueReprova = {
  ancora: "fails",
  titulo: "What fails",
  chamada:
    "Each of these fails the build, and the output says why. Every one is an assertion in the " +
    "negative test you can run.",
  marca: "◆ fails",
  casos: [
    { titulo: "Commit cites DEC-999", texto: "The decision does not exist in the registry." },
    { titulo: "Decision without a signer", texto: "A row that counts must name who signed it." },
    { titulo: "Signature SHA does not resolve", texto: "The approving commit is not in the tree." },
    { titulo: "Decision signed by a machine key", texto: "A key marked maquina signs drafts, never decisions." },
    { titulo: "Draft cited by a commit", texto: "A draft exists, but nothing may steer a commit until it is signed." },
    { titulo: "Nivel: N2 in a trailer", texto: "N2 is never declared. It is proven by a signature." },
    { titulo: "Delegation to a draft", texto: "A delegation must point at a signed decision." },
    { titulo: "N1 commit without Autorizado-por", texto: "Delegated work must name the delegation it uses." },
  ],
  rotuloDoComando: "terminal · clean clone, latest release",
} as const;

export const niveis = {
  ancora: "levels",
  titulo: "Levels and delegation",
  chamada:
    "Not every choice needs a signed row. The levels say who may decide a class of thing, and " +
    "what trace it leaves. N0 and N1 exist only inside a delegation, and the delegation is " +
    "itself a signed N2 decision.",
  lista: [
    {
      nivel: "N0",
      nome: "Micro",
      exemplo: "formatting, a local rename, picking among options already allowed",
      quem: "the agent, or a fixed rule",
      rastro: "none per item; only the delegation",
      humano: false,
    },
    {
      nivel: "N1",
      nome: "Machine",
      exemplo: "a library from an approved list; an existing policy on a new case",
      quem: "the agent, with its machine key",
      rastro: "a commit on a draft branch, with the level trailer",
      humano: false,
    },
    {
      nivel: "N2",
      nome: "Human",
      exemplo: "architecture, data, money, a rule that becomes code, anything irreversible",
      quem: "the owner",
      rastro: "a signed row in the registry",
      humano: true,
    },
  ],
  rotulos: { exemplo: "example", quem: "who decides", rastro: "trace" },
  arquivo: {
    rotulo: "governance/delegacoes.txt · one line per class",
    linha: "delega N1 approved-dependencies autorizado_por DEC-NNN",
  },
  commit: { rotulo: "the commit that uses it", linha: "Nivel: N1\nAutorizado-por: DEC-NNN" },
  nota:
    "Without the file nothing changes, and the summary says no delegation is declared. Expiry " +
    "dates and quorum are not part of this step.",
} as const;

export const garantia = {
  ancora: "backing",
  titulo: "What backs a decision",
  chamada:
    "For every signed row the validator works out what backs it from git, and never takes it " +
    "from the table. A field a person fills in can lie; one derived from git cannot.",
  tipos: [
    { nome: "chave", texto: "A good signature from the signer’s declared human key." },
    { nome: "plataforma", texto: "A merge accepted by the platform route below. Weaker than a key." },
    { nome: "nenhuma", texto: "Nothing backs it. The summary counts it." },
  ],
  rotuloDoComando: "terminal · for scripts",
  comando: "bun scripts/validate-decisions.mjs --json",
  saida: '{ "id": "DEC-‹NNN›", "garantia": "chave", "sha": "‹sha›" }',
} as const;

export const merge = {
  ancora: "merge",
  titulo: "Merge as a signature",
  desligado: "off by default",
  chamada:
    "An optional route. A merge commit created by GitHub can count as the named signer’s " +
    "decision, but only where your instance declares it, and only after you measure that your " +
    "agent cannot press the same button.",
  cabecas: ["A platform merge counts only if", "Why"],
  condicoes: [
    { se: ["it has two parents"], porque: "squash and rebase leave one parent and an editable message" },
    { se: ["it verifies as ", { literal: "G" }, " against the platform key"], porque: "the key is imported and trusted, never assumed" },
    { se: ["its author is the declared email"], porque: "the account that pressed merge" },
    { se: ["that author is a person, not an app"], porque: "an app is a machine" },
    { se: ["that person wrote none of the pull request’s commits"], porque: "nobody approves their own work" },
  ] as ReadonlyArray<{ readonly se: Frase; readonly porque: string }>,
  porQueDesligado: {
    titulo: "Why it is off: our own measurement said no",
    texto:
      "On 2026-10-14, in a public test repository, the agent’s cloud credential turned out to be " +
      "the operator’s own account, with admin rights and a bypass for pull requests. A merge by " +
      "the agent would have been indistinguishable from a merge by the operator. So the " +
      "directive stays off in our instance.",
    rotuloDoComando: "terminal · run with the agent’s credential, never yours",
    comandos: [
      "gh api user --jq '.login, .type'",
      "gh api repos/OWNER/REPO --jq '.permissions'",
      "gh api repos/OWNER/REPO/rulesets/RULESET_ID --jq '.current_user_can_bypass'",
      "gh api -X PUT repos/OWNER/REPO/pulls/9999/merge",
    ],
    resultado: "◆ 2026-10-14: the agent could merge",
    consequencia: "route stays off",
  },
  plano:
    "On a private repository, branch rulesets need a paid GitHub plan. On the free plan, " +
    "creating one returns 403.",
} as const;

export const assinatura = {
  ancora: "signature",
  titulo: "What a signature does and does not show",
  mostra: {
    rotulo: "● shows",
    texto:
      "Which key signed. That the signer named in the row matches the key’s principal. That a " +
      "machine key did not sign a decision.",
  },
  naoMostra: {
    rotulo: "◆ does not show",
    texto:
      "Who wrote the content. That the decision is good. Any saving in time, tokens or money: " +
      "none is measured, so none is claimed.",
  },
} as const;

/** As âncoras são as que o GitHub gera dos títulos do QUICKSTART do pacote. */
export const guias = {
  ancora: "guides",
  titulo: "Guides",
  chamada: "Each one lives in the quickstart, in the repository, next to the commands it uses.",
  lista: [
    { titulo: "Adopting it in a repository that already exists", secao: "QUICKSTART §2b →", ancora: "2b-adopting-shizune-in-a-repository-that-already-exists" },
    { titulo: "More than one person", secao: "QUICKSTART §6 →", ancora: "more-than-one-person" },
    { titulo: "Squash, rebase, and the two things that break", secao: "QUICKSTART §6 →", ancora: "squash-rebase-and-the-two-things-that-break" },
    { titulo: "Delegating small decisions: N0 and N1", secao: "QUICKSTART §6 →", ancora: "delegating-small-decisions-levels-n0-and-n1" },
    { titulo: "Giving an agent its own key", secao: "QUICKSTART §6 →", ancora: "giving-an-agent-its-own-key" },
    { titulo: "If a key leaks", secao: "QUICKSTART §6 →", ancora: "if-a-key-leaks" },
    { titulo: "A merged pull request as a signature", secao: "QUICKSTART §6 →", ancora: "a-merged-pull-request-as-a-signature-off-by-default" },
  ],
  chaveVazada: {
    resumo: "▸ If a key leaks: the six steps",
    passos: [
      "Take the key off the trust list, in a commit signed by another human key.",
      "Mark the cut-off date on the line, so earlier history stays verifiable.",
      "List what the key signed after the probable exposure.",
      "Re-sign each decision that still holds; revoke the rest with a new decision.",
      "Rotate the neighbouring credentials: the agent’s, the CI’s, the platform’s.",
      "Record the incident as a dated decision.",
    ],
  },
} as const;

export const formato = {
  ancora: "format",
  titulo: "The format",
  marca: "se aprovado · especificação v0",
  texto:
    "A short specification of the registry format, separate from the tool, so another " +
    "implementation can read the same file. Draws here only after the proposal is signed.",
} as const;

/**
 * As contribuições — o único bloco desta rota que roda contra o GitHub.
 *
 * As duas contagens foram medidas em 2026-10-15, com os dois comandos abaixo, e o
 * estado de cada linha da lista foi relido no mesmo dia (uma busca por
 * repositório, a mesma do comando). `estado` é fato do dia da medição, não
 * propriedade da contribuição, e por isso a lista carrega a própria data. O que
 * mudou desde 16/09: a issue do cognee foi fechada como concluída em 2026-10-04 —
 * é ela que faz as aceitas serem 3, e não 2.
 *
 * **Nenhuma contagem de achados aqui** — nem por alvo, nem agregada (decisão do
 * operador em 2026-09-16). A evidência são os links.
 */
const REPOS = "rohitg00/agentmemory mem0ai/mem0 topoteretes/cognee TeleAI-UAGI/Awesome-Agent-Memory";

export interface Contribuicao {
  readonly repo: string;
  readonly numero: number;
  readonly tipo: "issue" | "pull request";
  readonly estado: string;
  readonly url: string;
}

export const contribuicoes = {
  ancora: "contrib",
  titulo: "Where the method ran",
  chamada:
    "The method was pointed at four public agent-memory repositories. Each number below is " +
    "printed by the command next to it, not typed on this page.",
  medidoEm: "2026-10-15",
  rotuloDoComando: "terminal · runs against GitHub, needs gh signed in",
  abertas: {
    valor: 7,
    texto: [
      { forte: "Issues and pull requests opened by CaduAzeredo" },
      " in the four repositories, open or closed.",
    ] as Frase,
    comando: `for r in ${REPOS}; do gh api "search/issues?q=repo:$r+author:CaduAzeredo" --jq '.total_count'; done | awk '{s+=$1} END {print s}'`,
  },
  aceitas: {
    valor: 3,
    texto: [
      { forte: "Of those, accepted:" },
      " pull requests merged, plus issues the maintainer closed as completed.",
    ] as Frase,
    comando: `for r in ${REPOS}; do for q in 'is:pr+is:merged' 'is:issue+reason:completed'; do gh api "search/issues?q=repo:$r+author:CaduAzeredo+$q" --jq '.total_count'; done; done | awk '{s+=$1} END {print s}'`,
  },
  nota:
    "Not the same count as the evidence notebook’s “findings resolved by third parties”: that " +
    "one counts findings, these count contributions. Each label says which.",
  lista: {
    titulo: "Every one is public, with a link",
    estadoEm: "State as of 2026-10-15.",
    itens: [
      { repo: "TeleAI-UAGI/Awesome-Agent-Memory", numero: 98, tipo: "pull request", estado: "merged 2026-09-01", url: "https://github.com/TeleAI-UAGI/Awesome-Agent-Memory/pull/98" },
      { repo: "TeleAI-UAGI/Awesome-Agent-Memory", numero: 100, tipo: "issue", estado: "closed as completed 2026-09-03", url: "https://github.com/TeleAI-UAGI/Awesome-Agent-Memory/issues/100" },
      { repo: "mem0ai/mem0", numero: 7202, tipo: "issue", estado: "open", url: "https://github.com/mem0ai/mem0/issues/7202" },
      { repo: "topoteretes/cognee", numero: 4865, tipo: "issue", estado: "closed as completed 2026-10-04", url: "https://github.com/topoteretes/cognee/issues/4865" },
      { repo: "rohitg00/agentmemory", numero: 1313, tipo: "issue", estado: "open", url: "https://github.com/rohitg00/agentmemory/issues/1313" },
      { repo: "rohitg00/agentmemory", numero: 1314, tipo: "issue", estado: "open", url: "https://github.com/rohitg00/agentmemory/issues/1314" },
      { repo: "rohitg00/agentmemory", numero: 1315, tipo: "issue", estado: "open", url: "https://github.com/rohitg00/agentmemory/issues/1315" },
    ] as readonly Contribuicao[],
  },
} as const;
