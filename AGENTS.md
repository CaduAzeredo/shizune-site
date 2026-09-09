# AGENTS.md — o contrato deste repositório

Este é o site do produto: **`shizune.dev`**, duas rotas e um 404, em inglês. Ele não é o
pacote Shizune — o pacote vive em [`CaduAzeredo/shizune`](https://github.com/CaduAzeredo/shizune),
tem manifest, CI e `doctor` próprios, e nada daqui entra lá.

**Leia isto antes de editar.** O dossiê que gerou este repositório é
`projects/brain-launch/dossie-site-shizune.md` no Brain; quando os dois divergirem, **este
repositório ganha** e o dossiê é corrigido.

---

## As sete regras que não se renegociam

### 1. Todo número da página é medido, nunca digitado

`src/content/ficha.ts` e `src/content/saida-teste-negativo.txt` são **gerados** por
`npm run ficha`, que clona o pacote público, faz o checkout da release marcada Latest no
GitHub e roda os três comandos que a página mostra. Não edite nenhum dos dois à mão.

Trocar de release é rodar o script e publicar. A tag é **saída** da medição, nunca entrada:
tag constante dentro do script seria a mesma edição à mão em outro arquivo, só que escondida.

O comando de cada número aparece ao lado dele na página, e roda **a partir do clone público
na tag, e de nada além disso** — sem caminho local, sem SHA de fronteira, sem árvore que o
leitor não tenha. O que não se reproduz assim não ganha número na `/`.

### 2. O bloco de terminal é literal

`saida-teste-negativo.txt` é exatamente o que o comando imprimiu. Ele não se traduz, não se
encurta e não se embeleza. Confira com `diff` contra uma execução nova; nunca edite.

Cortar linha para caber **é editar**. O que não cabe na dobra recolhe num `<details>`, com o
texto inteiro no DOM. No celular a saída rola na horizontal em vez de quebrar linha.

A saída é em português porque o comando imprime em português. Traduzir aqui transformaria a
captura em log encenado, que é o defeito que este site existe para pegar. A legenda em
inglês, fora do bloco, é o que serve o leitor de fora.

### 3. O texto vem do Brain, e não se reescreve no caminho

Fonte: `projects/brain-launch/shizune-dev-texto-e-briefing.md`. Nenhuma frase foi reescrita,
encurtada ou cortada para caber, e nenhuma deve ser. Se uma frase precisa mudar, ela muda lá
primeiro.

O texto vive em `src/content/*.ts`, fora do JSX.

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
rota nova é uma chave num mapa. O lockup `>_ Cadu Azeredo / shizune` aparece no topo e no
rodapé, e **nunca é reescrito em outra tipografia dentro do conteúdo**.

O `e2e` conta: um `<footer>`, um `<header>`, um `<main>`, um `<h1>`, o lockup duas vezes, e o
nome o número de vezes declarado por rota. A contagem existe para que uma repetição nova
precise de alguém decidindo que ela entra.

### 7. Estar no ar significa que o corpo diz o que devia dizer

`scripts/e2e.mjs` confere **uma string esperada no corpo de cada rota**, nunca só o status.
A regra tem data e custo: em 08 e 09 de setembro de 2026, um diagnóstico de domínio leu o
código de status e não o corpo por dois dias. O `200` era verdadeiro — era a página de
estacionamento do registrador respondendo.

Por isso também **não há reescrita geral de SPA**: caminho desconhecido recebe `404.html`
com **status 404** de verdade, e não um `200` com cara de erro.

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
| `typecheck` | `tsc --noEmit` |
| `lint` | `eslint .` |
| `build` | `vite build` mais o `404.html` do pós-build |
| `peso` | Orçamento do primeiro desenho, em gzip, com a folga impressa |
| `e2e` | As três rotas num Chromium de verdade. O número de verificações ele mesmo imprime — não fica escrito aqui, para não envelhecer em silêncio |

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
- número de versão no corpo — a tag aparece só no comando de clone
- exclamação; "save time"; "10x"; número redondo sem comando
- nome de cliente, de alvo, de issue ou de fornecedor de IA
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
