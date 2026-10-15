import type { ReactNode } from "react";
import type { EstadoDaAfirmacao } from "@/content/ficha";
import { cn } from "@/lib/utils";

/**
 * A linha de medição de um número: o estado, o dia e o SHA em que ele foi medido.
 *
 * O estado se lê pela forma e pelo texto, nunca só pela cor: ● reproduzida,
 * ◐ desatualizada, ○ ainda não medida. Desatualizada fala de SHA, não de dias —
 * a medição não é do commit da release mais recente.
 */
const ROTULO: Readonly<Record<EstadoDaAfirmacao, string>> = {
  reproduzida: "● reproduced",
  desatualizada: "◐ outdated",
  "nao-medida": "○ not measured yet",
};

export function Medicao({
  estado,
  data,
  sha,
  extra,
  className,
}: {
  readonly estado: EstadoDaAfirmacao;
  readonly data?: string;
  readonly sha?: string;
  readonly extra?: ReactNode;
  readonly className?: string;
}) {
  return (
    <p className={cn("medicao", className)}>
      <span className={cn(estado === "reproduzida" ? "text-primary" : estado === "desatualizada" ? "text-accent-amber" : "")}>
        {ROTULO[estado]}
      </span>
      {data && <span>measured {data}</span>}
      {sha && <span>sha {sha}</span>}
      {extra}
    </p>
  );
}

export default Medicao;
