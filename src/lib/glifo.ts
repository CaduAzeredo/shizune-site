/**
 * O símbolo, em dados — os traçados e a regra de espessura.
 *
 * Fica separado dos componentes por dois motivos. O primeiro é mecânico: um
 * arquivo que exporta componente e constante quebra o recarregamento rápido do
 * Vite, e o lint reprova. O segundo importa mais — estes valores são a
 * IDENTIDADE, e são lidos de fora do JSX: `scripts/arte.mjs` gera o favicon e a
 * OG a partir do mesmo traçado, e confere contra este arquivo para que as duas
 * cópias não possam divergir em silêncio.
 */

/**
 * Espessura por tamanho — ordem do operador, 2026-09-09: 2 a 16px · 1.5 em
 * 18–24 · 1.25 em 32+. Escrita como função, e não lembrada caso a caso: uma
 * regra de escala que mora na cabeça de alguém dura até a próxima sessão.
 */
export function espessura(tamanho: number): number {
  if (tamanho <= 16) return 2;
  if (tamanho <= 24) return 1.5;
  return 1.25;
}

/** A variante compacta, como no `glifo-shizune-compacto.svg` do Brain. */
export const CAMINHO_COMPACTO =
  "M1.5 12C1.5 6.5 3 3.5 5 3.5C7 3.5 7 18 8.5 18C10 18 10 9 11.5 9C12.7 9 13.4 12 14.5 12L22.5 12";

/**
 * O mesmo caminho com a cauda escrita como curva — pontos de controle SOBRE a
 * reta. Desenha exatamente a mesma linha (conferido por captura: mesmo sha256
 * nas duas formas em repouso) e é o que permite a cauda interpolar no colapso
 * do hero. Só o hero usa esta forma.
 */
export const CAMINHO_COMPACTO_ANIMAVEL =
  "M1.5 12C1.5 6.5 3 3.5 5 3.5C7 3.5 7 18 8.5 18C10 18 10 9 11.5 9C12.7 9 13.4 12 14.5 12C17.2 12 19.8 12 22.5 12";

/** O traçado de conteúdo — quatro inflexões, dois caminhos, de 24px para cima. */
export const CAMINHO_CONTEUDO_ONDA =
  "M2 12c2.6 0 2.6-7 5.2-7s2.6 14 5.2 14 2.6-7 5.2-7 2.6 3.5 4.4 3.5";
export const CAMINHO_CONTEUDO_LINHA = "M2 12h20";
