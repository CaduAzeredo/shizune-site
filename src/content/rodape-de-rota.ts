/**
 * A marca por rota — e um rodapé só.
 *
 * Nenhuma página desenha o próprio fecho. O rodapé é global e lê este mapa; a
 * página declara o que ela é, e não como ela termina. A lição vem do site
 * pessoal, onde duas páginas desenharam fechos próprios e o nome composto
 * apareceu três vezes no mesmo palmo de tela.
 *
 * Aqui o mapa tem uma chave só, e isso é de propósito: o padrão vale a partir
 * de um, senão a segunda rota o quebra sem ninguém perceber.
 */

export interface MarcaDeRota {
  /** O que vem depois da barra no lockup do topo: `>_ Cadu Azeredo / <isto>`. */
  readonly segmento: string;
}

export const marcasDeRota: Readonly<Record<string, MarcaDeRota>> = {
  "/": { segmento: "shizune" },
  "/method": { segmento: "shizune/method" },
};

/** Fora do mapa — inclusive no 404 — o segmento é o do produto. */
export const SEGMENTO_PADRAO = "shizune";

export function segmentoDaRota(caminho: string): string {
  return marcasDeRota[caminho]?.segmento ?? SEGMENTO_PADRAO;
}

/**
 * O fecho, um só, em toda rota.
 *
 * `™` e nunca `®`: a marca não foi concedida, e "registered" sem concessão é
 * afirmação falsa. Apache-2.0 licencia o código e não licencia o nome.
 */
export const rodape = {
  segmento: SEGMENTO_PADRAO,
  fecho: "Shizune — by Cadu Azeredo · Apache-2.0 · Shizune™",
} as const;
