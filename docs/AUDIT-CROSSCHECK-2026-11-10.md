# Cross-check — `VISUAL_CRAFT_AUDIT.md` vs `docs/VISUAL-CRAFT-AUDIT-2026-11-10.md`

**Reviewed:** `VISUAL_CRAFT_AUDIT.md`, current 1,345-line version (mtime 2026-11-10 17:16; the file changed twice during review, so earlier snapshots are not being judged).  
**Compared against:** my audit, `docs/VISUAL-CRAFT-AUDIT-2026-11-10.md`.  
**Method:** every code claim was checked against `console.css`, `commandConsole.ts`, `tools/verify.mjs`, `tools/browser.mjs`, `git status`, and `verify_run.log`.

> **Moving target / final-pass ledger:** the reference file was edited at 17:15 and 17:16 while this cross-check was being written. The settled 1,345-line version fixed several things I flagged in earlier drafts, and they are credited here rather than re-litigated:
> - battery `<25%` now maps to `--needs` amber (red discipline);
> - `--surface-*` and the keycap/battery borders are tokenised;
> - `--map-vignette` and `--kbd-key-color` are defined;
> - the 240°/270° gauge contradiction and start-origin drift are fixed with a fixed `rot = 150°`;
> - all 10 CSS blocks now scan clean for raw literals outside `:root` (independently verified: 0 hits);
> - the beacon keyframe is now transform/opacity only;
> - I ran `npm run verify` on the settled tree: **45/45 passes**.
>
> What still reproduces is listed below. The headline is that "100% tokenised" is not the same as "defined": `var(--glow-amber)` is tokenised, but the token does not exist.

---

## Verdict

The reference audit is **directionally right and operationally unsafe**. Its visual instincts are strong — it identifies the same flat-card / no-glow / no-vignette problem set — but its "production-ready" CSS and TS are not production-ready: several declarations are invalid, two flagship components silently lose their shadows, the card treatment reverses a documented readability guard, and the verification suite validates the untouched app rather than the proposed CSS. The final hardening pass fixed the raw-hex, red-discipline, gauge-math, and compositor-keyframe issues; what remains is the token-resolution and cascade layer. My audit is narrower and less theatrical, but it is applyable, preserves the existing accessibility and theme contracts, and finds the three real bugs the reference audit misses.

| Dimension | `VISUAL_CRAFT_AUDIT.md` | My audit |
|---|---|---|
| Visual direction | Strong, reference-led | Strong, reference-led |
| Code correctness | **Fails** — undefined tokens, cascade collisions, invalid shadows | Passes by construction, token-only |
| Design-system integrity | Breaks provenance, daylight, red discipline, density floors | Preserves all four |
| Accessibility | Ignores reduced-motion/transparency/contrast; 9.5px badges | Explicit parity + floors |
| Layout safety (1280×800) | Ignores the COA height guard and topbar budget | Treats 1280×800 as the binding constraint |
| Implementation wiring | Mostly un-wired "drop-in" helpers | Line-level call sites + data contracts |
| Verification | Claims 45/45 (reproducible), but the log was stale and "Playwright" is false; drop-in CSS is unverified because it was never applied | Checklist + commands; ran the suite; no fabricated evidence |
| Real bugs found | 0 of 3 (`.card h1`, daylight CTA, dead `.kpis`) | 3 of 3 |

**Recommendation:** adopt six ideas, reject the code. Use my §4 as the base, then merge the two-tier specular, stipple fill, battery cap, and azimuth-ring concept from the reference audit.

---

## 1. Where the two audits agree (both correct)

These are real defects; either audit can be used to justify the fix.

- `.card` has no specular rim and no elevation of its own (`console.css:639`), while `.glass` does (`:390`) and `.chat` gets the diagonal rim (`:567`).
- State cards use an inset stroke + tinted border but no perimeter bloom (`console.css:645–646`).
- The primary CTA is a bevelled gradient key, not the flat inverted pill in Linear/Vercel (`console.css:402–404`, `:212–217`).
- `.kbd` / `.opt .k` are inconsistent keycaps (`console.css:411` vs `:681`).
- `.prov` badges are thin outlines with no fill or spine (`console.css:433–436`).
- The map has fog but no screen-space vignette (`terrainEngine.ts:4598–4601`; no `#map::after`).
- Route loss, containment, and ROS are text, not instruments (`commandConsole.ts:1077–1090`, `:1439–1453`).
- The L2 widgets already contain real micro-instruments; the L1 deck and decision cards do not.

