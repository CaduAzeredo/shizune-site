/**
 * As rotas, o topo e um rodapé só.
 *
 * Nenhuma página desenha o próprio fecho. O rodapé é global e lê este arquivo;
 * rota nova é uma chave no mapa, e não um bloco novo de layout. A lição vem do
 * site pessoal, onde duas páginas desenharam fechos próprios e o nome composto
 * apareceu três vezes no mesmo palmo de tela.
 *
 * O TOPO MUDOU NA ROTA DAS QUATRO PÁGINAS (15/10). O lockup antigo,
 * `>_ Cadu Azeredo / shizune`, saiu: o topo é o símbolo e o nome do produto, e o
 * autor assina no rodapé.
 *
 * O CRÉDITO DO AUTOR (decisão do operador, 15/10, 12h43 — a forma B da tela
 * 14b): "Shizune by Cadu Azeredo". "Shizune" na fonte do site, "by" em cinza, e
 * "Cadu Azeredo" em Newsreader Italic, como link para caduazeredo.com, na mesma
 * aba (leva ao site do mesmo autor). A tinta é o âmbar do Shizune: o fio sob o
 * nome acende em âmbar no foco e no ponteiro. Nada mais da marca do Cadu entra
 * no shizune.dev.
 */

export interface Rota {
  readonly caminho: string;
  /** O rótulo na navegação do topo e do rodapé. */
  readonly rotulo: string;
  /** Quantas vezes "Cadu Azeredo" aparece na rota. O `e2e` confere. */
  readonly nomeNaRota: number;
}

/** As quatro páginas, na ordem da navegação. A `/` não entra na navegação: o símbolo leva a ela. */
export const ROTAS: readonly Rota[] = [
  { caminho: "/", rotulo: "/", nomeNaRota: 1 },
  { caminho: "/method", rotulo: "/method", nomeNaRota: 1 },
  { caminho: "/evidence", rotulo: "/evidence", nomeNaRota: 1 },
  { caminho: "/roadmap", rotulo: "/roadmap", nomeNaRota: 1 },
];

export const NAVEGACAO = ROTAS.filter((r) => r.caminho !== "/");

/**
 * O fecho, um só, em toda rota.
 *
 * `™` e nunca `®`: a marca não foi concedida, e "registered" sem concessão é
 * afirmação falsa. Apache-2.0 licencia o código e não licencia o nome.
 *
 * O design do rodapé traz também "contributions under DCO" e o `SUCCESSION.md`.
 * Os dois ficam FORA: nenhum dos dois foi aprovado, e o pacote não fala de DCO em
 * lugar nenhum — o rodapé diria algo que o repositório não diz. Entram quando o
 * pacote os adotar, primeiro lá e depois aqui.
 */
export const rodape = {
  /** O crédito do autor. Ver o cabeçalho deste arquivo. */
  autoria: { produto: "Shizune", por: "by", autor: "Cadu Azeredo", siteDoAutor: "https://caduazeredo.com" },
  licenca: "Apache-2.0",
  marca: "Shizune™ · the name is not licensed with the code.",
} as const;
