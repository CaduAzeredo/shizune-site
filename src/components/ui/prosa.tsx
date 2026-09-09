import { Fragment } from "react";
import {
  ehForte,
  ehLiteral,
  ehRotulo,
  ehSecao,
  type Frase,
} from "@/content/prosa";

/**
 * Renderiza uma frase do conteúdo.
 *
 * O conteúdo marca o que é literal, seção, ênfase ou rótulo; aqui se decide
 * como cada um aparece. Nenhum texto é acrescentado, removido ou reordenado no
 * caminho — este componente só escolhe a tipografia de cada trecho.
 */
export function Prosa({ frase }: { readonly frase: Frase }) {
  return (
    <>
      {frase.map((t, i) => {
        if (typeof t === "string") return <Fragment key={i}>{t}</Fragment>;

        if (ehLiteral(t))
          return (
            <code key={i} className="token-literal">
              {t.literal}
            </code>
          );

        if (ehSecao(t))
          return (
            <span key={i} className="font-mono text-accent-amber">
              {t.secao}
            </span>
          );

        if (ehForte(t))
          return (
            <strong key={i} className="font-semibold text-foreground">
              {t.forte}
            </strong>
          );

        if (ehRotulo(t))
          return (
            <em key={i} className="italic">
              {t.rotulo}
            </em>
          );

        return null;
      })}
    </>
  );
}

export default Prosa;
