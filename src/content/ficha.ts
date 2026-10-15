/**
 * A ficha da release, lida — só os campos que as páginas mostram.
 *
 * A fonte é `ficha-release.json`, cópia byte a byte do `shizune-release.json`
 * anexado à release mais recente do pacote (DEC-026 no Brain: a release é a
 * fonte, os sites são cópias). Quem troca o arquivo é a cadeia, num PR em
 * `preview/*`, ou `npm run ficha -- <arquivo>`, à mão. **Nada aqui é digitado:**
 * cada número, data e SHA desta página sai do arquivo, e cada número leva o
 * comando que o reproduz num clone limpo do pacote.
 *
 * A versão e a tag NÃO são importadas aqui, e isso é a regra "sem versão no texto
 * visível" escrita no empacotador: o JSON é importado campo a campo, e o que
 * nenhuma página lê fica fora do pacote. A versão entra num lugar só, o JSON-LD,
 * em `seo.ts`.
 */
import { chain, changelog, date, evidence, sha, steps } from "./ficha-release.json";
import { sha as shaDaReleaseMaisRecente } from "./release-mais-recente.json";

export type IdDegrau =
  | "agent-signs-for-owner"
  | "poisoned-index-or-memory"
  | "forged-attestation"
  | "tampered-generated-rules"
  | "approval-on-autopilot"
  | "long-lived-leaked-key";

export type EstadoDegrau = "done" | "now" | "todo" | "blocked";

/**
 * O estado de uma afirmação, pela regra da página `/evidence`:
 * medida no SHA da release mais recente é reproduzida; em outro SHA, desatualizada.
 * Desatualizada não fala de dias — fala de SHA.
 */
export type EstadoDaAfirmacao = "reproduzida" | "desatualizada" | "nao-medida";

interface Afirmacao {
  readonly id: string;
  readonly value: number | string;
  readonly command: string;
  readonly sha: string;
  readonly measured_at: string;
  readonly capture?: string;
  readonly runs_against?: string;
}

const afirmacoes = evidence as readonly Afirmacao[];
const afirmacao = (id: string): Afirmacao | undefined => afirmacoes.find((a) => a.id === id);

function exigir(id: string): Afirmacao {
  const a = afirmacao(id);
  if (!a) throw new Error(`ficha-release.json sem a afirmação "${id}"`);
  return a;
}

/**
 * "8 passaram, 2 n/a" ou "os 10 verificadores passaram" — as duas formas da
 * linha final do `doctor`. Qualquer outra forma é erro de leitura, e falha alto:
 * um número de checagem adivinhado seria o defeito que o `doctor` corrigiu.
 */
function lerDoctor(valor: string): { passaram: number; na: number; total: number } {
  const comNa = valor.match(/^(\d+) passaram, (\d+) n\/a$/);
  if (comNa) {
    const passaram = Number(comNa[1]);
    const na = Number(comNa[2]);
    return { passaram, na, total: passaram + na };
  }
  const semNa = valor.match(/^os (\d+) verificadores passaram$/);
  if (semNa) return { passaram: Number(semNa[1]), na: 0, total: Number(semNa[1]) };
  throw new Error(`linha do doctor que a página não sabe ler: "${valor}"`);
}

const doctor = exigir("doctor-summary");

export const ficha = {
  sha,
  shaCurto: sha.slice(0, 7),
  /** O dia da release. */
  data: date,
  /** A âncora da seção da release no CHANGELOG.md — sem número de versão. */
  changelog,
  /** A cadeia grava o SHA da release mais recente; diferente do desta ficha, a página está atrasada. */
  desatualizada: shaDaReleaseMaisRecente !== sha,
  asseracoes: Number(exigir("negative-test-assertions").value),
  arquivos: Number(exigir("package-files").value),
  doctor: { ...lerDoctor(String(doctor.value)), linha: `Resultado: OK — ${String(doctor.value)}.` },
  /** A saída do teste negativo, exatamente como o comando a imprimiu. */
  captura: (exigir("negative-test-output").capture ?? "").replace(/\r\n/g, "\n"),
} as const;

/** O comando que a ficha registrou para a afirmação — o mesmo que a página imprime. */
export function comandoDe(id: string): string {
  return exigir(id).command;
}

export function estadoDe(id: string): EstadoDaAfirmacao {
  const a = afirmacao(id);
  if (!a) return "nao-medida";
  return a.sha === sha ? "reproduzida" : "desatualizada";
}

export function medicaoDe(id: string): { readonly data: string; readonly shaCurto: string } {
  const a = exigir(id);
  return { data: a.measured_at, shaCurto: a.sha.slice(0, 7) };
}

const estados = new Map(
  (steps as ReadonlyArray<{ readonly id: string; readonly state: string }>).map((s) => [s.id, s.state]),
);

export function estadoDoDegrau(id: IdDegrau): EstadoDegrau {
  const e = estados.get(id);
  if (e === "done" || e === "now" || e === "todo" || e === "blocked") return e;
  throw new Error(`ficha-release.json sem estado válido para o degrau "${id}"`);
}

export const estadoDaCadeia = chain.state as EstadoDegrau;

export default ficha;
