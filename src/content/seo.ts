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
 * A VERSÃO VIVE AQUI, E SÓ AQUI (`softwareVersion`, na `/`). Até a rota das
 * quatro páginas ela não entrava em lugar nenhum, porque a trava era "a tag só
 * no comando de clone". A trava nova (DEC-025 e o comando do Bloco B, 15/10) é
 * "nenhuma versão no texto visível; a versão só no JSON-LD", e o comando de
 * clone passou a resolver a tag sozinho. O valor vem da ficha da release, nunca
 * digitado. Este é o ÚNICO import de `version` no site: a busca de versão no
 * build só pode achá-la aqui.
 */
import { version } from "./ficha-release.json";
import { REPOSITORIO } from "./repositorio";

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

const artigo = (headline: string, descricao: string, caminho: string) => ({
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline,
  description: descricao,
  url: `${DOMINIO}${caminho}`,
  inLanguage: "en",
  author: AUTOR,
  license: "https://www.apache.org/licenses/LICENSE-2.0",
  about: { "@type": "SoftwareSourceCode", name: "Shizune", codeRepository: REPOSITORIO },
});

const DESCRICAO_HOME =
  "A thin decision-registry layer on top of git. It records what was decided as numbered " +
  "lines, and cross-checks that record against what git already knows.";

export const seoHome: SeoDaRota = {
  titulo: "Shizune — the machine drafts, you sign, the command verifies",
  descricao: DESCRICAO_HOME,
  caminho: "/",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Shizune",
    description: DESCRICAO_HOME,
    codeRepository: REPOSITORIO,
    url: DOMINIO,
    programmingLanguage: "JavaScript",
    runtimePlatform: "Node.js",
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    inLanguage: "en",
    softwareVersion: version,
    author: AUTOR,
  },
};

const DESCRICAO_METHOD =
  "How the decision registry works: numbered lines that never change number, two states, " +
  "levels and delegation, what backs a decision, and what a signature does and does not show.";

export const seoMethod: SeoDaRota = {
  titulo: "The method — Shizune",
  descricao: DESCRICAO_METHOD,
  caminho: "/method",
  jsonLd: artigo("The method", DESCRICAO_METHOD, "/method"),
};

const DESCRICAO_EVIDENCE =
  "Every claim on this site, the command that checks it in the public repository, and when it " +
  "was last measured.";

export const seoEvidence: SeoDaRota = {
  titulo: "Evidence — Shizune",
  descricao: DESCRICAO_EVIDENCE,
  caminho: "/evidence",
  jsonLd: artigo("Evidence", DESCRICAO_EVIDENCE, "/evidence"),
};

const DESCRICAO_ROADMAP =
  "Six steps, each named by the threat it closes and the proof it publishes. The state of each " +
  "step comes from the release card of the latest release.";

export const seoRoadmap: SeoDaRota = {
  titulo: "Roadmap — Shizune",
  descricao: DESCRICAO_ROADMAP,
  caminho: "/roadmap",
  jsonLd: artigo("Roadmap", DESCRICAO_ROADMAP, "/roadmap"),
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
export const ROTAS_PUBLICAS = ["/", "/method", "/evidence", "/roadmap"] as const;
