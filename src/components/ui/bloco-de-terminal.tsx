import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { colorir, dividirSaida } from "@/lib/terminal";

/**
 * A saída do validador — o elemento mais importante da página.
 *
 * O que ela é: a saída LITERAL de um comando, rodada num clone limpo do pacote
 * público na tag da release, e registrada na ficha da release. Texto real,
 * selecionável, copiável, inteiro no DOM.
 *
 * O que ela nunca é, e as regras que garantem isso:
 *
 * - **Nunca imagem, nunca GIF.** Se um dia precisar ser gravação, é asciinema.
 * - **Nunca editada.** Nenhuma linha é cortada para caber. O que não cabe
 *   RECOLHE, e o texto continua no DOM para leitor de tela.
 * - **Nunca quebrada.** `white-space: pre`: no celular ela rola na horizontal,
 *   porque quebrar linha seria editar a saída.
 * - **Nunca traduzida.** A saída é em português porque o comando imprime em
 *   português; a legenda em inglês, fora do bloco, é o que serve o leitor de fora.
 *
 * A coloração é por regra, sobre o texto literal: `ok` verde, `[seção]` âmbar,
 * a palavra que reprova em vermelho. Nenhuma palavra é acrescentada.
 */
export function LinhasDaCaptura({
  texto,
  destaques = [],
}: {
  readonly texto: string;
  /** Trechos que marcam a linha inteira como destacada — o que o exemplo explica. */
  readonly destaques?: readonly string[];
}) {
  return (
    <>
      {texto.split("\n").map((linha, i) => {
        const destacada = destaques.some((d) => linha.includes(d));
        const conteudo = colorir(linha).map((p, j) => (
          <span
            key={j}
            className={cn(
              p.papel === "ok" && "term-ok",
              p.papel === "secao" && "term-secao",
              p.papel === "reprova" && "term-reprova",
              destacada && p.papel === "normal" && "text-foreground",
            )}
          >
            {p.texto}
          </span>
        ));
        return (
          <Fragment key={i}>
            {i > 0 && "\n"}
            {destacada ? <span className="term-destaque">{conteudo}</span> : conteudo}
          </Fragment>
        );
      })}
    </>
  );
}

/**
 * Uma seção da captura, num quadro com barra — os exemplos 01 e 02 da `/`.
 */
export function QuadroDaCaptura({
  rotulo,
  direita,
  texto,
  destaques,
  rodape,
  className,
}: {
  readonly rotulo: string;
  readonly direita?: ReactNode;
  readonly texto: string;
  readonly destaques?: readonly string[];
  readonly rodape?: ReactNode;
  readonly className?: string;
}) {
  return (
    <figure className={cn("bloco-cmd m-0", className)}>
      <div className="bloco-cmd-barra">
        <span className="bloco-cmd-rotulo">
          <span aria-hidden="true" className="quadrado-verde" />
          {rotulo}
        </span>
        {direita}
      </div>
      <pre className="term-saida" tabIndex={0} role="group" aria-label={`Captured output — ${rotulo}`}>
        <LinhasDaCaptura texto={texto} destaques={destaques} />
      </pre>
      {rodape && <figcaption className="bloco-cmd-medicao">{rodape}</figcaption>}
    </figure>
  );
}

/**
 * A captura inteira, com as primeiras seções abertas e o resto recolhido.
 *
 * A divisão é derivada da captura em `lib/terminal.ts`, e a contagem da barra é
 * contada, não escrita.
 */
export function BlocoDeTerminal({ saida }: { readonly saida: string }) {
  const { cabeca, resto, fim, asseracoesRecolhidas, secoesRecolhidas } = dividirSaida(saida);

  return (
    <div className="superficie-term">
      <pre className="term-saida" tabIndex={0} role="group" aria-label="Validator output — first sections">
        <LinhasDaCaptura texto={cabeca} />
      </pre>

      {resto !== "" && (
        <details>
          <summary className="term-barra">
            <span className="sinal" aria-hidden="true" />
            {` ${secoesRecolhidas.join(" · ")} — ${asseracoesRecolhidas} assertions more`}
          </summary>
          <pre className="term-saida" tabIndex={0} role="group" aria-label="Validator output — remaining sections">
            <LinhasDaCaptura texto={resto} />
          </pre>
        </details>
      )}

      {fim !== "" && (
        <pre className="term-saida term-fim" tabIndex={0} role="group" aria-label="Validator output — final line">
          <LinhasDaCaptura texto={fim} />
        </pre>
      )}
    </div>
  );
}

export default BlocoDeTerminal;
