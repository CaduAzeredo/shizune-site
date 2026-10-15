import { Link } from "react-router-dom";
import useSeo from "@/lib/use-seo";
import { seoHome } from "@/content/seo";
import ficha, { comandoDe, estadoDe, medicaoDe } from "@/content/ficha";
import {
  comeco,
  comoFunciona,
  configurar,
  contraNos,
  exemplo01,
  exemplo02,
  hero,
  numeros,
  ondeSeguir,
} from "@/content/home";
import { CHECKOUT_DA_ULTIMA, CLONE, REPOSITORIO, secaoDoQuickstart } from "@/content/repositorio";
import { GlifoCompacto } from "@/components/layout/glifo";
import BlocoDeComando from "@/components/ui/bloco-de-comando";
import BlocoDeTerminal, { QuadroDaCaptura } from "@/components/ui/bloco-de-terminal";
import { MarcaRascunho } from "@/components/ui/marca";
import Medicao from "@/components/ui/medicao";
import Prosa from "@/components/ui/prosa";
import { PUBLICACAO } from "@/lib/ambiente";
import { blocoAparece } from "@/lib/publicacao";
import { trechoDaSecao } from "@/lib/terminal";
import { cn } from "@/lib/utils";

/**
 * A rota `/` — a home v3.
 *
 * A ordem é a do design, e ela é o argumento: a frase e, ao lado, como começar;
 * as três partes; dois exemplos com a saída real do validador; os números com o
 * comando de cada um; os três comandos do começo; para onde seguir.
 *
 * Toda captura e todo número saem da ficha da release. A saída dos exemplos é
 * uma SEÇÃO da captura, sem linha cortada, e a captura inteira fica no DOM
 * dentro do primeiro exemplo.
 */
function CabecaDeSecao({
  rotulo,
  titulo,
  chamada,
}: {
  readonly rotulo: string;
  readonly titulo: string;
  readonly chamada?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="rotulo-secao">{rotulo}</p>
      <h2 className="titulo-2">{titulo}</h2>
      {chamada && <p className="chamada">{chamada}</p>}
    </div>
  );
}

