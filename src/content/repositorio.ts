/**
 * Os endereços do pacote público, num lugar só.
 *
 * Nenhum leva número de versão: a regra é "sem versão no texto visível", e um
 * link é texto que o empacotador grava no pacote. O que aponta para a release
 * aponta para `releases/latest`; o que aponta para um documento aponta para o
 * `main`, e a âncora da seção da release vem da ficha.
 */
export const REPOSITORIO = "https://github.com/CaduAzeredo/shizune";
export const CLONE = `git clone ${REPOSITORIO}.git`;
export const ULTIMA_RELEASE = `${REPOSITORIO}/releases/latest`;
export const QUICKSTART = `${REPOSITORIO}/blob/main/QUICKSTART.md`;
export const CHANGELOG = `${REPOSITORIO}/blob/main/CHANGELOG.md`;
export const ISSUES = `${REPOSITORIO}/issues`;

/** O comando que resolve a tag mais recente sozinho — e por isso nunca a escreve. */
export const CHECKOUT_DA_ULTIMA = 'git checkout "$(git tag --sort=-v:refname | head -1)"';

/** Um endereço do QUICKSTART, pela âncora que o GitHub gera do título da seção. */
export const secaoDoQuickstart = (ancora: string): string => `${QUICKSTART}#${ancora}`;

/** A seção da release no CHANGELOG, pela âncora que a ficha registrou. */
export const secaoDoChangelog = (ancoraDaFicha: string): string =>
  `${REPOSITORIO}/blob/main/${ancoraDaFicha}`;

/** Os espelhos em português, no site pessoal. */
export const ESPELHO_PT = {
  "/": "https://www.caduazeredo.com/shizune",
  "/evidence": "https://www.caduazeredo.com/shizune/evidencia",
  "/roadmap": "https://www.caduazeredo.com/shizune/roadmap",
} as const;
