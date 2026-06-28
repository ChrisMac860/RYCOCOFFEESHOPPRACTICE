# Going-live checklist

What's left to take RYCO from "spec build" to "sale-ready". The naming/branch
items are already done; what remains needs **a real person** (the shop owner) or
**money** (a domain) and so is yours to do.

Live site: **https://chrismac860.github.io/ryco-coffee-house/**

---

## 1. Drop "PRACTICE" from the name — ✅ DONE

- GitHub repo renamed `RYCOCOFFEESHOPPRACTICE` → **`ryco-coffee-house`**.
- `basePath` updated to `/ryco-coffee-house/` and redeployed, so the Pages URL is
  now `…github.io/ryco-coffee-house/`.

Want a different name (e.g. `RYCOCOFFEESHOP`)? It's one command —
`gh repo rename RYCOCOFFEESHOP` — then change `basePath` in
[`../scripts/site.config.mjs`](../scripts/site.config.mjs) to match and redeploy.

**Local folder** (optional, cosmetic): the folder is still
`…/Documents/RYCOCOFFEESHOPPRACTICE`. Nothing depends on its name; rename it in
File Explorer any time (close the editor first).

## 2. Drop the `codex/ryco-react-site` branch — ✅ DONE

Work promoted to **`main`**, `main` set as the default branch, the old
`codex/ryco-react-site` branch deleted, and the deploy workflow trimmed to deploy
only `main`.

---

## 3. Add a custom domain — ⏸️ SKIPPED (no domain for now)

Not doing this yet (no domain purchased). The build is already wired so this is a
two-line change whenever you want it. You'd need a domain (Namecheap, Cloudflare,
GoDaddy, …). Say it's `rycocoffeehouse.com`.

1. **Point it at the code.** In
   [`../scripts/site.config.mjs`](../scripts/site.config.mjs):
   ```js
   export const siteOrigin = "https://rycocoffeehouse.com";
   export const basePath = "/";
   ```
2. **Tell GitHub.** Copy the template to activate the CNAME the deploy includes:
   ```bash
   cp docs/CNAME.example public/CNAME      # then edit it to your real domain
   ```
   …**or** set it in GitHub → Settings → Pages → Custom domain (GitHub manages
   the CNAME for you). Tick **Enforce HTTPS** once the certificate is issued.
3. **Point DNS** at GitHub Pages, at your registrar:
   - Apex (`rycocoffeehouse.com`) → four `A` records:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     (and the matching `AAAA` records if you want IPv6).
   - `www` → `CNAME` to `chrismac860.github.io`.
4. **Redeploy** (push to `main`). DNS can take up to ~24h to propagate; the green
   "DNS check successful" in the Pages settings confirms it.

After this, every canonical/Open-Graph URL the build emits automatically uses the
new domain — no other code changes needed (that's what `site.config.mjs` buys you).

---

## 4. Get written permission + a testimonial (do this before selling/launching)

The site currently uses RYCO's name, brand and **public** listing/social photos
on the assumption that the owner is fine with it. Before it goes public or
changes hands, get that in writing — it protects you and them.

- **Ask for:** written permission to use the business name, logo and imagery on
  the site; and a 1–2 sentence testimonial you can quote.
- **Record it** in [`PERMISSION.md`](PERMISSION.md) (date + how it was given).
- A ready-to-send message is drafted in [`PERMISSION.md`](PERMISSION.md).
- Once you have a testimonial, it can go straight on the site (e.g. a short quote
  on the About section) and in the README's story.

---

## 5. Swap the placeholders for real content

- **Prices:** replace the market-estimate placeholders in
  [`../src/data/siteContent.ts`](../src/data/siteContent.ts) with RYCO's real
  menu prices (flagged with a `NOTE:` comment there).
- **Photos:** drop owner-approved originals into
  [`../public/images/`](../public/images/), keeping the same filenames, or update
  the references in `siteContent.ts`. See
  [`../public/images/README.md`](../public/images/README.md).
