import { Link } from "react-router-dom";
import { GlifoCompacto } from "./glifo";
import { NAVEGACAO } from "@/content/rodape-de-rota";
import { ESPELHO_PT, REPOSITORIO } from "@/content/repositorio";
import { cn } from "@/lib/utils";

/**
 * O topo: o símbolo e o nome do produto, e a navegação das quatro páginas.
 *
 * O símbolo é a variante compacta, a marca do CHROME (decisão do operador,
 * 2026-09-09). O lockup antigo saiu do topo na rota das quatro páginas — ver o
 * cabeçalho de `rodape-de-rota.ts`.
 *
 * No celular a navegação desce para uma segunda linha, inteira, em vez de virar
 * um menu escondido: são quatro destinos, e esconder quatro destinos atrás de um
 * botão é trocar uma linha de texto por um clique.
 *
 * O link "pt" só existe nas rotas que têm espelho em português no site pessoal.
 */
export function Header({ rota }: { readonly rota: string }) {
  const espelho = ESPELHO_PT[rota as keyof typeof ESPELHO_PT];

  return (
    <header className="border-b border-border">
      <div className="largura topo">
        <Link to="/" aria-label="Shizune — home" className="topo-marca">
          <span aria-hidden="true" className="text-accent-amber">
            <GlifoCompacto tamanho={26} />
          </span>
          <span className="topo-nome">shizune</span>
        </Link>

        <nav aria-label="Main" className="topo-nav">
          {NAVEGACAO.map((r) => (
            <Link
              key={r.caminho}
              to={r.caminho}
              aria-current={rota === r.caminho ? "page" : undefined}
              className={cn("topo-link", rota === r.caminho && "topo-link-atual")}
            >
              {r.rotulo}
            </Link>
          ))}
          {espelho && (
            <a href={espelho} hrefLang="pt-BR" lang="pt-BR" className="topo-link">
              pt
            </a>
          )}
          <a href={REPOSITORIO} className="topo-link topo-github">
            github
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
