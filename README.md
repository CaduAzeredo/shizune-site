# shizune.dev

The website for [Shizune](https://github.com/CaduAzeredo/shizune) — a thin decision-registry
layer on top of git.

Two routes and a 404: `/` and `/method`. Static, English only, no tracking, no analytics, no
forms, no cookies.

## Build

```
npm install
npm run ficha     # measures the public package at its published tag
npm run arte      # favicons and the OG image
npm run portao    # the gate — everything below must be green before a deploy
npm run dev
```

`npm run ficha` needs the [GitHub CLI](https://cli.github.com/) authenticated: it asks GitHub
which release is marked Latest, clones the public package, checks out that tag and runs the
three commands the page prints. **Every number on the site comes from that run.** None of them
is typed by hand, and the command that produces each one is printed next to it on the page.

## The gate

```
npm run portao
```

Contrast measured per declared pair · the motion rules · the anti-slop scan · typecheck ·
lint · build · a weight budget for the first paint · and an end-to-end run in a real Chromium
that checks **a string in the body of every route, never the status alone**, plus redirects,
per-route head, a single footer, brand counts, zero horizontal overflow at two widths, WCAG
2.2 target sizes, axe at WCAG 2 A+AA, visible focus, tab order against visual order, and
`prefers-reduced-motion`.

The e2e serves `dist/` through a local model of the hosting that reads this repository's
`vercel.json` — same headers, same rewrite, same 404, including the Content-Security-Policy.
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
