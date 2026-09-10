#!/usr/bin/env node
/**
 * A ficha — os números da página, medidos, nunca digitados.
 *
 * Regra do operador (2026-09-09): **todo comando da página roda a partir do
 * clone público na tag, e de nada além disso.** Sem caminho local, sem SHA de
 * fronteira, sem árvore que o leitor não tenha. O que não se reproduz assim não
 * ganha número na página.
 *
 * Este script é essa regra virada em código. Ele clona o pacote público, faz o
 * checkout da tag publicada, roda os três comandos que a página mostra, e
 * escreve `src/content/ficha.ts`. A página renderiza `ficha.tag` e
 * `ficha.arquivos`; nenhum literal de versão ou de contagem existe no JSX.
 *
 * Três coisas que ele faz de propósito, e cada uma existe porque a alternativa
 * já deu errado em algum lugar:
 *
 * 1. **A tag é SAÍDA, nunca entrada.** Ele pergunta ao GitHub qual release está
 *    marcada Latest. Tag constante dentro do script seria a mesma edição à mão
 *    em outro arquivo — só que escondida.
 *
 * 2. **Conta o `9 / 7 / 2` da saída do `doctor` em vez de escrevê-lo.** A
 *    linha-resumo do `doctor` fecha com "os 9 verificadores passaram",
 *    contando os dois `n/a` como aprovados (item 47 da fila do Brain,
 *    candidato, não aplicado). Enquanto o item não for decidido, é este script
 *    que sabe a diferença — ele lê o bloco RESUMO linha a linha.
 *
 * 3. **Captura a saída do teste negativo verbatim** e deriva dela a contagem de
 *    asserções visíveis e recolhidas. A legenda "N assertions more" da barra do
 *    `<details>` é contada, não escrita: no mockup ela tinha sido escrita à
 *    mão, e estava errada.
 *
 * O que a ficha NÃO cobre, e fica declarado: os números da instância privada
 * (19 decisões, 7 contribuições) não saem de clone nenhum. Continuam entrando à
 * mão na `/method`, com o rótulo "measured in a private instance, <data>".
 */
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DESTINO = path.join(RAIZ, "src/content/ficha.ts");
/**
 * A captura vive como ARQUIVO DE TEXTO, e não embutida no `.ts`.
 *
 * Assim ela é exatamente o que o comando imprimiu, byte a byte: quem revisa dá
 * `diff` contra uma execução nova em vez de conferir uma string escapada dentro
 * de código. E o `e2e` lê o mesmo arquivo que a página renderiza, em vez de uma
 * segunda cópia que poderia divergir em silêncio.
 */
const DESTINO_CAPTURA = path.join(RAIZ, "src/content/saida-teste-negativo.txt");
const DESTINO_CLONE = path.join(RAIZ, "src/content/saida-clone.txt");
const DESTINO_LS = path.join(RAIZ, "src/content/saida-ls.txt");
const REPO = "CaduAzeredo/shizune";
const URL_CLONE = `https://github.com/${REPO}.git`;

function rodar(cmd, args, cwd) {
  return execFileSync(cmd, args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    windowsHide: true,
  });
}

/**
 * Renderiza uma saída de terminal como o terminal a renderiza.
 *
 * O `git clone --progress` emite CENTENAS de quadros de progresso separados por
 * `\r`. Num terminal, cada `\r` rebobina o cursor e o quadro seguinte sobrescreve
 * o anterior — a pessoa vê **uma** linha por etapa, com o estado final. Salvo num
 * arquivo, o mesmo fluxo vira 373 linhas.
 *
 * **Colapsar os quadros é RENDERIZAR, não editar.** `\r` é instrução de
 * apresentação, não conteúdo; os espaços à direita são o apagador do próprio
 * `git`. Apagar uma linha seria edição, e isso não acontece aqui. Medido em
 * 2026-09-09: 373 linhas cruas → 7 renderizadas, idênticas às que aparecem no
 * terminal.
 */
function comoNoTerminal(bruto) {
  return bruto
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.split("\r").pop().replace(/\s+$/, ""))
    .filter((l) => l !== "")
    .join("\n");
}

/** Roda e devolve a saída mesmo quando o código de saída não é 0. */
function rodarTolerante(cmd, args, cwd) {
  try {
    return { codigo: 0, saida: rodar(cmd, args, cwd) };
  } catch (e) {
    return { codigo: e.status ?? 1, saida: `${e.stdout ?? ""}${e.stderr ?? ""}` };
  }
}

