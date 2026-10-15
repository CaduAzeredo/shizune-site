/**
 * O que aparece, e como — a regra de publicação, num lugar só.
 *
 * Uma linha que afirma algo sobre o mundo de fora (um vizinho, uma citação, um
 * número de relatório que ainda não foi medido de novo) só vai ao ar com a fonte
 * conferida. Enquanto a fonte não foi conferida:
 *
 * - no **preview**, a linha aparece, marcada como rascunho — é onde o operador
 *   lê a página antes de decidir;
 * - em **produção**, a linha não aparece.
 *
 * A regra é código, e não cuidado de quem edita, porque "lembrar de esconder
 * antes de publicar" é exatamente o tipo de passo que se perde na véspera. O
 * teste está em `scripts/test-publicacao.mjs` e roda no portão.
 *
 * Este módulo é puro de propósito: não lê ambiente nem importa nada, para que o
 * teste o carregue direto, sem o empacotador. Quem decide o ambiente é
 * `lib/ambiente.ts`.
 */

export type Publicacao = "producao" | "previa";

export interface Visivel<T> {
  readonly item: T;
  /** `true` quando a linha aparece só porque é preview. */
  readonly rascunho: boolean;
}

export function oQueAparece<T>(
  itens: readonly T[],
  conferido: (item: T) => boolean,
  publicacao: Publicacao,
): readonly Visivel<T>[] {
  return itens.flatMap((item): Visivel<T>[] => {
    if (conferido(item)) return [{ item, rascunho: false }];
    return publicacao === "producao" ? [] : [{ item, rascunho: true }];
  });
}

/** Um bloco inteiro (uma seção, um cartão) segue a mesma regra de uma linha. */
export function blocoAparece(conferido: boolean, publicacao: Publicacao): boolean {
  return conferido || publicacao !== "producao";
}
