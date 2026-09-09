/**
 * O tipo do texto.
 *
 * O texto das páginas vive em `src/content/*.ts`, fora do JSX. Mas o texto
 * desta página tem literais dentro das frases — `vigente`, `DEC-NNN`, `%G?`,
 * `[negativo]` — e eles não são decoração: um ponteiro escrito em fonte de
 * texto corrido se lê como opinião, e o briefing proíbe isso.
 *
 * Então a frase não é uma string, é uma sequência de trechos. Quem escreve o
 * conteúdo marca o que é literal; quem desenha decide como o literal aparece.
 * Nenhum dos dois precisa do outro para mudar.
 */

/** Texto de máquina citado dentro de texto de gente: `vigente`, `DEC-NNN`. */
export interface Literal {
  readonly literal: string;
}

/** Marcador de seção da saída do validador: `[negativo]`, `[rascunho]`. */
export interface Secao {
  readonly secao: string;
}

/** A palavra que carrega o peso da frase. */
export interface Forte {
  readonly forte: string;
}

/** Rótulo de procedência — "Measured in a private instance, 2026-09-09:". */
export interface Rotulo {
  readonly rotulo: string;
}

export type Trecho = string | Literal | Secao | Forte | Rotulo;

/** Uma frase é uma sequência de trechos. Uma string sozinha também é. */
export type Frase = readonly Trecho[];

export const ehLiteral = (t: Trecho): t is Literal =>
  typeof t === "object" && "literal" in t;
export const ehSecao = (t: Trecho): t is Secao =>
  typeof t === "object" && "secao" in t;
export const ehForte = (t: Trecho): t is Forte =>
  typeof t === "object" && "forte" in t;
export const ehRotulo = (t: Trecho): t is Rotulo =>
  typeof t === "object" && "rotulo" in t;

/**
 * O texto puro de uma frase, sem marcação.
 *
 * Serve ao `e2e`: a verificação de corpo por rota (item 45 da fila do Brain)
 * compara o que a página RENDERIZOU com o que o conteúdo DECLARA, e as duas
 * pontas precisam falar a mesma língua.
 */
export function textoPuro(frase: Frase): string {
  return frase
    .map((t) => {
      if (typeof t === "string") return t;
      if (ehLiteral(t)) return t.literal;
      if (ehSecao(t)) return t.secao;
      if (ehForte(t)) return t.forte;
      return t.rotulo;
    })
    .join("");
}
