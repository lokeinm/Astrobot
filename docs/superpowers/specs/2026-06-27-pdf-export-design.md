# PDF Export of the Reading — Design

**Date:** 2026-06-27
**Status:** Approved (design); pending spec review

## Goal

Add a one-click "Export PDF" button that produces a real, downloadable `.pdf` of the
**full reading** (all tabs flattened into one document, including the chart wheel),
for the daily reading, the week/month forecast, and the synastry/compatibility view.

## Constraints

- Single-file app (`index.html`): HTML + CSS + JS in one file. Keep it that way.
- Client-side only — no server, no account, no API key. Data never leaves the browser.
- Consistent with the existing CDN ESM import pattern (`astronomy-engine` from `esm.sh`).
- Must not slow down normal page loads.

## Scope

- **Content:** whole reading — every section across all tabs, in document order, plus the
  chart wheel(s). Method: `jsPDF` + `html2canvas`.
- **Views covered:** daily reading, week/month forecast, synastry. All three render through
  the single `render()` function, so one button covers all of them.
- **Out of scope:** tarot and the compatibility roster screen (separate render paths, not
  requested). Print-stylesheet approach (rejected in favor of a real downloadable file).

## Entry point

A new `⤓ Export PDF` button is appended to the existing `footer-btns` block in `render()`
(~`index.html:1478`), alongside the existing ghost buttons. It appears in all three views.

## Libraries (lazy-loaded)

Imported dynamically only on first click, from `esm.sh` (same CDN as `astronomy-engine`):

- `jspdf` — PDF construction.
- `html2canvas` — DOM rasterization.

Dynamic `import()` keeps them out of the initial page load. While loading + rendering, the
button shows `Exporting…` and is disabled. A `try/catch/finally` restores the button and
shows an inline error message (e.g. when offline) on failure.

## Export sheet (core)

Capturing the live tabbed UI is unreliable (only the active panel is visible; the rest are
`display:none`). Instead, build a **dedicated offscreen container** and capture that:

- A hidden `<div class="pdf-sheet">` positioned offscreen (e.g. `position:fixed; left:-9999px`),
  fixed print-friendly width (~720px), dark background matching the app.
- Populated from the same `data` object `render()` already holds, in document order:
  **dateline → hero → every section (`data.sec`, in tab order, ignoring the tab split) →
  footer credit line** ("Astrobot · <site URL> · generated <date>").
- **Excluded:** tab bar, mode toggle (Today/Week/Month), goal-filter bar, and the
  re-read/edit/back footer buttons — interactive chrome, not content.
- Built fresh per export and removed in `finally` (no stale DOM).
- Avoid `backdrop-filter` and other html2canvas-hostile CSS in the sheet's styling. The app's
  CSS uses plain colors, gradients, box-shadows, and CSS variables (no `oklch`/`color-mix`),
  which html2canvas handles. Google Fonts are already loaded in the page.

## Chart wheel handling

html2canvas is unreliable with inline SVG, so convert deterministically before capture:

1. Serialize the wheel `<svg>` (via `XMLSerializer`) → `data:image/svg+xml` URL.
2. Draw it onto an offscreen `<canvas>` (`Image.onload` → `drawImage`).
3. Produce a PNG `<img>` and place it into the export sheet under the wheel's section.

For synastry (two wheels: synastry + composite) run the routine per wheel. If conversion
fails for any wheel, catch it and omit that wheel rather than failing the whole export.

The wheel SVG(s) are embedded directly in section HTML (the `tab:"chart"`/`tab:"life"`
sections carry `<svg class="wheel">`), so they arrive in the export sheet automatically when
sections are copied in. The builder simply queries the built sheet for `svg.wheel` elements
and replaces each in place with its PNG `<img>` before html2canvas runs. The forecast view
has no wheel section, so there is nothing to convert there.

## Canvas → multi-page PDF

- `html2canvas(sheet, { scale: 2, backgroundColor: <app bg color> })` → one tall canvas.
- Slice the canvas across **A4 portrait** pages: compute the page height in canvas pixels
  from the A4 aspect ratio and the sheet width, then draw each vertical slice onto its own
  jsPDF page so content flows across pages (no single squished image).
- Save:
  - Reading/forecast: `astrobot-reading-YYYY-MM-DD.pdf`
  - Synastry: `astrobot-synastry-<A>-<B>-YYYY-MM-DD.pdf` (names sanitized for filesystem)
- `doc.save(filename)` triggers the download.

## Error handling

- Offline / CDN failure on dynamic import → caught; button restored; inline error shown.
- Wheel conversion failure → that wheel omitted; export continues.
- `finally` always removes the offscreen sheet and re-enables the button.

## Testing

No automated test harness exists in this single-file app; verification is manual in-browser:

1. Daily reading → Export → PDF downloads, multi-page, includes wheel, text legible.
2. Week and Month forecast → same checks.
3. Synastry → both wheels present, correct filename.
4. Offline → graceful error, button restored.

Verify in-browser before declaring complete.