---

## 2. Blocking defects in the reference audit's drop-in code

### B1 — Undefined tokens invalidate the two most important cards

`--glow-amber` and `--glow-red` are used at `VISUAL_CRAFT_AUDIT.md:362, 367, 709, 847, 852, 963`, but the file only defines `--glow-amber-emissive` and `--glow-crimson-emissive` (`:779–783`). There is no `--glow-amber:` or `--glow-red:` definition anywhere.

CSS custom-property substitution failure invalidates the **entire declaration**, not just the missing component. So:

```css
.card.needs {
  box-shadow: var(--shadow-card-elevated), 0 0 24px -2px var(--glow-amber), var(--specular-top-bright) !important;
}
```

computes to `box-shadow: none`. The "needs you" and "critical" cards lose the elevation **and** the specular highlight in the same declaration. The reference audit's flagship upgrade produces a flatter state card than the current code.

The same class of bug appears at `--p-alpha-w-16` (`:771, 794, 957`), which does not exist in the alpha ladder (`console.css:58–75` stops at `.12` then `.18`). Consequences:
- `--border-subtle-white` is invalid → `.battery-capsule` loses its border.
- `--kbd-border` is invalid → `.kbd` loses its top/side border (the separate `border-bottom` survives).
- `.prov.measured` loses its outer glow.

**Fix:** define the glow tokens once, and use `--p-alpha-w-18` or `.12`. Then validate with a custom-property existence check.

### B2 — `.card::before` collides with the state rail, and `overflow: hidden` clips it

The reference audit adds a top specular gradient on `.card::before` (`:833–842`) and `overflow: hidden` on `.card` (`:830`).

But `::before` is already the state rail:

```css
/* console.css:640 */
.card.needs::before, .card.critical::before { content: ""; position: absolute; left: -1px; ... width: 2px; }
```

Two failures follow:
1. `.card.needs::before` (specificity 0,2,1) beats `.card::before` (0,1,1), so the specular gradient **does not render on the state cards** — exactly the cards the audit showcases in its before/after.
2. `overflow: hidden` clips the rail at `left: -1px`, so the 2px amber/red cue **disappears**.

Net result for `.card.needs`: no rail, no specular, no elevation (B1), only a full-saturation 1px amber border. That is the "muddy alarm box" the audit set out to remove.

**Fix:** deliver the specular with `box-shadow: inset 0 1px 0 ...` (no pseudo-element), and do not set `overflow: hidden` on `.card`.

### B3 — 78% opacity + 18px blur reverses a documented readability decision

`console.css:639` carries an explicit comment:

> `near-opaque - map features must not bleed through the COA rows`

The reference audit sets:

```css
.card {
  background: rgba(22, 25, 34, 0.78) !important;
  backdrop-filter: blur(18px) saturate(180%) !important;
}
```

That is a deliberate reversal of the guard, on the highest-density text surface in the product. With a moving 3D terrain behind 22% transparency, the COA table, gate copy, and provenance rows lose contrast against bright ridges and smoke. The existing suite already collapsed the COA on short viewports because vertical space is scarce; adding 18px blur does not restore legibility.

The contrast section (`:1326–1329`) measures `#ECEEF2` on an **opaque** `#161922`. That is not the delivered composite. The actual background is 78% `#161922` + 22% terrain. `--text-4` at 5.16:1 can fall below 4.5:1 over a bright ridge. The repo's own `--text-4` check composites against the live surface (`tools/verify.mjs:390–399`) precisely because of this.

**Fix:** keep the near-opaque card (`var(--bg-surface-2)` at ~92%), add an 8px blur only as a texture, and let the rim light carry the glass read. This is what my audit does.

