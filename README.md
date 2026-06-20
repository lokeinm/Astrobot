# Astrobot — Daily Sky Almanac 🌙

A single-file astrology suite built around a **personalized daily transit reading** from your
real birth chart — plus a forecast, an interactive chart wheel, a full natal blueprint,
compatibility (synastry + composite), and tarot. Mystical but grounded, encouraging, never fear-based.

**Live:** <https://lokeinm.github.io/Astrobot/>

- **Real astronomy** — true planetary positions, Moon phase, retrogrades, aspects and your
  Ascendant/houses, computed in the browser with [`astronomy-engine`](https://github.com/cosinekitty/astronomy)
  (Swiss-Ephemeris-grade accuracy). Verified against standard ephemerides.
- **100% client-side & private** — your data never leaves your phone; it's saved in
  `localStorage`. No server, no account, no API key, free forever.

Everything lives in **`index.html`** (HTML + CSS + JS in one file).

---

## Features

### Daily reading
A **12-section** read — Daily Energy Theme · Key Transits · Where the Sky Is in Your Houses ·
What's Working in Your Favor · What to Look Out For · Best Moves · Money & Career · Love & Social ·
Emotional & Spiritual · Power Window · Affirmation · Final Guidance. Each key transit shows
**how long it lasts** (a plain-language window from the planet's real speed, e.g. "active for ~3
days · building toward exact") and **which houses it activates**, with house-specific guidance.

### Interactive UI
A summary **hero** (Moon phase, day theme, tappable jump chips) sits above **sticky tabs** so you
scan instead of scroll. The Transits tab opens with a **visual timeline** (building → exact →
easing, bar length = duration), and tapping your **focus goals** filters the reading. Smooth
tab/section transitions throughout.

### Today / Week / Month forecast
A toggle reframes the reading as a forward-looking **forecast**: a dated calendar of exact
transit aspects, Moon phases, sign ingresses, and retrograde stations, plus a period theme and a
date-strip timeline.

### Interactive chart wheel + natal blueprint
A tappable SVG **bi-wheel** — your natal planets (inner) and today's transits (outer) with aspect
lines; tap any planet or house for detail. Below it, a full **natal blueprint**: your Big Three
(Sun/Moon/Rising), every planet in its sign + house, element & modality balance, and major natal
aspects.

### Compatibility — synastry & composite
Save people (a roster in `localStorage`) and compare any two: a weighted compatibility score
(overall + Romance / Communication / Stability), the strongest **inter-aspects**, two-way **house
overlays**, a **synastry wheel**, and the **composite chart** (the relationship as its own
midpoint chart) with its core placements.

### Tarot
A full **78-card deck** (Major + Minor Arcana) with three spreads — Single, Three-Card, and the
10-card Celtic Cross — and optional reversed cards, each with its own meaning.

> Houses, the Rising sign, and overlays need a birth time; without one the app degrades
> gracefully (durations, planets and aspects still work, with a note).

---

## Use it on your iPhone

You just need to put `index.html` at any public URL, then "Add to Home Screen". Pick one:

### Option A — Netlify Drop (easiest, ~30 sec, free)
1. Go to <https://app.netlify.com/drop>
2. Drag the **`Astrobot` folder** onto the page.
3. Netlify gives you a URL like `https://your-name.netlify.app`.

### Option B — Val Town (free, fits your stack)
1. Create an HTTP val.
2. Have it return the contents of `index.html` with `Content-Type: text/html`.
3. Open the val's URL.

### Option C — GitHub Pages (free, permanent) — **already live**
This repo is deployed at <https://lokeinm.github.io/Astrobot/>. To update it, just
`git push`; Pages rebuilds in ~1 minute. (Setup, for reference: Settings → Pages →
deploy from `main` / root.)

### Then, on your iPhone
1. Open the URL in **Safari**.
2. Tap **Share** → **Add to Home Screen**.
3. It launches full-screen like a native app (custom icon + dark theme included).

> Want a daily push instead of opening it yourself? That's the one deferred feature —
> real notifications need a small backend (the app is intentionally serverless). A tiny
> Telegram bot / scheduled job could text you the day's theme each morning. Ask and I'll wire it.

---

## Filling in your chart

| Field | Notes |
|------|------|
| **Date of birth** | Required. |
| **Time of birth** | Optional. Blank → noon is used and houses/Moon are flagged as approximate. The more exact, the sharper. |
| **Birth place** | Type a city and tap **Find** (free Open-Meteo lookup), or enter latitude/longitude by hand. East/North = positive. |
| **Birth time zone** | The UTC offset where you were born (e.g. New York winter −5, summer −4). Needed to place planets correctly. |
| **Focus** | Optional goals (love, money, career…) that tilt the reading toward what you care about. |

Houses use the **whole-sign** system (simple, robust, widely used). Daily transits are
calculated for *right now* in your device's time zone.

---

## Accuracy notes

- Positions are geocentric, apparent, **tropical**, true-ecliptic-of-date — the standard for
  Western astrology. Spot-checked: e.g. Sun 10.8° Capricorn for 1990-01-01, today's Sun ~28° Gemini.
- Aspect orbs: conjunction 8°, opposition 8°, trine 7°, square 6°, sextile 5°.
- This is for **reflection and self-coaching only** — not medical, legal, or financial advice.
  Astrology here describes energy and possibility, never certainty. You always hold the pen.
