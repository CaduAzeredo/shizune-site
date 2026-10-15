import type { ReactNode } from "react";

/**
 * As três páginas de leitura — `/method`, `/evidence`, `/roadmap` — têm a mesma
 * forma: um sumário à esquerda e o texto à direita. No celular o sumário vira
 * uma linha de links acima do texto.
 *
 * O sumário NÃO marca a seção em que a pessoa está. Marcar exigiria observar a
 * rolagem, e o portão do `check-motion` proíbe tudo que reage à rolagem. Um
 * sumário estático é um índice; um sumário que acende conforme se rola é um
 * efeito, e este site não tem efeito.
 */
export interface ItemDoSumario {
  readonly ancora: string;
  readonly rotulo: string;
}

export function PaginaComSumario({
  sumario,
  children,
}: {
  readonly sumario: readonly ItemDoSumario[];
  readonly children: ReactNode;
}) {
  return (
    <div className="largura pagina-sumario">
      <aside className="pagina-sumario-lado">
        <nav aria-label="On this page" className="sumario">
          <p className="rotulo-secao">On this page</p>
          {sumario.map((s) => (
            <a key={s.ancora} href={`#${s.ancora}`}>
              {s.rotulo}
            </a>
          ))}
        </nav>
      </aside>
      <div className="pagina-sumario-texto">{children}</div>
    </div>
  );
}

export default PaginaComSumario;
