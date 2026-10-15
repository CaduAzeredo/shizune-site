/**
 * O texto da rota `/`.
 *
 * Fonte: o design da home v3 (`projects/brain-launch/design/shizune-design-06-home-v3-en.page.html`
 * no Brain), com o ajuste da tela 10 nos números. **Nenhuma frase do design foi
 * reescrita para caber.** Três mudanças, todas porque o design foi desenhado
 * antes da release e marcava valores como exemplo:
 *
 * 1. os números e as capturas saem da ficha da release (`ficha.ts`), e as marcas
 *    "exemplo" do design saíram junto com os valores de exemplo;
 * 2. a nota do Example 01 dizia "this one is marked as an example until release
 *    day" — a release saiu, e a frase passou a dizer de onde a captura vem;
 * 3. o passo 2 do "Start" mostrava uma saída desenhada ("‹n› etapas · ‹n›
 *    executam…"). O `doctor` não imprime isso: ele imprime a linha final que a
 *    ficha registrou, e é ela que aparece.
 *
 * "Against ourselves" fica como rascunho: os números vêm de um relatório da
 * instância privada sobre uma release antiga, o design os marca "a medir de
 * novo", e a regra deste site é que número que não se reproduz no clone público
 * não vai ao ar. Em produção a seção não aparece (ver `lib/publicacao.ts`).
 *
 * PROPAGAÇÃO — ver AGENTS.md § 8.
 */
import type { Frase } from "./prosa";

export const hero = {
  linhas: [
    { sujeito: "The machine ", verbo: "drafts." },
    { sujeito: "You ", verbo: "sign." },
    { sujeito: "The command ", verbo: "verifies." },
  ],
  /** A frase inteira, para a conferência do e2e. */
  frase: "The machine drafts. You sign. The command verifies.",
  subtitulo: "Who decided — and can you prove it?",
  texto:
    "Your AI agent remembers, but it obeys what was decided. A numbered decision, a " +
    "signed commit, and a command that fails the build when someone cites what was " +
    "never decided.",
  rejeitar: "See it reject a commit ↓",
  metodo: "Read the method",
  rodape: "Apache-2.0 · zero dependencies · Node 20+ or Bun",
} as const;

export const configurar = {
  titulo: "Set up Shizune",
  texto:
    "Paste this into your agent at the root of a Shizune clone. It reads the contract " +
    "first and asks before each step.",
  rotuloDoPrompt: "your agent · prompt",
  /**
   * O que a página mostra do prompt. O botão copia o prompt INTEIRO, que é o
   * `promptCompleto` abaixo, copiado do QUICKSTART do pacote sem mudança.
   */
  trecho:
    "You are at the root of a Shizune repository. Before doing anything:\n\n" +
    "1. Read AGENTS.md in full — it is the operating contract that governs how you write and what you may touch in this repository.\n" +
    "2. Read skills/README.md to learn the available skill pipeline (grill-with-docs -> domain-modeling -> to-spec -> implement -> handoff).\n\n" +
    "Then walk me through the pipeline for project <slug>: …",
  promptCompleto:
    "You are at the root of a Shizune repository. Before doing anything:\n\n" +
    "1. Read AGENTS.md in full — it is the operating contract that governs how you\n" +
    "   write and what you may touch in this repository.\n" +
    "2. Read skills/README.md to learn the available skill pipeline\n" +
    "   (grill-with-docs -> domain-modeling -> to-spec -> implement -> handoff).\n\n" +
    "Then walk me through the pipeline for project <slug>:\n" +
    "- Start with the grill-with-docs skill: interview me until you have enough\n" +
    "  facts, and fill in projects/<slug>/CONTEXT.md, marking as HYPOTHESIS\n" +
    "  anything I do not confirm with evidence.\n" +
    "- Advance one skill at a time, asking for my approval before moving on.\n" +
    "- Every .md file you create is born with the v2 frontmatter defined in\n" +
    "  AGENTS.md. When you finish, run bun scripts/doctor.mjs and fix every\n" +
    "  error before stopping.",
  origem: "from QUICKSTART.md · Setup prompt",
  promptInteiro: "full prompt →",
  ancoraDoPrompt: "setup-prompt",
  ouRode: "Or run it yourself:",
  comandos: ["git clone https://github.com/CaduAzeredo/shizune.git", "cd shizune", "bun scripts/doctor.mjs"],
  legendaTerminal: "runs in your terminal",
  legendaAgente: "goes to your agent",
} as const;

