// Generates the daily Astrobot email by running the real app headlessly and scraping the reading.
// Reuses all the in-browser astronomy — no logic is duplicated here.
//
// Env (from GitHub Actions secrets):
//   BDATE  (YYYY-MM-DD, required)   BTIME (HH:MM, optional)
//   LAT, LON (numbers)              TZ (IANA, e.g. America/New_York)
//   GOALS  (comma list, optional)   SITE (file path or URL; defaults to ./index.html)
//
// Output: writes .daily/body.html, and (in CI) appends `subject=…` to $GITHUB_OUTPUT.

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, appendFileSync } from 'node:fs';
import { resolve } from 'node:path';

const {
  BDATE, BTIME = '', LAT = '', LON = '', TZ = '', GOALS = '',
  SITE, GITHUB_OUTPUT,
} = process.env;

if (!BDATE) { console.error('BDATE is required'); process.exit(1); }

const target = SITE || ('file://' + resolve('index.html'));
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto(target);
await page.waitForLoadState('networkidle');

// fill the form
await page.fill('#bdate', BDATE);
if (BTIME) await page.fill('#btime', BTIME);
if (LAT) await page.fill('#lat', String(LAT));
if (LON) await page.fill('#lon', String(LON));
if (TZ) await page.selectOption('#tz', TZ).catch(() => {});
for (const g of GOALS.split(',').map(s => s.trim()).filter(Boolean)) {
  await page.click(`button.chip:has-text("${g}")`).catch(() => {});
}
await page.click('#go');
await page.waitForSelector('.hero-line', { timeout: 30000 });
await page.waitForTimeout(800);

// scrape the reading
const data = await page.evaluate(() => {
  const txt = sel => (document.querySelector(sel)?.textContent || '').trim();
  const sectionByTitle = t => [...document.querySelectorAll('section.read')]
    .find(s => (s.querySelector('h2')?.textContent || '').trim() === t);
  const secText = t => { const s = sectionByTitle(t); return s ? (s.querySelector('p,.lead,.q')?.textContent || s.textContent).trim() : ''; };

  const date = txt('.dateline .d');
  const heroLine = txt('.hero-line');
  const theme = secText('Daily Energy Theme');
  const powerWindow = (() => { const s = [...document.querySelectorAll('section.read')].find(x => /Power Window/.test(x.querySelector('h2')?.textContent || '')); return s ? s.querySelector('.window')?.textContent.replace(/\s+/g, ' ').trim() : ''; })();
  const affirmation = secText('Affirmation');

  // key transits live in the Transits tab — read them from the DOM (all panels are in the DOM)
  const ktSec = [...document.querySelectorAll('section.read')].find(s => /Key Transits/.test(s.querySelector('h2')?.textContent || ''));
  const transits = ktSec ? [...ktSec.querySelectorAll('li')].slice(0, 4).map(li => ({
    t: (li.querySelector('.t')?.textContent || '').replace(/\s+/g, ' ').trim(),
    dur: (li.querySelector('.dur')?.textContent || '').replace(/\s+/g, ' ').trim(),
    m: (li.querySelector('.m')?.textContent || '').replace(/\s+/g, ' ').trim(),
    ex: (li.querySelector('.ex')?.textContent || '').replace(/\s+/g, ' ').trim(),
  })) : [];

  return { date, heroLine, theme, powerWindow, affirmation, transits };
});

if (errors.length) { console.error('Page errors:', errors); await browser.close(); process.exit(1); }
await browser.close();

// compose the email
const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const siteUrl = 'https://lokeinm.github.io/Astrobot/';
const transitsHtml = data.transits.map(t => `
  <li style="margin:0 0 12px;padding:0 0 12px;border-bottom:1px solid #2b3647;list-style:none">
    <div style="font-family:monospace;font-size:12px;color:#e3bd72">${esc(t.t)}</div>
    ${t.dur ? `<div style="font-size:12px;color:#9aa6b4;margin-top:2px">${esc(t.dur)}</div>` : ''}
    <div style="font-size:15px;color:#ccc4b2;margin-top:4px">${esc(t.m)}</div>
    ${t.ex ? `<div style="font-size:14px;color:#e7ddc8;margin-top:6px;padding:8px 11px;background:rgba(201,164,92,.08);border-left:2px solid #c9a45c;border-radius:0 8px 8px 0">${esc(t.ex)}</div>` : ''}
  </li>`).join('');

const html = `<!doctype html><html><body style="margin:0;background:#0e1117;padding:0">
<div style="max-width:560px;margin:0 auto;background:#0e1117;color:#ece3d0;font-family:Georgia,'Times New Roman',serif;padding:22px">
  <div style="font-family:monospace;font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#c9a45c">Astrobot · Daily Sky</div>
  <div style="font-size:22px;color:#ece3d0;margin:6px 0 16px">${esc(data.date)}</div>

  <div style="background:linear-gradient(135deg,#26324c,#171f2c);border:1px solid #33405a;border-radius:16px;padding:18px;margin-bottom:18px">
    <div style="font-size:21px;font-style:italic;color:#ece3d0;line-height:1.25">${esc(data.heroLine)}</div>
    <div style="font-size:15px;color:#ded6c4;line-height:1.55;margin-top:10px">${esc(data.theme)}</div>
  </div>

  ${transitsHtml ? `<div style="font-family:monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#c9a45c;margin:0 0 10px">Key transits today</div><ul style="margin:0;padding:0">${transitsHtml}</ul>` : ''}

  ${data.powerWindow ? `<div style="background:#171f2c;border:1px solid #2b3647;border-radius:12px;padding:14px;margin:18px 0;font-size:15px;color:#ded6c4">⚡ ${esc(data.powerWindow)}</div>` : ''}

  ${data.affirmation ? `<div style="text-align:center;font-style:italic;font-size:19px;color:#e3bd72;margin:20px 0">${esc(data.affirmation)}</div>` : ''}

  <div style="text-align:center;margin-top:22px">
    <a href="${siteUrl}" style="display:inline-block;font-family:monospace;font-size:13px;color:#0e1117;background:#c9a45c;text-decoration:none;padding:11px 20px;border-radius:999px">Open the full reading →</a>
  </div>
  <div style="font-size:11px;color:#7e8a98;font-style:italic;text-align:center;margin-top:22px;line-height:1.5">
    For reflection and self-coaching — not medical, legal or financial advice. You always hold the pen.
  </div>
</div></body></html>`;

const subject = `🌙 Astrobot — ${data.date || 'today'}`;

mkdirSync('.daily', { recursive: true });
writeFileSync('.daily/body.html', html);
if (GITHUB_OUTPUT) appendFileSync(GITHUB_OUTPUT, `subject=${subject}\n`);

console.log('Subject:', subject);
console.log('Theme  :', data.heroLine);
console.log('Transits scraped:', data.transits.length);
console.log('Wrote .daily/body.html (' + html.length + ' bytes)');
