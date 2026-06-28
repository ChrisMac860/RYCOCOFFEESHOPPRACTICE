// Build-time prerender (static site generation).
//
// Vite's client build emits a single index.html whose <div id="root"> is EMPTY
// — fine for the browser (JS fills it in) but invisible to crawlers, link
// unfurlers and "view source". This script renders every route to static HTML
// using the server bundle (dist-server/entry-server.js) and writes one fully
// populated HTML file per route, each with its own <title>/description/canonical
// so the served HTML is complete before any JavaScript runs. The browser then
// hydrates the same markup (see src/main.tsx).
//
// Run automatically as the `postbuild` npm step, after the client and server
// Vite builds have produced dist/ and dist-server/.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { basePath, ogImage, pages, siteOrigin, siteUrl } from "./site.config.mjs";

const distDir = resolve("dist");
const templatePath = resolve(distDir, "index.html");
const serverEntry = resolve("dist-server/entry-server.js");

// The absolute home URL hardcoded in index.html (used for the dev/default
// build). We swap every occurrence for the configured siteUrl so canonical
// links, Open Graph URLs, the share image and the JSON-LD block all follow
// site.config.mjs — switching to a custom domain needs no edits here.
const TEMPLATE_HOME_URL = "https://chrismac860.github.io/ryco-coffee-house/";

const { render } = await import(pathToFileURL(serverEntry).href);

const template = readFileSync(templatePath, "utf8");

if (!template.includes('<div id="root"></div>')) {
  throw new Error('Prerender aborted: could not find <div id="root"></div> in dist/index.html.');
}

const escapeAttr = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const escapeText = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function setTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeText(title)}</title>`);
}

// Rewrite a meta/link tag's value by targeting its identifying attribute,
// tolerant of single- or multi-line tags.
function setTagValue(html, openTag, idAttr, idValue, valueAttr, value) {
  const re = new RegExp(`(<${openTag}\\s+${idAttr}="${idValue}"\\s+${valueAttr}=")[\\s\\S]*?("\\s*/?>)`);
  if (!re.test(html)) {
    throw new Error(`Prerender aborted: could not find <${openTag} ${idAttr}="${idValue}">.`);
  }
  return html.replace(re, `$1${escapeAttr(value)}$2`);
}

function pageUrl(routePath) {
  return routePath === "/" ? siteUrl : `${siteUrl}${routePath.replace(/^\//, "")}`;
}

// Apply the configured site URL everywhere the template hardcoded the default.
const baseHtml = template.split(TEMPLATE_HOME_URL).join(siteUrl);

let written = 0;
let homeHtml = "";

for (const page of pages) {
  const appHtml = render(page.path);
  const url = pageUrl(page.path);

  let html = baseHtml.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  html = setTitle(html, page.title);
  html = setTagValue(html, "meta", "name", "description", "content", page.description);
  html = setTagValue(html, "link", "rel", "canonical", "href", url);
  html = setTagValue(html, "meta", "property", "og:url", "content", url);
  html = setTagValue(html, "meta", "property", "og:title", "content", page.title);
  html = setTagValue(html, "meta", "property", "og:description", "content", page.description);
  html = setTagValue(html, "meta", "name", "twitter:title", "content", page.title);
  html = setTagValue(html, "meta", "name", "twitter:description", "content", page.description);

  const outPath = resolve(distDir, page.file);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  written += 1;

  if (page.path === "/") {
    homeHtml = html;
  }
}

// GitHub Pages serves 404.html for any path without a matching file. Reuse the
// home page so unknown deep links still boot the SPA (which then routes
// client-side) instead of showing a blank 404.
writeFileSync(resolve(distDir, "404.html"), homeHtml);

// Sanity check: confirm the served home HTML actually contains rendered content.
const marker = "RYCO";
if (!homeHtml.includes(`<div id="root"><`) || !homeHtml.includes(marker)) {
  throw new Error("Prerender produced empty markup — aborting so the broken build is not deployed.");
}

console.log(`Prerendered ${written} route(s) + 404.html into dist/ (base ${basePath}, origin ${siteOrigin}, image ${ogImage}).`);