export const comoFunciona = {
  rotulo: "How it works",
  titulo: "Three parts. None of them does another one's job.",
  chamada:
    "The decision exists as a numbered line. Until a person signs it, it does not count, " +
    "and a commit that cites it fails.",
  partes: [
    {
      quem: "01 · the machine",
      titulo: "Drafts the decision",
      texto: [
        "A numbered line, marked ",
        { literal: "rascunho, assinatura pendente" },
        ". It exists. It does not count yet.",
      ] as Frase,
      linha: "DEC-‹NNN› · rascunho, assinatura pendente",
      comando: false,
    },
    {
      quem: "02 · you",
      titulo: "Sign it",
      texto: [
        "The signer and the SHA of the approving commit enter the line. The state becomes ",
        { literal: "vigente" },
        ".",
      ] as Frase,
      linha: "DEC-‹NNN› · vigente · ‹signer› · ‹sha›",
      comando: false,
    },
    {
      quem: "03 · the command",
      titulo: "Verifies it",
      texto: [
        "It cross-checks the record against git: the decision exists, the signer is there, the SHA resolves.",
      ] as Frase,
      linha: "node scripts/validate-decisions.mjs",
      comando: true,
    },
  ],
  camadas: [
    { rotulo: "● solved elsewhere", texto: "The watermark says what the machine wrote.", produto: false },
    { rotulo: "● solved elsewhere", texto: "The key says who pushed.", produto: false },
    { rotulo: "◆ this is Shizune", texto: "The registry says what the human decided.", produto: true },
  ],
  nota: "A signature shows which key signed — never who wrote the content.",
} as const;

export const exemplo01 = {
  ancora: "example-01",
  rotulo: "Example 01 · a commit cites a decision that does not exist",
  titulo: "What happens when a commit cites DEC-999?",
  chamada:
    "The negative test builds that commit on purpose and checks that the validator refuses " +
    "it. Guess first, then read what the command said.",
  prever: {
    titulo: "Predict",
    texto: "The registry has no DEC-999. Does the commit pass?",
    opcoes: ["It passes", "It fails"],
  },
  rodar: { titulo: "Run it", rotulo: "terminal · clean clone, latest release" },
  ler: {
    titulo: "Read what it said",
    texto:
      "The validator refuses with exit code 1 and names the reason: DEC-999 is not in the " +
      "registry. A refusal that does not explain itself would fail the test too.",
  },
  /** A seção da captura que este exemplo mostra, e as linhas que ele destaca. */
  secao: "[negativo]",
  destaques: ["commit que cita DEC inexistente", "explicou que o DEC-999 não existe"],
  rotuloSaida: "validator · code 1",
  detalhes: {
    resumo: "▸ How this run was verified, and what the output means",
    paragrafos: [
      [
        "The output is in Portuguese because it is the real capture, not a translation. Each ",
        { literal: "ok" },
        " is one assertion that passed; ",
        { literal: "reprovou" },
        " is the validator refusing, which is what the test expects.",
      ] as Frase,
      [
        "The run happened in a clean public clone. The page shows the capture from the release " +
          "card of the latest release, and the whole run is below.",
      ] as Frase,
    ],
    inteira: "The whole run",
  },
} as const;

