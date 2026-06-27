import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { basename } from "./router";
import "./styles.css";

const app = (
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

const root = document.getElementById("root")!;

// In production the HTML is prerendered (see scripts/prerender.mjs), so #root
// already contains markup and we hydrate it — preserving the server-rendered
// first paint. During `vite dev` there is no prerender, so #root is empty and
// we render from scratch instead.
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