export function Home() {
  useSeo(seoHome);
  const medidaDaCaptura = medicaoDe("negative-test-output");
  const rodapeDaCaptura = (
    <Medicao estado={estadoDe("negative-test-output")} data={medidaDaCaptura.data} sha={medidaDaCaptura.shaCurto} extra={<span>unedited capture</span>} />
  );

  return (
    <>
      {/* ── a frase, e como começar ───────────────────────────────────── */}
      <section className="largura secao-hero">
        <div className="hero-grade">
          <div className="flex min-w-0 flex-col gap-6">
            {/* O símbolo colapsa uma vez, na entrada: a onda oscila a largura
                inteira e vira a reta. Âncora silenciosa, não ilustração. */}
            <span aria-hidden="true" className="glifo-hero entra d1 block text-accent-amber">
              <GlifoCompacto tamanho={56} animavel />
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

            <p className="subtitulo-hero entra d3">{hero.subtitulo}</p>
            <p className="texto-hero entra d3">{hero.texto}</p>

            <div className="entra d4 flex flex-wrap gap-3">
              <a href={`#${exemplo01.ancora}`} className="botao botao-principal">
                {hero.rejeitar}
              </a>
              <Link to="/method" className="botao botao-fantasma">
                {hero.metodo}
              </Link>
            </div>

            <p className="rotulo-secao entra d4">{hero.rodape}</p>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <h2 className="titulo-3">{configurar.titulo}</h2>
            <p className="texto-mudo">{configurar.texto}</p>
            <BlocoDeComando
              agente
              rotulo={configurar.rotuloDoPrompt}
              linhas={[configurar.trecho]}
              copiar={configurar.promptCompleto}
              medicao={
                <p className="medicao">
                  <span>{configurar.origem}</span>
                  <a href={secaoDoQuickstart(configurar.ancoraDoPrompt)}>{configurar.promptInteiro}</a>
                </p>
              }
            />
            <p className="texto-mudo">{configurar.ouRode}</p>
            <BlocoDeComando className="imprime" linhas={configurar.comandos} />
            <p className="medicao">
              <span>
                <span aria-hidden="true" className="text-primary">$ </span>
                {configurar.legendaTerminal}
              </span>
              <span>
                <span aria-hidden="true" className="text-accent-amber">› </span>
                {configurar.legendaAgente}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ── as três partes ─────────────────────────────────────────────── */}
      <section className="secao">
        <div className="largura flex flex-col gap-10">
          <CabecaDeSecao rotulo={comoFunciona.rotulo} titulo={comoFunciona.titulo} chamada={comoFunciona.chamada} />

          <div className="grade-3">
            {comoFunciona.partes.map((p) => (
              <div key={p.quem} className="superficie-card flex flex-col gap-3.5 p-5.5">
                <p className="rotulo-passo">{p.quem}</p>
                <h3 className="titulo-3">{p.titulo}</h3>
                <p className="texto-mudo">
                  <Prosa frase={p.texto} />
                </p>
                <code className={cn("linha-registro", p.comando && "linha-comando")}>
                  {p.comando && (
                    <span aria-hidden="true" className="text-primary">
                      ${" "}
                    </span>
                  )}
                  {p.linha}
                </code>
              </div>
            ))}
          </div>

          <div className="grade-3">
            {comoFunciona.camadas.map((c) => (
              <div key={c.texto} className={cn("faixa-camada", c.produto && "faixa-produto")}>
                <p className={cn("rotulo-secao", c.produto && "text-accent-amber")}>{c.rotulo}</p>
                <p>{c.texto}</p>
              </div>
            ))}
          </div>

          <p className="texto-mudo">{comoFunciona.nota}</p>
        </div>
      </section>

      {/* ── exemplo 01 ─────────────────────────────────────────────────── */}
      <section id={exemplo01.ancora} className="secao">
        <div className="largura flex flex-col gap-8">
          <CabecaDeSecao rotulo={exemplo01.rotulo} titulo={exemplo01.titulo} chamada={exemplo01.chamada} />

          <div className="exemplo-grade">
            <ol className="passos-exemplo">
              <li>
                <h3 className="titulo-passo">
                  <span className="rotulo-passo">1</span> {exemplo01.prever.titulo}
                </h3>
                <p className="texto-mudo">{exemplo01.prever.texto}</p>
                <div className="flex flex-wrap gap-2.5">
                  {exemplo01.prever.opcoes.map((o) => (
                    <a key={o} href="#saida-01" className="botao botao-escolha">
                      {o}
                    </a>
                  ))}
                </div>
              </li>
              <li>
                <h3 className="titulo-passo">
                  <span className="rotulo-passo">2</span> {exemplo01.rodar.titulo}
                </h3>
                <BlocoDeComando rotulo={exemplo01.rodar.rotulo} linhas={[comandoDe("negative-test-output")]} />
              </li>
              <li>
                <h3 className="titulo-passo">
                  <span className="rotulo-passo">3</span> {exemplo01.ler.titulo}
                </h3>
                <p className="texto-mudo">{exemplo01.ler.texto}</p>
              </li>
            </ol>

            <QuadroDaCaptura
              className="alvo-ancora"
              rotulo={`output · ${comandoDe("negative-test-output")}`}
              direita={<span className="codigo-saida codigo-1">{exemplo01.rotuloSaida}</span>}
              texto={trechoDaSecao(ficha.captura, exemplo01.secao)}
              destaques={exemplo01.destaques}
              rodape={rodapeDaCaptura}
            />
          </div>
          <span id="saida-01" className="sr-only">
            Output of the run
          </span>

          <details className="detalhes-exemplo">
            <summary>{exemplo01.detalhes.resumo}</summary>
            <div className="flex flex-col gap-6 pt-4">
              <div className="grade-2">
                {exemplo01.detalhes.paragrafos.map((p, i) => (
                  <p key={i} className="texto-mudo">
                    <Prosa frase={p} />
                  </p>
                ))}
              </div>
              <p className="rotulo-secao">{exemplo01.detalhes.inteira}</p>
              <BlocoDeTerminal saida={ficha.captura} />
            </div>
          </details>
        </div>
      </section>

      {/* ── exemplo 02 ─────────────────────────────────────────────────── */}
      <section id={exemplo02.ancora} className="secao">
        <div className="largura flex flex-col gap-8">
          <CabecaDeSecao rotulo={exemplo02.rotulo} titulo={exemplo02.titulo} chamada={exemplo02.chamada} />

          <div className="exemplo-grade exemplo-grade-invertida">
            <QuadroDaCaptura
              rotulo={exemplo02.rotuloSaida}
              direita={
                <span className="flex flex-wrap gap-2">
                  <span className="codigo-saida codigo-0">{exemplo02.codigos.semCitacao}</span>
                  <span className="codigo-saida codigo-1">{exemplo02.codigos.comCitacao}</span>
                </span>
              }
              texto={trechoDaSecao(ficha.captura, exemplo02.secao)}
              destaques={exemplo02.destaques}
              rodape={rodapeDaCaptura}
            />

            <div className="flex min-w-0 flex-col gap-4">
              {exemplo02.cartoes.map((c) => (
                <div key={c.rotulo} className="superficie-card flex flex-col gap-2 p-5">
                  <p className={cn("rotulo-passo", c.reprova && "text-status-alert")}>{c.rotulo}</p>
                  <p className="texto">{c.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── os números ─────────────────────────────────────────────────── */}
      <section id={numeros.ancora} className="secao">
        <div className="largura flex flex-col gap-9">
          <CabecaDeSecao rotulo={numeros.rotulo} titulo={numeros.titulo} chamada={numeros.chamada} />

          <div className="grade-3">
            <CartaoDeNumero
              valor={ficha.asseracoes}
              titulo={numeros.asseracoes.titulo}
              texto={numeros.asseracoes.texto(ficha.asseracoes)}
              id="negative-test-assertions"
            />
            <CartaoDeNumero
              valor={ficha.arquivos}
              titulo={numeros.arquivos.titulo}
              texto={numeros.arquivos.texto}
              id="package-files"
            />
            <CartaoDeNumero
              valor={ficha.doctor.total}
              titulo={<Prosa frase={numeros.doctor.titulo(ficha.doctor.passaram, ficha.doctor.na)} />}
              texto={numeros.doctor.texto}
              id="doctor-summary"
            />
          </div>

          <p>
            <Link to="/evidence" className="inline-flex min-h-6 items-center">
              {numeros.todas}
            </Link>
          </p>
        </div>
      </section>

      {/* ── contra nós mesmos: rascunho no preview, fora da produção ───── */}
      {blocoAparece(contraNos.conferido, PUBLICACAO) && (
        <section id={contraNos.ancora} className="secao">
          <div className="largura flex flex-col gap-9">
            <CabecaDeSecao rotulo={contraNos.rotulo} titulo={contraNos.titulo} chamada={contraNos.chamada} />
            <div className="grade-4">
              {contraNos.passos.map((p) => (
                <div key={p.texto} className={cn("superficie-card flex flex-col gap-1.5 p-5", p.fechado && "cartao-feito")}>
                  <span className={cn("numero-medio", p.fechado && "text-primary")}>{p.valor}</span>
                  <p className="texto">{p.texto}</p>
                  <p className="rotulo-secao">{p.rodape}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="texto-mudo max-w-[70ch]">
                {contraNos.limite} {contraNos.limiteFonte}
              </p>
              {!contraNos.conferido && <MarcaRascunho>{contraNos.marca}</MarcaRascunho>}
            </div>
          </div>
        </section>
      )}

      {/* ── o começo ───────────────────────────────────────────────────── */}
      <section id={comeco.ancora} className="secao">
        <div className="largura comeco-grade">
          <div className="flex min-w-0 flex-col gap-3.5">
            <p className="rotulo-secao">{comeco.rotulo}</p>
            <h2 className="titulo-2">{comeco.titulo}</h2>
            <p className="chamada">{comeco.chamada}</p>
            <p className="texto-mudo">
              <Prosa frase={comeco.nota} />
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            <BlocoDeComando rotulo={comeco.passo1} linhas={[CLONE, "cd shizune", CHECKOUT_DA_ULTIMA]} />
            <BlocoDeComando
              rotulo={comeco.passo2}
              linhas={[comandoDe("doctor-summary")]}
              saida={ficha.doctor.linha}
              rotuloDaSaida={comeco.passo2Saida}
              medicao={<p className="medicao"><span>{comeco.passo2Saida}</span></p>}
            />
            <BlocoDeComando rotulo={comeco.passo3} linhas={[comeco.novoProjeto]} />
          </div>
        </div>
      </section>

      {/* ── para onde seguir ───────────────────────────────────────────── */}
      <section className="secao">
        <div className="largura flex flex-col gap-6">
          <p className="rotulo-secao">{ondeSeguir.rotulo}</p>
          <div className="grade-4">
            {ondeSeguir.destinos.map((d) =>
              d.rota === "github" ? (
                <a key={d.rota} href={REPOSITORIO} className="cartao-destino">
                  <span className="cartao-destino-rota">{d.rota}</span>
                  <span>{d.texto}</span>
                </a>
              ) : (
                <Link key={d.rota} to={d.rota} className="cartao-destino">
                  <span className="cartao-destino-rota">{d.rota}</span>
                  <span>{d.texto}</span>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function CartaoDeNumero({
  valor,
  titulo,
  texto,
  id,
}: {
  readonly valor: number;
  readonly titulo: React.ReactNode;
  readonly texto: string;
  readonly id: string;
}) {
  const m = medicaoDe(id);
  return (
    <div className="superficie-card flex flex-col gap-3.5 p-5.5">
      <span className="numero-medido">{valor}</span>
      <h3 className="titulo-cartao">{titulo}</h3>
      <p className="texto-mudo">{texto}</p>
      <BlocoDeComando
        className="mt-auto"
        compacto
        linhas={[comandoDe(id)]}
        medicao={<Medicao estado={estadoDe(id)} data={m.data} sha={m.shaCurto} />}
      />
    </div>
  );
}

export default Home;
