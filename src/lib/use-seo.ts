import { useEffect } from "react";
import { DOMINIO, type SeoDaRota } from "@/content/seo";

const MARCA_DE_ROTA = "seo-de-rota";

/**
 * Head por rota, sem dependência.
 *
 * Escreve título, descrição, canônica, OG/Twitter e JSON-LD na montagem e
 * REMOVE tudo na desmontagem: meta de uma rota vazando para a outra é a versão
 * de SEO do rodapé duplicado.
 *
 * O `index.html` já traz description e OG padrão do site. Criar uma segunda tag
 * ao lado da primeira não adianta — quem lê meta lê a primeira. Então, quando a
 * tag já existe, ela é SOBRESCRITA aqui e restaurada na saída; só o que não
 * existe é criado e removido.
 */
export function useSeo({
  titulo,
  descricao,
  caminho,
  jsonLd,
  naoIndexar = false,
}: SeoDaRota & { readonly naoIndexar?: boolean }) {
  useEffect(() => {
    document.title = titulo;

    const criados: Element[] = [];
    /** Tags do `index.html` tiradas por esta rota, e devolvidas na saída. */
    const removidos: Element[] = [];
    const restauraveis: Array<{
      el: Element;
      attr: string;
      antes: string | null;
    }> = [];

    const meta = (attrs: Record<string, string>) => {
      const chave = attrs.name
        ? `meta[name="${attrs.name}"]`
        : `meta[property="${attrs.property}"]`;
      const existente = document.head.querySelector(chave);
      if (existente) {
        restauraveis.push({
          el: existente,
          attr: "content",
          antes: existente.getAttribute("content"),
        });
        existente.setAttribute("content", attrs.content);
        return;
      }
      const el = document.createElement("meta");
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      el.setAttribute(`data-${MARCA_DE_ROTA}`, "1");
      document.head.appendChild(el);
      criados.push(el);
    };

    meta({ name: "description", content: descricao });
    meta({ property: "og:title", content: titulo });
    meta({ property: "og:description", content: descricao });
    meta({ property: "og:type", content: "website" });
    meta({ property: "og:url", content: DOMINIO + caminho });
    meta({ property: "og:site_name", content: "Shizune" });
    meta({ property: "og:locale", content: "en" });
    meta({ property: "og:image", content: `${DOMINIO}/og.png` });
    meta({ name: "twitter:card", content: "summary_large_image" });
    meta({ name: "twitter:title", content: titulo });
    meta({ name: "twitter:description", content: descricao });
    meta({ name: "twitter:image", content: `${DOMINIO}/og.png` });

    // Só o 404. Um 404 indexado compete com a página certa no resultado.
    if (naoIndexar) meta({ name: "robots", content: "noindex" });

    // A canônica do `index.html` é SOBRESCRITA, não duplicada. Duas canônicas
    // na mesma página é o buscador escolhendo por conta própria qual vale.
    //
    // E numa página que pede `noindex` ela simplesmente NÃO EXISTE: canônica é
    // um pedido de indexação numa URL preferida, e pedir as duas coisas ao
    // mesmo tempo é deixar o buscador decidir qual das duas obedecer.
    const canonicaExistente = document.head.querySelector("link[rel=canonical]");
    if (naoIndexar) {
      if (canonicaExistente) {
        canonicaExistente.remove();
        removidos.push(canonicaExistente);
      }
    } else if (canonicaExistente) {
      restauraveis.push({
        el: canonicaExistente,
        attr: "href",
        antes: canonicaExistente.getAttribute("href"),
      });
      canonicaExistente.setAttribute("href", DOMINIO + caminho);
    } else {
      const canonica = document.createElement("link");
      canonica.rel = "canonical";
      canonica.href = DOMINIO + caminho;
      canonica.setAttribute(`data-${MARCA_DE_ROTA}`, "1");
      document.head.appendChild(canonica);
      criados.push(canonica);
    }

    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute(`data-${MARCA_DE_ROTA}`, "1");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
      criados.push(script);
    }

    return () => {
      for (const el of criados) el.remove();
      for (const el of removidos) document.head.appendChild(el);
      for (const { el, attr, antes } of restauraveis) {
        if (antes === null) el.removeAttribute(attr);
        else el.setAttribute(attr, antes);
      }
    };
  }, [titulo, descricao, caminho, jsonLd, naoIndexar]);
}

export default useSeo;
