<!-- Copilot / AI agent instructions for the Random-Surrealism repo -->
# Copilot instructions — Random Surrealism

Purpose: give AI coding agents the minimal, actionable context needed to make safe, productive edits in this repository.

- **Big picture:** a small frontend-only project that procedurally generates surrealist artwork in the browser using an HTML5 `<canvas>` element. The codebase is intentionally simple: `index.html` (markup and UI hooks), `style.css` (visual design), and `script.js` (all rendering logic and UX behaviour).

- **Where to look first:**
  - `index.html` — document structure and interactive element IDs (`#artCanvas`, `#generate-btn`, `#download-btn`).
  - `script.js` — the entire rendering pipeline. Key symbols: `generateArt()`, `downloadArt()`, `colorPalettes`, `canvasWidth`, `canvasHeight`, and the keyboard handlers for `g`/`d`.
  - `style.css` — visual tokens and layout, css variables in `:root` define the theme and gradients.

- **Primary flows you may change or extend:**
  - To change canvas resolution or initial render size, edit `canvasWidth` / `canvasHeight` in `script.js`.
  - To add or adjust palettes, modify the `colorPalettes` array in `script.js` (each entry includes `colors` and `bg`).
  - To adjust shapes or rendering density, edit the loops inside `generateArt()` (look for `shapeCount`, `drawCircle`, `drawRectangle`, `drawPolygon`, etc.).

- **Conventions and patterns (repo-specific):**
  - Single-file application logic lives in `script.js` — there is no bundler or module system; prefer minimal, backward-compatible edits (ES5/ES6 friendly) and avoid introducing build tooling unless requested.
  - UI control state is managed via DOM classes and attributes: `generate-btn` toggles `loading` and `disabled`; `download-btn` is enabled after generation.
  - Random utilities are local functions: `randInt()`, `randFloat()`, `randomFromArray()` — reuse these rather than adding new randomness helpers unless necessary.
  - Accessibility is respected with `aria-*` attributes and a `.visually-hidden` helper — preserve these when editing markup.

- **Developer / runtime notes:**
  - No build step: run by opening `index.html` or serve with a static server. Quick commands (from repo root):
    ```powershell
    # Simple local HTTP server (Python)
    python -m http.server 8000

    # Or Node static server (if available)
    npx http-server -c-1 .  
    ```
  - The project is deployed on Vercel (see the `/_vercel/insights/script.js` include); avoid removing the insights script unless instructed.

- **Integration points & external deps:**
  - Google Fonts (`Playfair Display`, `Inter`) are loaded in `index.html`.
  - A Vercel insights script is loaded via `/ _vercel/insights/script.js` (deployed environment). There is also a small `window.va` analytics shim which can be left alone.

- **Testing and verification:**
  - Visual/functional verification is manual: open `index.html` in a browser, use the `Create Masterpiece` button, and check that images download and keyboard shortcuts `g` and `d` work. There are no automated tests in the repository.

- **Safe edit checklist for PRs:**
  - Run the page locally and visually confirm the canvas renders new art on load and on clicking `Create Masterpiece`.
  - Confirm `Download Art` produces a PNG (check filename pattern `ethereal-canvas-<timestamp>.png`).
  - Preserve ARIA attributes and `skip-link` for accessibility.
  - If changing color values or palettes, ensure background contrast remains legible for overlaid text.

- **Examples of quick tasks & where to implement them:**
  - Add a new color palette: append an object to `colorPalettes` in `script.js` with `name`, `colors`, and `bg` keys.
  - Add a new shape type: implement a small `drawX()` helper in `script.js` and call it from the `generateArt()` switch-case.
  - Add a UI control: update `index.html` (control markup), `style.css` (styles/variables), and hook behavior in `script.js`.

If anything here is unclear or you want more detail (tests, CI, or refactor guidance), tell me which area to expand and I will iterate the file.
