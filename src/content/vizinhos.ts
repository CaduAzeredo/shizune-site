/**
 * Onde o Shizune se encaixa — os vizinhos.
 *
 * Fonte: `projects/brain-launch/mapa-de-vizinhos-2026-10-15.md` no Brain, com a
 * ligação de cada vizinho à ameaça que ele toca feita pela verificação de 15/10
 * (tela 18a do design). A tela em inglês (12) só desenhou a primeira linha; as
 * outras doze foram traduzidas da tela em português nesta passada, e ficam como
 * rascunho junto com as linhas que as originaram.
 *
 * **Nenhuma linha tem fonte conferida ainda.** A regra (DEC-026 e o comando do
 * Bloco B, 15/10): linha sem link de fonte conferido aparece marcada como
 * rascunho no preview e não aparece em produção. Quando uma fonte for conferida,
 * o link e o dia da leitura entram em `fonte` e `lidaEm`, e a linha vai ao ar.
 * Com todas sem fonte, a seção inteira some em produção — inclusive o título,
 * que conta as linhas que aparecem, e não as que existem.
 */
import type { IdDegrau } from "./ficha";

export interface Vizinho {
  readonly nome: string;
  readonly exemplos: string;
  readonly resolve: string;
  readonly lacuna: string;
  readonly conecta: string;
  readonly degrau: IdDegrau;
  /** O link da fonte primária, depois de conferido. `null` enquanto não. */
  readonly fonte: string | null;
  readonly lidaEm: string | null;
}

export const VIZINHOS: readonly Vizinho[] = [
  {
    nome: "Decision records",
    exemplos: "MADR, adr-tools, log4brains",
    resolve: "A format and tooling for writing decisions down.",
    lacuna: "“Who decided” is declared text. Nobody checks it.",
    conecta: "A validator reads the same format and checks the signature.",
    degrau: "agent-signs-for-owner",
    fonte: null,
    lidaEm: null,
  },
  {
    nome: "Decisions written by the agent",
    exemplos: "AgDR",
    resolve: "The agent records what it decided.",
    lacuna: "The authorship is the agent’s.",
    conecta: "The agent’s record becomes a machine-level draft; the human signs.",
    degrau: "tampered-generated-rules",
    fonte: null,
    lidaEm: null,
  },
  {
    nome: "Approval gates in agent frameworks",
    exemplos: "LangGraph, OpenAI Agents SDK, Microsoft Agent Framework",
    resolve: "Pausing the agent until someone approves.",
    lacuna: "The approval vanishes into saved state, with no signature and no durable rule.",
    conecta: "An adapter turns the approval into a draft decision.",
    degrau: "tampered-generated-rules",
    fonte: null,
    lidaEm: null,
  },
  {
    nome: "Coding agents’ permission prompts",
    exemplos: "Claude Code, Codex",
    resolve: "Asking before each risky action.",
    lacuna: "People approve almost everything and catch little.",
    conecta: "The human signs the decision and the plan, not each click.",
    degrau: "approval-on-autopilot",
    fonte: null,
    lidaEm: null,
  },
  {
    nome: "Buzz, by Block",
    exemplos: "workspace for humans and agents",
    resolve: "A key per agent, and approval gates.",
    lacuna: "The gate records who approved, not what was decided.",
    conecta: "The decision layer on top of identity.",
    degrau: "tampered-generated-rules",
    fonte: null,
    lidaEm: null,
  },
  {
    nome: "Agent memory",
    exemplos: "mem0, cognee, Letta, agentmemory",
    resolve: "Remembering context across sessions.",
    lacuna: "Memory is derived and has no authority.",
    conecta: "The registry decides; memory gives context.",
    degrau: "poisoned-index-or-memory",
    fonte: null,
    lidaEm: null,
  },
  {
    nome: "Provenance",
    exemplos: "Sigstore, in-toto, SLSA",
    resolve: "Proving where an artifact came from.",
    lacuna: "It proves the origin, not the decision.",
    conecta: "The in-toto format for the machine’s attestation.",
    degrau: "forged-attestation",
    fonte: null,
    lidaEm: null,
  },
  {
    nome: "Agent identity",
    exemplos: "Entra Agent ID, SPIFFE, MCP OAuth",
    resolve: "Who the agent is.",
    lacuna: "It does not say what authorized it.",
    conecta: "Short-lived identity instead of a fixed key.",
    degrau: "long-lived-leaked-key",
    fonte: null,
    lidaEm: null,
  },
  {
    nome: "Policy as code",
    exemplos: "OPA, Cedar",
    resolve: "Evaluating rules at runtime.",
    lacuna: "Nobody knows which decision created the rule.",
    conecta: "A generated rule with a provenance header, checked by verify-rules.",
    degrau: "tampered-generated-rules",
    fonte: null,
    lidaEm: null,
  },
  {
    nome: "Agent audit trails",
    exemplos: "AgentTrail and others",
    resolve: "A signed receipt of what the agent did.",
    lacuna: "They record the action, not the decision that released it.",
    conecta: "Shizune sits before it: the decision that authorizes.",
    degrau: "approval-on-autopilot",
    fonte: null,
    lidaEm: null,
  },
  {
    nome: "Plan and task tools",
    exemplos: "Beads, Backlog.md, Task Master, Spec Kit",
    resolve: "Planning and executing.",
    lacuna: "No immutable history, no separation of who reviews, no human signature.",
    conecta: "An event ledger: append-only, chained by hash.",
    degrau: "poisoned-index-or-memory",
    fonte: null,
    lidaEm: null,
  },
  {
    nome: "Micro-decisions by a model",
    exemplos: "Jev, Laya",
    resolve: "Deciding small things fast.",
    lacuna: "A different category: they decide, they do not prove.",
    conecta: "The micro level, under a signed delegation.",
    degrau: "agent-signs-for-owner",
    fonte: null,
    lidaEm: null,
  },
  {
    nome: "Regulation",
    exemplos: "EU AI Act, articles 12, 14 and 26",
    resolve: "Requires logging and human oversight.",
    lacuna: "It does not say the format.",
    conecta: "Exporting the proof of oversight.",
    degrau: "long-lived-leaked-key",
    fonte: null,
    lidaEm: null,
  },
];

export const fonteConferida = (v: Vizinho): boolean => Boolean(v.fonte && v.lidaEm);

/** O título conta as linhas que aparecem. Por extenso, até vinte. */
const POR_EXTENSO = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen",
  "Nineteen", "Twenty",
];

export function contagemPorExtenso(n: number): string {
  return POR_EXTENSO[n] ?? String(n);
}
