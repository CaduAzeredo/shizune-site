import BrandMark from "./brand-mark";
import { GlifoCompacto } from "./glifo";
import { rodape } from "@/content/rodape-de-rota";

/**
 * O fecho — um só, em toda rota.
 *
 * Nenhuma página desenha o próprio. Ele lê `rodape` de `rodape-de-rota.ts`; uma
 * rota nova é uma chave num mapa, não um rodapé novo. O `e2e` conta: mais de um
 * `<footer>` na página reprova.
 *
 * O nome completo aparece aqui SEMPRE, inclusive quando o header do celular o
 * esconde — é o lugar onde a assinatura é obrigatória.
 */
export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="coluna flex flex-col gap-4 pt-7 pb-9 md:flex-row md:items-center md:justify-between md:gap-6 md:pb-10">
        <BrandMark segmento={rodape.segmento} />

        <span className="inline-flex items-center gap-2.5">
          <span aria-hidden="true" className="text-accent-amber">
            <GlifoCompacto tamanho={20} />
          </span>
          <span className="text-[13px] text-muted-foreground md:text-[13.5px]">
            {rodape.fecho}
          </span>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