// ── 1. a tag publicada, perguntada ao GitHub ────────────────────────────────

let tag;
try {
  tag = rodar("gh", [
    "release",
    "view",
    "--json",
    "tagName",
    "-q",
    ".tagName",
    "-R",
    REPO,
  ]).trim();
} catch {
  console.error(
    `erro: não consegui resolver a release Latest de ${REPO} com o gh.\n` +
      "       A tag é saída deste script, nunca entrada — sem ela a ficha não sai.\n" +
      "       Confira `gh auth status` e a conectividade, e rode de novo.",
  );
  process.exit(1);
}

console.log(`  tag publicada (release Latest de ${REPO}): ${tag}`);

// ── 2. o clone limpo, exatamente o da página ────────────────────────────────

const trabalho = mkdtempSync(path.join(tmpdir(), "ficha-shizune-"));
const clone = path.join(trabalho, "shizune");

try {
  // O clone é capturado, e não silenciado: é ele que a `/` mostra.
  //
  // `--progress` está aqui por FIDELIDADE, não por aparência, e a escolha foi
  // medida em 2026-09-09 rodando as duas versões. Sem o parâmetro, com a saída
  // canalizada, o `git` imprime uma linha só — "Cloning into 'shizune'..." —,
  // que é artefato do cano e NÃO é o que a pessoa vê. Com `--progress` vem o
  // que ela vê ao rodar o comando publicado num terminal de verdade, porque lá
  // o stderr é um tty e o progresso sai por padrão. O comando na página segue
  // sem o parâmetro; quem o roda vê isto.
  // SEM destino no argumento, e é obrigatório que seja assim. Passando o
  // caminho absoluto, o `git` o ecoa — "Cloning into 'C:\Users\...'" — e a
  // captura publica o diretório de trabalho e o nome de usuário de quem rodou.
  // É a trava mais dura do dossiê: nunca a árvore local numa captura. Sem
  // destino, o `git` deriva o nome do repositório e imprime "Cloning into
  // 'shizune'...", que é o que a pessoa vê ao rodar o comando publicado.
  const saidaClone = spawnSync("git", ["clone", "--progress", URL_CLONE], {
    cwd: trabalho,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    windowsHide: true,
  });
  if (saidaClone.status !== 0) {
    console.error(`erro: o clone de ${URL_CLONE} falhou.\n${saidaClone.stderr}`);
    process.exit(1);
  }
  rodar("git", ["checkout", "--quiet", tag], clone);

  const sha = rodar("git", ["rev-parse", "--short", "HEAD"], clone).trim();
  const descrito = rodar("git", ["describe", "--tags"], clone).trim();

  if (descrito !== tag) {
    console.error(
      `erro: o clone respondeu \`git describe --tags\` = ${descrito}, e a release Latest é ${tag}.`,
    );
    process.exit(1);
  }

  // ── 3. os três comandos da página ──────────────────────────────────────

  // 3.1 arquivos no pacote — `git ls-files | wc -l`
  const arquivos = rodar("git", ["ls-files"], clone)
    .split("\n")
    .filter((l) => l.trim() !== "").length;

  // 3.2 asserções no teste negativo — `grep -cE '^\s*ok\(' ...`
  const fonteTeste = rodar(
    "git",
    ["show", `${tag}:scripts/test-validate-decisions.mjs`],
    clone,
  );
  const asseracoes = fonteTeste
    .split("\n")
    .filter((l) => /^\s*ok\(/.test(l)).length;

  // 3.3 o doctor — contado no bloco RESUMO, e não na linha de fecho
  const doctor = rodarTolerante("node", ["scripts/doctor.mjs"], clone);
  const resumo = doctor.saida.slice(doctor.saida.indexOf("RESUMO"));
  const corte = resumo.indexOf("\nResultado:");
  const linhasResumo = (corte < 0 ? resumo : resumo.slice(0, corte))
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^(OK|n\/a|FALHA)\b/.test(l));

  const doctorOk = linhasResumo.filter((l) => l.startsWith("OK")).length;
  const doctorNa = linhasResumo.filter((l) => l.startsWith("n/a")).length;
  const doctorFalha = linhasResumo.filter((l) => l.startsWith("FALHA")).length;
  const doctorTotal = linhasResumo.length;

  if (doctorTotal === 0) {
    console.error(
      "erro: não achei o bloco RESUMO na saída do doctor — o formato mudou.\n" +
        "      A ficha não inventa número: corrija a leitura antes de publicar.",
    );
    process.exit(1);
  }
  if (doctorFalha > 0) {
    console.error(
      `erro: o doctor reprovou ${doctorFalha} verificador(es) no clone em ${tag}.` +
        " A página não publica número de árvore que não passa.",
    );
    process.exit(1);
  }

  // 3.4 a captura do teste negativo, verbatim
  const teste = rodarTolerante(
    "node",
    ["scripts/test-validate-decisions.mjs"],
    clone,
  );
  if (teste.codigo !== 0) {
    console.error(
      `erro: o teste negativo saiu com código ${teste.codigo} no clone em ${tag}.` +
        " A página mostra uma execução que passa; esta não passou.",
    );
    process.exit(1);
  }
  const saida = teste.saida.replace(/\r\n/g, "\n").replace(/\s+$/, "");

  const okNaSaida = saida.split("\n").filter((l) => /^\s+ok\s/.test(l)).length;
  if (okNaSaida !== asseracoes) {
    console.error(
      `erro: o teste imprimiu ${okNaSaida} linha(s) "ok" e a fonte declara ${asseracoes} asserção(ões).\n` +
        "      Os dois números aparecem na página; publicá-los divergentes é o defeito que este site denuncia.",
    );
    process.exit(1);
  }

  // ── 4. o arquivo ───────────────────────────────────────────────────────

  // ── 3.5 o que a pessoa vê ao clonar, e o que ela recebe ────────────────

  const clonado = comoNoTerminal(saidaClone.stderr);
  if (!clonado.startsWith("Cloning into 'shizune'")) {
    console.error(
      `erro: a saída do clone não começa como esperado.\n${clonado.slice(0, 200)}`,
    );
    process.exit(1);
  }

  /**
   * A guarda contra vazamento de árvore local, mecânica e não por disciplina.
   *
   * Ela existe porque a primeira versão deste script VAZOU: passando o destino
   * absoluto ao `git clone`, a captura saiu com
   * "Cloning into 'C:\\Users\\<usuário>\\AppData\\Local\\Temp\\...'". Uma trava
   * que depende de alguém reler a saída antes de publicar não é trava.
   */
  const VAZAMENTOS = [
    [/[A-Za-z]:[\\/]/, "caminho absoluto do Windows"],
    [/\/(?:home|Users)\//, "caminho absoluto POSIX"],
    [/\\\\/, "caminho UNC"],
    [
      new RegExp(
        path.basename(trabalho).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      ),
      "nome do diretório temporário",
    ],
  ];

  const semArvoreLocal = (rotulo, texto) => {
    for (const [re, oQue] of VAZAMENTOS) {
      if (!re.test(texto)) continue;
      console.error(
        `erro: a captura do ${rotulo} contém ${oQue}.\n` +
          "       A trava do dossiê é dura: nunca a árvore local numa captura.",
      );
      process.exit(1);
    }
  };

  semArvoreLocal("clone", clonado);

  // A listagem da raiz do clone: uma entrada por linha, primeiro nível apenas.
  // A página mostra o que se recebe ao baixar — não permissão, não recursão.
  //
  // Isto era `ls` puro por execFileSync, e o script só rodava onde `ls` existe.
  // Na máquina do operador (Windows, fora do Git Bash) quebrava com
  // `spawnSync ls ENOENT` — um gerador de números que depende do shell de quem
  // o roda é a mesma classe de defeito que a ficha existe para evitar.
  //
  // `readdirSync` reproduz o `ls` exatamente, com duas condições que NÃO são
  // detalhe: o filtro de dotfiles (o `ls` não mostra `.git`, `.github`,
  // `.gitignore`, `.gitattributes`) e o `sort()` sem comparador, que ordena por
  // code unit — a mesma ordem de byte do `ls` em locale C, com as maiúsculas
  // antes das minúsculas. Conferido contra a captura da v0.4.0: idêntico byte
  // a byte, 16 entradas.
  //
  // `git ls-files` seria a troca errada: lista os 66 arquivos rastreados,
  // recursivamente e com dotfiles — outro número e outra página.
  const listagem = readdirSync(clone)
    .filter((nome) => !nome.startsWith("."))
    .sort()
    .join("\n");
  const entradas = listagem.split("\n").filter((l) => l.trim() !== "").length;
  if (entradas < 10) {
    console.error(`erro: o \`ls\` do clone devolveu ${entradas} entradas.`);
    process.exit(1);
  }
  semArvoreLocal("ls", listagem);

  const medidoEm = new Date().toISOString().slice(0, 10);

  writeFileSync(DESTINO_CAPTURA, `${saida}\n`, "utf8");
  writeFileSync(DESTINO_CLONE, `${clonado}\n`, "utf8");
  writeFileSync(DESTINO_LS, `${listagem}\n`, "utf8");

  const corpo = `/**
 * GERADO POR \`scripts/ficha.mjs\` — NÃO EDITE À MÃO.
 *
 * Medido em ${medidoEm}, num clone limpo de
 * https://github.com/${REPO} na tag ${tag} (${sha}).
 *
 * Trocar de release é rodar \`npm run ficha\` e publicar. Nenhum número desta
 * página é digitado: se um deles estiver errado, o erro está no comando, e o
 * comando está impresso ao lado do número na própria página.
 *
 * As capturas NÃO estão aqui: são os três \`.txt\` ao lado, exatamente como os
 * comandos as imprimiram. Quem revisa dá \`diff\` neles contra uma execução nova.
 */
import saidaTesteNegativo from "./saida-teste-negativo.txt?raw";
import saidaClone from "./saida-clone.txt?raw";
import saidaLs from "./saida-ls.txt?raw";

export interface Ficha {
  /** A tag publicada, resolvida pela release marcada Latest no GitHub. */
  readonly tag: string;
  /** O SHA curto que a tag resolve no clone. */
  readonly sha: string;
  /** Data da medição, ISO curto. */
  readonly medidoEm: string;
  /** \`git ls-files | wc -l\` */
  readonly arquivos: number;
  /** \`grep -cE '^\\s*ok\\(' scripts/test-validate-decisions.mjs\` */
  readonly asseracoes: number;
  /** Verificadores do \`doctor\`, contados no bloco RESUMO. */
  readonly doctor: {
    readonly total: number;
    readonly executam: number;
    readonly na: number;
  };
  /** A saída literal de \`node scripts/test-validate-decisions.mjs\`. */
  readonly saidaTesteNegativo: string;
  /** O que o \`git clone\` imprime, renderizado como no terminal. */
  readonly saidaClone: string;
  /** O \`ls\` da raiz do clone — o que se recebe ao baixar. */
  readonly saidaLs: string;
}

export const ficha: Ficha = {
  tag: ${JSON.stringify(tag)},
  sha: ${JSON.stringify(sha)},
  medidoEm: ${JSON.stringify(medidoEm)},
  arquivos: ${arquivos},
  asseracoes: ${asseracoes},
  doctor: { total: ${doctorTotal}, executam: ${doctorOk}, na: ${doctorNa} },
  saidaTesteNegativo: saidaTesteNegativo.replace(/\\n$/, ""),
  saidaClone: saidaClone.replace(/\\n$/, ""),
  saidaLs: saidaLs.replace(/\\n$/, ""),
};

export default ficha;
`;

  writeFileSync(DESTINO, corpo, "utf8");

  console.log(`  clone: ${tag} = ${sha}`);
  console.log(`  arquivos no pacote:      ${arquivos}`);
  console.log(`  asserções no teste:      ${asseracoes}  (linhas "ok" impressas: ${okNaSaida})`);
  console.log(
    `  doctor:                  ${doctorTotal} verificadores — ${doctorOk} executam, ${doctorNa} n/a`,
  );
  console.log(`  captura do teste:        ${saida.split("\n").length} linhas`);
  console.log(
    `  captura do clone:        ${clonado.split("\n").length} linhas renderizadas ` +
      `(de ${saidaClone.stderr.split(/\r|\n/).length} quadros crus)`,
  );
  console.log(`  ls da raiz do clone:     ${entradas} entradas`);
  console.log(`\nficha: escrita em src/content/ficha.ts. Resultado: OK`);
} finally {
  rmSync(trabalho, { recursive: true, force: true });
}
