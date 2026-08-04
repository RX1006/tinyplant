# TinyPlantCo — Full Deployment Guide (Blog)

Deploys the complete customer journey: **tinyplantco.com → click "Blog" in
nav → land on the listing page → click into any article.**
Written for GitHub's web UI (`github.com/RX1006/tinyplant`) — no terminal needed.

---

## The customer journey, and what powers each step

| Step | What the customer sees | File that powers it |
|---|---|---|
| 1 | Lands on `tinyplantco.com` | `index.html` |
| 2 | Clicks **Blog** in the nav | Nav link inside `index.html`, pointing to `/blog` |
| 3 | Lands on the listing page | `blog/index.html` |
| 4 | Clicks into any article | 7 individual `blog/<slug>/index.html` files |

---

## Full file list for this deployment

```
index.html                                          (homepage — nav says "Blog")
vercel.json                                          (redirects old /guides → /blog, if that was ever live)
sitemap.xml                                          (all pages, for search engines)
api/subscribe.js                                     (raffle signup — unchanged, no action needed)

blog/index.html                                      (listing page)
blog/POST-TEMPLATE.html                               (reference only, not a live page)
blog/welcome-to-tinyplantco/index.html
blog/5-easy-plants-for-kids-to-grow/index.html
blog/what-is-a-sunflower/index.html
blog/what-is-a-snap-pea/index.html
blog/what-is-a-radish/index.html
blog/what-is-basil/index.html
blog/what-is-a-marigold/index.html
```

---

## Step 1 — Clean up any leftover `/guides` files

If you deployed the earlier "Guides" version, delete these from the repo
if they still exist (open each file on GitHub → trash-can icon → commit):
- `guides/index.html`
- `guides/POST-TEMPLATE.html`
- `guides/welcome-to-tinyplantco/index.html`
- `guides/5-easy-plants-for-kids-to-grow/index.html`
- `guides/what-is-a-sunflower/index.html`
- `guides/what-is-a-snap-pea/index.html`
- `guides/what-is-a-radish/index.html`
- `guides/what-is-basil/index.html`
- `guides/what-is-a-marigold/index.html`

Also remove any leftover Sanity-era files if they're still around:
`api/blog-list.js`, `api/blog-post.js`, `lib/`, `schemas/`.

*(Skip anything that was never pushed.)*

## Step 2 — Update the homepage (`index.html`)

1. Go to `https://github.com/RX1006/tinyplant`
2. Open `index.html` → click the pencil (Edit) icon
3. Replace its entire contents with the `index.html` file provided in this
   message (nav now links to `/blog` with the label "Blog")
4. Scroll down, commit message like `Update nav to Blog`, **Commit changes**

## Step 3 — Add the blog listing page

1. **Add file → Create new file**
2. Filename: `blog/index.html` (typing the `/` creates the folder)
3. Paste in the `blog/index.html` contents provided
4. Commit message: `Add blog listing page` → **Commit new file**

## Step 4 — Add all 7 article pages

Repeat **Add file → Create new file** for each of these, pasting the
matching content each time:

1. `blog/welcome-to-tinyplantco/index.html`
2. `blog/5-easy-plants-for-kids-to-grow/index.html`
3. `blog/what-is-a-sunflower/index.html`
4. `blog/what-is-a-snap-pea/index.html`
5. `blog/what-is-a-radish/index.html`
6. `blog/what-is-basil/index.html`
7. `blog/what-is-a-marigold/index.html`

Also add the reusable template (not a live page, but keep it for future posts):
- `blog/POST-TEMPLATE.html`

## Step 5 — Update `vercel.json` and `sitemap.xml`

These already exist in your repo from earlier steps — edit, don't create new:

1. Open `vercel.json` → pencil icon → replace contents with the version
   provided (redirects `/guides` → `/blog`, in case that URL was ever live)
   → **Commit changes**
2. Open `sitemap.xml` → same → replace with the version listing all 7
   articles under `/blog` → **Commit changes**

## Step 6 — Let Vercel redeploy

Each commit above triggers an automatic redeploy since your repo is
connected to Vercel. Check **Vercel → your project → Deployments** and
wait for the latest one to show **Ready** (usually under a minute for a
static site).

## Step 7 — Walk the actual customer journey to verify

1. Visit `https://www.tinyplantco.com/` — homepage loads
2. Click **Blog** in the nav — lands on `https://www.tinyplantco.com/blog`
3. Confirm all 7 article cards appear, newest first
4. Click into each article and confirm it loads correctly:
   - `/blog/what-is-a-marigold`
   - `/blog/what-is-basil`
   - `/blog/what-is-a-radish`
   - `/blog/what-is-a-snap-pea`
   - `/blog/what-is-a-sunflower`
   - `/blog/5-easy-plants-for-kids-to-grow`
   - `/blog/welcome-to-tinyplantco`
5. On each article, click **"← Back to all posts"** and confirm it
   returns to `/blog`
6. If you had previously deployed the `/guides` version, visit
   `https://www.tinyplantco.com/guides` directly — should **redirect**
   to `/blog`

## Step 8 (optional) — Resubmit sitemap to Google Search Console

Since `sitemap.xml` changed (URLs moved to `/blog`), resubmit it in
Search Console so Google recrawls sooner rather than waiting for its next
natural pass.

---

## Publishing a new article after this
Ask Claude to write it using `blog/POST-TEMPLATE.html`'s structure, save
it to `blog/your-slug/index.html`, add a card to the top of
`blog/index.html`, and add a `<url>` entry to `sitemap.xml`. No other
files need to change.
