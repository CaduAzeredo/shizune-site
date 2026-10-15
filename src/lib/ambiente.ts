import type { Publicacao } from "./publicacao";

/**
 * Preview ou produção — decidido no build, nunca no navegador.
 *
 * `vite.config.ts` lê `VERCEL_ENV` (que a Vercel põe no build: `production`,
 * `preview` ou `development`) e grava o resultado como constante. Fora da
 * Vercel o build é preview, a não ser que `PUBLICACAO=producao` seja passado —
 * é assim que dá para ver localmente o que a produção vai mostrar.
 *
 * Nenhuma busca ao vivo decide isto: o CSP não deixaria, e uma página que muda
 * conforme o que o navegador consegue alcançar é uma página que ninguém
 * consegue conferir.
 */
export const PUBLICACAO: Publicacao = __PUBLICACAO__;
