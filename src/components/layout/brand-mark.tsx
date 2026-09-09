import { cn } from "@/lib/utils";

/**
 * A marca — `>_ Cadu Azeredo / shizune`.
 *
 * Lida por inteiro é um shell parado na raiz esperando comando: o prompt abre,
 * o nome ocupa o meio, a barra fecha, o segmento diz onde a pessoa está.
 *
 * Três regras, e elas existem para não serem renegociadas caso a caso:
 *
 * 1. **A barra nunca sai, e é a única parte sempre verde.** Sem ela vira só um
 *    nome escrito.
 * 2. **O prompt é a moldura.** Sozinho com a barra vira ícone e avatar sem
 *    redesenhar nada.
 * 3. **O nome vai por extenso**, nunca abreviado, nunca em versalete.
 *
 * O lockup aparece só no topo e no rodapé, e **nunca é reescrito em outra
 * tipografia dentro do conteúdo da página**. Quando a linha inteira couber em
 * prosa, a forma composta é "Shizune — by Cadu Azeredo".
 */
export interface BrandMarkProps {
  /** O que vem depois da barra. Vem do mapa de rota; a marca não sabe de rota. */
  readonly segmento: string;
  /**
   * Esconde "Cadu Azeredo" — só no header do celular, onde o lockup inteiro não
   * cabe ao lado da navegação. O nome completo continua no rodapé, sempre.
   * Quando o nome sai, o segmento assume o primeiro plano: sem isso a marca
   * ficaria sem nenhuma palavra em destaque.
   */
  readonly semNome?: boolean;
  readonly className?: string;
}

export function BrandMark({
  segmento,
  semNome = false,
  className,
}: BrandMarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className="inline-flex h-6 w-6 items-center justify-center rounded-[5px] border border-primary font-mono text-[10px] leading-none font-bold text-primary"
      >
        &gt;_
      </span>

      {!semNome && (
        <span className="font-sans text-[15.5px] font-semibold tracking-[-0.01em] text-foreground">
          Cadu Azeredo
        </span>
      )}

      <span
        aria-hidden="true"
        className="font-sans text-[15.5px] font-light text-primary"
      >
        /
      </span>

      {/* O segmento em monoespaçada de propósito: o prompt e a barra já dizem
          que aquilo é um shell, e nome de rota é um ponteiro como qualquer
          outro neste site. */}
      <span
        className={cn(
          "font-mono text-[13px] leading-none",
          semNome ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {segmento}
      </span>

      {semNome && <span className="sr-only">Cadu Azeredo</span>}
    </span>
  );
}

export default BrandMark;
