/**
 * O 404.
 *
 * Curto de propósito, e na cor de alerta — o único lugar das três rotas onde
 * `--status-alert` aparece. Sem ilustração, sem piada, sem "oops": a página diz
 * o que houve e devolve os dois caminhos que existem.
 */

export const naoEncontrado = {
  codigo: "404",
  titulo: "This page does not exist.",
  texto: "Two routes exist, and this is neither of them.",
  home: "Home",
  metodo: "The method",
} as const;