### B4 — `!important` defeats the preference and theme layers

The suite is blanket `!important`. The repo deliberately supports:

- `prefers-reduced-transparency` (`console.css:357–359`)
- `prefers-contrast: more` (`:362–365`)
- `prefers-reduced-motion` (`:342–356`)
- `:root[data-theme="daylight"]` (`:1143–1243`)

The reference suite:
- Adds `backdrop-filter` to `.card` but never adds `.card` to the reduced-transparency block → the preference is ignored on cards.
- Forces `background` and `backdrop-filter` with `!important`, so a future `prefers-contrast` override on `.card` would lose.
- Adds a continuous `beacon-composite-pulse` on `::after`; the reduced-motion block does not target that pseudo-element, so the loop survives.
- Redefines `--surface-sunken`, `--surface-hover`, `--surface-pressed` in `:root` (`:762–764`). Those three tokens already exist and are theme-aware (`console.css:188–190`). `--surface-sunken` is never re-declared in the daylight block, so it resolves to dark `var(--p-slate-1)` on a light theme: every field, dissent box, time lens, and battery well becomes a black hole in Field High-Lux.
- Sets `--btn-primary-inv-bg: var(--p-slate-12)` (`:796`) and applies it with `!important` (`:880`). Primitives are theme-independent, so the primary pill stays white in daylight — the exact ~1.05:1 failure my audit flags, now locked in.

**Fix:** no `!important`; add `.card` to the three preference blocks; add a daylight override that inverts the primary to ink; do not redeclare `--surface-sunken/hover/pressed`.

### B5 — `.opt.rec` as a white pill is an authority-model regression, not just a double-primary

The reference audit applies the inverted pill to **both** `.btn.primary` and `.opt.rec` (`:879`). In Sentinel, `.opt.rec` is TALON's **recommended option**, not the operator's decision (`commandConsole.ts:728`, `console.css:684`). Making it the brightest object in the card:

1. creates two white primaries in the same card (the recommended option and the actual CTA);
2. biases the operator toward TALON's recommendation at the exact moment the product's thesis is "TALON recommends, the operator decides" (`AUDIT.md`, authority ladder).

The reference product (Linear) puts the white pill on the **single** committing action, not on a suggestion. This is the most consequential design error in the document because it changes the meaning of the interface, not just its look.

**Fix:** keep `.opt.rec` as a neutral raised row with the inverted keycap; put the white pill only on the committing button.

---

## 3. Semantic and craft regressions

### S1 — Provenance is remapped onto state colours
The reference audit sets `measured → --plan-committed` (cyan), `modeled → --needs` (amber), `authored → --talon` (violet) (`:954–969`). The system deliberately keeps provenance orthogonal: `--prov-measured #8FC6FF`, `--prov-modeled #FFB089`, `--prov-authored #C9B8FF` (`console.css:126–128`, `:433–436`), with the rule "one meaning each, never reused for decoration" (`:114`).

Sharing amber between "modeled" and "needs you" means a modeled number can be misread as an action item. Sharing cyan with "plan committed" means a measurement can be misread as an order. This collapses the epistemic layer the product is built on.

**Fix:** keep the `--prov-*` hues; add the capsule geometry and spine, not the state colours.

### S2 — 9.5px provenance violates the documented legibility floor
`--fs-badge: 10.5px` is described as the "legibility floor" (`console.css:260`). The reference audit forces `.prov` to `9.5px !important` (`:937`). That is a regression, not a refinement.

### S3 — 20px pill height inflates dense 11px rows
`.prov` is used inline in `.basis` (12.5px), `.wx .cell small` (11px), and `.srow`. A fixed 20px capsule is taller than the line it annotates, stretching the weather cells and the card basis rows. In the deck, the existing CSS hides `.prov` below 1560px (`console.css:826`), so the effect is width-dependent and inconsistent.

**Fix:** keep provenance inline (`padding: 2px 5px`, no fixed height), as in my §4.6.

