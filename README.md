# parhamzm.github.io

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-5738d4.svg)](LICENSE)
[![Deployed on GitHub Pages](https://img.shields.io/badge/Deployed-GitHub_Pages-24292e.svg)](https://parhamzm.github.io/)
[![No dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)](#)

Personal academic website of **Parham Zilouchian Moghaddam** — AI researcher, University of Tehran.

Live at **https://parhamzm.github.io/**

A single-page static site: no build step, no framework, nothing to install.
Plain HTML, CSS and vanilla JavaScript, so GitHub Pages serves it as-is.

---

## Files

```
index.html                the whole site (all content lives here)
404.html                  not-found page
robots.txt                search-engine directives
sitemap.xml               sitemap for search engines
.nojekyll                 tells GitHub Pages to serve files verbatim
.gitignore                OS, editor and tooling clutter
LICENSE                   Apache License 2.0
NOTICE                    attribution + what the licence does not cover
assets/
  style.css               design system — light + dark themes
  script.js               theme toggle, nav, scroll spy, reveals, BibTeX copy
  profile.jpg             your photo (also .webp versions for speed)
  profile.webp
  profile-480.webp
  og-image.png            1200×630 social preview card
  favicon.svg             browser tab icon
  apple-touch-icon.png    iOS home-screen icon
  Parham_Zilouchian_Moghaddam_CV.pdf
```

> The dated CV draft in the project folder (`Parham_ZM_CV_*.pdf`) is deliberately
> **not** tracked — see `.gitignore`. The published copy is the one in `assets/`.

---

## Publishing to GitHub Pages

The repository **must** be named `parhamzm.github.io` for the site to appear at that address.

### First time

The repository is already initialised and committed locally, so only two commands remain:

```bash
cd "path/to/this/folder"

git remote add origin https://github.com/parhamzm/parhamzm.github.io.git
git push -u origin main --force
```

`--force` is needed only the first time, because the repository already contains the old site.
**It replaces that content with this one** — the old site's files will no longer be on `main`.
If you want to keep them, tag the old version first:

```bash
git fetch origin
git tag old-site origin/main && git push origin old-site
```

Then in GitHub: **Settings → Pages → Build and deployment → Source: “Deploy from a branch”**,
branch `main`, folder `/ (root)`. Save. The site is live in about a minute.

### Every update afterwards

```bash
git add .
git commit -m "Update publications"
git push
```

---

## Getting found on Google

The page already ships with everything a search engine needs: a name-first `<title>`, a
meta description, canonical URL, `robots` directives, a sitemap, Open Graph and Twitter card
tags, and **schema.org structured data** describing you as a `Person` (with your ORCID, Scholar,
GitHub and LinkedIn as `sameAs` identity signals) plus each publication as a `ScholarlyArticle`.
That is what lets Google connect this page to your name and, in time, show a knowledge panel.

Three things only you can do, and they matter more than anything else:

1. **Submit the site to Google Search Console** — <https://search.google.com/search-console>.
   Add `https://parhamzm.github.io/` as a URL-prefix property. Verify with the HTML-tag method:
   Google gives you a `<meta name="google-site-verification" ...>` tag; paste it into
   `index.html` just below the `<title>` line, push, then click Verify. Afterwards use
   **Sitemaps** to submit `sitemap.xml`, and **URL Inspection → Request indexing** on the
   homepage. Indexing usually takes a few days.

2. **Link to the site from profiles Google already trusts.** Add
   `https://parhamzm.github.io/` to your Google Scholar profile (Homepage field), ORCID,
   LinkedIn, GitHub bio, and your Medium and YouTube about pages. Inbound links from those
   domains are the single strongest signal that this page is *the* page for your name.

3. **Keep it fresh.** Add an entry to the *Recent News* section whenever something happens.
   Google favours pages that change; an academic homepage that has not moved in two years
   slowly drifts down the results.

Optional: also add `https://parhamzm.github.io/` to Bing Webmaster Tools — it feeds DuckDuckGo too.

---

## Editing the content

Everything is in `index.html`, in clearly labelled sections:

| Section | Search for |
|---|---|
| Hero / intro | `<!-- ═══ HERO` |
| About + interests | `id="about"` |
| Recent news | `id="news"` |
| Research experience | `id="research"` |
| Publications | `id="publications"` |
| Industry experience + skills | `id="experience"` |
| Education + honors | `id="education"` |
| Teaching | `id="teaching"` |
| Projects | `id="projects"` |
| Certificates, workshops, activities | `id="certificates"` |
| References & contact | `id="contact"` |

**Add a news item:** copy an `<li>` inside `<ol class="news">` and put it at the top.
Keep the `datetime` attribute in ISO form (`2026-07`) — search engines read it.

**Add a publication:** copy an existing `<li class="pub" id="pub-N">` block, change the number,
title, authors, venue and links. If it has a DOI, also update the `<pre class="bibtex">` block
inside it so the **BibTeX** button copies the right citation, and add a matching
`ScholarlyArticle` entry to the JSON-LD block in `<head>`.

**Add a certificate:** copy a `<article class="cert-card">` block into the relevant grid.

**Update the CV:** replace `assets/Parham_Zilouchian_Moghaddam_CV.pdf`, keeping the same
filename — every download button then points at the new file automatically.

**Change your photo:** replace `assets/profile.jpg` (square, ~600×600). Delete
`profile.webp` and `profile-480.webp` if you do not have WebP versions of the new photo —
the site falls back to the JPG. If the photo is missing entirely, a clean “PZ” monogram
appears instead; nothing breaks.

**Regenerate the social preview card** after a big change: the `og-image.png` is just a
1200×630 screenshot. Any design tool works, or ask Claude to rebuild it.

---

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

---

## Design notes

- **Two themes, both deliberate.** Light is warm paper with hairline rules; dark is a deep
  violet-black with layered surfaces and a top-edge highlight on cards. The site follows the
  visitor's system setting, and the header toggle overrides it — remembered between visits,
  applied before first paint so there is never a flash of the wrong theme.
- **Type:** Newsreader (serif) for headings and lead copy, Inter for everything else, on a
  fluid scale that adapts continuously between phone and desktop.
- **Accessibility:** every text/background pair meets WCAG AA contrast in both themes;
  full keyboard navigation with visible focus rings; animations disabled automatically for
  visitors who prefer reduced motion.
- **Print:** `Cmd/Ctrl + P` produces a clean black-on-white document — useful as a handout.
- The only external requests are Google Fonts. To go fully self-contained, delete the two
  `fonts.googleapis.com` / `fonts.gstatic.com` `<link>` tags — the site falls back to
  Georgia + system sans and still looks good.

---

## Mobile

The layout was tested at **320, 360, 390, 414, 430 and 768 px** with real narrow viewports,
and checked for horizontal overflow at every one — there is none, so the page never
scrolls sideways or zooms out on a phone.

What that involved:

- **Nothing forces a minimum width.** Every card grid uses `minmax(min(Npx, 100%), 1fr)`,
  so tracks shrink instead of overflowing on small screens.
- **The header adapts.** Below 430 px the full name is replaced by “P. Z. Moghaddam”, and the
  section links collapse into a menu that closes on tap, on `Esc`, or on an outside tap.
- **Touch targets.** A `@media (pointer: coarse)` block enlarges every button, chip, pill and
  menu item to at least 44 × 44 px on touch devices, while leaving the desktop layout compact.
- **Notched phones.** `viewport-fit=cover` plus `env(safe-area-inset-*)` padding keeps content
  clear of the rounded corners, the camera notch and the home indicator, including in landscape.
- **Long strings wrap.** DOIs, arXiv IDs and email addresses break rather than push the page wide.

If you edit the layout, re-check it at 320 px — it is the tightest real device width
(iPhone SE) and the first place an overflow shows up.

---

## License

Licensed under the **Apache License, Version 2.0** — see [LICENSE](LICENSE).

That covers the *code*: the HTML structure, the CSS design system and the JavaScript. You are
free to reuse it, including commercially, provided you keep the copyright and licence notice.

It does **not** cover the personal material shipped alongside it — the photograph, the CV, the
biography, and the publication list. Those remain the property of the copyright holder; replace
them with your own if you build on this. See [NOTICE](NOTICE) for the specifics.

Typefaces (Newsreader, Inter) are loaded from Google Fonts and licensed under the
SIL Open Font License 1.1; they are not redistributed here.
