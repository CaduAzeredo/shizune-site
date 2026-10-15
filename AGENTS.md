# AGENTS.md — o contrato deste repositório

Este é o site do produto: **`shizune.dev`**, quatro rotas (`/`, `/method`, `/evidence`,
`/roadmap`) e um 404, em inglês. Ele não é o
pacote Shizune — o pacote vive em [`CaduAzeredo/shizune`](https://github.com/CaduAzeredo/shizune),
tem manifest, CI e `doctor` próprios, e nada daqui entra lá.

**Leia isto antes de editar.** O dossiê que gerou este repositório é
`projects/brain-launch/dossie-site-shizune.md` no Brain; quando os dois divergirem, **este
repositório ganha** e o dossiê é corrigido.

---

## As oito regras que não se renegociam

### 1. Todo número da página vem da ficha da release, nunca digitado

`src/content/ficha-release.json` é **cópia byte a byte** do `shizune-release.json` anexado à
release mais recente do pacote (DEC-026 no Brain: a release é a fonte, os sites são cópias). O
pacote gera a ficha com `scripts/ficha-release.mjs` num checkout limpo da tag e a confere com
`--check` (esquema fechado, `sha` igual ao commit da tag, commit com assinatura `G`). Os números,
as datas, os SHAs, os comandos e a captura do teste negativo saem desse arquivo, por
`src/content/ficha.ts`. Não edite nenhum dos dois à mão.

Quem troca a ficha é a cadeia (um workflow agendado lê a release Latest, roda o `--check` e abre
um PR em `preview/*` só com `ficha-release.json` e `release-mais-recente.json`), ou
`npm run ficha -- <arquivo>`, à mão. **Até a 0.5.0 este repositório clonava o pacote e media os
números aqui; a medição passou para a release**, que é o único lugar onde ela é conferida contra
a tag. Medir de novo aqui seria ter duas fontes para o mesmo número.

O comando de cada número aparece ao lado dele na página — o mesmo comando que a ficha registrou —,
e roda **a partir do clone público, e de nada além disso**: sem caminho local, sem SHA de
fronteira, sem árvore que o leitor não tenha. O que não se reproduz assim não ganha número na
`/`. A exceção declarada são as contribuições, que rodam contra o GitHub, e a página diz.

### 2. O bloco de terminal é literal

A captura (`evidence[negative-test-output].capture` na ficha) é exatamente o que o comando
imprimiu no commit da tag. Ela não se traduz, não se encurta e não se embeleza. Os exemplos da
`/` mostram uma SEÇÃO da captura, sem linha cortada dentro dela, e a captura inteira fica no DOM
logo abaixo.

Cortar linha para caber **é editar**. O que não cabe na dobra recolhe num `<details>`, com o
texto inteiro no DOM. No celular a saída rola na horizontal em vez de quebrar linha.

A saída é em português porque o comando imprime em português. Traduzir aqui transformaria a
captura em log encenado, que é o defeito que este site existe para pegar. A legenda em
inglês, fora do bloco, é o que serve o leitor de fora.

### 3. O texto vem do Brain, e não se reescreve no caminho

Fonte, desde a rota das quatro páginas (15/10): as telas do design em
`projects/brain-launch/design/` — a home v3 (`shizune-design-06-home-v3-en.page.html`) e as telas
11 a 14 —, conferidas pela verificação de 15/10. Até lá a fonte era
`projects/brain-launch/shizune-dev-texto-e-briefing.md`. Nenhuma frase foi reescrita, encurtada ou
cortada para caber, e nenhuma deve ser; as poucas mudanças que a release real exigiu estão
declaradas no cabeçalho de cada arquivo de conteúdo. Se uma frase precisa mudar, ela muda lá
primeiro.

O texto vive em `src/content/*.ts`, fora do JSX. Os nomes dos seis degraus (`degraus.ts`) só
mudam por decisão assinada (DEC-025).

### 4. Cor é elemento, nunca atmosfera

Toda cor mora em `src/styles/tokens.css`. **Nenhum hex em `.tsx`** — o `check-slop` reprova.

O verde é o elemento do autor: barra do lockup, prompt, link, estado `ok`, anel de foco. O
âmbar é o acento do produto, em lugares contados: o símbolo, os marcadores `[seção]` do
terminal, os três números. O vermelho só na linha que reprova e no 404. **Sem tema claro.**

Duas propostas de atmosfera já foram reprovadas pelo operador — "tem verde demais" e "tem
muito amarelo". A regra não se renegocia caso a caso.

### 5. O movimento acontece uma vez, na entrada

Três gestos, e a lista é fechada: a cascata da dobra, o colapso do símbolo, a impressão do
terminal. Tudo em `src/styles/motion.css`, tudo com `backwards` — **se a animação não rodar,
tudo aparece no estado final**, nunca invisível. Tudo morto sob `prefers-reduced-motion`.

O `check-motion` reprova: `transition: all` · animação escrita em componente · animação em
laço · rolagem suave · reação ao cursor ou à rolagem · `keydown` em `document`/`window` ·
`IntersectionObserver` · WebGL/3D · `backdrop-filter`.

### 6. Um rodapé, e a marca no formato canônico

Nenhuma página desenha o próprio fecho. O rodapé é global e lê `src/content/rodape-de-rota.ts`;
rota nova é uma chave num mapa.

**O topo é o símbolo e o nome do produto** (`shizune`), e o autor assina no rodapé, no lugar
reservado para a `assinatura-cadu-v2`. O lockup `>_ Cadu Azeredo / shizune` saiu na rota das
quatro páginas (15/10). PENDENTE: o arquivo da assinatura nova ainda não existe; até lá o lugar
mostra o nome em texto ("Shizune — by Cadu Azeredo"), **nunca a logo antiga e nunca uma caixa
tracejada**. O nome nunca é reescrito em outra tipografia dentro do conteúdo.

O rodapé não diz "contributions under DCO" nem cita `SUCCESSION.md`: nenhum dos dois foi
aprovado, e o pacote não fala de DCO. Entram primeiro no pacote, depois aqui.

O `e2e` conta: um `<footer>`, um `<header>`, um `<main>`, um `<h1>`, o topo com o símbolo e o
nome do produto, o lockup antigo zero vezes, e o nome o número de vezes declarado por rota (hoje,
uma: o rodapé). A contagem existe para que uma repetição nova precise de alguém decidindo que
ela entra.

### 7. Estar no ar significa que o corpo diz o que devia dizer

`scripts/e2e.mjs` confere **uma string esperada no corpo de cada rota**, nunca só o status.
A regra tem data e custo: em 08 e 09 de setembro de 2026, um diagnóstico de domínio leu o
código de status e não o corpo por dois dias. O `200` era verdadeiro — era a página de
estacionamento do registrador respondendo.

Por isso também **não há reescrita geral de SPA**: caminho desconhecido recebe `404.html`
com **status 404** de verdade, e não um `200` com cara de erro.

### 8. Um fato que muda arrasta todas as superfícies que o afirmam — na mesma passada

Os mesmos fatos vivem em mais de um lugar: aqui (as quatro rotas), no site pessoal
(`caduazeredo.com/shizune`, `/shizune/evidencia`, `/shizune/roadmap`, `/novidades` e a home) e no
Brain. A Rei saiu dos sites em 15/10, e com ela a ficha da Rei como superfície. Atualizar um
lugar por vez é como a `/novidades` ficou uma semana atrás e como um badge de versão sobreviveu
a uma passada inteira de correção. A regra completa, com o inventário das superfícies, vive no
Brain em `projects/cadu-azeredo/regra-de-propagacao-entre-superficies.md`; o que este
repositório precisa saber na hora de mexer:

| Se mudar… | …aqui acompanham | …e fora daqui |
| :--- | :--- | :--- |
| **a release publicada** | a cadeia abre o PR com a ficha nova (ou `npm run ficha -- <arquivo>`) → os números, a captura e o estado dos degraus acompanham sozinhos; o `e2e` lê a ficha, então as âncoras também | a mesma ficha no site pessoal (`src/content/ficha-release.json`); o JSON-LD dos dois sites; o verbete na `/novidades`, cujo texto em português o operador assina |
| **um número medido fora da ficha** (as contribuições, contra o GitHub) | o valor, o comando e a data em `method.ts` | as páginas do site pessoal que mostram as contribuições |
| **um fato novo** (contribuição aceita, decisão) | o bloco que o afirma em `method.ts` ou `evidencia.ts` → âncoras novas no `e2e` | toda página do site pessoal que afirma o fato; verbete datado na `/novidades` **na mesma passada** |
| **uma fonte de vizinho conferida** | `fonte` e `lidaEm` em `vizinhos.ts` — e a linha vai ao ar em produção | a mesma linha em `/shizune/evidencia` do site pessoal |
| **uma trava** | a seção acima **e** `PROIBIDO` no `e2e` **e** os comentários que explicavam a trava antiga (`grep` pela regra antiga em `src/` e `scripts/`) | os mesmos três lugares no site pessoal; `content/README.md` no Brain |

A ordem é sempre: Brain → medir → este site → site pessoal → `/novidades` → Rei → contratos →
**verificar pelo corpo**. Quando uma superfície **não puder** acompanhar na mesma passada, o
atraso é declarado — no registro datado do Brain, num comentário `ATRASADO desde <data>` no topo
do arquivo atrasado, e na fila se passar de uma passada. Nunca em silêncio.

---

## O portão

```
npm run portao
```

que é, em ordem:

| Passo | O que mede |
| --- | --- |
| `check-contrast` | Descobre todo escopo que declara token e mede cada par declarado. Falha se um token de cor não aparecer em par nenhum |
| `check-motion` | As nove regras da regra 5, mais a existência da rede global de `prefers-reduced-motion` atingindo `*` |
| `check-slop` | Hex em `.tsx`, gradiente, blur, emoji, `®`, e o teto de 65% de saturação nos acentos |
| `test-publicacao` | A regra de publicação: linha sem fonte conferida aparece marcada no preview e some em produção |
| `typecheck` | `tsc --noEmit` |
| `lint` | `eslint .` |
| `build` | `vite build` mais o `404.html` do pós-build |
| `peso` | Orçamento do primeiro desenho, em gzip, com a folga impressa |
| `e2e` | As quatro rotas e o 404 num Chromium de verdade. O número de verificações ele mesmo imprime — não fica escrito aqui, para não envelhecer em silêncio |

O `e2e` sobe um servidor local que lê **este** `vercel.json` e aplica os mesmos cabeçalhos,
a mesma reescrita e o mesmo 404 — inclusive a CSP, o que faz uma violação aparecer no teste
em vez de na produção. Ele é um **modelo** da hospedagem, e não a hospedagem: redirect de
domínio e certificado só existem lá, e os dois precisam ser reconferidos depois do deploy,
lendo o corpo.

Ele usa o navegador que já existe na máquina — nenhum navegador é baixado. Aponte outro com
a variável `NAVEGADOR`.

---

## Travas de conteúdo

Nunca, no texto ou na arte — e o `e2e` confere as que dão para conferir mecanicamente:

- "prova autoria humana" / "proves human authorship"
- `®` ou "registered" — a marca não foi concedida; `™` pode
- "trusted by", depoimento, cliente, logo de empresa, métrica de uso — não existem
- preço, tier, "packs", curso, "beta fechado", "rodando em clientes"
- "governança de agentes" ou "ferramenta de diagnóstico" como categoria — a categoria é
  **auditable decision governance**; "diagnóstico" nomeia a atividade
- número de versão no texto visível — **nem no comando de clone**, que resolve a tag sozinho
  (`git checkout "$(git tag --sort=-v:refname | head -1)"`). A versão vive só no
  `softwareVersion` do JSON-LD da `/`, lida da ficha, e `seo.ts` é o único arquivo que importa o
  campo `version`. Depois do build, `grep -rnoE 'v?0\.[0-9]+\.[0-9]+' dist` acha uma ocorrência
  só, a do JSON-LD. *(Até 15/10 a tag aparecia no comando de clone.)*
- linha que afirma algo sobre o mundo de fora (um vizinho, uma citação, um número de relatório
  ainda não medido de novo) sem fonte conferida — no preview ela aparece marcada como rascunho, em
  produção ela não aparece (`src/lib/publicacao.ts`, testada em `scripts/test-publicacao.mjs` e no
  `e2e`)
- exclamação; "save time"; "10x"; número redondo sem comando
- nome de cliente ou de fornecedor de IA; nome de alvo ou de issue **só das contribuições
  enviadas há mais de 14 dias** (as sete da primeira rodada, públicas desde 2026-09-16 — o
  bloco `contribuicoes` da `/method`), e **nunca contagem de achados** — por alvo ou agregada.
  *(Até 2026-09-16 esta linha proibia todo nome de alvo e de issue: o embargo dos alvos
  venceu em 2026-09-15, e o que libera um achado é envio ao mantenedor mais 14 dias, não uma
  data. Achado não enviado não entra nunca.)*
- comando com caminho local, SHA privado, ou árvore que o leitor não tenha
- ícone de robô, cérebro, circuito, chip, escudo, cadeado, selo de verificação, kanji ou
  qualquer referência a anime

---

## Decisões de infraestrutura que parecem detalhe e não são

**`connect-src` inclui os dois domínios do Google Fonts.** Não é descuido: `<link rel="preconnect">`
é governado por `connect-src` no Chromium, e sem os dois na lista o navegador bloqueia a
conexão antecipada. Os dois já são confiáveis para `style-src` e `font-src`. O `e2e` prova
que a CSP bate com o que a página faz — foi ele que pegou a falta.

**`style-src` NÃO tem `'unsafe-inline'`.** O site pessoal tem; este não precisa, porque
nenhum componente escreve `style={{}}`. Se um dia precisar, o `e2e` acusa antes de subir.

**O `404.html` é gerado no pós-build**, com título próprio, `noindex` e **sem canônica** —
canônica é um pedido de indexação numa URL preferida, e pedi-la junto de `noindex` é deixar
o buscador escolher qual dos dois obedecer.

**O traçado do símbolo existe duas vezes** — em `src/lib/glifo.ts` e em `scripts/arte.mjs`,
que é Node e não importa TypeScript. O script **lê o arquivo da aplicação e reprova se as duas
divergirem**: duas cópias de uma identidade divergem, e a divergência sairia no favicon, que
é onde ninguém olha.

---

## Commit

**O primeiro commit deste repositório é do operador.** Nenhuma sessão de agente commita aqui
enquanto a chave de assinatura não exigir presença humana — ordem permanente de 2026-09-04,
que vale mesmo com ordem escrita no chat. O agente prepara os arquivos e a mensagem; o
operador commita, presente.
