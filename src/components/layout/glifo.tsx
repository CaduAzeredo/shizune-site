import {
  CAMINHO_COMPACTO,
  CAMINHO_COMPACTO_ANIMAVEL,
  CAMINHO_CONTEUDO_LINHA,
  CAMINHO_CONTEUDO_ONDA,
  espessura,
} from "@/lib/glifo";

/**
 * O símbolo — duas marcas, uma ideia: a onda que colapsa numa linha reta.
 *
 * A divisão entre as duas **vale além do site** — vale para os vídeos e para
 * qualquer peça futura (decisão do operador, 2026-09-09):
 *
 * - **A variante compacta** (`GlifoCompacto`) é a marca do CHROME: header,
 *   rodapé, favicon, avatar. Duas cristas, a amplitude decai, a onda VIRA a
 *   reta e fica. Um caminho só.
 * - **O traçado de conteúdo** (`GlifoConteudo`) é a marca do CONTEÚDO: o
 *   marcador de "How it works", o painel da ressalva da `/method`. Quatro
 *   inflexões, e a reta corre por baixo da onda inteira. Dois caminhos.
 *
 * Nenhum dos dois escreve cor: `currentColor`, e quem usa decide. É o que
 * mantém o `check-slop` verde e o que faz o mesmo símbolo servir ao âmbar do
 * produto e ao verde do autor sem existir duas vezes.
 */
interface GlifoProps {
  readonly tamanho: number;
  readonly className?: string;
  /** Usa a cauda em curva, que o hero anima. Fora do hero, nunca. */
  readonly animavel?: boolean;
}

export function GlifoCompacto({
  tamanho,
  className,
  animavel = false,
}: GlifoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      fill="none"
      stroke="currentColor"
      strokeWidth={espessura(tamanho)}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={animavel ? CAMINHO_COMPACTO_ANIMAVEL : CAMINHO_COMPACTO} />
    </svg>
  );
}

/**
 * O traçado de conteúdo, **de 24px para cima**.
 *
 * O piso de 24px é regra nova do executor, 2026-09-09, e não vem da ordem do
 * operador — que fixou só a espessura por tamanho. Vem daqui: quatro cristas em
 * 20 unidades dão ~2px cada a 16px, e a onda encosta na reta que a cruza; abaixo
 * de 24px este traçado vira um borrão. Abaixo disso, a variante compacta.
 *
 * O piso é o TIPO, e não um comentário: `tamanho` só aceita 24, 32 ou 48, então
 * descer é um erro de compilação e não uma decisão de alguém com pressa.
 */
export function GlifoConteudo({
  tamanho,
  className,
}: {
  readonly tamanho: 24 | 32 | 48;
  readonly className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      fill="none"
      stroke="currentColor"
      strokeWidth={espessura(tamanho)}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={CAMINHO_CONTEUDO_ONDA} />
      <path d={CAMINHO_CONTEUDO_LINHA} />
    </svg>
  );
}
