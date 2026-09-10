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
  origens,
  ressalva,
  secoes,
  testeNegativo,
  type SecaoDeTexto,
} from "@/content/method";
import { GlifoConteudo } from "@/components/layout/glifo";
import BlocoDeComando from "@/components/ui/bloco-de-comando";
import Prosa from "@/components/ui/prosa";
import { cn } from "@/lib/utils";

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

/**
 * A história, no fim da rota — e ela se desenha diferente de propósito.
 *
 * Três decisões, e cada uma tem motivo:
 *
 * 1. **Um `<h2>` para "Origins" e `<h3>` para as oito partes.** Oito `<h2>`
 *    fariam o sumário do documento anunciar dezesseis seções, quando a rota tem
 *    nove e uma história no fim. A hierarquia h1 → h2 → h3 é o que mantém o axe
 *    verde e o leitor de tela com um mapa que corresponde à página.
 * 2. **Sem régua entre as partes.** As seções de mecanismo acima são separadas
 *    por régua porque são independentes e se consultam fora de ordem; a
 *    história se lê de cima a baixo. O ritmo é por espaço, e a ausência da linha
 *    já avisa ao leitor que o registro mudou.
 * 3. **Sem o símbolo âmbar.** Ele aparece em dois lugares contados nesta rota —
 *    o marcador de "How it works" e o painel da ressalva. Um terceiro diluiria a
 *    regra de "lugares contados", que é a que o operador já reprovou duas vezes
 *    por excesso.
 */
function Origens() {
  return (
    <section className="coluna py-8.5 md:py-11">
      <h2 className="titulo-secao">{origens.titulo}</h2>

      <div className="flex flex-col gap-8 md:gap-10">
        {origens.partes.map((parte) => (
          <div
            key={parte.titulo}
            className={
              parte.painel
                ? "superficie-card px-5 py-6 md:px-9.5 md:pt-8 md:pb-7"
                : undefined
            }
          >
            <div
              className={
                parte.painel
                  ? "mb-5 flex items-center gap-3 md:mb-6"
                  : undefined
              }
            >
              {parte.painel && (
                <span aria-hidden="true" className="shrink-0 text-accent-amber">
                  <GlifoConteudo tamanho={24} />
                </span>
              )}
              <h3
                className={cn(
                  "text-[17px] font-semibold tracking-[-0.01em] text-foreground md:text-[18px]",
                  !parte.painel && "mb-4 md:mb-5",
                )}
              >
                {parte.titulo}
              </h3>
            </div>
            {parte.paragrafos.map((p, i) => (
              <p key={i} className={i > 0 ? "texto mt-4" : "texto"}>
                <Prosa frase={p} />
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
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
          {/* O `mb-0` no h2 passa a régua do título para este contêiner, que
              precisa acompanhar o espaçamento novo de `.titulo-secao` — senão
              os dois títulos que andam com o símbolo ficam mais apertados que
              todos os outros. */}
          <div className="mb-6.5 flex items-center gap-3 md:mb-8">
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

      {/* ── a história ────────────────────────────────────────────────────
          Última seção de CONTEÚDO, antes do fecho administrativo. "License and
          name" fica por último porque não é conteúdo: é `Apache-2.0`,
          `Shizune™` e a política de nome, e se lê colado ao rodapé, que diz as
          mesmas três coisas. Pôr a história entre os dois separaria duas peças
          que funcionam juntas. */}
      <Origens />

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
