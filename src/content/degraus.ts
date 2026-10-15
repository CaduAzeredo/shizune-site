/**
 * Os seis degraus do roadmap — os nomes e o que fecha cada um.
 *
 * Fonte: tela 13 do design (`projects/brain-launch/design/13-roadmap-en.page.html`
 * no Brain) e a DEC-025, que fixa os seis ids e os nomes em inglês e em
 * português. **Os nomes só mudam por decisão assinada.** O ESTADO de cada degrau
 * não está aqui: ele vem da ficha da release (`ficha.ts`), a mesma fonte do livro
 * razão. Um degrau "feito" escrito à mão seria a mesma edição à mão que a ficha
 * existe para impedir.
 */
import type { EstadoDegrau, IdDegrau } from "./ficha";

/**
 * Um item que nomeia fornecedor de IA (empresa que vende modelo ou agente, ou
 * produto dela). Decisão do operador, 15/10, 13h47: fica como rascunho — no
 * preview aparece marcado, em produção não aparece — até a fonte ser conferida.
 * O texto não muda. Plataforma, protocolo e projeto aberto (GitHub, MCP,
 * in-toto, Cedar, Sigstore, SPIFFE) não entram nesse critério.
 */
export interface ItemComFornecedor {
  readonly texto: string;
  readonly fornecedor: true;
}
export type ItemQueFecha = string | ItemComFornecedor;

export const textoDoItem = (i: ItemQueFecha): string => (typeof i === "string" ? i : i.texto);
export const itemConferido = (i: ItemQueFecha): boolean => typeof i === "string";

export interface Degrau {
  readonly id: IdDegrau;
  readonly nome: string;
  /** A ameaça que o degrau fecha, numa linha. */
  readonly ameaca: string;
  readonly fecha: readonly ItemQueFecha[];
  readonly prova: string;
}

export const DEGRAUS: readonly Degrau[] = [
  {
    id: "agent-signs-for-owner",
    nome: "Agent signs for the owner",
    ameaca: "An agent merges, or signs in the owner’s place.",
    fecha: [
      "Merge as a signature, off by default: only where the instance declares it and measured it, checking that whoever merged is a person and not the agent",
      "A guide to measuring the executor’s credential",
      "A computed backing field: key or platform",
      "Levels N0, N1 and N2, with authorized-by",
      "The doctor’s summary stops counting n/a as passed",
      "A guide to the machine key, and a procedure for a leaked key",
    ],
    prova:
      "A public test of the signature × merge method × author matrix, and an evidence notebook.",
  },
  {
    id: "poisoned-index-or-memory",
    nome: "Poisoned index or memory",
    ameaca: "Injection or tampering through what the agent reads.",
    fecha: [
      "A read layer with a hash per entry and a stable order",
      "Decision validity, and a supersedes graph",
      "A reproducible benchmark, and signed releases",
      "A lint against hidden instructions inside documents",
      "Conformance vectors for the format (if approved)",
    ],
    prova:
      "The first benchmark numbers, with the command next to them. No token saving claimed before it is measured.",
  },
  {
    id: "forged-attestation",
    nome: "Forged attestation",
    ameaca: "A forged machine attestation, or a pointer to nothing.",
    fecha: [
      "A machine attestation over the index and the ledger projection, in in-toto",
      "An A/B test with a small model, raw data published",
    ],
    prova:
      "A third party verifies the attestation with one command; the A/B result with its sample size.",
  },
  {
    id: "tampered-generated-rules",
    nome: "Tampered generated rules",
    ameaca: "A generated rule changed after the decision, or a malicious tool server.",
    fecha: [
      "Federation between registries, pinned by hash",
      "A rule generator (Cedar first) with a provenance header and verify-rules",
      {
        texto: "Adapters that turn approvals from LangGraph, OpenAI Agents SDK and Microsoft Agent Framework into drafts",
        fornecedor: true,
      },
      "A read-only MCP server",
      "A GitHub Action and a pre-commit hook (if approved)",
    ],
    prova: "verify-rules failing a tampered rule, in a demo with the command.",
  },
  {
    id: "approval-on-autopilot",
    nome: "Approval on autopilot",
    ameaca: "Self-approval, collusion, approving without reading.",
    fecha: [
      "Quorum N-of-M, and delegation with an expiry",
      "An audit of who proposed versus who approved",
      "Limits against approval fatigue",
    ],
    prova: "A separation-of-duties report generated on this repository.",
  },
  {
    id: "long-lived-leaked-key",
    nome: "Long-lived leaked key",
    ameaca: "A signing key that leaks and keeps working.",
    fecha: [
      { texto: "Identity through Sigstore OIDC, Entra or SPIFFE: short-lived keys", fornecedor: true },
      "Export for audit",
      "A compatibility guarantee for the format",
    ],
    prova: "An independent review published, and a versioned threat model.",
  },
];

/** O nome do degrau pelo id — para a coluna "Step" dos vizinhos. */
export function nomeDoDegrau(id: IdDegrau): string {
  const d = DEGRAUS.find((x) => x.id === id);
  if (!d) throw new Error(`degrau desconhecido: ${id}`);
  return d.nome;
}

/** Como cada estado se lê. A forma diz o estado sem depender da cor. */
export const ROTULO_DO_ESTADO: Readonly<Record<EstadoDegrau, string>> = {
  done: "● done",
  now: "◐ now",
  todo: "○ next",
  blocked: "◆ blocked",
};
