/**
 * GERADO POR `scripts/ficha.mjs` — NÃO EDITE À MÃO.
 *
 * Medido em 2026-09-09, num clone limpo de
 * https://github.com/CaduAzeredo/shizune na tag v0.4.0 (b71f349).
 *
 * Trocar de release é rodar `npm run ficha` e publicar. Nenhum número desta
 * página é digitado: se um deles estiver errado, o erro está no comando, e o
 * comando está impresso ao lado do número na própria página.
 *
 * A captura do teste negativo NÃO está aqui: ela é
 * `saida-teste-negativo.txt`, ao lado, exatamente como o comando a imprimiu.
 * Quem revisa dá `diff` naquele arquivo contra uma execução nova.
 */
import saidaTesteNegativo from "./saida-teste-negativo.txt?raw";

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
}

export const ficha: Ficha = {
  tag: "v0.4.0",
  sha: "b71f349",
  medidoEm: "2026-09-09",
  arquivos: 66,
  asseracoes: 39,
  doctor: { total: 9, executam: 7, na: 2 },
  saidaTesteNegativo: saidaTesteNegativo.replace(/\n$/, ""),
};

export default ficha;
