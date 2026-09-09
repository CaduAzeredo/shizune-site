import { Link } from "react-router-dom";
import useSeo from "@/lib/use-seo";
import { seoHome } from "@/content/seo";
import ficha from "@/content/ficha";
import {
  comeco,
  comoFunciona,
  hero,
  numeros,
  numerosMedidos,
  problema,
  prova,
} from "@/content/home";
import { GlifoCompacto, GlifoConteudo } from "@/components/layout/glifo";
import BlocoDeComando from "@/components/ui/bloco-de-comando";
import BlocoDeTerminal from "@/components/ui/bloco-de-terminal";
import Prosa from "@/components/ui/prosa";

/**
 * A rota `/`.
 *
 * A ordem é a do dossiê, e ela é o argumento: a frase, o problema em três
 * linhas, **a prova**, como funciona, os números, o começo. Nada antes da
 * prova — sem logo de "trusted by", sem frase de venda, sem hero decorativo
 * empurrando o terminal para baixo da dobra.
 */
export function Home() {
  useSeo(seoHome);

  return (
    <>
      {/* ── hero ──────────────────────────────────────────────────────── */}
      <section className="coluna pt-15 pb-13 md:pt-24 md:pb-19">
        {/* O símbolo colapsa uma vez, na entrada: a onda oscila a largura
            inteira e vira a reta. Âncora silenciosa, não ilustração — por isso
            nada em volta dele. */}
        <span
          aria-hidden="true"
          className="glifo-hero entra d1 mb-6.5 block text-accent-amber md:mb-8.5"
        >
          <span className="md:hidden">
            <GlifoCompacto tamanho={64} animavel />
          </span>
          <span className="hidden md:block">
            <GlifoCompacto tamanho={96} animavel />
          </span>
        </span>

        <h1 className="frase-hero entra d2">
          {hero.linhas.map((l, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {l.sujeito}
              <b>{l.verbo}</b>
            </span>
          ))}
        </h1>

        <p className="texto-mudo entra d3 mt-5.5 text-[16px] md:mt-7.5 md:text-[17px]">
          {hero.subtitulo}
        </p>
      </section>

      <hr className="h-px border-0 bg-border" />

      {/* ── o problema, em três linhas ────────────────────────────────── */}
      <section className="coluna py-10 md:py-13">
        <div className="entra d4 flex flex-col gap-2.5">
          {problema.linhas.map((linha) => (
            <p
              key={linha}
              className="text-[17px] leading-[1.5] text-foreground md:text-[19px]"
            >
              {linha}
            </p>
          ))}
        </div>
      </section>

      <hr className="h-px border-0 bg-border" />

      {/* ── a prova ───────────────────────────────────────────────────── */}
      <section className="coluna pt-14 pb-15 md:pt-19 md:pb-20">
        <h2 className="titulo-secao">{prova.titulo}</h2>
        <p className="texto-mudo mb-6">{prova.legenda}</p>

        <BlocoDeComando className="mb-4.5">{prova.comando(ficha)}</BlocoDeComando>

        <BlocoDeTerminal saida={ficha.saidaTesteNegativo} />

        <p className="texto-mudo mt-5 text-[13.5px] md:text-[14.5px]">
          <Prosa frase={prova.secoes} />
        </p>
      </section>

      <hr className="h-px border-0 bg-border" />

      {/* ── como funciona ─────────────────────────────────────────────── */}
      <section className="coluna pt-12 pb-12 md:pt-15 md:pb-16">
        <div className="mb-5 flex items-center gap-3">
          <span aria-hidden="true" className="text-accent-amber">
            <GlifoConteudo tamanho={24} />
          </span>
          <h2 className="titulo-secao mb-0">{comoFunciona.titulo}</h2>
        </div>
        <p className="texto mb-7 md:mb-8">{comoFunciona.chamada}</p>

        <div className="grid gap-4 md:grid-cols-3">
          {comoFunciona.passos.map((passo) => (
            <div
              key={passo.nome}
              className="superficie-card flex flex-col gap-3 px-4.5 py-4.5 md:px-6.5 md:py-6"
            >
              <span className="text-[17px] font-semibold text-foreground">
                {passo.nome}
              </span>
              <p className="texto-mudo">
                <Prosa frase={passo.texto} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr className="h-px border-0 bg-border" />

      {/* ── os números ────────────────────────────────────────────────── */}
      <section className="coluna pt-12 pb-12 md:pt-15 md:pb-16">
        <h2 className="titulo-secao">{numeros.titulo}</h2>
        <p className="texto-mudo mb-7 md:mb-8.5">{numeros.chamada}</p>

        <div className="flex flex-col gap-4">
          {numerosMedidos(ficha).map((n) => (
            <div
              key={n.comando}
              className="superficie-card grid items-start gap-4 px-4.5 py-4.5 md:grid-cols-[128px_minmax(0,1fr)] md:gap-7 md:px-6.5 md:py-6"
            >
              <span className="numero-medido">{n.valor}</span>
              {/* `min-w-0`: item de grade não encolhe abaixo do próprio
                  conteúdo mínimo, e o comando é largo. Sem isto o card empurra
                  a página inteira e o celular ganha rolagem horizontal — foi o
                  que o e2e pegou. */}
              <div className="flex min-w-0 flex-col gap-3">
                <p className="texto md:text-[16px]">
                  <Prosa frase={n.texto} />
                </p>
                <BlocoDeComando compacto>{n.comando}</BlocoDeComando>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="h-px border-0 bg-border" />

      {/* ── o começo ──────────────────────────────────────────────────── */}
      <section className="coluna pt-12 pb-16 md:pt-15 md:pb-21">
        <h2 className="titulo-secao">{comeco.titulo}</h2>
        <BlocoDeComando className="mb-5.5">{comeco.comando}</BlocoDeComando>
        {/* `min-h-6`: o piso de 24px da WCAG 2.2 (2.5.8) para alvo de toque.
            Um link de linha única tem 21px de altura e ficaria abaixo dele. */}
        <Link
          to="/method"
          className="inline-flex min-h-6 items-center text-[16px] font-medium"
        >
          {comeco.metodo}
        </Link>
      </section>
    </>
  );
}

export default Home;
