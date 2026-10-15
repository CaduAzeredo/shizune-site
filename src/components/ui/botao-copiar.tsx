import { useState } from "react";

/**
 * Copia um texto. Só isso.
 *
 * O texto copiado é o que o bloco mostra, sem o `$` do prompt — ou, no prompt do
 * agente, o prompt inteiro do QUICKSTART, que a página mostra em trecho. O aviso
 * "copied" volta a "copy" sozinho, e o mesmo aviso vai para leitor de tela por
 * uma região `status`, porque um botão que muda de rótulo em silêncio não diz
 * nada a quem não o vê.
 *
 * Sem rede: a área de transferência é do navegador, e o CSP não é tocado.
 */
export function BotaoCopiar({
  texto,
  rotulo = "Copy",
}: {
  readonly texto: string;
  readonly rotulo?: string;
}) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1600);
    } catch {
      // Sem permissão de área de transferência o texto continua selecionável no
      // bloco. O botão não finge que copiou.
    }
  }

  return (
    <>
      <button type="button" className="botao-copiar" onClick={copiar} aria-label={rotulo}>
        {copiado ? "copied" : "copy"}
      </button>
      <span role="status" className="sr-only">
        {copiado ? "Copied" : ""}
      </span>
    </>
  );
}

export default BotaoCopiar;
