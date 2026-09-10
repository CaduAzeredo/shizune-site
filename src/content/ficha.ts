/**
 * GERADO POR `scripts/ficha.mjs` — NÃO EDITE À MÃO.
 *
 * Medido em 2026-09-10, num clone limpo de
 * https://github.com/CaduAzeredo/shizune na tag v0.4.1 (11cfbc2).
 *
 * Trocar de release é rodar `npm run ficha` e publicar. Nenhum número desta
 * página é digitado: se um deles estiver errado, o erro está no comando, e o
 * comando está impresso ao lado do número na própria página.
 *
 * As capturas NÃO estão aqui: são os três `.txt` ao lado, exatamente como os
 * comandos as imprimiram. Quem revisa dá `diff` neles contra uma execução nova.
 */
import saidaTesteNegativo from "./saida-teste-negativo.txt?raw";
import saidaClone from "./saida-clone.txt?raw";
import saidaLs from "./saida-ls.txt?raw";

export interface Ficha {
  /** A tag publicada, resolvida pela release marcada Latest no GitHub. */
  readonly tag: string;
  /** O SHA curto que a tag resolve no clone. */
  readonly sha: string;
  /** Data da medição, ISO curto. */
  readonly medidoEm: string;
  /** `git ls-files | wc -l` */
  readonly arquivos: number;
  /** `grep -cE '^\s*ok\(' scripts/test-validate-decisions.mjs` */
  readonly asseracoes: number;
  /** Verificadores do `doctor`, contados no bloco RESUMO. */
  readonly doctor: {
    readonly total: number;
    readonly executam: number;
    readonly na: number;
  };
  /** A saída literal de `node scripts/test-validate-decisions.mjs`. */
  readonly saidaTesteNegativo: string;
  /** O que o `git clone` imprime, renderizado como no terminal. */
  readonly saidaClone: string;
  /** O `ls` da raiz do clone — o que se recebe ao baixar. */
  readonly saidaLs: string;
}

export const ficha: Ficha = {
  tag: "v0.4.1",
  sha: "11cfbc2",
  medidoEm: "2026-09-10",
  arquivos: 66,
  asseracoes: 57,
  doctor: { total: 9, executam: 7, na: 2 },
  saidaTesteNegativo: saidaTesteNegativo.replace(/\n$/, ""),
  saidaClone: saidaClone.replace(/\n$/, ""),
  saidaLs: saidaLs.replace(/\n$/, ""),
};

export default ficha;
