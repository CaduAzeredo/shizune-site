import { Link } from "react-router-dom";
import BrandMark from "./brand-mark";
import { GlifoCompacto } from "./glifo";
import { REPOSITORIO } from "@/content/home";
import { segmentoDaRota } from "@/content/rodape-de-rota";

/**
 * O topo.
 *
 * Três itens no desktop: lockup · símbolo · navegação. O símbolo entra DEPOIS
 * do nome e ANTES da navegação — decisão do operador, 2026-09-09 — com destaque
 * e tamanho maior que o resto do lockup, sem partir o `>_ Cadu Azeredo /
 * shizune` ao meio.
 *
 * No celular o símbolo NÃO entra, e o nome sai junto: sobra `>_ / shizune` mais
 * dois ponteiros. Também decisão do operador. O nome completo fica no rodapé.
 *
 * Os rótulos mudam entre as duas larguras porque as duas telas foram aprovadas
 * assim. O que muda é só o rótulo — o destino é o mesmo, e o `display: none`
 * mantém a árvore de acessibilidade com um nome só por link em cada largura.
 */
export function Header({ rota }: { readonly rota: string }) {
  const noMetodo = rota === "/method";

  return (
    <header className="border-b border-border">
      <div className="coluna flex h-15 items-center justify-between md:h-18">
        <Link
          to="/"
          aria-label="Shizune — home"
          className="text-foreground no-underline"
        >
          <span className="md:hidden">
            <BrandMark segmento={segmentoDaRota(rota)} semNome />
          </span>
          <span className="hidden md:inline-flex">
            <BrandMark segmento={segmentoDaRota(rota)} />
          </span>
        </Link>

        <span aria-hidden="true" className="hidden text-accent-amber md:block">
          <GlifoCompacto tamanho={32} />
        </span>

        <nav aria-label="Main" className="flex items-center gap-5 md:gap-7">
          <Link
            to={noMetodo ? "/" : "/method"}
            className="flex min-h-11 items-center font-mono text-[13px] text-muted-foreground md:min-h-6"
          >
            {noMetodo ? (
              "home"
            ) : (
              <>
                <span className="md:hidden">method</span>
                <span className="hidden md:inline">/method</span>
              </>
            )}
          </Link>

          <a
            href={REPOSITORIO}
            className="flex min-h-11 items-center font-mono text-[13px] md:min-h-6"
          >
            <span className="md:hidden">clone</span>
            <span className="hidden md:inline">github</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
