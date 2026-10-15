import ficha from "@/content/ficha";
import { cn } from "@/lib/utils";

/**
 * A faixa "lido da ficha" — de onde vêm os números e os estados da página.
 *
 * Duas formas. A normal diz o SHA e o dia da ficha. A âmbar aparece quando a
 * cadeia gravou um SHA de release mais recente que o da ficha: a página foi
 * gerada de uma ficha que ficou para trás. O navegador não descobre isso
 * sozinho — o CSP não deixa buscar nada ao vivo —, e por isso quem liga a faixa
 * é a cadeia, num PR, e não o carregamento da página.
 */
export function FaixaDaFicha({ comEstado = false }: { readonly comEstado?: boolean }) {
  return (
    <>
      <div className="faixa">
        <span>
          Read from the release card of the latest release · sha {ficha.shaCurto} · {ficha.data}
        </span>
        {comEstado && !ficha.desatualizada && <span className="text-primary">● up to date</span>}
      </div>
      {ficha.desatualizada && (
        <div className={cn("faixa", "faixa-atrasada")} role="note">
          <span>
            Outdated: this page was generated from a release card whose SHA differs from the latest
            release. The states below may be behind.
          </span>
        </div>
      )}
    </>
  );
}

export default FaixaDaFicha;
