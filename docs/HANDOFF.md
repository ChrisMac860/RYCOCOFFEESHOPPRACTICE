# Going-live checklist

These are the steps that take RYCO from "spec build on a `github.io` URL" to
"sale-ready site on its own domain". They're listed here rather than done
automatically because each one is **outward-facing** (changes public URLs) or
**needs a real person** (the shop owner, a domain registrar). Do them roughly in
this order.

---

## 1. Drop "PRACTICE" from the name

There are three separate "names" and only the first matters publicly:

| Name | Where | Public impact |
| --- | --- | --- |
| Public URL | GitHub Pages | High — fixed by the custom domain (step 3) |
| GitHub repo name | `github.com/ChrisMac860/RYCOCOFFEESHOPPRACTICE` | Cosmetic once a domain is set |
| Local folder | `…/Documents/RYCOCOFFEESHOPPRACTICE` | None |

**Recommended order:** set the custom domain first (step 3). Once the site is
served from `rycocoffeehouse.com`, the repo name is just an internal label and
you can rename it freely with no public fallout.

**Rename the GitHub repo** (run from the project folder):

```bash
gh repo rename ryco-coffee-house        # updates GitHub + your local remote
```

> ⚠️ If you rename the repo **without** a custom domain, the Pages URL becomes
> `…github.io/ryco-coffee-house/`, so you must also change `basePath` in
> [`../scripts/site.config.mjs`](../scripts/site.config.mjs) to
> `"/ryco-coffee-house/"` and redeploy. With a custom domain this doesn't apply.

**Rename the local folder** (optional, cosmetic): close your editor, rename the
folder in File Explorer, reopen. Nothing in the code depends on the folder name.

---

## 2. Drop the `codex/ryco-react-site` branch

Promote the work to `main` and make that the only deploy branch.

```bash
git checkout codex/ryco-react-site
git branch -m main                       # rename current branch to main locally
git push -u origin main                  # push main
gh repo edit --default-branch main       # make main the default on GitHub
git push origin --delete codex/ryco-react-site   # delete the old remote branch
```

Then trim the workflow so it only deploys `main`: in
[`../.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) remove
`master` and `codex/ryco-react-site` from the `on.push.branches` list, leaving
just `main`.

---

## 3. Add a custom domain

You need a domain (e.g. from Namecheap, Cloudflare, GoDaddy). Say it's
`rycocoffeehouse.com`.

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
