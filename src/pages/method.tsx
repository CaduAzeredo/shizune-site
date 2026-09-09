import useSeo from "@/lib/use-seo";
import { seoMethod } from "@/content/seo";
import ficha from "@/content/ficha";
import { CLONE } from "@/content/home";
import {
  entrega,
  exigencia,
  fronteira,
  licenca,
  oQueE,
  oQueReprova,
  ressalva,
  secoes,
  testeNegativo,
  type SecaoDeTexto,
} from "@/content/method";
import { GlifoConteudo } from "@/components/layout/glifo";
import BlocoDeComando from "@/components/ui/bloco-de-comando";
import Prosa from "@/components/ui/prosa";

/**
 * A rota `/method`.
 *
 * O método inteiro, denso, e sem índice lateral — decisão do operador: com
 * nove seções curtas, um índice ao lado seria mobília. As seções de mecanismo
 * correm juntas no mesmo ritmo; a ressalva tem o dobro de ar e painel próprio,
 * porque é a seção mais importante e a mais fácil de ler por cima.
 */
function Secao({ secao }: { readonly secao: SecaoDeTexto }) {
  return (
    <>
      <section className="coluna py-8.5 md:py-11">
        <h2 className="titulo-secao">{secao.titulo}</h2>
        {secao.paragrafos.map((p, i) => (
          <p key={i} className={i > 0 ? "texto mt-4" : "texto"}>
            <Prosa frase={p} />
          </p>
        ))}
      </section>
      <hr className="h-px border-0 bg-border" />
    </>
  );
}

export function Method() {
  useSeo(seoMethod);

  return (
    <>
      <section className="coluna pt-16 pb-10 md:pt-24 md:pb-13">
        <h1 className="mb-5 text-[26px] leading-[1.25] font-semibold tracking-[-0.022em] text-foreground md:mb-6 md:text-[34px]">
          {oQueE.titulo}
        </h1>
        <p className="text-[17px] leading-[1.55] text-foreground md:text-[19px]">
          {oQueE.texto}
        </p>
      </section>

      <hr className="h-px border-0 bg-border" />

      {secoes.map((s) => (
        <Secao key={s.titulo} secao={s} />
      ))}

      {/* ── o que reprova ─────────────────────────────────────────────── */}
      <section className="coluna py-8.5 md:py-11">
        <h2 className="titulo-secao">{oQueReprova.titulo}</h2>
        <p className="texto">
          <Prosa frase={oQueReprova.abertura} />
        </p>
        <p className="texto mt-4.5">{oQueReprova.chamada}</p>

        {/* Numerada em monoespaçada: são os cinco casos que o validador
            reprova, e cada um corresponde a asserções do teste negativo. */}
        <ol className="mt-4.5 flex list-none flex-col gap-3 p-0">
          {oQueReprova.casos.map((caso, i) => (
            <li
              key={caso}
              className="grid grid-cols-[22px_minmax(0,1fr)] gap-3 text-[16px] leading-[1.55] text-foreground md:text-[16.5px]"
            >
              <span
                aria-hidden="true"
                className="font-mono text-[13px] leading-[1.9] text-muted-foreground"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{caso}</span>
            </li>
          ))}
        </ol>

        <p className="texto mt-5.5">{oQueReprova.fecho}</p>
      </section>

      <hr className="h-px border-0 bg-border" />

      <Secao secao={fronteira} />
      <Secao secao={exigencia} />

      {/* ── a ressalva ────────────────────────────────────────────────── */}
      <section className="coluna py-15 md:py-20">
        <div className="superficie-card px-5 py-6 md:px-9.5 md:pt-9.5 md:pb-8.5">
          <div className="mb-5 flex items-center gap-3">
            <span aria-hidden="true" className="shrink-0 text-accent-amber">
              <GlifoConteudo tamanho={24} />
            </span>
            <h2 className="titulo-secao mb-0">{ressalva.titulo}</h2>
          </div>

          {ressalva.paragrafos.map((p, i) => (
            <p
              key={p}
              className={
                i > 0
                  ? "mt-4 text-[16.5px] leading-[1.6] text-foreground md:text-[17.5px]"
                  : "text-[16.5px] leading-[1.6] text-foreground md:text-[17.5px]"
              }
            >
              {p}
            </p>
          ))}

          <p className="texto-mudo mt-5">{ressalva.adjacente}</p>
          <p className="texto-mudo mt-5">
            <Prosa frase={ressalva.instancia} />
          </p>
        </div>
      </section>

      <hr className="h-px border-0 bg-border" />

      {/* ── o teste negativo ──────────────────────────────────────────── */}
      <section className="coluna py-8.5 md:py-11">
        <h2 className="titulo-secao">{testeNegativo.titulo}</h2>
        <p className="texto mb-5.5">{testeNegativo.texto}</p>
        <BlocoDeComando>
          {`${CLONE}\ncd shizune && git checkout ${ficha.tag}\nnode scripts/test-validate-decisions.mjs`}
        </BlocoDeComando>
      </section>

      <hr className="h-px border-0 bg-border" />

      {/* ── o que o método entrega ────────────────────────────────────── */}
      <section className="coluna py-8.5 md:py-11">
        <h2 className="titulo-secao">{entrega.titulo}</h2>
        <p className="texto">{entrega.texto}</p>
        <p className="texto-mudo mt-5">
          <Prosa frase={entrega.instancia} />
        </p>
      </section>

      <hr className="h-px border-0 bg-border" />

      {/* ── licença e nome ────────────────────────────────────────────── */}
      <section className="coluna pt-9.5 pb-15 md:pt-12 md:pb-19">
        <h2 className="titulo-secao">{licenca.titulo}</h2>
        {/* Sem assinatura própria aqui — ver a nota em `content/method.ts`.
            Quem assina a página é o rodapé global, e ele é um só. */}
        <p className="texto">
          <Prosa frase={licenca.texto} />
        </p>
      </section>
    </>
  );
}

export default Method;
