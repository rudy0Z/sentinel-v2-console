// Batch Figma export: drive every screen in tools/screens.catalog.mjs through the
// real console in headless Chromium and screenshot it. One PNG per numbered screen.
//
//   node tools/figma-export.mjs                 # all screens → qa/figma-screens/
//   node tools/figma-export.mjs --only=B03,G03  # a subset (num prefixes)
//   node tools/figma-export.mjs --out=qa/export # custom output dir
//
// Writes manifest.json alongside the PNGs (num, title, category, file, viewport, desc)
// so the Figma board can be assembled from the catalog itself.
import { launch } from './browser.mjs';
import { serve } from './serve.mjs';
import { ALL_SCREENS } from './screens.catalog.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const getArg = (name, dflt) => { const a = args.find((x) => x.startsWith('--' + name + '=')); return a ? a.slice(name.length + 3) : dflt; };
const only = getArg('only', null);
const outDir = getArg('out', 'qa/figma-screens');
const picks = only ? only.split(',').map((s) => s.trim()) : null;
const screens = picks ? ALL_SCREENS.filter((s) => picks.some((p) => s.num === p || s.num.startsWith(p))) : ALL_SCREENS;

const PORT = 8146; // never 8130/8132-8137/8145 (verify/e2e/probe/cshot territory)
mkdirSync(outDir, { recursive: true });
const server = await serve(PORT);
const browser = await launch();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const results = [];
for (const s of screens) {
  const t0 = Date.now();
  const file = `${outDir}/${s.num}-${s.id}.png`;
  const page = await browser.newPage();
  try {
    // Each screen boots pristine: wipe localStorage on every navigation so theme,
    // mic and intro state never leak between screens (lux toggles would contaminate
    // every later screen in the batch otherwise — found the hard way).
    await page.evaluateOnNewDocument(() => { try { localStorage.clear(); } catch {} });
    await page.setViewport({ width: s.vp[0], height: s.vp[1] });
    const q = s.url ? `?${s.url}` : '';
    await page.goto(`http://127.0.0.1:${PORT}/index.html${q}`, { waitUntil: 'load' });
    await page.waitForFunction('window.player && window.talon && document.querySelector(".boot.gone")', { timeout: 120000 });
    for (const a of s.actions ?? []) {
      if (a.wait !== undefined) { await sleep(a.wait); continue; }
      if (a.t !== undefined) { await page.evaluate((t) => window.player.setTime(t), a.t); await sleep(300); continue; }
      if (a.click) { await page.click(a.click).catch(() => page.evaluate((sel) => document.querySelector(sel)?.click(), a.click)); await sleep(250); continue; }
      if (a.clickPop) { await page.click(`[data-pop="${a.clickPop}"]`); await sleep(400); continue; }
      if (a.clickMatch) {
        const m = /^\/(.*)\/([a-z]*)$/.exec(a.clickMatch);
        const re = new RegExp(m[1], m[2]);
        const hit = await page.evaluate((reSrc) => {
          const re2 = new RegExp(reSrc.source, reSrc.flags);
          const el = [...document.querySelectorAll('button, .opt, .chip, [role="button"]')].find((b) => re2.test(b.textContent || ''));
          if (el) { el.click(); return true; }
          return false;
        }, { source: m[1], flags: m[2] });
        if (!hit) throw new Error('clickMatch no hit: ' + a.clickMatch);
        await sleep(350);
        continue;
      }
      if (a.key) { if (a.key.length === 1) await page.keyboard.type(a.key); else await page.keyboard.press(a.key); await sleep(350); continue; }
      if (a.eval) { await page.evaluate(a.eval); await sleep(250); continue; }
    }
    await page.screenshot({ path: file });
    results.push({ num: s.num, id: s.id, title: s.title, cat: s.cat, vp: s.vp, file: `${s.num}-${s.id}.png`, desc: s.desc, ok: true, ms: Date.now() - t0 });
    console.log(`PASS  ${s.num}  ${s.title}  (${Date.now() - t0}ms)`);
  } catch (e) {
    results.push({ num: s.num, id: s.id, title: s.title, cat: s.cat, vp: s.vp, file: `${s.num}-${s.id}.png`, desc: s.desc, ok: false, error: String(e).slice(0, 300), ms: Date.now() - t0 });
    console.log(`FAIL  ${s.num}  ${s.title}  — ${String(e).slice(0, 160)}`);
  }
  await page.close();
}

writeFileSync(`${outDir}/manifest.json`, JSON.stringify({
  generated: 'sentinel figma export',
  count: results.length,
  ok: results.filter((r) => r.ok).length,
  screens: results,
}, null, 1));
console.log(`\n${results.filter((r) => r.ok).length}/${results.length} screens exported → ${outDir}/`);
await browser.close();
server.close();
