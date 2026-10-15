import { cn } from "@/lib/utils";

/**
 * As duas marcas de procedência da página.
 *
 * - `rascunho`: a linha está aqui porque isto é preview, e a fonte dela ainda não
 *   foi conferida. Em produção ela não aparece (ver `lib/publicacao.ts`).
 * - `nota`: uma observação curta sobre de onde o valor vem.
 *
 * Tracejadas de propósito: uma borda inteira leria como componente, e estas são
 * anotação sobre o componente.
 */
export function MarcaRascunho({ children, className }: { readonly children: string; readonly className?: string }) {
  return <span className={cn("marca-rascunho", className)}>{children}</span>;
}

export function MarcaNota({ children, className }: { readonly children: string; readonly className?: string }) {
  return <span className={cn("marca-nota", className)}>{children}</span>;
}