### S4 — White-core dots lose the at-a-glance state code
The reference audit sets `.dot.working/.needs/.critical { background: white }` and adds a halo only to `.working` and `.critical` (`:856–870`). Consequences:
- `needs` gets a white core but **no halo** — the most important state gets the least treatment.
- `done` and `idle` stay coloured, so the dot system becomes asymmetric in a new way.
- The halo uses `background: inherit` on `::after`, which inherits the dot's **white** background, not the state hue; `currentColor` resolves to the inherited text colour (near-white on cards). The "chromatic halo" is white-on-white.
- `.dot.working` still carries the existing `breathe` animation (`console.css:421`), so it now pulses twice, out of phase.
- **Credit:** the keyframe itself is now transform/opacity only, so the "Composite-Only" heading is accurate. The remaining problem is the halo colour, not the animation property.

**Fix:** keep the state-coloured core; add a soft ring/halo via `box-shadow` with the state token. If a white core is desired, set the halo colour explicitly, not via `inherit`.

### S5 — Full-saturation state borders are an overcorrection
`.card.needs { border-color: var(--needs) }` (`:846`) replaces a 26% mix with 100% amber. The design principle is documented: "one accent, never a full coloured frame" (`console.css:638`). A 1px fully saturated amber rectangle is the "alarm box" look, not a perimeter bloom. The glow should carry the signal; the border should stay a tint.

### S6 — Black drop shadows do not create elevation on a near-black canvas
`--shadow-card-elevated: 0 16px 40px -4px rgba(0,0,0,.60), 0 4px 12px -1px rgba(0,0,0,.50)` (`:775`). On `#07080B`, a black shadow has almost no perceptual effect; it mostly muddies the terrain. In daylight it becomes a heavy dark halo. Dark-mode elevation is carried by surface lift + top specular + a tight ambient shadow, not a 40px black bloom.

### S7 — The "squircle" thesis is not implemented
The audit argues for Linear/Keyclear squircle geometry, then keeps `border-radius: var(--r-lg)` = **10px** (`:827`). No larger `--r-card` is introduced. The card radius is unchanged from today.

---

## 4. Code-level bugs in the TypeScript suite

### T1 — `renderTacticalSparkline` is neutralised by existing CSS
It emits `class="spark"` with inline `width`/`height` attributes and a `stroke` presentation attribute (`:1214–1217`). The existing CSS fixes the box and the stroke:

```css
.spark { width: 54px; height: 14px; flex: none; }        /* console.css:930 */
.spark polyline { stroke: var(--icon); }                 /* console.css:931 */
```

CSS rules beat presentation attributes, so `options.width`, `options.height`, and `options.color` are ignored. It also duplicates the existing `spark()` (`commandConsole.ts:1395`).

### T2 — Duplicate SVG ids in `renderElevationProfile`
The function emits `id="dotStipple"` and `id="elevGrad"` (`:1143, 1146`). If it renders more than once — route card, review, deck panel — the ids collide; `url(#dotStipple)` resolves to the first (possibly hidden) definition. Gradients/stipple can disappear or cross-reference.

### T3 — CSS variables in SVG presentation attributes are unreliable
`fill="var(--critical)"`, `stroke="var(--map-cyan)"`, `stop-color="var(--map-cyan)"`, and `font-family="var(--font-mono)"` in the marker and gradient blocks of §4.2 are not consistently supported as presentation attributes across browsers. Use `style="fill:var(--critical)"` or a class. This is a portability bug, not a style preference.

### T4 — `preserveAspectRatio="none"` distorts the choke marker
`renderElevationProfile` uses `preserveAspectRatio="none"` (`:1141`) but draws `circle` markers. Circles become ellipses when the card width differs from the 280-unit viewBox. The choke dot is the one mark that must stay crisp.

### T5 — The compass replacement breaks live bearing and reset-to-north
The existing compass is wired:

```ts
// commandConsole.ts:2696–2698
engine.on('view', (v) => { const c = $('#compassNeedle'); if (c) c.style.transform = `rotate(${-v.bearing}deg)`; });
```

