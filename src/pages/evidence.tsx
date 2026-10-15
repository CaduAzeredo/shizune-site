import { Link } from "react-router-dom";
import useSeo from "@/lib/use-seo";
import { seoEvidence } from "@/content/seo";
import ficha, { comandoDe, estadoDe, estadoDoDegrau, medicaoDe, type EstadoDaAfirmacao } from "@/content/ficha";
import { afirmacoes, cabeca, comoLer, encaixe, naoAfirmamos } from "@/content/evidencia";
import { contribuicoes } from "@/content/method";
import { nomeDoDegrau, ROTULO_DO_ESTADO } from "@/content/degraus";
import { contagemPorExtenso, fonteConferida, VIZINHOS } from "@/content/vizinhos";
import PaginaComSumario from "@/components/layout/pagina-com-sumario";
import BlocoDeComando from "@/components/ui/bloco-de-comando";
import FaixaDaFicha from "@/components/ui/faixa-da-ficha";
import { MarcaRascunho } from "@/components/ui/marca";
import Medicao from "@/components/ui/medicao";
import { PUBLICACAO } from "@/lib/ambiente";
import { oQueAparece } from "@/lib/publicacao";
import { cn } from "@/lib/utils";

/**
 * A rota `/evidence` — a tela 12.
 *
 * Cada afirmação tem o valor, o comando que a confere num clone limpo do pacote
 * público, o estado e o dia da medição — tudo da ficha da release. As
 * contribuições são a exceção declarada: rodam contra o GitHub, e a linha diz.
 *
 * Os vizinhos passam pela regra de publicação: sem fonte conferida, rascunho no
 * preview e nada em produção. Se nenhum aparecer, a seção inteira não aparece —
 * nem o título, nem a entrada no sumário.
 */
function Afirmacao({
  titulo,
  valor,
  texto,
  mostra,
  naoMostra,
  comandos,
  estado,
  medicao,
  rotuloDoComando = afirmacoes.rotuloDoComando,
}: {
  readonly titulo: string;
  readonly valor?: string | number;
  readonly texto: string;
  readonly mostra: string;
  readonly naoMostra: string;
  readonly comandos: readonly string[];
  readonly estado: EstadoDaAfirmacao;
  readonly medicao: React.ReactNode;
  readonly rotuloDoComando?: string;
}) {
  return (
    <article className={cn("afirmacao", estado === "desatualizada" && "afirmacao-atrasada")}>
      <div className="afirmacao-texto">
        <h3 className="titulo-3">{titulo}</h3>
        {valor !== undefined && <p className="numero-afirmacao">{valor}</p>}
        <p className="texto-mudo">{texto}</p>
        <p className="mostra">
          <b>{afirmacoes.mostra}</b> {mostra}
          <br />
          <b>{afirmacoes.naoMostra}</b> {naoMostra}
        </p>
      </div>
      <div className="afirmacao-comando">
        <BlocoDeComando compacto rotulo={rotuloDoComando} linhas={comandos} medicao={medicao} />
      </div>
    </article>
  );
}

function medicaoDaFicha(id: string) {
  const m = medicaoDe(id);
  return <Medicao estado={estadoDe(id)} data={m.data} sha={m.shaCurto} />;
}

