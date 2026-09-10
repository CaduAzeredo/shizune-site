#!/usr/bin/env node
/**
 * E2E — está no ar significa "o corpo diz o que devia dizer".
 *
 * Este verificador nasce do item 45 da fila do Brain, e a regra que ele
 * institucionaliza tem uma data e um custo: durante DOIS DIAS, em 08 e 09 de
 * setembro de 2026, um diagnóstico de domínio leu o código de status e não o
 * corpo da resposta. O `200` era verdadeiro; era a página de estacionamento do
 * registrador respondendo. **Cada rota aqui confere uma string esperada no
 * corpo — nunca só o status.**
 *
 * O que ele mede, por rota:
 *
 *   corpo · status · head (título, description, canônica, OG, JSON-LD) ·
 *   rodapé único · contagem de marca · estouro horizontal em duas larguras ·
 *   axe WCAG 2A+AA (2.0, 2.1 e 2.2) · alvo de toque · foco visível em tudo que
 *   é focável · ordem de tabulação contra a ordem visual · `<details>` operável
 *   por teclado · a saída do validador inteira no DOM · travas de conteúdo ·
 *   e nenhum erro de console, o que inclui violação de CSP.
 *
 * O SERVIDOR LOCAL É UM MODELO DA HOSPEDAGEM, E NÃO A HOSPEDAGEM. Ele lê o
 * `vercel.json` deste repositório e aplica os mesmos cabeçalhos, a mesma
 * reescrita e o mesmo 404 — inclusive a Política de Segurança de Conteúdo, o
 * que faz uma violação de CSP aparecer aqui em vez de na produção. Mas
 * redirect de domínio e certificado só existem lá: **os dois precisam ser
 * reconferidos depois do deploy, lendo o corpo.**
 *
 * O navegador é o Brave já instalado na máquina, dirigido por `playwright-core`
 * — nenhum navegador é baixado para rodar este teste.
 */
import { createServer, request as pedir } from "node:http";
import { createRequire } from "node:module";
import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "playwright-core";

const require = createRequire(import.meta.url);
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(RAIZ, "dist");
const PORTA = 4321;

/**
 * Contra o quê este teste roda.
 *
 * Sem `ALVO`, contra o `dist/` local, servido pelo modelo do `vercel.json` —
 * é o portão antes do deploy. Com `ALVO=https://shizune.dev`, contra a
 * produção, que é a reconferência que a ressalva sempre pediu: **redirect de
 * domínio e certificado só existem lá.**
 *
 * As mesmas verificações de corpo valem nos dois. O que muda é de onde vem a
 * resposta — e é justamente aí que já apareceu uma divergência entre o modelo
 * e o Vercel, então rodar os dois não é redundância.
 */
const ALVO = process.env.ALVO?.replace(/\/$/, "") ?? "";
const BASE = ALVO || `http://127.0.0.1:${PORTA}`;
const EM_PRODUCAO = ALVO !== "";
const HOST_WWW = "www.shizune.dev";

/**
 * O navegador.
 *
 * Na máquina do operador é o Brave já instalado — nenhum navegador é baixado
 * para rodar este teste. Em outra máquina, `NAVEGADOR` aponta o executável; e
 * na integração contínua, onde não há Brave, cai no Chrome do runner. Os três
 * são Chromium, então a medição é a mesma.
 */
const BRAVE = path.join(
  process.env.LOCALAPPDATA ?? "",
  "BraveSoftware/Brave-Browser/Application/brave.exe",
);
const EXECUTAVEL = process.env.NAVEGADOR ?? BRAVE;

// ── o modelo da hospedagem ──────────────────────────────────────────────────

const vercel = JSON.parse(readFileSync(path.join(RAIZ, "vercel.json"), "utf8"));
const CABECALHOS = Object.fromEntries(
  vercel.headers[0].headers.map((h) => [h.key, h.value]),
);
const REESCRITAS = new Set(vercel.rewrites.map((r) => r.source));

/**
 * O matcher de `source`, no mínimo que reproduz o comportamento observado.
 *
 * Ele existe por causa de uma falha que este teste DEIXOU PASSAR. A primeira
 * versão do redirect de `www` era só `/:caminho*`, e o servidor local aplicava
 * o redirect por host em qualquer caminho, sem olhar o `source` — então o
 * modelo concordava comigo em vez de me pegar. Em produção,
 * `www.shizune.dev/method` redirecionava e `www.shizune.dev/` respondia 200.
 *
 * Isto NÃO é uma implementação de path-to-regexp. São as três formas que este
 * arquivo usa, com o comportamento **medido na produção do Vercel em
 * 2026-09-09** — em especial a que importa: `/:nome*` não casa a raiz nua.
 * Se uma forma nova entrar no `vercel.json`, o modelo reprova em vez de
 * adivinhar, porque adivinhar é como o defeito passou da primeira vez.
 */
