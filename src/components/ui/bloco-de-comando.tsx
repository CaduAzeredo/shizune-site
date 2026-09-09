import { cn } from "@/lib/utils";

/**
 * Um comando, para ser lido e copiado.
 *
 * Texto real, selecionável, em monoespaçada. `white-space: pre` — o comando não
 * quebra linha para caber, ele rola. Um comando quebrado no meio é um comando
 * que não cola.
 *
 * A região rolável recebe `tabIndex={0}` e um rótulo: sem isso, quem navega por
 * teclado não consegue rolar o que o mouse rola. É a regra da WCAG para
 * conteúdo com rolagem, e o `e2e` a verifica com o axe.
 */
export function BlocoDeComando({
  children,
  compacto = false,
  className,
}: {
  readonly children: string;
  readonly compacto?: boolean;
  readonly className?: string;
}) {
  return (
    <div
      className={cn(
        "superficie-cmd",
        compacto ? "px-3.5 py-2.5" : "px-4 py-3.5",
        className,
      )}
      tabIndex={0}
      role="group"
      aria-label="Command"
    >
      <code
        className={cn(
          "block font-mono whitespace-pre text-foreground",
          compacto ? "text-[12.5px]" : "text-[12px] md:text-[13px]",
          "leading-[1.75]",
        )}
      >
        {children}
      </code>
    </div>
  );
}

export default BlocoDeComando;