export function Evidence() {
  useSeo(seoEvidence);
  const vizinhos = oQueAparece(VIZINHOS, fonteConferida, PUBLICACAO);

  const sumario = [
    { ancora: comoLer.ancora, rotulo: "How to read it" },
    { ancora: afirmacoes.ancora, rotulo: "Claims you can run" },
    { ancora: naoAfirmamos.ancora, rotulo: "What we do not claim" },
    ...(vizinhos.length > 0 ? [{ ancora: encaixe.ancora, rotulo: encaixe.rotulo }] : []),
  ];

  return (
    <PaginaComSumario sumario={sumario}>
      <section className="bloco-leitura">
        <p className="rotulo-secao">{cabeca.rotulo}</p>
        <h1 className="titulo-1">{cabeca.titulo}</h1>
        <p className="chamada-grande">{cabeca.texto}</p>
      </section>

      <section id={comoLer.ancora} className="bloco-leitura">
        <h2 className="titulo-3">{comoLer.titulo}</h2>
        <p className="legenda-estados">
          {comoLer.legenda.map((l) => (
            <span
              key={l.marca}
              className={cn(
                l.estado === "reproduzida" && "text-primary",
                l.estado === "desatualizada" && "text-accent-amber",
                l.estado === "falhou" && "text-status-alert",
              )}
            >
              {l.marca}
            </span>
          ))}
        </p>
        <p className="texto-mudo max-w-[68ch]">
          <b className="font-semibold text-foreground">{comoLer.desatualizada}</b>
          {comoLer.explicacao}
        </p>
        <FaixaDaFicha />
      </section>

      <section id={afirmacoes.ancora} className="bloco-leitura">
        <h2 className="titulo-2">{afirmacoes.titulo}</h2>
        <p className="chamada">{afirmacoes.chamada}</p>
        <div className="flex flex-col gap-3.5">
          <Afirmacao
            {...afirmacoes.validador}
            valor={ficha.asseracoes}
            comandos={[comandoDe("negative-test-assertions"), comandoDe("negative-test-output")]}
            estado={estadoDe("negative-test-assertions")}
            medicao={medicaoDaFicha("negative-test-assertions")}
          />
          <Afirmacao
            {...afirmacoes.chaveDeMaquina}
            comandos={[comandoDe("negative-test-output")]}
            estado={estadoDe("negative-test-output")}
            medicao={medicaoDaFicha("negative-test-output")}
          />
          <Afirmacao
            {...afirmacoes.doctor}
            valor={`${ficha.doctor.passaram} · ${ficha.doctor.na}`}
            comandos={[comandoDe("doctor-summary")]}
            estado={estadoDe("doctor-summary")}
            medicao={medicaoDaFicha("doctor-summary")}
          />
          <Afirmacao
            {...afirmacoes.pacote}
            valor={ficha.arquivos}
            comandos={[comandoDe("package-files")]}
            estado={estadoDe("package-files")}
            medicao={medicaoDaFicha("package-files")}
          />
          <Afirmacao
            {...afirmacoes.contribuicoes}
            valor={contribuicoes.abertas.valor}
            comandos={[contribuicoes.abertas.comando]}
            estado="reproduzida"
            rotuloDoComando={afirmacoes.contribuicoes.rotuloDoComando}
            medicao={
              <p className="medicao">
                <span>measured {contribuicoes.medidoEm}</span>
                <span>{afirmacoes.contribuicoes.ondeRoda}</span>
              </p>
            }
          />
        </div>
      </section>

      <section id={naoAfirmamos.ancora} className="bloco-leitura">
        <h2 className="titulo-2">{naoAfirmamos.titulo}</h2>
        <div className="grade-3">
          {naoAfirmamos.itens.map((i) => (
            <div key={i.titulo} className="superficie-card flex flex-col gap-2 p-4.5">
              <p className="rotulo-secao text-status-alert">{i.titulo}</p>
              <p className="texto-mudo">{i.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {vizinhos.length > 0 && (
        <section id={encaixe.ancora} className="bloco-leitura">
          <p className="rotulo-secao">{encaixe.rotulo}</p>
          <h2 className="titulo-2">{encaixe.titulo(contagemPorExtenso(vizinhos.length))}</h2>
          <p className="chamada-grande">{encaixe.texto}</p>
          <div className="grade-3">
            {encaixe.faixas.map((f) => (
              <div key={f.texto} className={cn("faixa-camada", f.produto && "faixa-produto")}>
                <p className={cn("rotulo-secao", f.produto && "text-accent-amber")}>{f.rotulo}</p>
                <p>{f.texto}</p>
              </div>
            ))}
          </div>
          <p className="texto-mudo max-w-[72ch]">{encaixe.nota}</p>

          <div className="flex flex-col gap-3">
            <div className="vizinhos-cabeca" aria-hidden="true">
              {encaixe.colunas.map((c, i) => (
                <span key={c} className={cn(i === 3 && "text-accent-amber")}>
                  {c}
                </span>
              ))}
            </div>
            {vizinhos.map(({ item: v, rascunho }) => (
              <article key={v.nome} className="vizinho">
                <div className="vizinho-grade">
                  <div className="vizinho-celula">
                    <span className="vizinho-rotulo">{encaixe.colunas[0]}</span>
                    <h3 className="titulo-cartao">{v.nome}</h3>
                    <span className="texto-mudo">{v.exemplos}</span>
                  </div>
                  <div className="vizinho-celula">
                    <span className="vizinho-rotulo">{encaixe.colunas[1]}</span>
                    <p>{v.resolve}</p>
                  </div>
                  <div className="vizinho-celula">
                    <span className="vizinho-rotulo">{encaixe.colunas[2]}</span>
                    <p>{v.lacuna}</p>
                  </div>
                  <div className="vizinho-celula vizinho-conecta">
                    <span className="vizinho-rotulo">{encaixe.colunas[3]}</span>
                    <p>{v.conecta}</p>
                  </div>
                  <div className="vizinho-celula">
                    <span className="vizinho-rotulo">{encaixe.colunas[4]}</span>
                    <span className={cn("rotulo-passo", estadoDoDegrau(v.degrau) === "now" && "text-accent-amber")}>
                      {ROTULO_DO_ESTADO[estadoDoDegrau(v.degrau)]}
                    </span>
                    <span>{nomeDoDegrau(v.degrau)}</span>
                  </div>
                </div>
                <p className="vizinho-fonte">
                  {v.fonte ? (
                    <a href={v.fonte}>{encaixe.fonte}</a>
                  ) : (
                    <span>
                      {encaixe.fonte} <span className="sublinhado-tracejado">{encaixe.semFonte}</span>
                    </span>
                  )}
                  <span>
                    {encaixe.lidaEm} <span className={cn(!v.lidaEm && "sublinhado-tracejado")}>{v.lidaEm ?? encaixe.semData}</span>
                  </span>
                  {rascunho && <MarcaRascunho>{encaixe.rascunho}</MarcaRascunho>}
                </p>
              </article>
            ))}
          </div>
          <p className="texto-mudo">
            {encaixe.rodape}{" "}
            <Link to="/roadmap" className="inline-flex min-h-6 items-center">
              {encaixe.verDegraus}
            </Link>
          </p>
        </section>
      )}
    </PaginaComSumario>
  );
}

export default Evidence;
