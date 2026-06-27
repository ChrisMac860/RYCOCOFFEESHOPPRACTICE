import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { basename, toLocation } from "./router";

// Render a single route to an HTML string at build time. The prerender script
// (scripts/prerender.mjs) calls this once per route and injects the result into
// the page so the served HTML already contains real content for crawlers and
// for first paint. The browser then hydrates the same markup (see main.tsx).
export function render(routePath: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter basename={basename} location={toLocation(routePath)}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
}
