/**
 * O 404 — a tela 14.
 *
 * Curto de propósito, e na cor de alerta: sem ilustração, sem piada, sem "oops".
 * A página diz o que houve e devolve os quatro caminhos que existem.
 */
import { CLONE } from "./repositorio";

export const naoEncontrado = {
  codigo: "404",
  titulo: "This page does not exist.",
  texto: "Four pages exist, and this is none of them.",
  destinos: [
    { rota: "/", texto: "The thesis, and a run you can repeat." },
    { rota: "/method", texto: "How a decision is recorded, signed and checked." },
    { rota: "/evidence", texto: "Every claim, its command, its last measurement." },
    { rota: "/roadmap", texto: "Six steps, each named by the threat it closes." },
  ],
  rotuloDoComando: "terminal · or start from the code",
  comando: CLONE,
} as const;