function casaSource(source, caminho) {
  if (source === "/") return caminho === "/";
  if (source === "/(.*)") return true;
  const prefixo = source.match(/^\/:[A-Za-z]+\*$/);
  if (prefixo) return caminho !== "/";
  if (!source.includes(":") && !source.includes("(")) return source === caminho;
  throw new Error(
    `e2e: forma de "source" não modelada em vercel.json: ${source}\n` +
      "     Acrescente-a a casaSource() com o comportamento MEDIDO na produção.",
  );
}

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".ico": "image/x-icon",
};

function servidor() {
  return createServer((req, res) => {
    const url = new URL(req.url, BASE);
    let caminho = decodeURIComponent(url.pathname);

    const responder = (status, corpo, tipo, extras = {}) => {
      res.writeHead(status, {
        ...CABECALHOS,
        "Content-Type": tipo,
        ...extras,
      });
      res.end(corpo);
    };

    // Os redirects do vercel.json, aplicados na ordem e com o `source` de
    // verdade — não por host solto, que foi como o defeito da raiz passou.
    const host = (req.headers.host ?? "").split(":")[0];
    for (const regra of vercel.redirects ?? []) {
      const condicao = (regra.has ?? []).every(
        (h) => h.type === "host" && h.value === host,
      );
      if (!condicao || !casaSource(regra.source, caminho)) continue;
      const destino = regra.destination
        .replace(/:[A-Za-z]+\*/, caminho.replace(/^\//, ""))
        .replace(/\$1/, caminho.replace(/^\//, ""));
      res.writeHead(regra.permanent ? 308 : 307, { Location: destino });
      res.end();
      return;
    }

    // trailingSlash: false
    if (caminho.length > 1 && caminho.endsWith("/")) {
      res.writeHead(308, { Location: caminho.slice(0, -1) });
      res.end();
      return;
    }

    if (caminho === "/") caminho = "/index.html";
    else if (REESCRITAS.has(caminho)) caminho = "/index.html";

    const arq = path.join(DIST, caminho.replace(/^\//, ""));
    const dentro = arq.startsWith(DIST);

    if (dentro && existsSync(arq) && statSync(arq).isFile()) {
      const extras = caminho.startsWith("/assets/")
        ? { "Cache-Control": "public, max-age=31536000, immutable" }
        : {};
      responder(
        200,
        readFileSync(arq),
        TIPOS[path.extname(arq)] ?? "application/octet-stream",
        extras,
      );
      return;
    }

    // O resto é 404 DE VERDADE — status 404 com o corpo do 404.
    responder(404, readFileSync(path.join(DIST, "404.html")), TIPOS[".html"]);
  });
}

/**
 * Um GET ao host do `www`, sem seguir redirect.
 *
 * Local: o cabeçalho `Host` é forjado por http cru, porque o `fetch` reserva
 * esse cabeçalho e o Host é justamente o que decide a regra. Em produção: o
 * host é real, e a requisição vai por HTTPS de verdade.
 */
async function pedirCom(caminho) {
  if (EM_PRODUCAO) {
    const r = await fetch(`https://${HOST_WWW}${caminho}`, {
      redirect: "manual",
    });
    return { status: r.status, location: r.headers.get("location") };
  }
  return new Promise((resolve, reject) => {
    const req = pedir(
      {
        host: "127.0.0.1",
        port: PORTA,
        path: caminho,
        headers: { Host: HOST_WWW },
      },
      (res) => {
        res.resume();
        resolve({
          status: res.statusCode,
          location: res.headers.location ?? null,
        });
      },
    );
    req.on("error", reject);
    req.end();
  });
}

// ── as expectativas, por rota ───────────────────────────────────────────────

const capturaCompleta = readFileSync(
  path.join(RAIZ, "src/content/saida-teste-negativo.txt"),
  "utf8",
).replace(/\n$/, "");

const ROTAS = [
  {
    caminho: "/",
    status: 200,
    titulo: "Shizune — the machine drafts, you sign, the command verifies",
    canonica: "https://shizune.dev/",
    jsonLd: "SoftwareSourceCode",
    /** Item 45: cada uma destas tem de estar NO CORPO, e não no status. */
    corpo: [
      "The machine drafts.",
      "You sign.",
      "The command verifies.",
      "Who decided — and can you prove it?",
      "Nobody records what the human decided — and that record is what Shizune is.",
      "The proof",
      "test-validate-decisions: tudo passou.",
      "Numbers you can reproduce",
      "git clone https://github.com/CaduAzeredo/shizune.git",
      // A seção "Start": o que a pessoa vê ao clonar, e o que ela recebe.
      // As capturas saem do mesmo clone medido — se sumirem, a seção voltou a
      // ser um comando solto e o leitor deixou de ver o que vai baixar.
      "Cloning into 'shizune'",
      "Resolving deltas: 100%",
      "cd shizune && ls",
      "QUICKSTART.md",
      "one run, not an illustration",
    ],
    /**
     * "Cadu Azeredo" aparece 3 vezes: o lockup do topo, o lockup do rodapé e a
     * forma composta do fecho. Contado aqui para que a quarta não entre sem
     * alguém decidir que ela entra.
     */
    marca: 3,
  },
  {
    caminho: "/method",
    status: 200,
    titulo: "The method — Shizune",
    canonica: "https://shizune.dev/method",
    jsonLd: "TechArticle",
    corpo: [
      "A thin decision-registry layer on top of git.",
      "The registry",
      "A number is assigned once and never reassigned.",
      "What fails",
      "What a signature does and does not show",
      "it is not evidence of authorship",
      "Measured in a private instance, 2026-09-09:",
      "Apache-2.0. Shizune™.",
      // A seção Origins. As duas do meio são as frases em que a página admite
      // defeito do próprio projeto — as primeiras a sumir se alguém decidir
      // encurtar a história, e por isso as que mais precisam de âncora.
      "Origins",
      "the decision that started it is the only one with no record",
      "The record came before the history",
      "could sign in 36 milliseconds",
      "a status code was being read instead of the body of the response",
      "Michael Nygard",
    ],
    /**
     * 3, como nas outras rotas: os dois lockups e o fecho do rodapé.
     *
     * Era 4 até 2026-09-09. A quarta vinha do texto final da rota, que fechava
     * com "Shizune — by Cadu Azeredo" logo acima de um rodapé que diz o mesmo.
     * Foi este contador que tornou a colisão visível; o operador decidiu que a
     * linha do texto sai e o rodapé único fica. Se voltar a dar 4, alguém
     * recolocou a assinatura na página.
     */
    marca: 3,
  },
  {
    caminho: "/nao-existe",
    status: 404,
    titulo: "Not found — Shizune",
    canonica: null,
    jsonLd: null,
    corpo: ["404", "This page does not exist.", "Two routes exist"],
    marca: 3,
  },
];

/** Travas de conteúdo do briefing, conferidas no texto RENDERIZADO. */
const PROIBIDO = [
  { re: /\bproves? (?:a )?human (?:wrote|authorship)/i, porque: "trava: nunca 'prova autoria humana'" },
  { re: /®|\bregistered\b/i, porque: "trava: ® e 'registered' nunca — a marca não foi concedida" },
  { re: /\btrusted by\b/i, porque: "trava: sem logo ou frase de 'trusted by' — não existem" },
  { re: /\bsave time\b|\b10x\b/i, porque: "trava: o argumento é precisão, nunca economia" },
  { re: /\bbeta\b/i, porque: "trava: sem 'beta fechado', sem 'rodando em clientes'" },
  { re: /\bgovernance of agents\b/i, porque: "trava: a categoria é auditable decision governance" },
  { re: /!/, porque: "trava: sem exclamação" },
  {
    // O número de versão só pode existir logo depois de `git checkout `, que é
    // o comando de clone. Em qualquer outro lugar da página, é trava violada.
    re: /(?<!git checkout )\bv\d+\.\d+\.\d+\b/,
    porque: "trava: número de versão só no comando de clone",
  },
];

// ── execução ────────────────────────────────────────────────────────────────

const falhas = [];
const linhas = [];

const ok = (msg) => linhas.push(`  ok     ${msg}`);
const falha = (msg, detalhe) => {
  falhas.push({ msg, detalhe });
  linhas.push(`  FALHA  ${msg}`);
  if (detalhe) linhas.push(`         ↑ ${detalhe}`);
};

if (!EM_PRODUCAO && !existsSync(DIST)) {
  console.error("erro: não há dist/. Rode o build antes do e2e.");
  process.exit(1);
}
const http = EM_PRODUCAO ? null : servidor();
if (http) await new Promise((r) => http.listen(PORTA, "127.0.0.1", r));

const comoAbrir = existsSync(EXECUTAVEL)
  ? { executablePath: EXECUTAVEL }
  : { channel: "chrome" };

let navegador;
try {
  navegador = await chromium.launch(comoAbrir);
} catch (e) {
  if (http) await new Promise((r) => http.close(r));
  console.error(
    `erro: não consegui abrir o navegador.\n` +
      `       tentei: ${existsSync(EXECUTAVEL) ? EXECUTAVEL : "channel chrome"}\n` +
      `       aponte outro com a variável NAVEGADOR.\n       ${e.message}`,
  );
  process.exit(1);
}

try {
  const axeFonte = readFileSync(
    require.resolve("axe-core/axe.min.js"),
    "utf8",
  );

  // ── 1. redirects, medidos no protocolo ────────────────────────────────
  linhas.push("\n  redirects");
  {
    const r = await fetch(`${BASE}/method/`, { redirect: "manual" });
    if (r.status === 308 && r.headers.get("location") === "/method")
      ok("/method/ → 308 /method  (trailingSlash: false)");
    else
      falha(
        "/method/ deveria devolver 308 para /method",
        `devolveu ${r.status} → ${r.headers.get("location")}`,
      );

    // `fetch` não deixa forjar o cabeçalho Host (o undici o reserva), e é
    // justamente o Host que decide este redirect. Então vai por http cru.
    //
    // A RAIZ É TESTADA SEPARADAMENTE, e a razão é uma falha real: a primeira
    // versão desta regra era só `/:caminho*`, que no matcher do Vercel NÃO casa
    // a raiz nua. Em produção, `www.shizune.dev/method` redirecionava e
    // `www.shizune.dev/` respondia 200 — conteúdo duplicado no endereço mais
    // visitado de todos. O teste não viu porque testava só `/method`: tinha o
    // mesmo ponto cego da regra. Testar a raiz e um subcaminho, sempre.
    for (const [caminho, destino] of [
      ["/", "https://shizune.dev/"],
      ["/method", "https://shizune.dev/method"],
      ["/robots.txt", "https://shizune.dev/robots.txt"],
    ]) {
      const w = await pedirCom(caminho, "www.shizune.dev");
      if (w.status === 308 && w.location === destino)
        ok(`www.shizune.dev${caminho} → 308 ${destino}`);
      else
        falha(
          `www${caminho} deveria devolver 308 para ${destino}`,
          `devolveu ${w.status} → ${w.location}`,
        );
    }
  }

  // ── 2. as rotas ───────────────────────────────────────────────────────
  for (const rota of ROTAS) {
    linhas.push(`\n  rota ${rota.caminho}`);

    // 2.1 status E corpo — nunca um sem o outro
    const bruto = await fetch(BASE + rota.caminho, { redirect: "manual" });
    const html = await bruto.text();
    if (bruto.status === rota.status)
      ok(`status ${bruto.status}`);
    else
      falha(
        `status deveria ser ${rota.status}`,
        `devolveu ${bruto.status} — um 404 que responde 200 é o defeito do item 45`,
      );
    if (html.includes("<div id=\"root\">")) ok("o HTML servido é a aplicação");

    const pagina = await navegador.newPage({ viewport: { width: 1440, height: 900 } });
    const erros = [];
    pagina.on("console", (m) => {
      if (m.type() !== "error") return;
      const l = m.location();
      const onde = l?.url ? ` [${l.url.replace(BASE, "")}:${l.lineNumber}]` : "";
      erros.push(m.text() + onde);
    });
    pagina.on("pageerror", (e) => erros.push(String(e)));

    const resposta = await pagina.goto(BASE + rota.caminho, {
      waitUntil: "networkidle",
    });

    if (resposta.status() === rota.status) ok(`o navegador também vê ${rota.status}`);
    else falha(`o navegador viu ${resposta.status()}`, `esperado ${rota.status}`);

    // 2.2 O CORPO. A verificação que dá nome a este arquivo.
    const texto = await pagina.evaluate(() => document.body.innerText);
    for (const esperado of rota.corpo) {
      if (texto.includes(esperado)) ok(`corpo contém: "${recorte(esperado)}"`);
      else
        falha(
          `o corpo NÃO contém: "${recorte(esperado)}"`,
          "status verde com corpo errado é exatamente o que este teste existe para pegar",
        );
    }

    // 2.3 head por rota
    const cabeca = await pagina.evaluate(() => ({
      titulo: document.title,
      descricao:
        document.querySelector('meta[name="description"]')?.content ?? null,
      canonicas: [...document.querySelectorAll("link[rel=canonical]")].map(
        (l) => l.href,
      ),
      ogUrl: document.querySelector('meta[property="og:url"]')?.content ?? null,
      ogTitulo:
        document.querySelector('meta[property="og:title"]')?.content ?? null,
      twitter:
        document.querySelector('meta[name="twitter:card"]')?.content ?? null,
      robots: document.querySelector('meta[name="robots"]')?.content ?? null,
      jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map((s) => {
          try {
            return JSON.parse(s.textContent)["@type"];
          } catch {
            return "(json inválido)";
          }
        }),
    }));

    if (cabeca.titulo === rota.titulo) ok(`title: ${cabeca.titulo}`);
    else falha("title errado", `veio "${cabeca.titulo}", esperado "${rota.titulo}"`);

    if (cabeca.descricao) ok("description presente");
    else falha("sem description");

    if (rota.canonica) {
      if (cabeca.canonicas.length === 1 && cabeca.canonicas[0] === rota.canonica)
        ok(`canônica única: ${rota.canonica}`);
      else
        falha(
          "canônica errada ou duplicada",
          `${cabeca.canonicas.length} encontrada(s): ${cabeca.canonicas.join(", ") || "nenhuma"}`,
        );
      if (cabeca.ogUrl === rota.canonica) ok("og:url bate com a canônica");
      else falha("og:url não bate com a canônica", `og:url = ${cabeca.ogUrl}`);
      if (cabeca.ogTitulo === rota.titulo) ok("og:title bate com o title");
      else falha("og:title não bate com o title");
      if (cabeca.twitter) ok(`twitter:card = ${cabeca.twitter}`);
      else falha("sem twitter:card");
    } else {
      if (cabeca.canonicas.length === 0) ok("o 404 não tem canônica");
      else falha("o 404 tem canônica", cabeca.canonicas.join(", "));
      if (cabeca.robots === "noindex") ok("o 404 pede noindex");
      else falha("o 404 não pede noindex", `robots = ${cabeca.robots}`);
    }

    if (rota.jsonLd) {
      if (cabeca.jsonLd.length === 1 && cabeca.jsonLd[0] === rota.jsonLd)
        ok(`JSON-LD: ${rota.jsonLd}`);
      else
        falha(
          `JSON-LD deveria ser ${rota.jsonLd}, único`,
          `veio: ${cabeca.jsonLd.join(", ") || "nenhum"}`,
        );
    }

    // 2.4 rodapé único e contagem de marca
    const marcas = await pagina.evaluate(() => {
      const conta = (texto, agulha) => texto.split(agulha).length - 1;
      return {
        rodapes: document.querySelectorAll("footer").length,
        cabecalhos: document.querySelectorAll("header").length,
        principais: document.querySelectorAll("main").length,
        h1: document.querySelectorAll("h1").length,
        nome: conta(document.body.innerText, "Cadu Azeredo"),
        prompt: conta(document.body.innerText, ">_"),
      };
    });

    if (marcas.rodapes === 1) ok("um rodapé, e só um");
    else falha(`${marcas.rodapes} rodapés`, "nenhuma página desenha o próprio fecho");
    if (marcas.cabecalhos === 1) ok("um header");
    else falha(`${marcas.cabecalhos} headers`);
    if (marcas.principais === 1) ok("um <main>");
    else falha(`${marcas.principais} elementos <main>`);
    if (marcas.h1 === 1) ok("um <h1>");
    else falha(`${marcas.h1} elementos <h1>`, "um documento tem um título");
    if (marcas.nome === rota.marca)
      ok(`"Cadu Azeredo" aparece ${marcas.nome}× (esperado ${rota.marca})`);
    else
      falha(
        `"Cadu Azeredo" aparece ${marcas.nome}×, esperado ${rota.marca}`,
        "a marca não se repete sem alguém decidir que se repete",
      );
    if (marcas.prompt === 2) ok("o lockup >_ aparece 2× — topo e rodapé");
    else falha(`o lockup >_ aparece ${marcas.prompt}×`, "esperado 2: topo e rodapé");

    // 2.5 travas de conteúdo, no texto renderizado
    for (const t of PROIBIDO) {
      const m = texto.match(t.re);
      if (!m) continue;
      falha(`texto proibido na página: "${recorte(m[0])}"`, t.porque);
    }
    if (!PROIBIDO.some((t) => t.re.test(texto)))
      ok(`${PROIBIDO.length} travas de conteúdo, nenhuma violada`);

    // 2.6 estouro horizontal, nas duas larguras
    for (const largura of [390, 1440]) {
      await pagina.setViewportSize({ width: largura, height: 900 });
      const estouro = await pagina.evaluate(() => {
        const doc = document.documentElement;
        const piores = [...document.querySelectorAll("body *")]
          .map((el) => ({
            tag: el.tagName.toLowerCase(),
            classe: (el.className || "").toString().slice(0, 40),
            direita: Math.round(el.getBoundingClientRect().right),
          }))
          .filter((e) => e.direita > window.innerWidth + 1)
          .slice(0, 3);
        return {
          rolagem: doc.scrollWidth,
          janela: window.innerWidth,
          piores,
        };
      });
      if (estouro.rolagem <= estouro.janela + 1)
        ok(`${largura}px — estouro horizontal zero`);
      else
        falha(
          `${largura}px — estouro horizontal de ${estouro.rolagem - estouro.janela}px`,
          estouro.piores.map((p) => `${p.tag}.${p.classe} → ${p.direita}px`).join(" · "),
        );
    }

    // 2.6b nada escapa do próprio cartão.
    //
    // O estouro da PÁGINA é zero e mesmo assim um literal longo pode vazar
    // pela borda do card sem empurrar nada — foi o que aconteceu com
    // `rascunho, assinatura pendente` numa coluna de 216px. Este é o mesmo
    // defeito, uma escala abaixo, e a verificação de página não o vê.
    for (const largura of [390, 1440]) {
      await pagina.setViewportSize({ width: largura, height: 900 });
      const vazando = await pagina.evaluate(() =>
        [...document.querySelectorAll(".superficie-card")].flatMap((card) => {
          const c = card.getBoundingClientRect();
          return [...card.querySelectorAll("*")]
            .map((el) => ({ el, r: el.getBoundingClientRect() }))
            .filter(({ r }) => r.width > 0 && r.right > c.right + 1)
            .map(({ el, r }) => ({
              texto: (el.textContent || "").trim().slice(0, 34),
              sobra: Math.round(r.right - c.right),
            }));
        }),
      );
      if (vazando.length === 0) ok(`${largura}px — nada escapa da borda do card`);
      else
        falha(
          `${largura}px — ${vazando.length} elemento(s) escapando do card`,
          vazando.map((v) => `"${v.texto}" +${v.sobra}px`).join(" · "),
        );
    }

    // 2.7 alvo de toque (WCAG 2.2, 2.5.8) — nas DUAS larguras.
    // O critério não é de celular: um link de 21px de altura reprova no
    // desktop igual. Medir só a largura pequena escondia isso.
    for (const largura of [390, 1440]) {
    await pagina.setViewportSize({ width: largura, height: 844 });
    const alvos = await pagina.evaluate(() => {
      const focaveis = [...document.querySelectorAll("a[href], button, summary")];
      return focaveis
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            tag: el.tagName.toLowerCase(),
            texto: (el.innerText || "").trim().slice(0, 28),
            w: Math.round(r.width),
            h: Math.round(r.height),
            /** A exceção "inline" da 2.5.8: link dentro de um bloco de texto. */
            inline:
              el.tagName === "A" &&
              !!el.closest("p, li") &&
              getComputedStyle(el).display.includes("inline"),
          };
        })
        /**
         * Fica de fora o que não está NA TELA: o pulo de navegação é
         * `sr-only` (1×1) até receber foco, e a 2.5.8 fala de alvo exibido.
         * O corte é por área, e não por classe, para que não vire porta.
         */
        .filter((a) => a.w * a.h > 4);
    });
    const pequenos = alvos.filter((a) => !a.inline && (a.w < 24 || a.h < 24));
    if (pequenos.length === 0)
      ok(
        `${largura}px — alvo de toque ≥24px em ${alvos.length} elementos (exceção inline respeitada)`,
      );
    else
      falha(
        `${largura}px — ${pequenos.length} alvo(s) abaixo de 24×24`,
        pequenos.map((p) => `${p.tag} "${p.texto}" ${p.w}×${p.h}`).join(" · "),
      );
    }

    // 2.8 axe — WCAG 2.0, 2.1 e 2.2, níveis A e AA
    //
    // A marca separa os erros DA PÁGINA dos erros DA FERRAMENTA. O axe injeta
    // estilo inline para medir, e a CSP deste site não permite estilo inline —
    // então o próprio axe dispara uma violação que não é defeito do site.
    // Medido nesta máquina: sem o axe, e com a CSP aplicada, o console fica
    // limpo nas três rotas. Filtrar por mensagem sem essa separação esconderia
    // uma violação de verdade que dissesse a mesma coisa.
    const marcaAxe = erros.length;
    await pagina.setViewportSize({ width: 1440, height: 900 });
    await pagina.evaluate(axeFonte);
    const resultado = await pagina.evaluate(async () => {
      const r = await axe.run(document, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
        },
      });
      return {
        violacoes: r.violations.map((v) => ({
          id: v.id,
          impacto: v.impact,
          n: v.nodes.length,
          alvo: v.nodes[0]?.target?.join(" ") ?? "",
        })),
        passou: r.passes.length,
      };
    });
    if (resultado.violacoes.length === 0)
      ok(`axe WCAG 2A+AA — 0 violações, ${resultado.passou} regras passaram`);
    else
      for (const v of resultado.violacoes)
        falha(`axe: ${v.id} (${v.impacto}, ${v.n} nó(s))`, v.alvo);

    // 2.9 foco visível e ordem de tabulação
    await pagina.evaluate(() => window.scrollTo(0, 0));
    const percurso = [];
    for (let i = 0; i < 40; i++) {
      await pagina.keyboard.press("Tab");
      const atual = await pagina.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          texto: (el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 30),
          contorno: cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0,
          sombra: cs.boxShadow !== "none",
          y: Math.round(r.top + window.scrollY),
          x: Math.round(r.left),
          area: Math.round(r.width * r.height),
        };
      });
      if (!atual) break;
      percurso.push(atual);
      if (percurso.length > 1 && atual.tag === percurso[0].tag && atual.texto === percurso[0].texto)
        break;
    }

    const semFoco = percurso.filter((p) => !p.contorno && !p.sombra);
    if (percurso.length > 0 && semFoco.length === 0)
      ok(`foco visível em ${percurso.length} elementos focáveis`);
    else if (percurso.length === 0) falha("nenhum elemento focável encontrado");
    else
      falha(
        `${semFoco.length} elemento(s) focável(is) sem foco visível`,
        semFoco.map((p) => `${p.tag} "${p.texto}"`).join(" · "),
      );

    const visiveis = percurso.filter((p) => p.area > 4);
    const foraDeOrdem = [];
    for (let i = 1; i < visiveis.length; i++) {
      const a = visiveis[i - 1];
      const b = visiveis[i];
      const mesmaLinha = Math.abs(b.y - a.y) <= 8;
      if (mesmaLinha ? b.x < a.x - 8 : b.y < a.y - 8)
        foraDeOrdem.push(`${a.tag} "${a.texto}" → ${b.tag} "${b.texto}"`);
    }
    if (foraDeOrdem.length === 0)
      ok(`ordem de tabulação segue a ordem visual (${visiveis.length} paradas)`);
    else
      falha(
        `${foraDeOrdem.length} salto(s) para trás na tabulação`,
        foraDeOrdem.join(" · "),
      );

    // 2.10 o <details> por teclado, e a saída inteira no DOM
    const temDetails = await pagina.$("details");
    if (temDetails) {
      await pagina.focus("summary");
      const antes = await pagina.$eval("details", (d) => d.open);
      await pagina.keyboard.press("Enter");
      const depois = await pagina.$eval("details", (d) => d.open);
      if (antes !== depois) ok("<details> abre e fecha por teclado (Enter)");
      else falha("<details> não respondeu ao Enter");

      const noDom = await pagina.evaluate(() =>
        [...document.querySelectorAll(".superficie-term pre")]
          .map((p) => p.textContent)
          .join("\n"),
      );
      const faltando = capturaCompleta
        .split("\n")
        .filter((l) => l.trim() !== "" && !noDom.includes(l));
      if (faltando.length === 0)
        ok(`as ${capturaCompleta.split("\n").length} linhas da captura estão no DOM`);
      else
        falha(
          `${faltando.length} linha(s) da captura não estão no DOM`,
          `primeira: ${recorte(faltando[0])}`,
        );

      const semEditar = await pagina.$eval(
        ".superficie-term pre",
        (p) => getComputedStyle(p).whiteSpace,
      );
      if (semEditar === "pre") ok("a saída não quebra linha — rola, como deve");
      else falha(`white-space da saída é "${semEditar}"`, "quebrar linha é editar a saída");
    }

    // 2.11 nada no console — inclui violação de CSP.
    //
    // A exceção é o 404 anunciando a si mesmo: numa rota que DEVE responder
    // 404, o navegador registra "Failed to load resource: 404" para o próprio
    // documento. Ignorar isso é ignorar o esperado, não o defeito — e o status
    // já foi conferido duas vezes acima, no protocolo e no navegador.
    const doProprio404 =
      /Failed to load resource: the server responded with a status of 404/;
    const doAxe = /Applying inline style violates/;
    const reais = erros.filter((e, i) => {
      if (rota.status === 404 && doProprio404.test(e)) return false;
      if (i >= marcaAxe && doAxe.test(e)) return false; // do axe, não da página
      return true;
    });
    if (reais.length === 0)
      ok(
        `console limpo antes e depois do axe (CSP aplicada; ${erros.length - reais.length} mensagem(ns) da própria ferramenta)`,
      );
    else for (const e of reais.slice(0, 4)) falha("erro de console", e);

    await pagina.close();
  }

  // ── 3. prefers-reduced-motion ─────────────────────────────────────────
  linhas.push("\n  prefers-reduced-motion");
  {
    const ctx = await navegador.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const p = await ctx.newPage();
    await p.goto(BASE + "/", { waitUntil: "networkidle" });
    const animacoes = await p.evaluate(() =>
      [".entra", ".imprime", ".glifo-hero path"]
        .map((sel) => {
          const el = document.querySelector(sel);
          return el
            ? { sel, nome: getComputedStyle(el).animationName }
            : { sel, nome: "(ausente)" };
        }),
    );
    const vivas = animacoes.filter((a) => a.nome !== "none" && a.nome !== "(ausente)");
    if (vivas.length === 0)
      ok(`as ${animacoes.length} animações estão mortas sob reduced-motion`);
    else
      falha(
        `${vivas.length} animação(ões) viva(s) sob reduced-motion`,
        vivas.map((v) => `${v.sel} → ${v.nome}`).join(" · "),
      );

    // O símbolo tem de estar VISÍVEL e colapsado, nunca invisível.
    const simbolo = await p.evaluate(() => {
      const el = document.querySelector(".glifo-hero svg, svg.glifo-hero, .glifo-hero");
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { opacidade: cs.opacity, display: cs.display };
    });
    if (simbolo && simbolo.opacidade !== "0" && simbolo.display !== "none")
      ok("o símbolo do hero fica visível, colapsado, sem animação");
    else falha("o símbolo do hero sumiu sob reduced-motion", JSON.stringify(simbolo));

    const textoReduzido = await p.evaluate(() => document.body.innerText);
    if (textoReduzido.includes("The machine drafts."))
      ok("a dobra continua legível sob reduced-motion");
    else falha("a dobra sumiu sob reduced-motion");

    await ctx.close();
  }

  // ── 4. sitemap e robots ───────────────────────────────────────────────
  linhas.push("\n  sitemap e robots");
  {
    const s = await fetch(`${BASE}/sitemap.xml`);
    const xml = await s.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const esperado = ["https://shizune.dev/", "https://shizune.dev/method"];
    if (s.status === 200 && JSON.stringify(locs) === JSON.stringify(esperado))
      ok(`sitemap com as ${locs.length} rotas públicas, e só elas`);
    else
      falha("sitemap divergente", `veio: ${locs.join(", ")}`);

    const r = await fetch(`${BASE}/robots.txt`);
    const txt = await r.text();
    if (r.status === 200 && txt.includes("Sitemap: https://shizune.dev/sitemap.xml"))
      ok("robots.txt aponta o sitemap");
    else falha("robots.txt sem o ponteiro do sitemap");
  }
} finally {
  await navegador.close();
  if (http) await new Promise((r) => http.close(r));
}

// ── relatório ───────────────────────────────────────────────────────────────

function recorte(s, n = 58) {
  const limpo = String(s).replace(/\s+/g, " ").trim();
  return limpo.length > n ? `${limpo.slice(0, n)}…` : limpo;
}

console.log(linhas.join("\n"));
console.log("");

if (falhas.length > 0) {
  console.error(`e2e: ${falhas.length} falha(s). Resultado: FALHOU`);
  process.exit(1);
}

const total = linhas.filter((l) => l.startsWith("  ok")).length;
console.log(
  `e2e: ${total} verificações em ${ROTAS.length} rotas contra ${EM_PRODUCAO ? BASE : "o dist/ local"}, ` +
    "todas no CORPO e não só no status. Resultado: OK",
);
console.log(
  EM_PRODUCAO
    ? "     alvo: a produção. Redirect de domínio, certificado e o 404 da hospedagem foram medidos onde eles existem."
    : "     ressalva: redirect de domínio e certificado só existem na hospedagem — reconferir com ALVO=https://shizune.dev, lendo o corpo.",
);
