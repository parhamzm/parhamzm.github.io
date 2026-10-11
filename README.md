# parhamzm.github.io

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-1f4e8c.svg)](LICENSE)
[![Deployed on GitHub Pages](https://img.shields.io/badge/Deployed-GitHub_Pages-24292e.svg)](https://parhamzm.github.io/)
[![No dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)](#)

Personal academic website of **Parham Zilouchian Moghaddam**, AI researcher, University of Tehran.

Live at **https://parhamzm.github.io/**

A single-page static site: no build step, no framework, nothing to install.
Plain HTML, CSS and vanilla JavaScript, so GitHub Pages serves it as-is.

---

## Files

```
index.html                the whole site (all content lives here)
404.html                  not-found page (uses absolute /assets/ paths on purpose)
robots.txt                search-engine directives
sitemap.xml               sitemap for search engines
.nojekyll                 tells GitHub Pages to serve files verbatim
.gitignore                OS, editor and tooling clutter
LICENSE                   Apache License 2.0
NOTICE                    attribution + what the licence does not cover
assets/
  style.css               design system: light + dark themes
  script.js               theme toggle, section menu, scroll spy, BibTeX
  fonts/                  self-hosted Inter + Newsreader (Latin) and their OFL licences
  profile-portrait.jpg    head-and-shoulders crop used on the page (+ .webp)
  profile.jpg             original photo (+ .webp versions); used for search results
  og-image.png            1200×630 social preview card
  favicon.svg             browser tab icon
  apple-touch-icon.png    iOS home-screen icon
  Parham_Zilouchian_Moghaddam_CV_Oct2026.pdf   current CV (linked from the page)
  Parham_Zilouchian_Moghaddam_CV.pdf           previous CV, kept for old links
```

> Working CV drafts in `MyCVs/` are deliberately **not** tracked (see `.gitignore`).
> Only the copies in `assets/` are published.

---

## Updating the CV

CV versions are kept side by side, so old links never break and the history stays visible.

1. Add the new PDF as `assets/Parham_Zilouchian_Moghaddam_CV_<Mon><Year>.pdf`
   (for example `..._CV_Jan2027.pdf`). Do not delete or overwrite older versions.
2. Replace the old filename everywhere it is linked. All five places use the same string,
   so a single search-and-replace for `_CV_Oct2026.pdf` finds them:
   the profile button and the two contact links in `index.html`, the button in `404.html`,
   and the entry in `sitemap.xml`.
3. If the CV changed any facts (titles, dates, publications), update the matching section of
   `index.html` so the site and the CV never disagree.

---

## Editing the content

Everything is in `index.html`, in clearly labelled sections, in this order:

| Section | Search for |
|---|---|
| Profile column (photo, name, CV, links) | `class="profile"` |
| About + research interests | `id="about"` |
| News | `id="news"` |
| Publications | `id="publications"` |
| Research experience | `id="research"` |
| Education + honors | `id="education"` |
| Teaching + service | `id="teaching"` |
| Industry experience + skills | `id="experience"` |
| Projects | `id="projects"` |
| Schools, workshops & certificates | `id="certificates"` |
| Contact + references | `id="contact"` |

**Add a news item:** copy an `<li>` inside `<ol class="news">` and put it at the top.
Keep the `datetime` attribute in ISO form (`2026-10`); search engines read it.

**Add a publication:** copy a `<li class="pub" id="pub-N">` block and update the number,
badge, title, authors, venue and links. Then:
- update its `<pre>` BibTeX block (the **BibTeX** button shows and copies it);
- add a matching `ScholarlyArticle` to the JSON-LD block in `<head>`;
- if numbering shifts, update the `[N]` cross-references (`class="ref"`) in About, News and Research.

Use the **official** title and author names from the publisher (Crossref/DOI page) in BibTeX.

**Add a certificate:** copy a `<li class="cert">` row into the right list, newest first.

**Change the photo:** replace `assets/profile-portrait.jpg` / `.webp` (square, ~400×400,
head and shoulders) and `assets/profile.jpg`. If you change the photo, regenerate the
social card as well.

**Regenerate the social preview card** (`og-image.png`, 1200×630) after a big change:
it is just a screenshot of a small HTML card in the site's fonts and colours.

---

## Publishing

The repository must be named `parhamzm.github.io`. GitHub Pages deploys `main`, folder `/ (root)`.

```bash
git add .
git commit -m "Update publications"
git push
```

GitHub Pages caches files for about 10 minutes. `style.css` and `script.js` are linked with a
`?v=` date suffix; bump it whenever you change them so visitors never mix old and new files.

---

## Getting found on Google

The page ships with a name-first `<title>`, a meta description, a canonical URL, a sitemap,
Open Graph and Twitter card tags, and **schema.org structured data**: a `ProfilePage` whose
`mainEntity` is you as a `Person` (with ORCID, Scholar, GitHub and LinkedIn as `sameAs`
identity signals) plus each publication as a `ScholarlyArticle`.

What only you can do, and matters most:

1. **Google Search Console** (<https://search.google.com/search-console>): add the site, submit
   `sitemap.xml`, and use **URL Inspection → Request indexing** after big updates.
2. **Link to the site from profiles Google already trusts:** Google Scholar (Homepage field),
   ORCID, LinkedIn, GitHub bio, Medium and YouTube.
3. **Keep News current.** A homepage that changes is ranked, and read, as alive.

---

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

---

## Design notes

- **Layout.** On wide screens a sticky profile column (photo, name, affiliation, CV, profiles
  and a section index) sits beside a single reading column, so a reader always knows who this
  is and where they are. Below 1024 px it becomes a compact top bar with a section menu.
- **CV-style rhythm.** Research, education, teaching, honors, skills and training share one
  left-hand date column, so the page scans like a well-set CV.
- **Type.** Newsreader (serif) for names, headings, titles and journal names; Inter for
  everything else. Running text is 16–17 px; nothing that carries content is set below 13 px.
- **Colour.** Warm paper, near-black ink and a single ink-blue accent. Every text/background pair
  passes WCAG AA in both themes (body text 12.7:1 light, 11.9:1 dark; links ≥ 8:1).
- **Accessibility.** Skip link, landmark structure, visible focus rings, `aria-current` on the
  section index, a menu that cannot be tabbed into while closed, full keyboard support, and no
  motion beyond small colour transitions (disabled under reduced-motion). axe-core reports no
  violations.
- **Performance and privacy.** Fonts are self-hosted (about 130 KB, Latin subsets) with
  metric-matched fallbacks, so there are no third-party requests and text barely shifts while
  fonts load. The page works fully without JavaScript; JS only adds conveniences.
- **Themes.** Follows the system setting; the toggle overrides it and is remembered. The theme
  is applied before first paint, so there is never a flash of the wrong one.
- **Print.** `Cmd/Ctrl + P` produces a clean black-on-white document.

## Mobile

Checked at 320, 390, 820, 1280 and 1440 px for horizontal overflow (there is none). Touch
devices get 40–44 px targets; notched phones are handled with `env(safe-area-inset-*)`.
If you edit the layout, re-check at 320 px: it is the narrowest real device width.

---

## License

Licensed under the **Apache License, Version 2.0**; see [LICENSE](LICENSE).

That covers the *code*: the HTML structure, the CSS design system and the JavaScript. You are
free to reuse it, including commercially, provided you keep the copyright and licence notice.

It does **not** cover the personal material shipped alongside it: the photographs, the CVs, the
biography, and the publication list. Those remain the property of the copyright holder; replace
them with your own if you build on this. See [NOTICE](NOTICE) for the specifics.

The self-hosted typefaces (Inter, Newsreader) are licensed under the SIL Open Font License 1.1;
their licence texts are in `assets/fonts/`.
