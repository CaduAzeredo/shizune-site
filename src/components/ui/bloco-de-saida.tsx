import { cn } from "@/lib/utils";

/**
 * Uma saída de comando, literal, sem interpretação.
 *
 * Irmão mais simples do `BlocoDeTerminal`: mesma superfície, mesma regra de não
 * quebrar linha, mesma rolagem acessível por teclado — e **nada mais**. Sem
 * recolhimento, porque estas saídas cabem inteiras; sem coloração, porque não
 * há `ok` nem `[seção]` a marcar; e **sem animação de impressão**, que é da
 * dobra e acontece uma vez, no carregamento — animar um bloco que nasce fora da
 * tela seria movimento que ninguém vê pagando o custo de todo mundo.
 *
 * O que ele mostra vem de arquivo capturado por `scripts/ficha.mjs`. Nenhuma
 * linha é desenhada, encurtada ou reordenada no caminho.
 */
export function BlocoDeSaida({
  saida,
  rotulo,
  className,
}: {
  readonly saida: string;
  readonly rotulo: string;
  readonly className?: string;
}) {
  return (
    <div className={cn("superficie-term", className)}>
      <pre className="term-saida" tabIndex={0} role="group" aria-label={rotulo}>
        {saida}
      </pre>
    </div>
  );
}

export default BlocoDeSaida;
