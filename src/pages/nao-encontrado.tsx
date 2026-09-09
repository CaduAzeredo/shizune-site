import { Link } from "react-router-dom";
import useSeo from "@/lib/use-seo";
import { seoNaoEncontrado } from "@/content/seo";
import { naoEncontrado } from "@/content/nao-encontrado";

/**
 * O 404.
 *
 * O único lugar das três rotas onde a cor de alerta aparece — não há linha que
 * reprova nas outras duas. Sem ilustração, sem piada, sem "oops": diz o que
 * houve e devolve os dois caminhos que existem.
 */
export function NaoEncontrado() {
  useSeo({ ...seoNaoEncontrado, naoIndexar: true });

  return (
    <section className="coluna pt-20 pb-24 md:pt-28 md:pb-32">
      <p className="font-mono text-[46px] leading-none font-medium tracking-[-0.03em] text-status-alert md:text-[54px]">
        {naoEncontrado.codigo}
      </p>
      <h1 className="mt-6 text-[26px] leading-[1.25] font-semibold tracking-[-0.022em] text-foreground md:text-[34px]">
        {naoEncontrado.titulo}
      </h1>
      <p className="texto-mudo mt-4">{naoEncontrado.texto}</p>

      {/* `min-h-11` no celular e `min-h-6` acima: o piso de 24px da WCAG 2.2
          (2.5.8) em toda largura, e 44px onde o dedo alcança. */}
      <p className="mt-8 flex gap-7 font-mono text-[14px]">
        <Link to="/" className="inline-flex min-h-11 items-center md:min-h-6">
          {naoEncontrado.home}
        </Link>
        <Link
          to="/method"
          className="inline-flex min-h-11 items-center md:min-h-6"
        >
          {naoEncontrado.metodo}
        </Link>
      </p>
    </section>
  );
}

export default NaoEncontrado;
