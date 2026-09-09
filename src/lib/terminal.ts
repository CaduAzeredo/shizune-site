/**
 * A saída do validador, dividida para caber na dobra — sem ser editada.
 *
 * O bloco de terminal é o elemento mais importante da página e o mais fácil de
 * errar. A regra do briefing é dura e está certa: **cortar linha para caber é
 * editar.** Então nada aqui corta. O que este módulo faz é decidir o que fica
 * ABERTO e o que fica RECOLHIDO — o texto inteiro continua no DOM, selecionável,
 * copiável e legível por leitor de tela.
 *
 * A divisão é DERIVADA da captura, nunca escrita ao lado dela. Se a saída mudar
 * numa release futura, a divisão acompanha; e se os marcadores sumirem, a
 * função falha para o lado seguro — mostra TUDO aberto. Nunca para o lado de
 * esconder algo sem querer.
 *
 * A contagem da barra do `<details>` ("N assertions more") também é derivada.
 * No mockup ela tinha sido escrita à mão, e estava errada em quatro.
 */

/** Onde o recolhimento começa. Antes disto, a dobra; a partir daqui, o resto. */
const MARCA_DO_RESTO = "[documentação]";

/** A linha de fecho, que fica sempre visível abaixo do recolhimento. */
const MARCA_DO_FIM = /^test-validate-decisions:/;

const EH_ASSERCAO = /^\s+ok\s/;

export interface Divisao {
  /** As seções visíveis na dobra: `[negativo]`, `[positivo]`, `[rascunho]`. */
  readonly cabeca: string;
  /** O que recolhe. Vazio quando os marcadores não forem encontrados. */
  readonly resto: string;
  /** A linha final da execução. Vazia se a captura não terminar como esperado. */
  readonly fim: string;
  readonly asseracoesVisiveis: number;
  readonly asseracoesRecolhidas: number;
  /** Os nomes de seção do trecho recolhido, na ordem em que aparecem. */
  readonly secoesRecolhidas: readonly string[];
}

const contar = (texto: string): number =>
  texto.split("\n").filter((l) => EH_ASSERCAO.test(l)).length;

export function dividirSaida(saida: string): Divisao {
  const linhas = saida.replace(/\r\n/g, "\n").split("\n");

  // A linha de fecho: a última não vazia, e só se ela for mesmo o fecho.
  let iFim = linhas.length - 1;
  while (iFim >= 0 && linhas[iFim].trim() === "") iFim--;
  const temFim = iFim >= 0 && MARCA_DO_FIM.test(linhas[iFim]);
  const fim = temFim ? linhas[iFim] : "";
  const corpo = linhas.slice(0, temFim ? iFim : linhas.length);

  const iResto = corpo.findIndex((l) => l.startsWith(MARCA_DO_RESTO));

  const aparar = (ls: string[]) => ls.join("\n").replace(/^\n+|\s+$/g, "");

  // Lado seguro: marcador ausente, nada recolhe.
  if (iResto < 0) {
    const cabeca = aparar(corpo);
    return {
      cabeca,
      resto: "",
      fim,
      asseracoesVisiveis: contar(cabeca),
      asseracoesRecolhidas: 0,
      secoesRecolhidas: [],
    };
  }

  const cabeca = aparar(corpo.slice(0, iResto));
  const resto = aparar(corpo.slice(iResto));

  const secoes: string[] = [];
  for (const linha of resto.split("\n")) {
    const m = linha.match(/^\[([^\]]+)\]/);
    if (m && !secoes.includes(m[1])) secoes.push(m[1]);
  }

  return {
    cabeca,
    resto,
    fim,
    asseracoesVisiveis: contar(cabeca),
    asseracoesRecolhidas: contar(resto),
    secoesRecolhidas: secoes,
  };
}

/** Os papéis que a saída tem, e nada além: só três coisas ganham cor. */
export type Papel = "normal" | "ok" | "secao";

export interface Pedaco {
  readonly texto: string;
  readonly papel: Papel;
}

/**
 * Colore uma linha da saída.
 *
 * Verde no `ok` porque verde é "o que passa"; âmbar no `[marcador]` porque
 * âmbar é o produto falando. O resto fica no cinza do texto secundário: uma
 * captura inteira em branco competiria com a prosa da página.
 *
 * A coloração é aplicada POR REGRA, sobre o texto literal — nenhuma linha é
 * reescrita, e nenhuma palavra é acrescentada.
 */
export function colorir(linha: string): readonly Pedaco[] {
  const secao = linha.match(/^(\[[^\]]+\])(.*)$/);
  if (secao) {
    return [
      { texto: secao[1], papel: "secao" },
      { texto: secao[2], papel: "normal" },
    ];
  }

  const ok = linha.match(/^(\s+)(ok)(\s.*)$/);
  if (ok) {
    return [
      { texto: ok[1], papel: "normal" },
      { texto: ok[2], papel: "ok" },
      { texto: ok[3], papel: "normal" },
    ];
  }

  if (MARCA_DO_FIM.test(linha)) return [{ texto: linha, papel: "ok" }];

  return [{ texto: linha, papel: "normal" }];
}
