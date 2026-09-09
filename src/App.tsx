import { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import Method from "@/pages/method";
import NaoEncontrado from "@/pages/nao-encontrado";

/**
 * Volta ao topo na troca de rota.
 *
 * Instantâneo, e não "suave": rolagem animada é a primeira coisa que este
 * público reprova, e o portão do `check-motion` a proíbe. Sem isto, quem clica
 * em "Read the method →" no fim da `/` chega à `/method` já na metade dela.
 */
function AoTopo() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/**
 * A casca: um header e um rodapé, sempre os mesmos, em toda rota. Nenhuma
 * página desenha o próprio fecho — o `e2e` conta e reprova o segundo.
 *
 * `main` recebe `id="conteudo"` e existe o pulo de navegação para ele: numa
 * página densa de texto, quem navega por teclado não deve atravessar o header
 * inteiro a cada rota.
 */
function Casca() {
  const { pathname } = useLocation();

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10 focus:rounded-[5px] focus:border focus:border-primary focus:bg-surface focus:px-4 focus:py-2.5 focus:font-mono focus:text-[13px]"
      >
        Skip to content
      </a>

      <AoTopo />
      <Header rota={pathname} />

      <main id="conteudo">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/method" element={<Method />} />
          <Route path="*" element={<NaoEncontrado />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Casca />
    </BrowserRouter>
  );
}

export default App;
