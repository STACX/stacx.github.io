# STACX — Project Website & Documentation

Two self-contained static sites for **STACX (STandAloneCompleX)** — a modular
infrastructure for end-to-end agentic reinforcement learning over LLMs, diffusion
models, and agentic tasks — deployed side by side from one GitHub Pages repo:

| Site | Folder | Published URL |
| --- | --- | --- |
| Project page | `web/` | <https://stacx.github.io/web/> |
| Documentation | `docs/` | <https://stacx.github.io/docs/> |

The root `index.html` is a redirect to `web/`, so the short URL
`https://stacx.github.io/` keeps working as the project-page
entry point. Plain HTML/CSS/JS with **no build step**.

## Structure

```
.
├── index.html              # redirect → web/
├── .nojekyll               # serve files verbatim (no Jekyll processing)
├── web/                    # project page
│   ├── index.html
│   └── static/
│       ├── css/style.css
│       ├── js/main.js
│       └── images/stacx-logo.png
└── docs/                   # documentation site (14 self-contained pages)
    ├── index.html          # docs landing (Overview)
    ├── getting-started.html
    ├── architecture.html, backends.html, recipes.html   # Trainer
    ├── rollout*.html                              # Rollout
    └── environment.html, env-sandbox.html         # Environment
```

The `docs/` pages are copied verbatim from the STACX repo's `doc/` folder
(source of truth). To refresh after editing docs there:

```bash
cp <stacx-repo>/doc/*.html docs/
```

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000/web/  and  http://localhost:8000/docs/
```

## Deploy to GitHub Pages

In the repo: **Settings → Pages → Build and deployment**

- **Source:** *Deploy from a branch*
- **Branch:** `main`  ·  **Folder:** `/ (root)`  →  **Save**

Wait ~1 minute. The sites publish at the URLs in the table above.

Every subsequent `git push` to `main` re-deploys automatically — no build step or
Action required (the `.nojekyll` file ensures everything is served verbatim).

> **Note:** This repo is private. A GitHub Pages site published from it is **publicly
> accessible** to anyone who has the URL. If the Pages option is unavailable on your
> plan for a private repo, make the repo public (Settings → General → Change visibility).

## Updating the site

```bash
# edit files, then:
git add -A && git commit -m "Update site" && git push
```

## Credits

Diagrams and charts are hand-authored inline SVG (crisp at any zoom). Fonts: Inter,
Space Grotesk, JetBrains Mono (Google Fonts). Palette anchored on the STACX logo green.
