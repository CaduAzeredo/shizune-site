import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

const raiz = document.getElementById("root");
if (!raiz) throw new Error("sem #root no index.html");

createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