and the button is `data-act="north"` (`:2866`). `renderCompassReticle` (`:1225–1248`) returns a `<div>` with no `id="compassNeedle"` and no `data-act`. Applying it removes the live rotation and the reset affordance. It also renders a 38px ring plus a `000° N` label into a 40px tool column (`--tools-w: 40px`), which will overflow.

**Fix if adopted:** keep the button and id, rotate the ring group from the same `engine.on('view')` handler, and either drop the text label or widen the tool rail.

### T6 — The arc gauge is fixed geometrically, but under-scaled and mis-specified
The 17:16 edit added a fixed `rot = 150°` and a `sweepAngle = 240` constant (`:1064–1082`), which resolves both the earlier 240/270 contradiction and the start-origin drift. Credit for the fix. Two issues remain:

- The gauge is **48px** (`:1073`), which is small for a "hero instrument" and well below the Keyclear/Aerion references (roughly 120–180px).
- The visible readout is **13px** (`:1087`), while the audit's own spec claims a "16px numeral" (`:196`). The label is **9.5px** (`:1088`), below the repo's 10.5px badge floor.

### T7 — The gauge/battery components are not wired
`renderRadialArcGauge`, `renderElevationProfile`, `renderMicroBattery`, `renderTacticalSparkline`, and `renderCompassReticle` are exported but never called. No call sites in `buildCard`, `cutCard`, `unitRow`, or `renderTopbar` are given. "Drop-in" is inaccurate; these are standalone helpers with no data adapters. `renderMicroBattery` also duplicates the existing `unitPips` (`commandConsole.ts:869`) and, if it replaces the battery cell in `unitRow`, drops the existing `spark(hist)` trend.

### T8 — The route profile has no data contract and no layout guard
The elevation profile needs `{ distKm, elevM }[]`, which is not in the scenario schema the audit cites. More critically, adding a 48px profile + 48px gauge + 20px badges to a decision card ignores the existing short-viewport guard: `coaDefaultShut = innerHeight < 1000` (`commandConsole.ts:711`) and `@media (max-height: 900px)` (`console.css:695`). At 1280×800 the options are already the element that gets clipped; ~120px of new visualization will push them below the card edge. Any adopted instrument must be collapsible or replace prose, not stack on top of it.

---

## 5. Verification claims vs. artifacts

| Claim | Artifact | Verdict |
|---|---|---|
| "git status … 100% CLEAN (Zero tracked source file modifications)" (`:1262–1264`) | `git status --short` shows **8 modified tracked files** (pre-existing at session start), plus the new audit and cross-check docs | **Misleading, not attributable.** The audit's read-only claim is plausible for its own run, but the repo is not clean. |
| "45/45 checks passed" (`:1321`) | I ran `npm run verify` on the settled tree: **45/45 passes** | **True when re-run.** The pasted log itself was not in `verify_run.log`, but the claim is reproducible. It validates the existing app, **not** the drop-in CSS (which was never applied). |
| "headless Playwright over SwiftShader" (`:1267`) | `tools/browser.mjs` imports `puppeteer-core`; `package.json` has `puppeteer-core`, no Playwright | **False.** |
| "All CSS … 100% production-ready" (`:1342`) | `--glow-amber`, `--glow-red`, `--p-alpha-w-16` undefined; `.card::before` collision; `.card` shadow invalid | **False.** |
| "Contrast 15.2:1 / 9.3:1 / 5.16:1" (`:1326–1328`) | Measured against opaque `#161922`; the delivered card is `rgba(22,25,34,.78)` over variable terrain | **Invalid method.** Worst-case composite was not tested. |
| "100% tokenised / 10/10 clean" | Independently verified: 10 CSS blocks, **0** raw literals outside `:root` | **True.** Credit — but the scan proves syntax, not that every referenced token exists. |
| "Apple Pro Apps · Anduril Lattice · Palantir Gotham" (`:9, 44`) | The reference folder contains Aerion, Linear/Cycle 13, Neurolinc, Vercel, Keyclear — **no Apple, Anduril, or Palantir images** | **Unsupported benchmark.** |
| "Aerion Tactical HUD — translucent frosted obsidian glass" (`:33`) | `Screenshot 2026-09-28 023442` is a **light-mode** white floating card; `023338` is a dark monitor with fairly opaque bottom panels | **Partly invented characterisation.** |

