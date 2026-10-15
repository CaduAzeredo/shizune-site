#!/usr/bin/env node
/**
 * Teste da regra de publicação (`src/lib/publicacao.ts`).
 *
 * A regra: linha sem fonte conferida aparece marcada como rascunho no preview e
 * NÃO aparece em produção. O que este teste prova é que a produção esconde, e que
 * o preview mostra marcando — as duas metades, porque uma regra que só esconde
 * esconderia também do operador, que lê o preview para decidir.
 *
 * Roda o arquivo TypeScript direto, pela remoção de tipos do Node (22.6+ com
 * `--experimental-strip-types`, padrão a partir do 23.6). O módulo é puro de
 * propósito, para que isso funcione sem o empacotador.
 */
import { blocoAparece, oQueAparece } from "../src/lib/publicacao.ts";

let falhas = 0;
const ok = (cond, msg) => {
  console.log(cond ? `  ok     ${msg}` : `  FALHA  ${msg}`);
  if (!cond) falhas++;
};

const linhas = [
  { nome: "com fonte", fonte: "https://exemplo.invalid/fonte" },
  { nome: "sem fonte", fonte: null },
  { nome: "fonte vazia", fonte: "" },
];
const conferido = (l) => Boolean(l.fonte);

console.log("\n[produção] linha sem fonte não aparece\n");
const prod = oQueAparece(linhas, conferido, "producao");
ok(prod.length === 1 && prod[0].item.nome === "com fonte", "só a linha com fonte aparece");
ok(prod.every((v) => v.rascunho === false), "nada aparece marcado como rascunho em produção");
ok(oQueAparece([{ fonte: null }], conferido, "producao").length === 0, "sem nenhuma fonte, a lista sai vazia");

console.log("\n[preview] linha sem fonte aparece, marcada\n");
const prev = oQueAparece(linhas, conferido, "previa");
ok(prev.length === 3, "as três linhas aparecem no preview");
ok(prev.find((v) => v.item.nome === "com fonte")?.rascunho === false, "a linha com fonte não leva marca");
ok(prev.filter((v) => v.rascunho).length === 2, "as duas linhas sem fonte levam a marca de rascunho");
ok(prev.map((v) => v.item.nome).join(",") === "com fonte,sem fonte,fonte vazia", "a ordem é a da lista");

console.log("\n[bloco] um bloco inteiro segue a mesma regra\n");
ok(blocoAparece(false, "producao") === false, "bloco não conferido some em produção");
ok(blocoAparece(false, "previa") === true, "bloco não conferido aparece no preview");
ok(blocoAparece(true, "producao") === true, "bloco conferido aparece em produção");

console.log(falhas ? `\ntest-publicacao: ${falhas} falha(s). Resultado: FALHOU` : "\ntest-publicacao: tudo passou. Resultado: OK");
process.exit(falhas ? 1 : 0);
