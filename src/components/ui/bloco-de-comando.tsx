import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import BotaoCopiar from "./botao-copiar";

/**
 * Um comando, para ser lido e copiado — com a barra que diz onde ele roda.
 *
 * A barra tem um quadrado e um rótulo: verde para o que roda no terminal, âmbar
 * para o que vai para o agente. O `$` e o `›` são prompt, e não comando: ficam
 * fora da seleção e fora do que o botão copia. Um comando que cola com `$` na
 * frente é um comando que não roda.
 *
 * Texto real, selecionável, em monoespaçada, com `white-space: pre`: o comando
 * não quebra linha para caber, ele rola. A região rolável recebe `tabIndex={0}`
 * e um rótulo, senão a rolagem existe só para quem tem mouse — o `e2e` confere
 * isso com o axe.
 */
export function BlocoDeComando({
  linhas,
  rotulo = "terminal",
  agente = false,
  copiar,
  saida,
  rotuloDaSaida,
  medicao,
  direita,
  compacto = false,
  className,
}: {
  /** Uma linha por comando. Num prompt de agente, uma linha só, com o texto inteiro. */
  readonly linhas: readonly string[];
  readonly rotulo?: string;
  /** `true` para o prompt que vai para o agente: âmbar e `›`. */
  readonly agente?: boolean;
  /** O que o botão copia. Sem isto, as linhas, sem o prompt. */
  readonly copiar?: string;
  /** Uma saída curta, impressa abaixo do comando. */
  readonly saida?: string;
  readonly rotuloDaSaida?: string;
  /** A linha de medição, embaixo de tudo. */
  readonly medicao?: ReactNode;
  /** No lugar do botão "copy": um código de saída, por exemplo. */
  readonly direita?: ReactNode;
  readonly compacto?: boolean;
  readonly className?: string;
}) {
  const textoParaCopiar = copiar ?? linhas.join("\n");

  return (
    <div className={cn("bloco-cmd", className)}>
      <div className="bloco-cmd-barra">
        <span className="bloco-cmd-rotulo">
          <span aria-hidden="true" className={agente ? "quadrado-ambar" : "quadrado-verde"} />
          {rotulo}
        </span>
        {direita ?? <BotaoCopiar texto={textoParaCopiar} rotulo={agente ? "Copy the full prompt" : "Copy the command"} />}
      </div>

      <pre
        className={cn("bloco-cmd-codigo", compacto && "bloco-cmd-compacto", agente && "bloco-cmd-agente")}
        tabIndex={0}
        role="group"
        aria-label={agente ? "Prompt for your agent" : "Command"}
      >
        {linhas.map((linha, i) => (
          <span key={i} className="block">
            <span aria-hidden="true" className={cn("prompt", agente ? "text-accent-amber" : "text-primary")}>
              {agente ? "› " : "$ "}
            </span>
            {linha}
          </span>
        ))}
      </pre>

      {saida !== undefined && (
        <pre className="bloco-cmd-saida" tabIndex={0} role="group" aria-label={rotuloDaSaida ?? "Output"}>
          {saida}
        </pre>
      )}

      {medicao && <div className="bloco-cmd-medicao">{medicao}</div>}
    </div>
  );
}

export default BlocoDeComando;
