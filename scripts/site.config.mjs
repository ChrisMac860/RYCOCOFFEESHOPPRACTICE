// Single source of truth for the deployed site's location and per-page SEO.
//
// Used by:
//   - vite.config.ts        -> sets the build `base`
//   - scripts/prerender.mjs  -> builds canonical/OG URLs + per-page <head> tags
//
// === Switching to a custom domain (e.g. https://rycocoffeehouse.com) ===
//   1. Set   siteOrigin = "https://rycocoffeehouse.com"
//   2. Set   basePath   = "/"
//   3. Add the domain in GitHub: Settings -> Pages -> Custom domain
//      (this writes a `public/CNAME` file — a template is already provided).
//   4. Point DNS at GitHub Pages (see README "Going live" checklist).
// Nothing else in the codebase needs editing — the app reads the base from Vite.

export const siteOrigin = "https://chrismac860.github.io";
export const basePath = "/RYCOCOFFEESHOPPRACTICE/";

// Absolute URL of the home page (origin + base), no trailing duplication.
export const siteUrl = `${siteOrigin}${basePath}`.replace(/\/+$/, "/");

// Default share image (relative to basePath).
export const ogImage = "images/ryco-restaurantguru-photo.jpg";

// Every route that gets its own prerendered HTML file + tailored <head>.
// `path` matches the React Router path; `file` is written under dist/.
export const pages = [
  {
    path: "/",
    file: "index.html",
    title: "RYCO Coffee House | Coffee, Acai Bowls & Brunch in Moy",
    description:
      "RYCO Coffee House in Moy, Dungannon (Co. Tyrone). Freshly made coffee, acai bowls, smoothies, traybakes, toasties and breakfast pots. Open Wednesday to Monday."
  },
  {
    path: "/menu",
    file: "menu/index.html",
    title: "Menu | RYCO Coffee House, Moy",
    description:
      "RYCO Coffee House menu: coffee, acai bowls, smoothies, traybakes, toasties and overnight oats for sit-in, lunch and takeaway in Moy."
  },
  {
    path: "/about",
    file: "about/index.html",
    title: "About | RYCO Coffee House, Moy",
    description:
      "A bright local coffee house on Killyman Street, Moy — coffee, breakfast pots, acai bowls and lunch bites for the everyday stop-in."
  },
  {
    path: "/visit",
    file: "visit/index.html",
    title: "Visit | RYCO Coffee House, 30 Killyman Street, Moy",
    description:
      "Find RYCO Coffee House at 30 Killyman Street, Moy, Dungannon BT71 7SJ. Opening hours and directions. Open Wednesday to Monday."
  },
  {
    path: "/gallery",
    file: "gallery/index.html",
    title: "Gallery | RYCO Coffee House, Moy",
    description:
      "Storefront, coffee, acai bowls and house favourites from the RYCO Coffee House counter on Killyman Street, Moy."
  },
  {
    path: "/contact",
    file: "contact/index.html",
    title: "Contact | RYCO Coffee House, Moy",
    description:
      "Call RYCO Coffee House, check the socials or get directions to 30 Killyman Street, Moy, Dungannon BT71 7SJ."
  }
];