export const exemplo02 = {
  ancora: "example-02",
  rotulo: "Example 02 · a draft that nobody has signed",
  titulo: "Can a draft decision count?",
  chamada:
    "The machine drafts freely. A draft that nothing cites passes. The moment a commit cites " +
    "it, the build fails until a person signs.",
  secao: "[rascunho]",
  destaques: ["rascunho REFERENCIADA por commit", "explicou que a decisão citada não está assinada"],
  rotuloSaida: "output · same command",
  codigos: { semCitacao: "uncited · 0", comCitacao: "cited · 1" },
  cartoes: [
    {
      rotulo: "uncited draft",
      texto: "Passes with code 0, counted as a draft, with a warning that a signature is pending.",
      reprova: false,
    },
    {
      rotulo: "cited draft",
      texto: "Fails with code 1. The output says the cited decision is not signed.",
      reprova: true,
    },
    {
      rotulo: "what this protects",
      texto: "The agent can write as many drafts as it likes. None of them can steer a commit until you sign.",
      reprova: false,
    },
  ],
} as const;

export const numeros = {
  ancora: "numbers",
  rotulo: "Numbers you can reproduce",
  titulo: "Every number comes with the command that produces it.",
  chamada:
    "Measured on a clean public clone at the latest release. Each one says what it shows and " +
    "what it does not.",
  asseracoes: {
    titulo: "assertions in the validator's negative test",
    texto: (n: number): string =>
      `Assertions inside one file — not a suite of ${n} tests. Shows how many cases the ` +
      "validator must reject or accept. Does not show that it is right beyond them.",
  },
  arquivos: {
    titulo: "files in the public package",
    texto: "Shows how much you clone. Does not show how good any of it is.",
  },
  doctor: {
    titulo: (passaram: number, na: number): Frase => [
      "checks in ",
      { literal: "doctor" },
      `: ${passaram} run, ${na} report n/a`,
    ],
    texto:
      "On an exported tree two checks have nothing to verify and answer n/a — the right " +
      "behaviour. Does not show that checks you skip would pass.",
  },
  todas: "Every claim, its command and its last measurement →",
} as const;

export const contraNos = {
  ancora: "against",
  /** Ver o cabeçalho: os números não se reproduzem no clone, e o design os marca "a medir de novo". */
  conferido: false,
  rotulo: "Against ourselves",
  titulo: "The same instrument, pointed inward.",
  chamada:
    "We ran Shizune against Shizune in a clean clone with an empty HOME. What it found, and " +
    "what happened to each finding, stays written — including the diagnosis we got wrong.",
  passos: [
    { valor: "5", texto: "findings on the first pass", rodape: "sha c248f75", fechado: false },
    { valor: "4", texto: "closed in code and text", rodape: "next release", fechado: false },
    { valor: "1", texto: "closed later; its first diagnosis was wrong", rodape: "2026-09-09", fechado: false },
    { valor: "0", texto: "open at the published SHA", rodape: "sha 0ccfe4f", fechado: true },
  ],
  limite: "Five portable checks are not an audit. There was no comparison with any other project.",
  limiteFonte: "— the limit, in the report's own words",
  marca: "draft · numbers from the published report, to measure again",
} as const;

export const comeco = {
  ancora: "start",
  rotulo: "Start",
  titulo: "Three commands. Nothing installed.",
  chamada:
    "No npm install, no package.json. The scripts use only builtins and run on any machine " +
    "with Bun or Node 20+, without talking to anyone.",
  nota: ["Nothing is deleted. A superseded record moves to ", { literal: "archive/" }, "."] as Frase,
  passo1: "terminal · step 1 of 3 · get the latest release",
  passo2: "terminal · step 2 of 3 · check the tree",
  passo2Saida: "expected closing line · from the release card",
  passo3: "terminal · step 3 of 3 · your first project",
  novoProjeto: "bun scripts/new-project.mjs my-project",
} as const;

export const ondeSeguir = {
  rotulo: "Where next",
  destinos: [
    { rota: "/method", texto: "How a decision is recorded, signed and checked." },
    { rota: "/evidence", texto: "Every claim, its command, its last measurement." },
    { rota: "/roadmap", texto: "What is done and what is next, by the threat each step closes." },
    { rota: "github", texto: "The code, the issues, and every release." },
  ],
} as const;