The verification section is structurally good — it is the right thing to include. The problem is that it presents a pre-existing repo log as proof of the proposed CSS.

---

## 6. What the reference audit gets right that mine missed

Credit where it is due. These are worth merging.

1. **Two-tier specular.** `--specular-top-hairline` (12%) for normal cards and `--specular-top-bright` (20%) for active/critical cards is a better idea than my single 12% tier. Adopt.
2. **`.sitbtn` lacks `--highlight-top`.** True (`console.css:453`). A top specular on the situation button would make the topbar feel machined. I did not call this out.
3. **The compass is a 22px needle.** True (`commandConsole.ts:2866`). My audit treated a minimap as a stretch and did not audit the compass itself. The azimuth-ring idea is a cheaper, better-targeted upgrade than a minimap — provided it preserves `id="compassNeedle"` and `data-act="north"`.
4. **Dot-stipple fill for the elevation profile.** A stipple texture is a good way to encode "measured" vs the solid/dashed "modeled" line. My profile uses a flat area fill; adopting a stipple would strengthen the provenance read.
5. **Battery cap geometry.** The little terminal cap on the 4-cell battery is a nice physical detail beyond my pips. Adopt with the existing `unitPips` thresholds and keep the sparkline.
6. **White-core beacon concept.** A white emitter core with a state-coloured halo is a real avionics pattern. The implementation in the document is broken, but the idea is worth a correct implementation on critical only.

---

## 7. What my audit gets right that theirs missed

These are the items that decide whether the pass ships.

1. **`.card h1` is unstyled.** The cut card (`commandConsole.ts:1079, 1086`) uses `<h1>`, but only `.card h2` exists (`console.css:666`). It renders at UA-default `2em` with `0.67em` margins. The reference audit's "before" wireframe does not show this, so its visual baseline is not the live DOM.
2. **The daylight primary CTA is invisible.** `--btn-primary-*` is never overridden in the daylight block (`console.css:1143–1243`); the white gradient on `#F2F0EA` is ~1.05:1. The reference audit not only misses this, it re-implements the white pill with `!important`, making the bug permanent.
3. **`.kpis` is dead CSS.** The strip is styled (`:464–467`) and responsive (`:1105, :1110, :1112`) but never emitted by `renderTopbar` (`commandConsole.ts:572–591`). The reference audit's "4-segment KPI strip" is described in a table but never implemented or wired.
4. **The 0.94-opacity readability guard.** The reference audit's 0.78 + 18px blur reverses a documented decision on the densest text surface.
5. **The 1280×800 budget.** Adding instruments without respecting the COA collapse and card max-height will clip the decisive options. The reference audit ignores this entirely.
6. **Preference parity.** Reduced motion, reduced transparency, and high contrast are first-class in this repo; the reference suite ignores or defeats them.
7. **Provenance integrity.** The reference audit collapses `--prov-*` into state hues, destroying the orthogonal epistemic layer.
8. **The right typography diagnosis.** The real issue is hierarchy (the gate deadline is 11.5px), not fabricated jitter on mono counters. `.countdown`, `.clock b`, `.batt`, `.kpi b` are all Geist Mono; digits cannot jitter. `.kpi b` is 13.5px mono (`:466`), not "28/32px Geist Sans" as the reference table claims.
9. **No fake verification.** My audit gives commands and a checklist; it does not paste a 45/45 log and call it proof.

---

## 8. Merge decision

