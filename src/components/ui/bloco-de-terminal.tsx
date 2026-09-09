import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { colorir, dividirSaida } from "@/lib/terminal";

/**
 * O bloco de terminal — o elemento mais importante da página.
 *
 * O que ele é: a saída LITERAL de um comando, rodada num clone limpo do pacote
 * público na tag publicada. Texto real, selecionável, copiável, inteiro no DOM.
 *
 * O que ele nunca é, e as regras que garantem isso:
 *
 * - **Nunca imagem, nunca GIF.** Se um dia precisar ser gravação, é asciinema.
 * - **Nunca editado.** Nenhuma linha é cortada para caber. O que não cabe na
 *   dobra RECOLHE, e o texto continua no DOM para leitor de tela.
 * - **Nunca quebrado.** `white-space: pre`: no celular ele rola na horizontal,
 *   porque quebrar linha seria editar a saída.
 * - **Nunca traduzido.** A saída é em português porque o comando imprime em
 *   português; traduzir aqui transformaria a captura em log encenado. A legenda
 *   em inglês, fora do bloco, é o que serve o leitor de fora.
 * - **Nunca em laço.** Ele se imprime uma vez, na entrada, e morre sob
 *   `prefers-reduced-motion`.
 *
 * A divisão entre o que fica aberto e o que recolhe é derivada da captura em
 * `lib/terminal.ts`, e a contagem da barra é contada, não escrita.
 */
function Linhas({ texto }: { readonly texto: string }) {
  return (
    <>
      {texto.split("\n").map((linha, i) => (
        <Fragment key={i}>
          {i > 0 && "\n"}
          {colorir(linha).map((p, j) => (
            <span
              key={j}
              className={cn(
                p.papel === "ok" && "term-ok",
                p.papel === "secao" && "term-secao",
              )}
            >
              {p.texto}
            </span>
          ))}
        </Fragment>
      ))}
    </>
  );
}

export function BlocoDeTerminal({ saida }: { readonly saida: string }) {
  const { cabeca, resto, fim, asseracoesRecolhidas, secoesRecolhidas } =
    dividirSaida(saida);

  return (
    <div className="superficie-term imprime">
      <pre
        className="term-saida"
        tabIndex={0}
        role="group"
        aria-label="Validator output — first sections"
      >
        <Linhas texto={cabeca} />
      </pre>

      {resto !== "" && (
        <details>
          <summary className="term-barra">
            <span className="sinal" aria-hidden="true" />
            {` ${secoesRecolhidas.join(" · ")} — ${asseracoesRecolhidas} assertions more`}
          </summary>
          <pre
            className="term-saida"
            tabIndex={0}
            role="group"
            aria-label="Validator output — remaining sections"
          >
            <Linhas texto={resto} />
          </pre>
        </details>
      )}

      {fim !== "" && (
        <pre
          className="term-saida term-fim"
          tabIndex={0}
          role="group"
          aria-label="Validator output — final line"
        >
          <Linhas texto={fim} />
        </pre>
      )}
    </div>
  );
}

export default BlocoDeTerminal;
