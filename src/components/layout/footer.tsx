import { Link } from "react-router-dom";
import { NAVEGACAO, rodape } from "@/content/rodape-de-rota";
import { REPOSITORIO } from "@/content/repositorio";

/**
 * O fecho — um só, em toda rota.
 *
 * Nenhuma página desenha o próprio. Ele lê `rodape-de-rota.ts`; uma rota nova é
 * uma chave num mapa, não um rodapé novo. O `e2e` conta: mais de um `<footer>`
 * na página reprova.
 *
 * A autoria fica aqui, e só aqui: "Shizune by Cadu Azeredo", com o nome do
 * autor em Newsreader Italic levando a caduazeredo.com na mesma aba — é o site
 * do mesmo autor, e não um destino de fora.
 */
export function Footer() {
  const { produto, por, autor, siteDoAutor } = rodape.autoria;
  return (
    <footer className="border-t border-border">
      <div className="largura rodape">
        <div className="rodape-linhas">
          <p className="credito">
            {/* Os espaços entre os itens são para o leitor de tela e para quem
                copia o texto; na tela, quem separa é o `gap`. */}
            <span>{produto}</span>{" "}
            <span className="credito-por">{por}</span>{" "}
            <a href={siteDoAutor} className="credito-autor">
              {autor}
            </a>
          </p>
          <p>{rodape.licenca}</p>
          <p>{rodape.marca}</p>
        </div>

        <nav aria-label="Footer" className="rodape-nav">
          {NAVEGACAO.map((r) => (
            <Link key={r.caminho} to={r.caminho} className="topo-link">
              {r.rotulo}
            </Link>
          ))}
          <a href={REPOSITORIO} className="topo-link">
            github
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