| Item | Source | Decision |
|---|---|---|
| Card rim light + elevation + 14px radius + state bloom | Mine | **Adopt** as base |
| Near-opaque card + 8px blur (keep the 0.94 read guard) | Mine | **Adopt** |
| Two-tier specular (12% normal / 20% active) | Theirs | **Adopt** into my token set |
| `.sitbtn` top specular | Theirs | **Adopt** |
| Heroic 18px gate stake + `.card-rail` | Mine | **Adopt** |
| Flat white pill for `.btn.primary` only | Mine | **Adopt** |
| White pill on `.opt.rec` | Theirs | **Reject** — authority bias |
| Daylight ink primary override | Mine | **Adopt** |
| Keycap recipe (18–20px, 2px bottom, specular) | Both | **Adopt mine**, take their 20px variant for `.opt .k` only |
| Provenance capsule with spine + tint | Mine | **Adopt** |
| Provenance recolour to state hues | Theirs | **Reject** |
| 9.5px / 20px `.prov` | Theirs | **Reject** |
| White-core dots + `inherit` halo | Theirs | **Reject as written**; adopt the two-zone idea with explicit state colours |
| Full-saturation state border | Theirs | **Reject**; use a 24–32% tint + bloom |
| Black 40px drop shadow | Theirs | **Reject**; use surface lift + tight ambient |
| 78% alpha + 18px blur | Theirs | **Reject** |
| `.card::before` gradient / `overflow:hidden` | Theirs | **Reject** — collides with the state rail |
| Vignette + HUD marks | Both | **Adopt mine** (multi-stop + scrim), plus their corner-reticle idea is already `.hud-reg` |
| `.hud-corner` duplicate | Theirs | **Reject** — `.hud-reg` already exists and is mounted |
| Route waypoint strip + elevation | Both | **Adopt mine**; add their stipple fill |
| 270° arc gauge | Theirs | **Reject as written** (origin drift, 240/270 inconsistency); use my 180° arc or fix theirs with fixed rotation |
| Battery cap | Theirs | **Adopt** into existing `unitPips`, keep the sparkline |
| Azimuth ring compass | Theirs | **Adopt with fixes** (preserve id/act, fit the 40px rail) |
| `!important` blanket | Theirs | **Reject** |
| §2C raw-hex "exact CSS" | Theirs | **Reject** — fails the zero-raw-hex contract |
| Verification log | Theirs | **Reject** — not supported by artifacts |

---

## 9. Final recommended spec

Use my audit's §4 as the implementation base, with these three merges:

```css
/* two-tier specular (from the reference audit, tokenised) */
--specular-top-hairline: inset 0 1px 0 var(--p-alpha-w-12);
--specular-top-bright:   inset 0 1px 0 var(--p-alpha-w-20);

.card { box-shadow: var(--card-shadow), var(--specular-top-hairline); }
.card.needs { box-shadow: var(--card-shadow), var(--bloom-needs), var(--specular-top-bright); }
.card.critical { box-shadow: var(--card-shadow), var(--bloom-critical), var(--specular-top-bright); }

/* the situation button gets the same machined top edge */
.sitbtn { box-shadow: var(--highlight-top); }

/* provenance stays orthogonal: keep the --prov-* hues, add the capsule geometry */
.prov.measured { color: var(--prov-measured); }
.prov.modeled  { color: var(--prov-modeled); }
.prov.authored { color: var(--prov-authored); }

/* route profile: stipple fill for MEA, solid/dashed ridge for MOD */
.rp-stipple { fill: url(#rp-dots); }
.rp-line[data-prov="measured"] { stroke-dasharray: none; }
.rp-line[data-prov="modeled"]  { stroke-dasharray: 4 3; }
```

And two implementation rules that the reference audit skips:

1. **No instrument without a height budget.** Every added viz must be collapsible at `max-height: 900px`, and the decision card's options must remain above the clip edge at 1280×800.
2. **No new colour without a daylight override.** Any token used on a surface that exists in both themes must be re-declared in `:root[data-theme="daylight"]`.

### Bottom line

The reference audit is a **good mood board and a bad patch**. Use it for the two-tier specular, the stipple texture, the battery cap, and the azimuth-ring idea. Do not paste its CSS: it breaks the state rail, invalidates the state-card shadows, reverses the card-opacity guard, ignores the preference and theme layers, collapses provenance into state colour, and biases the operator toward TALON's recommendation. My audit is the safer base; merge the four ideas above and the result is stronger than either document alone.
