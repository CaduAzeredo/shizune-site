import useSeo from "@/lib/use-seo";
import { seoMethod } from "@/content/seo";
import { comandoDe, estadoDe, medicaoDe } from "@/content/ficha";
import {
  assinatura,
  contribuicoes,
  formato,
  garantia,
  guias,
  merge,
  niveis,
  oQueE,
  oQueReprova,
  registro,
} from "@/content/method";
import { secaoDoQuickstart } from "@/content/repositorio";
import PaginaComSumario from "@/components/layout/pagina-com-sumario";
import BlocoDeComando from "@/components/ui/bloco-de-comando";
import { MarcaNota } from "@/components/ui/marca";
import Medicao from "@/components/ui/medicao";
import Prosa from "@/components/ui/prosa";
import { cn } from "@/lib/utils";

/**
 * A rota `/method` — a tela 11.
 *
 * Esta é a parte documental do site: o registro do operador para ela é "mais
 * padrão GitHub, mais padrão chato" (2026-09-03), e isso é elogio. Sem efeito,
 * sem coreografia; o trabalho de design aqui é deixar o texto denso confortável.
 */
const SUMARIO = [
  { ancora: oQueE.ancora, rotulo: "What this is" },
  { ancora: registro.ancora, rotulo: "The registry" },
  { ancora: oQueReprova.ancora, rotulo: "What fails" },
  { ancora: niveis.ancora, rotulo: "Levels and delegation" },
  { ancora: garantia.ancora, rotulo: "What backs a decision" },
  { ancora: merge.ancora, rotulo: "Merge as a signature" },
  { ancora: assinatura.ancora, rotulo: "What a signature shows" },
  { ancora: guias.ancora, rotulo: "Guides" },
  { ancora: formato.ancora, rotulo: "The format" },
  { ancora: contribuicoes.ancora, rotulo: "Where the method ran" },
];

