import { Link } from "react-router-dom";
import useSeo from "@/lib/use-seo";
import { seoNaoEncontrado } from "@/content/seo";
import { naoEncontrado } from "@/content/nao-encontrado";
import BlocoDeComando from "@/components/ui/bloco-de-comando";

/**
 * O 404. O status de verdade (404, e não 200 com cara de erro) é da hospedagem:
 * `scripts/pos-build.mjs` escreve o `404.html` que ela serve para todo caminho
 * que não for uma das quatro rotas. Aqui é só o que a página diz.
 */
export function NaoEncontrado() {
  useSeo({ ...seoNaoEncontrado, naoIndexar: true });

  return (
    <div className="largura pagina-404">
      <p className="rotulo-secao text-status-alert">{naoEncontrado.codigo}</p>
      <h1 className="titulo-1">{naoEncontrado.titulo}</h1>
      <p className="chamada-grande">{naoEncontrado.texto}</p>
      <div className="grade-4">
        {naoEncontrado.destinos.map((d) => (
          <Link key={d.rota} to={d.rota} className="cartao-destino">
            <span className="cartao-destino-rota">{d.rota}</span>
            <span className="texto-mudo">{d.texto}</span>
          </Link>
        ))}
      </div>
      <BlocoDeComando rotulo={naoEncontrado.rotuloDoComando} linhas={[naoEncontrado.comando]} compacto />
    </div>
  );
}

export default NaoEncontrado;
