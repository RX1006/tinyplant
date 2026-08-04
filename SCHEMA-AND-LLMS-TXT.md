# Adding Schema and llms.txt to TinyPlantCo

## Two different things, both relevant to GEO/AEO

**Schema markup (JSON-LD)** — structured data embedded in each page's HTML
that tells search engines and AI crawlers exactly what the content *is*
(an article, an FAQ, an organization) rather than making them guess from
prose. This is an established, widely-supported standard (schema.org),
used by Google, Bing, and AI answer engines alike.

**llms.txt** — a newer, much simpler convention: a single plain-text/markdown
file at your site's root that gives AI crawlers a clean, structured index
of your site's pages and what each one covers — similar in spirit to
`robots.txt` or `sitemap.xml`, but written for language models to read
directly rather than for a crawler to parse HTML. It's not yet universally
adopted by every AI platform, but costs nothing to add and several
answer-engine crawlers do reference it.

---

## What schema you already have

Every blog article already includes:
- **Article schema** — headline, publish date, author, publisher
- **FAQPage schema** — every visible FAQ question/answer pair, structured
  so AI answer engines can pull them directly

## What was missing, and what I just added

Your **homepage had no schema at all**. I added:

- **Organization schema** — tells crawlers what TinyPlantCo is, as a
  business entity (name, URL, description)
- **WebSite schema** — establishes the site itself as an indexable entity

Both are now in `index.html`'s `<head>`, right before the closing tag.

## What I did NOT add, and why
- **Product schema** — this is normally for things with a price, SKU, and
  buy button. Since the Garden Kit isn't currently sold (it's raffled,
  free), Product schema would technically misrepresent it. If you launch
  a paid store later, that's the moment to add it.
- **BreadcrumbList schema** — usually valuable on deeper page hierarchies
  (e.g. category > subcategory > article). Your site is shallow enough
  (`/`, `/blog`, `/blog/slug`) that it adds little right now — worth
  revisiting if the site structure grows.

---

## The `llms.txt` file

I created `llms.txt` at your site root, following the standard structure:
- `# TinyPlantCo` — site name as H1
- A one-line blockquote summary
- A short paragraph of context
- `## Pages` — core site pages
- `## Blog Guides` — every article, each with a one-line description
- `## Optional` — secondary resources (sitemap)

This needs to be updated every time you publish a new article — add one
line under `## Blog Guides` per new post, same pattern as the sitemap.

---

## Deployment steps

### 1. Update `index.html`
Open `index.html` on GitHub → pencil (Edit) icon → replace its contents
with the updated version (adds Organization + WebSite schema) → commit.

### 2. Add `llms.txt`
**Add file → Create new file** → filename: `llms.txt` (root level, no
folder) → paste the contents provided → commit.

### 3. Redeploy and verify
Vercel auto-redeploys on commit. Once live, check:
- `https://www.tinyplantco.com/llms.txt` loads as plain text
- View source on `https://www.tinyplantco.com/` and confirm the two new
  `<script type="application/ld+json">` blocks appear in the `<head>`

### 4. Validate the schema (recommended)
Paste your homepage URL into Google's Rich Results Test
(`search.google.com/test/rich-results`) to confirm the Organization and
WebSite schema parse without errors. Do the same for one blog article to
confirm the existing Article/FAQPage schema still validates.

---

## Going forward
Every new article already gets Article + FAQPage schema automatically,
since that's baked into `blog/POST-TEMPLATE.html`. The only new step per
post: add one line to `llms.txt` under `## Blog Guides`, same as you
already do for `sitemap.xml`.