export function Method() {
  useSeo(seoMethod);
  const m = medicaoDe("negative-test-output");

  return (
    <PaginaComSumario sumario={SUMARIO}>
      <section id={oQueE.ancora} className="bloco-leitura">
        <p className="rotulo-secao">{oQueE.rotulo}</p>
        <h1 className="titulo-1">{oQueE.titulo}</h1>
        <p className="chamada-grande">{oQueE.texto}</p>
        <div className="grade-3">
          {oQueE.papeis.map((p, i) => (
            <div key={p.quem} className={cn("superficie-card flex flex-col gap-1.5 px-4.5 py-4", i === 2 && "cartao-forte")}>
              <p className="rotulo-secao">{p.quem}</p>
              <p className="texto">
                <b className="font-semibold">{p.verbo}</b>
                {p.resto}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id={registro.ancora} className="bloco-leitura">
        <h2 className="titulo-2">{registro.titulo}</h2>
        <p className="chamada">{registro.chamada}</p>
        <div className="grade-2">
          {[registro.rascunho, registro.vigente].map((r) => (
            <div key={r.rotulo} className="flex min-w-0 flex-col gap-2">
              <p className="rotulo-secao">{r.rotulo}</p>
              <code className="linha-registro">{r.linha}</code>
            </div>
          ))}
        </div>
        <p className="texto-mudo">{registro.nota}</p>
      </section>

      <section id={oQueReprova.ancora} className="bloco-leitura">
        <h2 className="titulo-2">{oQueReprova.titulo}</h2>
        <p className="chamada">{oQueReprova.chamada}</p>
        <div className="grade-reprova">
          {oQueReprova.casos.map((c) => (
            <div key={c.titulo} className="superficie-card flex min-w-0 flex-col gap-1.5 px-4 py-3.5">
              <span className="rotulo-passo text-status-alert">{oQueReprova.marca}</span>
              <b className="font-semibold">{c.titulo}</b>
              <p className="texto-mudo">{c.texto}</p>
            </div>
          ))}
        </div>
        <BlocoDeComando
          rotulo={oQueReprova.rotuloDoComando}
          linhas={[comandoDe("negative-test-output")]}
          medicao={<Medicao estado={estadoDe("negative-test-output")} data={m.data} sha={m.shaCurto} />}
        />
      </section>

      <section id={niveis.ancora} className="bloco-leitura">
        <h2 className="titulo-2">{niveis.titulo}</h2>
        <p className="chamada">{niveis.chamada}</p>
        <div className="grade-3">
          {niveis.lista.map((n) => (
            <div key={n.nivel} className={cn("superficie-card flex min-w-0 flex-col gap-2.5 p-4.5", n.humano && "cartao-produto")}>
              <span className="numero-nivel">{n.nivel}</span>
              <b className="font-semibold">{n.nome}</b>
              <dl className="lista-definicao">
                <dt>{niveis.rotulos.exemplo}</dt>
                <dd>{n.exemplo}</dd>
                <dt>{niveis.rotulos.quem}</dt>
                <dd>{n.quem}</dd>
                <dt>{niveis.rotulos.rastro}</dt>
                <dd>{n.rastro}</dd>
              </dl>
            </div>
          ))}
        </div>
        <div className="grade-2">
          <div className="flex min-w-0 flex-col gap-2">
            <p className="rotulo-secao">{niveis.arquivo.rotulo}</p>
            <code className="linha-registro">{niveis.arquivo.linha}</code>
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <p className="rotulo-secao">{niveis.commit.rotulo}</p>
            <code className="linha-registro whitespace-pre">{niveis.commit.linha}</code>
          </div>
        </div>
        <p className="texto-mudo">{niveis.nota}</p>
      </section>

      <section id={garantia.ancora} className="bloco-leitura">
        <h2 className="titulo-2">{garantia.titulo}</h2>
        <p className="chamada">{garantia.chamada}</p>
        <div className="grade-3">
          {garantia.tipos.map((t) => (
            <div key={t.nome} className="superficie-card flex min-w-0 flex-col gap-2 p-4.5">
              <code className="token-literal self-start">{t.nome}</code>
              <p className="texto-mudo">{t.texto}</p>
            </div>
          ))}
        </div>
        <BlocoDeComando rotulo={garantia.rotuloDoComando} linhas={[garantia.comando]} saida={garantia.saida} rotuloDaSaida="Output, one line per decision" />
      </section>

      <section id={merge.ancora} className="bloco-leitura caixa-tracejada">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="titulo-2">{merge.titulo}</h2>
          <span className="pilula-desligada">
            <i aria-hidden="true" />
            {merge.desligado}
          </span>
        </div>
        <p className="chamada">{merge.chamada}</p>
        <div className="tabela-rolavel" tabIndex={0} role="group" aria-label={merge.cabecas[0]}>
          <table>
            <thead>
              <tr>
                <th scope="col">{merge.cabecas[0]}</th>
                <th scope="col">{merge.cabecas[1]}</th>
              </tr>
            </thead>
            <tbody>
              {merge.condicoes.map((c) => (
                <tr key={c.porque}>
                  <td>
                    <Prosa frase={c.se} />
                  </td>
                  <td>{c.porque}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="titulo-3">{merge.porQueDesligado.titulo}</h3>
          <p className="texto-mudo max-w-[66ch]">{merge.porQueDesligado.texto}</p>
          <BlocoDeComando
            rotulo={merge.porQueDesligado.rotuloDoComando}
            linhas={merge.porQueDesligado.comandos}
            medicao={
              <p className="medicao">
                <span className="text-status-alert">{merge.porQueDesligado.resultado}</span>
                <span>{merge.porQueDesligado.consequencia}</span>
              </p>
            }
          />
          <p className="texto-mudo">{merge.plano}</p>
        </div>
      </section>

      <section id={assinatura.ancora} className="bloco-leitura">
        <h2 className="titulo-2">{assinatura.titulo}</h2>
        <div className="grade-2">
          <div className="superficie-card flex flex-col gap-2 p-5">
            <p className="rotulo-secao text-primary">{assinatura.mostra.rotulo}</p>
            <p className="texto">{assinatura.mostra.texto}</p>
          </div>
          <div className="superficie-card flex flex-col gap-2 p-5">
            <p className="rotulo-secao text-status-alert">{assinatura.naoMostra.rotulo}</p>
            <p className="texto">{assinatura.naoMostra.texto}</p>
          </div>
        </div>
      </section>

      <section id={guias.ancora} className="bloco-leitura">
        <h2 className="titulo-2">{guias.titulo}</h2>
        <p className="chamada">{guias.chamada}</p>
        <div className="grade-guias">
          {guias.lista.map((g) => (
            <a key={g.ancora} href={secaoDoQuickstart(g.ancora)} className="cartao-guia">
              <b className="font-semibold">{g.titulo}</b>
              <span className="rotulo-secao">{g.secao}</span>
            </a>
          ))}
        </div>
        <details className="superficie-card detalhes-cartao">
          <summary>{guias.chaveVazada.resumo}</summary>
          <ol className="passos-seis">
            {guias.chaveVazada.passos.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </details>
      </section>

      <section id={formato.ancora} className="bloco-leitura">
        <h2 className="titulo-2">{formato.titulo}</h2>
        <div className="caixa-tracejada flex flex-col gap-2 p-5">
          <MarcaNota className="self-start">{formato.marca}</MarcaNota>
          <p className="texto-mudo">{formato.texto}</p>
        </div>
      </section>

      <section id={contribuicoes.ancora} className="bloco-leitura">
        <h2 className="titulo-2">{contribuicoes.titulo}</h2>
        <p className="chamada">{contribuicoes.chamada}</p>
        <div className="grade-2">
          {[contribuicoes.abertas, contribuicoes.aceitas].map((c) => (
            <div key={c.comando} className="superficie-card flex min-w-0 flex-col gap-2.5 p-4.5">
              <span className="numero-medio">{c.valor}</span>
              <p className="texto">
                <Prosa frase={c.texto} />
              </p>
              <BlocoDeComando
                compacto
                rotulo={contribuicoes.rotuloDoComando}
                linhas={[c.comando]}
                medicao={
                  <p className="medicao">
                    <span>measured {contribuicoes.medidoEm}</span>
                    <span>runs against GitHub, not the clone</span>
                  </p>
                }
              />
            </div>
          ))}
        </div>
        <p className="texto-mudo max-w-[70ch]">{contribuicoes.nota}</p>

        <h3 className="titulo-3">{contribuicoes.lista.titulo}</h3>
        <ul className="lista-contribuicoes">
          {contribuicoes.lista.itens.map((c) => (
            <li key={c.url}>
              <a href={c.url} className="font-mono">
                {c.repo}#{c.numero}
              </a>
              <span className="texto-mudo">
                {c.tipo} · {c.estado}
              </span>
            </li>
          ))}
        </ul>
        <p className="texto-mudo">{contribuicoes.lista.estadoEm}</p>
      </section>
    </PaginaComSumario>
  );
}

export default Method;
