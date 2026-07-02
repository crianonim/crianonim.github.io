# crianonim.github.io

**Purpose:** Jan Skowronski's personal portfolio / GitHub Pages site, originally built as a Founders and Coders course application website.

**Stack:** Plain static site — vanilla HTML, CSS, and JavaScript (no framework, no build step, no package.json). Served directly by GitHub Pages.

**Run:** No build tooling. Open `index.html` in a browser, or serve the directory with any static server (e.g. `python3 -m http.server`).

**Structure (root):**
- `index.html` – single-page site with `who` / `why` / `how` sections.
- `main.css` – styles; `main.js` – interactivity (interest carousel with play/pause/next/prev + progress bar, section navigation, photo hover/click effects).
- `img/`, `mypic.jpeg`, `favicon.ico` – assets.
- `games/` – `LifeOfAlex.html`; `tyrian/` – a prebuilt/bundled game (Parcel-style hashed `index.*.js`/`.css`).
- `TODO.md` – informal notes.

**Status/Notes:** Vanilla static portfolio (NOT a Next.js or Elm app). Main content is the FAC application page; `games/` and `tyrian/` are separate embedded/linked mini-projects.
