/**
 * SEO por rota.
 *
 * Um SPA sem pré-render não tem milagre de SEO — o que dá para garantir é que
 * cada rota declare título, descrição, canônica, OG/Twitter e JSON-LD corretos
 * para o robô que executa JavaScript, e que a meta de uma rota não vaze para a
 * outra. Essa é a limitação, e ela fica escrita em vez de escondida.
 *
 * REGRA DO JSON-LD: só entram campos verificáveis. Nada de `aggregateRating`,
 * `interactionCount`, `award` ou qualquer campo que afirme adoção — não
 * existem, e inventar é o fim da credibilidade nesta categoria.
 *
 * O número de versão NÃO entra aqui, embora fosse fácil e verdadeiro: a trava
 * de conteúdo diz "nenhum número de versão no corpo das páginas; a tag aparece
 * só no comando de clone", e metadado que o buscador cita de volta é corpo o
 * bastante.
 */
import { REPOSITORIO } from "./home";

export const DOMINIO = "https://shizune.dev";

const AUTOR = {
  "@type": "Person",
  name: "Cadu Azeredo",
  url: "https://www.caduazeredo.com",
} as const;

export interface SeoDaRota {
  readonly titulo: string;
  readonly descricao: string;
  readonly caminho: string;
  readonly jsonLd?: Record<string, unknown>;
}

export const seoHome: SeoDaRota = {
  titulo: "Shizune — the machine drafts, you sign, the command verifies",
  descricao:
    "A thin decision-registry layer on top of git. It records what was decided as " +
    "numbered lines, and cross-checks that record against what git already knows.",
  caminho: "/",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Shizune",
    description:
      "A thin decision-registry layer on top of git. It records what was decided as " +
      "numbered lines, and cross-checks that record against what git already knows.",
    codeRepository: REPOSITORIO,
    url: DOMINIO,
    programmingLanguage: "JavaScript",
    runtimePlatform: "Node.js",
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    inLanguage: "en",
    author: AUTOR,
  },
};

export const seoMethod: SeoDaRota = {
  titulo: "The method — Shizune",
  descricao:
    "How the decision registry works: numbered lines that never change number, two " +
    "states, what makes the validator fail, and what a signature does and does not show.",
  caminho: "/method",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "The method",
    description:
      "How the decision registry works: numbered lines that never change number, two " +
      "states, what makes the validator fail, and what a signature does and does not show.",
    url: `${DOMINIO}/method`,
    inLanguage: "en",
    author: AUTOR,
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    about: {
      "@type": "SoftwareSourceCode",
      name: "Shizune",
      codeRepository: REPOSITORIO,
    },
  },
};

/**
 * O 404 não entra no sitemap e pede para não ser indexado. Um 404 indexado é
 * uma página de erro competindo com a página certa no resultado da busca.
 */
export const seoNaoEncontrado: SeoDaRota = {
  titulo: "Not found — Shizune",
  descricao: "This page does not exist.",
  caminho: "/404",
};

/** As rotas que entram no sitemap. O 404 fica de fora, de propósito. */
export const ROTAS_PUBLICAS = ["/", "/method"] as const;
