# shizune.dev

The website for [Shizune](https://github.com/CaduAzeredo/shizune) — a thin decision-registry
layer on top of git.

Four routes and a 404: `/`, `/method`, `/evidence` and `/roadmap`. Static, English only, no
tracking, no analytics, no forms, no cookies.

## Build

```
npm install
npm run ficha -- <path to shizune-release.json>   # copies the release card into the site
npm run arte      # favicons and the OG image
npm run portao    # the gate — everything below must be green before a deploy
npm run dev
```

**Every number on the site comes from the release card** — the `shizune-release.json` attached
to the latest release of the package, which the package's own `scripts/ficha-release.mjs`
generates on a clean checkout of the tag and checks (`--check`) against the tag's commit and its
`G` signature. `npm run ficha` copies that file, byte for byte, into `src/content/`. None of the
numbers is typed by hand, and the command that reproduces each one is printed next to it on the
page. The browser never fetches anything live: the Content-Security-Policy would not allow it.

In production, the release card is replaced by the release chain: a scheduled workflow reads the
latest public release, runs the check, and opens a pull request on a preview branch with only the
card. The merge stays with the owner.

The version number appears in one place only: `softwareVersion` in the JSON-LD of `/`.

Rows that make a claim about the outside world (the neighbors on `/evidence`, the self-audit
numbers on `/`) appear only once their source is checked. Until then they show as drafts in a
preview build and do not appear in production (`VERCEL_ENV=production`, or `PUBLICACAO=producao`
locally).

## The gate

```
npm run portao
```

Contrast measured per declared pair · the motion rules · the anti-slop scan · the publication
rule test · typecheck · lint · build · a weight budget for the first paint · and an end-to-end run
in a real Chromium that checks **a string in the body of every route, never the status alone**,
plus redirects, per-route head, a single footer, brand counts, the version only in the JSON-LD,
drafts present in preview and absent in production, zero horizontal overflow at two widths,
WCAG 2.2 target sizes, axe at WCAG 2 A+AA, visible focus, tab order against visual order, and
`prefers-reduced-motion`.

The e2e serves `dist/` through a local model of the hosting that reads this repository's
`vercel.json` — same headers, same rewrites, same 404, including the Content-Security-Policy.
A CSP violation shows up in the test instead of in production. It is a model, not the hosting:
domain redirect and certificate exist only there, and both must be re-checked after deploy,
**by reading the body**.

It drives a browser already installed on the machine; none is downloaded. Point at another
one with the `NAVEGADOR` environment variable.

## Repository contract

`AGENTS.md` — read it before editing. It is written in Portuguese, like the rest of the
instance material; the site itself is English only.

## Licence

The Shizune package is Apache-2.0. Shizune™ — the licence covers the code and does not license
the name; the package's `README.md` states the naming policy under "Trademark and naming".
