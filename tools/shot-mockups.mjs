// Mockup-resolution verification: shoot the console at 2K and 4K (16:9).
import { launch } from './browser.mjs';
import { serve } from './serve.mjs';
const server = await serve(8138);
const browser = await launch();
for (const [name, w, h] of [['mockup-2560', 2560, 1440], ['mockup-4k', 3840, 2160]]) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h });
  await page.goto(`http://127.0.0.1:8138/?intro=0&situation=wui-breakout&phase=D`, { waitUntil: 'load' });
  await page.waitForFunction('window.engine && window.player && document.querySelector(".boot.gone")', { timeout: 120000 });
  const geo = await page.evaluate(async () => {
    // poll for the settled frame: software GL at 2K/4K renders the first cards + the
    // tools shift late — wait until the decision lane and the tools agree, then shoot
    const rect = (s) => { const el = document.querySelector(s); if (!el) return null; const r = el.getBoundingClientRect(); return [r.left, r.right, r.top, r.bottom].map(Math.round); };
    const inter = (a, b) => !a || !b ? null : Math.min(a[1], b[1]) - Math.max(a[0], b[0]) > 1 && Math.min(a[3], b[3]) - Math.max(a[2], b[2]) > 1;
    const t0 = Date.now();
    let tools, cards;
    for (;;) {
      tools = rect('.tools'); cards = rect('#cards');
      if ((!cards || cards[1] - cards[0] < 2 || !inter(tools, cards)) && document.querySelectorAll('#slots .widget').length >= 4) break;
      if (Date.now() - t0 > 20000) break;
      await new Promise((r) => setTimeout(r, 150));
    }
    return { toolsCardsOverlap: inter(tools, cards), topbar: rect('#topbar'), overflow: document.documentElement.scrollWidth > innerWidth + 1, widgets: document.querySelectorAll('#slots .widget').length };
  });
  console.log(name, JSON.stringify(geo));
  await page.screenshot({ path: `qa/${name}.png` });
  await page.close();
}
await browser.close();
server.close();
