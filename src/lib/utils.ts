/**
 * Junta classes, ignorando o que for falso.
 *
 * É o `cn` de sempre, e é DELIBERADAMENTE pequeno: o site pessoal carrega
 * `clsx` + `tailwind-merge` para isto, e as duas somam peso que este site não
 * tem por que pagar. Não há aqui nenhum componente que receba classe conflitante
 * de fora — quando houver, a fusão de classes entra junto com ele.
 */
export function cn(...partes: Array<string | false | null | undefined>): string {
  return partes.filter(Boolean).join(" ");
}
