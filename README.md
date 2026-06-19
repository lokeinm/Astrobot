# Astrobot — Daily Sky Almanac 🌙

A single-file astrology web app that gives you a **personalized daily transit reading**
from your real birth chart. Mystical but grounded, encouraging, never fear-based.

- **Real astronomy** — true planetary positions, Moon phase, retrogrades, aspects and your
  Ascendant/houses, computed in the browser with [`astronomy-engine`](https://github.com/cosinekitty/astronomy)
  (Swiss-Ephemeris-grade accuracy). Verified against standard ephemerides.
- **100% client-side & private** — your birth data never leaves your phone; it's saved in
  `localStorage`. No server, no account, no API key, free forever.
- **12-section reading** — Daily Energy Theme · Key Transits · Where the Sky Is in Your Houses ·
  What's Working in Your Favor · What to Look Out For · Best Moves · Money & Career · Love & Social ·
  Emotional & Spiritual · Power Window · Affirmation · Final Guidance.
- **Interactive UI** — a summary **hero** (Moon phase, day theme, tappable jump chips) sits above
  **sticky tabs** (Today · Transits · Houses · Life) so you scan instead of scroll. The Transits tab
  opens with a **visual timeline** (building → exact → easing, bar length = duration), and tapping
  your **focus goals** filters the reading to what's relevant. Smooth tab/section transitions throughout.
- **Transit depth** — each key transit shows **how long it lasts** (a plain-language window
  computed from the planet's real speed, e.g. "active for ~3 days · building toward exact") and
  **which houses it activates** — where the transiting planet is moving now and where your natal
  planet sits — plus house-specific guidance on how to use it. A dedicated section maps **all 10
  transiting planets to your houses** with an example for each. (Houses need a birth time; without
  one, durations still show and house details are gracefully omitted.)

Everything lives in **`index.html`** (HTML + CSS + JS in one file).

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

### Option C — GitHub Pages (free, permanent)
1. Push this folder to a GitHub repo.
2. Settings → Pages → deploy from `main` / root.
3. Visit `https://<you>.github.io/<repo>/`.

### Then, on your iPhone
1. Open the URL in **Safari**.
2. Tap **Share** → **Add to Home Screen**.
3. It launches full-screen like a native app (custom icon + dark theme included).

> Want a daily push instead of opening it yourself? That's the natural next step —
> a tiny Telegram bot / scheduled job could text you section 1 each morning. Ask and I'll wire it.

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
