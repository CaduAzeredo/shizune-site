import useSeo from "@/lib/use-seo";
import { seoRoadmap } from "@/content/seo";
import ficha, { estadoDaCadeia, estadoDoDegrau, type EstadoDegrau } from "@/content/ficha";
import { DEGRAUS, ROTULO_DO_ESTADO, itemConferido, textoDoItem } from "@/content/degraus";
import { MarcaRascunho } from "@/components/ui/marca";
import { PUBLICACAO } from "@/lib/ambiente";
import { oQueAparece } from "@/lib/publicacao";
import { cabeca, cadeia, degraus, depois, feito } from "@/content/roadmap";
import { CHANGELOG, secaoDoChangelog } from "@/content/repositorio";
import PaginaComSumario from "@/components/layout/pagina-com-sumario";
import FaixaDaFicha from "@/components/ui/faixa-da-ficha";
import { cn } from "@/lib/utils";

/**
 * A rota `/roadmap` — a tela 13.
 *
 * Seis degraus, cada um com o nome da ameaça que fecha. O estado de cada um sai
 * da ficha da release: quando a próxima release sai, a cadeia abre o PR com a
 * ficha nova, e o degrau muda de estado nesse mesmo PR — nunca à mão.
 */
const SUMARIO = [
  { ancora: degraus.ancora, rotulo: "The six steps" },
  { ancora: feito.ancora, rotulo: "Already done" },
  { ancora: cadeia.ancora, rotulo: "Outside the steps" },
  { ancora: depois.ancora, rotulo: "After the steps" },
];

const COR_DO_ESTADO: Readonly<Record<EstadoDegrau, string>> = {
  done: "text-primary",
  now: "text-accent-amber",
  todo: "text-muted-foreground",
  blocked: "text-status-alert",
};

export function Roadmap() {
  useSeo(seoRoadmap);
  const feitos = DEGRAUS.filter((d) => estadoDoDegrau(d.id) === "done");

  return (
    <PaginaComSumario sumario={SUMARIO}>
      <section className="bloco-leitura">
        <p className="rotulo-secao">{cabeca.rotulo}</p>
        <h1 className="titulo-1">{cabeca.titulo}</h1>
        <p className="chamada-grande">{cabeca.texto}</p>
        <FaixaDaFicha comEstado />
      </section>

      <section id={degraus.ancora} className="bloco-leitura">
        <h2 className="titulo-2">{degraus.titulo}</h2>
        <nav aria-label="Steps" className="trilho">
          {DEGRAUS.map((d) => {
            const e = estadoDoDegrau(d.id);
            return (
              <a key={d.id} href={`#${d.id}`} className={cn("trilho-degrau", `trilho-${e}`)}>
                <span className={cn("rotulo-passo", COR_DO_ESTADO[e])}>{ROTULO_DO_ESTADO[e]}</span>
                <span className="trilho-nome">{d.nome}</span>
              </a>
            );
          })}
        </nav>
        <p className="texto-mudo max-w-[70ch]">{degraus.nota}</p>

        <div className="flex flex-col gap-3.5">
          {DEGRAUS.map((d) => {
            const e = estadoDoDegrau(d.id);
            return (
              <article key={d.id} id={d.id} className={cn("degrau", e === "now" && "degrau-agora", e === "done" && "degrau-feito")}>
                <div className="flex flex-col gap-1.5">
                  <span className={cn("rotulo-passo", COR_DO_ESTADO[e])}>{ROTULO_DO_ESTADO[e]}</span>
                  <h3 className="titulo-degrau">{d.nome}</h3>
                  <p className="texto-mudo">{d.ameaca}</p>
                </div>
                <div className="degrau-corpo">
                  <div>
                    <p className="rotulo-secao">{degraus.oQueFecha}</p>
                    <ul className="lista-simples">
                      {oQueAparece(d.fecha, itemConferido, PUBLICACAO).map(({ item, rascunho }) => (
                        <li key={textoDoItem(item)}>
                          {textoDoItem(item)}
                          {rascunho && (
                            <>
                              {" "}
                              <MarcaRascunho>{degraus.rascunhoFornecedor}</MarcaRascunho>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="rotulo-secao">{degraus.prova}</p>
                    <p className="texto">{d.prova}</p>
                    {(e === "now" || e === "done") && (
                      <>
                        <p className="rotulo-secao mt-1.5">{degraus.quandoFeito}</p>
                        <p className="texto-mudo">{degraus.registro}</p>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id={feito.ancora} className="bloco-leitura">
        <h2 className="titulo-2">{feito.titulo}</h2>
        {feitos.map((d) => (
          <div key={d.id} className="degrau degrau-feito">
            <span className="rotulo-passo text-primary">{ROTULO_DO_ESTADO.done}</span>
            <h3 className="titulo-3">{d.nome}</h3>
            <p className="texto-mudo">{feito.degrauFeito(ficha.data)}</p>
            <a href={secaoDoChangelog(ficha.changelog)} className="rotulo-secao link-rotulo self-start text-primary">
              {feito.notas}
            </a>
          </div>
        ))}
        <div className="degrau degrau-feito">
          <span className="rotulo-passo text-primary">{ROTULO_DO_ESTADO.done}</span>
          <h3 className="titulo-3">{feito.antes.titulo}</h3>
          <p className="texto-mudo">{feito.antes.texto}</p>
          <a href={secaoDoChangelog(feito.antes.ancoraNoChangelog)} className="rotulo-secao link-rotulo self-start text-primary">
            {feito.notas}
          </a>
        </div>
        <p className="texto-mudo">
          {feito.rodape} <a href={CHANGELOG}>CHANGELOG.md</a>
        </p>
      </section>

      <section id={cadeia.ancora} className="bloco-leitura caixa-tracejada">
        <div className="flex flex-col gap-1.5">
          <p className="rotulo-secao">{cadeia.rotulo}</p>
          <h2 className="titulo-degrau">{cadeia.titulo}</h2>
        </div>
        <p className="texto-mudo max-w-[66ch]">{cadeia.texto}</p>
        <div className="degrau-corpo">
          <div>
            <p className="rotulo-secao">{cadeia.ameacaRotulo}</p>
            <p className="texto">{cadeia.ameaca}</p>
          </div>
          <div>
            <p className="rotulo-secao">{cadeia.provaRotulo}</p>
            <p className="texto">{cadeia.prova}</p>
          </div>
        </div>
        <span className={cn("rotulo-passo", COR_DO_ESTADO[estadoDaCadeia])}>{ROTULO_DO_ESTADO[estadoDaCadeia]}</span>
      </section>

      <section id={depois.ancora} className="bloco-leitura">
        <h2 className="titulo-2">{depois.titulo}</h2>
        <div className="superficie-card flex flex-col gap-2 p-5">
          <h3 className="titulo-3">{depois.item.titulo}</h3>
          <p className="texto-mudo">{depois.item.texto}</p>
        </div>
      </section>
    </PaginaComSumario>
  );
}

export default Roadmap;
