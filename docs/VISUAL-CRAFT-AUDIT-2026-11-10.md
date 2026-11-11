# Sentinel — Visual Craft & Aesthetic Audit

**Date:** 2026-11-10  
**Scope:** `index.html`, `console.css`, `tokens.html`, `commandConsole.ts`, `terrainEngine.ts`  
**Benchmarks reviewed:** Aerion Mission Control (`Screenshot 2026-09-28 023338/023431/023442`), Linear/Cycle 13 (`HUF64kYWkAAKN0G`), Neurolinc C2 (`HUmKdYRXYAAvRr8`), Vercel (`HUmf8VXW4AEBFNb`), Keyclear (`HUXgl3mbAAAtP7f`).  
**Stance:** this is a craft audit, not a rewrite. Sentinel's information architecture, provenance discipline, and token hygiene are already ahead of most tactical dashboards. The gap is **surface execution at the decision layer** — the place where the operator actually looks.

---

## 0. Verdict

Sentinel today reads as a **rigorously engineered console wearing a web-app skin**. The system is correct; the surfaces are under-articulated. The references win on four repeatable moves:

1. **Elevation without borders** — cards are lifted by shadow + radius, not outlined by a 1px stroke.
2. **One heroic number per surface** — 32–48px, tabular, with 10–11px uppercase labels orbiting it.
3. **Data as instrument, not sentence** — arcs, stems, hatched bars, dot matrices, radial ticks.
4. **Atmosphere** — vignetted map, graded terrain, HUD that floats in depth.

Sentinel has (1) partially, (2) inverted, (3) only inside the L2 panels, and (4) only distance fog.

| Vector | Score | One-line verdict |
|---|---:|---|
| 1 · Card anatomy, elevation, specular | **6.0** | Correct border, correct radius family — but no rim light, no lift, and the card sits on the wrong ramp step. |
| 2 · Tactical micro-data-viz | **5.5** | Sparklines, wind rose and endurance pips exist in L2 widgets; the decision layer is still prose and text rows. |
| 3 · Typography, tabular precision, rhythm | **7.0** | Good `tabular-nums` hygiene and caps tracking; hierarchy is inverted (the deadline is the smallest number on the card). |
| 4 · Luminescence & dark-tactical atmosphere | **6.0** | Semantics and red-discipline are exemplary; zero glow, zero bloom, zero atmospheric grade. |
| 5 · Component craft (buttons, keycaps, badges) | **6.5** | Buttons are tactile but beveled like 2012; `.prov` is the weakest mark in the system; daylight primary CTA is nearly invisible. |
| 6 · 3D map HUD integration | **5.5** | HUD frame and bearing pill are good; no vignette/scrim, no always-on instrument deck, no radar anchor. |
| **Overall** | **6.0 / 10** | Strong bones. The leap is a surface pass, not an architecture pass. |

### Three defects that are outright bugs, not taste

1. **`.card h1` is unstyled.** The road-cut card (`commandConsole.ts:1079`, `:1086`) uses `<h1>`, but CSS only defines `.card h2` (`console.css:666`). The single most urgent card in the product renders its headline at the UA default `2em` (~25px) with `0.67em` margins, breaking the card's rhythm and contradicting every other card. **Fix in the same pass as the type scale.**
2. **The daylight primary CTA disappears.** `--btn-primary-bg` is a white gradient defined only in the dark `:root` (`console.css:212–217`). The daylight block (`:root[data-theme="daylight"]`, `console.css:1143`) overrides `--btn-bg` but **not** `--btn-primary-*`. On `#F2F0EA` alabaster, a white pill is ~1.05:1 against its own surface; only the `0 2px 0 var(--p-slate-8)` lip defines it. The `Deploy`-class CTA must invert to ink in daylight.
3. **`.kpis` is dead CSS.** The KPI strip is fully styled (`console.css:464–467`) and fully responsive (`:1105`, `:1110`, `:1112`), but `renderTopbar` (`commandConsole.ts:572–591`) never emits it. The topbar therefore has no Neurolinc-grade metric strip at all.

---

## 1. What is already world-class — do not regress

- **Token architecture.** Three tiers, semantic aliases, alpha ladder, concentric radius math (`console.css:17–331`). This is better than most design systems twice Sentinel's size.
- **Red discipline.** `--critical` is reserved for life safety; battery `<25%` is amber; the mic is violet (`console.css:939–941`, `:547`). The reference products do not have this discipline.
- **Provenance.** `MEA / MOD / AUT` travel with every number (`console.css:433–436`; `commandConsole.ts:1595`, `:1638`, `:1686`). This is Sentinel's signature; do not flatten it into decoration.
- **Accessibility engineering.** Reduced motion, reduced transparency, `prefers-contrast`, focus rings, 11px legibility floor, measured contrast in `tokens.html`. Keep all of it.
- **Existing micro-instruments.** `spark()` (`commandConsole.ts:1395`), `windRose()` (`:851`), `unitPips()` (`:869`), `cadenceHtml()` (`:876`), the structure dot matrix (`console.css:977–980`), and `.u-pips` (`:1343–1346`) prove the vocabulary already exists. The job is to **promote** it, not invent it.

---

## 2. Findings by vector

### VECTOR 1 — Card anatomy, elevation, specular highlights

**Evidence.** `.card` (`console.css:639`) is:

```css
background: color-mix(in srgb, var(--bg-surface-1) 94%, transparent);
border: 1px solid var(--border);            /* white 12% */
border-radius: var(--r-lg);                 /* 10px */
/* no backdrop-filter, no box-shadow of its own, no top specular */
```

Compare `.glass` (`:390`), which carries `--glass-shadow`:

```css
inset 0 1px 0 rgba(255,255,255,.10),
inset 0 0 0 .5px rgba(255,255,255,.05),
0 2px 6px rgba(0,0,0,.35),
0 18px 44px -18px rgba(0,0,0,.50)
```

The `.chat` glass even gets the diagonal rim catch (`console.css:567`) via `--rim-gradient` (`:242`). **The decision cards — the most important surface in the product — get none of it.**

**Defects**

- **D1.1 — Flat card.** No elevation, no top specular, no ambient occlusion. It reads as a cut-out rectangle rather than a machined panel. Linear/Keyclear cards are separated by shadow and radius; Sentinel separates by a visible 1px border, which is the "wireframe dashboard" tell.
- **D1.2 — Wrong ramp step.** `--bg-surface-2` (`rgba(17,20,26,.92)`, `:83`) is defined but unused by cards; cards sit at `--bg-surface-1` (#0C0E12). Canvas `#07080B` → surface-1 `#0C0E12` is a 4-value luminance step — invisible. The card never lifts off the canvas.
- **D1.3 — Radius too tight for the format.** 10px on a 372px card with 12–16px internal padding is a "developer card". Aerion/Keyclear sit at 16–20px; Vercel's panels at 12–14px. At 372px width, 10px reads boxy.
- **D1.4 — State treatment is a single inset stroke.** `.card.needs` uses `inset 0 2px 0` (`:645`). It signals state but adds no perimeter light, so the "needs you" card does not *glow* the way Aerion's waypoints do.
- **D1.5 — Double shadow contract.** `.cards .card` (`:584`) overrides with `--shadow-2, inset 0 0 0 .5px`; other `.card` instances (inspector, route card in `#cards`) rely on it inconsistently. There is no single card elevation token.
- **D1.6 — Corner ticks fight the radius.** `.card::after` (`:648–656`) draws eight 10px corner brackets at `inset: 2px`. With a 10–14px radius, the brackets float inside the arc rather than tracing it. At 14px they will look worse. Either inset them to `5–6px` or retire them in favour of the rim light.

**Before → after (decision card)**

```
BEFORE                                    AFTER
┌──────────────────────────────┐          ╭──────────────────────────────╮
│ ● 09:42 · FT-01 · Needs you  │          │ ● 09:42 · FT-01 · NEEDS YOU  │
│  12:40                       │          │                     ┌─────┐│
│                              │          │                     │12:40││  ← 18px stake
│ Encinal Canyon Rd is cut     │          │                     │GATE ││
│ The projected cut time has   │          │                     └─────┘│
│ arrived — treat Route A...   │          │ Encinal Canyon Rd is cut     │  ← 15px, balanced
│                              │          │ ┌────────┐┌────────┐         │
│ [ Compare courses ]          │          │ │  ROS   ││CONT.   │         │  ← gauges
│ ┌──────────────────────────┐ │          │ │  14    ││  62%   │         │
│ │ 1  Acknowledge           │ │          │ └────────┘└────────┘         │
│ └──────────────────────────┘ │          │ ●WP1──●WP2──╳CHOKE──○SAFE     │  ← route strip
│                              │          │ ╱╲__╱╲____╱╲___               │  ← elevation
│ [Why?] [Show on map]         │          │ [Acknowledge]  [Why?]         │
└──────────────────────────────┘          ╰──────────────────────────────╯
 flat, outlined, no lift                   lifted, rim-lit, state bloom,
                                           one heroic number, instruments
```

**Exact rules** — see §4.2. The move is: `--bg-surface-2` + 3% top wash + `backdrop-filter: blur(8px)`, radius 14px, `inset 0 1px 0 white/12%` + a two-part shadow, state cards add a perimeter bloom (`0 0 0 1px` state-tint + `0 0 30px -10px` state-glow). This is the single highest-leverage change in the document because it touches every screen.

---

### VECTOR 2 — Tactical micro-data visualizations

**What exists (and is good).** Inside the L2 panel, the weather widget already draws a wind rose with a gust arc (`commandConsole.ts:851–866`), session sparklines (`:1395–1401`, `:1606–1611`), battery pips (`:869–873`), and the growth widget draws the burned-area chart. The structures widget draws a dot matrix. This is real instrumentation.

**What is missing.** The L1 deck and the decision cards — the two surfaces that are always visible — are text.

- **D2.1 — Egress is prose.** `deckGlance('evac')` (`:1439–1448`) returns strings: `"Route A cut"`, `"projected cut time reached"`. The cut card (`:1077–1090`) is three paragraphs and one button. There is no waypoint strip, no choke marker, no elevation profile, no time-to-choke. Aerion's `MAP OVERVIEW` + route waypoints are the direct benchmark.
- **D2.2 — Rate of spread has no gauge.** ROS lives as `T.spread` text in the weather cell (`:1610`) and never appears as an arc. Aerion's `THREAT DETECTION` 180° arc (green→amber→red, big `03`, needle) is the exact pattern.
- **D2.3 — Battery is already a cell in L2, but not in the glance.** `deckGlance('fleet')` (`:1434–1438`) returns `"42%"` + `"8 assets"`. The pips exist in `unitRow` only (`:1686`). Promote a 4-segment cell into the deck.
- **D2.4 — Containment / cleared % is a bar, not a radial.** `.bar` (`console.css:947–948`) is a good hatched fill, but zones read better as a short segmented ring or a stem row.
- **D2.5 — No threat equalizer at the decision layer.** Wind/fuel moisture trends are buried in L2. A 24×12 bar-equalizer inline in the card meta would carry the "what changed" signal without a sentence.
- **D2.6 — Provenance is text-adjacent, not visual.** In the references, the data mark *is* the chart (stippled = measured, dashed = modeled). Sentinel has the tokens but not a chart-level encoding.

**Before → after (egress glance + cut card)**

```
BEFORE — L1 segment                      AFTER — L1 segment
┌─────────────────────────────┐          ┌─────────────────────────────┐
│ [⌁] EGRESS          MOD     │          │ [⌁] EGRESS          MOD     │
│     Route A cut · projected │          │     Route A cut   ●●●○ 2h14 │
│     cut time reached      ▴ │          │     ═══════╪═══╌╌╌╌╌  ▴    │  ← meter underline
└─────────────────────────────┘          └─────────────────────────────┘

BEFORE — cut card body                   AFTER — cut card body
"Encinal Canyon Rd is cut. The           ┌ EGRESS · ROUTE A ─────── MOD ┐
projected cut time has arrived —         │  WP1 ── WP2 ── ╳ ── ○ SAFE  │
treat Route A as gone for anyone         │  ●━━━━━━●━━━━━╳╌╌╌╌○         │
still south of the hairpin. The          │  2m      6m    T+14   T+22   │
upper canyon north reroute is            │  ╱╲__╱╲______╱╲___            │
still a draft order..."                  └──────────────────────────────┘
                                          CONTAINMENT 62%   ROS 14 ch/h
```

**Data contract.** `routeViz()` needs `{ label, elev, state }[]`. Source candidates already in the build: route polyline from `terrainEngine`, cut time from the `route-a-cut` / `cut-marker` overlay, and `EvacBoard.routes[].status`. If elevation is not in the scenario schema, derive it from the terrain heightfield along the polyline — do **not** fabricate it. If it cannot be derived, ship the waypoint strip alone and omit the profile. Honesty is the product.

---

### VECTOR 3 — Typography, tabular precision, visual rhythm

**Good.** `--tracking-caps: .08em` (`:275`) and `.caps` (`:382`) are correct. `.mono, .num` sets `font-variant-numeric: tabular-nums` (`:381`), and `.kpi b`, `.measure b`, `.batt`, `.slots .seg .t b` repeat it. The 11px legibility floor (`--fs-micro`) is the right call for a control room.

**Defects**

- **D3.1 — Hierarchy is inverted on decision cards.** `.countdown` is `var(--fs-caption)` = **11.5px** (`:668`). The gate deadline — the one number that should command the eye — is smaller than the body copy (12.5px) and the title (13.5px). Aerion's `03`, Keyclear's `+3.0 pts`, Neurolinc's `1,847` are 32–48px. On Sentinel, the eye lands on the 2px amber bar, not the clock. **This is the most important type fix in the audit.**
- **D3.2 — The title ladder is 1px apart.** `--fs-body: 12.5`, `--fs-title: 13.5` (`:264–265`). A 1px step is not a hierarchy; it is a rounding error. Card titles should be 15px, body 12.5px, with `letter-spacing: -0.012em` and `text-wrap: balance`.
- **D3.3 — Tracking is inconsistent.** Six values are in play: `.widget h3` `0.02em` (`:898`), `.seg small` `0.07em` (`:805`), `.caps` `0.08em`, `.brand` `0.14em` (`:449`), `.exercise` `0.12em` (`:871`), `.hudBearing` `0.08em` (`:1328`). Panels are the worst offender: the section label `SITUATION` is nearly untracked while the eyebrow inside a card is wide. Define `--tracking-label: .06em`, `--tracking-caps: .08em`, `--tracking-wide: .12em`, `--tracking-brand: .14em` and map every call site.
- **D3.4 — Proportional numerals in dynamic chrome.** `.card h2` uses Geist Sans with no `tabular-nums`; decision titles that embed times (`+18 min`, `T+1:34`) can reflow as values change. Add `font-variant-numeric: tabular-nums` to `.card h1, .card h2` and `.card-stake`. Monospace rows are already safe.
- **D3.5 — `text-wrap` is unmanaged.** Long incident titles (`:732`) break at arbitrary points. `text-wrap: balance` on card titles and `pretty` on `p` is a free editorial lift.

---

### VECTOR 4 — Tactical colour luminescence, glows, atmosphere

**Good.** The semantic ladder is disciplined and the red discipline is better than the references. `--needs` amber, `--plan-committed` cyan, `--talon` violet are used with intent.

**Defects**

- **D4.1 — No glow anywhere on a surface.** Only the 8px dots carry a 3px soft ring (`:421–424`). No card, no button, no chip, no active row emits light. The result is "dark spreadsheet", not "backlit avionics". A tactical dark UI needs **one** bloom per state, used sparingly: the active decision card, the live waypoint, the critical banner.
- **D4.2 — Dot system is asymmetric.** `.dot.working`, `.needs`, `.critical` get a soft ring; `.done` and default idle do not (`:420–424`). The result is that "done" reads flatter than "idle" in some contexts. Give every state the same 3px ring, with tone only changing hue.
- **D4.3 — `LIVE` blinks harshly.** `.live::before` uses `steps(2)` (`:474`). Square blinking is a 2005 server-status tell. Aerion/Neurolinc pulse. Replace with a smooth 1.9s breathe and a soft halo.
- **D4.4 — No atmospheric grade on the map.** `terrainEngine` has distance fog (`:4598–4601`) and a graded terrain shader, but no screen-space vignette or horizon blend. The canvas runs edge-to-edge under the HUD with no depth separation. This is V6's main gap and also a colour gap: the HUD floats on a flat plate.
- **D4.5 — Grain is glass-only.** `.glass::after` adds film grain (`:392`), but cards are not glass, so the UI has two texture regimes side by side. Once cards get a translucent surface, use the same grain at lower opacity.

**Bloom recipe (use once per screen):**

```css
--bloom-needs:
  0 0 0 1px color-mix(in srgb, var(--needs) 24%, transparent),
  0 0 30px -10px color-mix(in srgb, var(--needs) 50%, transparent);
```

Never apply this to more than one card at a time. If two items need attention, the higher-severity one blooms; the other keeps the 2px rail.

---

### VECTOR 5 — Component craft: buttons, keycaps, badges, chips

**Defects**

- **D5.1 — Primary button is a 2012 keycap.** `--btn-primary-shadow` (`:216`) is:
  `inset 0 1px 0 white, 0 2px 0 slate-8, 0 5px 12px black/50`.
  The hard `0 2px 0` bottom lip is skeuomorphic. Linear/Vercel/Keyclear primaries are **flat white pills**: no bevel, no lip, `border-radius: 999px`, crisp dark type. The physicality comes from contrast, not from a plastic edge.
- **D5.2 — Daylight primary is invisible.** See §0 bug 2.
- **D5.3 — Keycaps are inconsistent.** `.kbd` (`:411`) is a good keycap; `.opt .k` (`:681`) is a better one (24px, 2px bottom border, layered shadow). But the actual topbar shortcuts (`R`, `?`, `Space`) are only in tooltips. There is no visible `⌘K`-class affordance anywhere. Vercel puts `⌘K` inside the search field; Sentinel should put a small keycap on Review (`R`) and Help (`?`), and a visible `ESC` in the chat composer.
- **D5.4 — `.prov` is the weakest mark in the system.** At 10.5px it is a 1px coloured outline with coloured text and no fill (`:433–436`). It disappears on the card and reads as a debug tag. The brief's own suggestion is right: **micro-capsule geometry + a 2px colour spine + a tinted surface fill**. Keep the three hues; give them physical presence.
- **D5.5 — Chips have no specular.** `.chip` (`:426`) is flat `--surface-raised` with a 1px border. Aerion chips have a top highlight; without it, 22px pills read as printed labels rather than controls.
- **D5.6 — `--r-sm` (6px) is too tight for topbar verbs.** In a 52px bar, 6px corners on a 32px button feel cramped next to the 10px topbar. Utility buttons can stay at 8px; primary verbs should be pills.

**Before → after (control cluster)**

```
BEFORE                                    AFTER
┌───────────────────────┐                 ╭───────────────────────╮
│ Review                │  ← beveled      │  Review            R  │  ← pill + keycap
└───────────────────────┘                 ╰───────────────────────╯
┌───────────────────────┐                 ╭───────────────────────╮
│ ▲ Acknowledge         │                 │   Acknowledge         │  ← flat white pill
└───────────────────────┘                 ╰───────────────────────╯
 [MOD] modeled · [MEA] measured            ┃MOD modeled  ┃MEA measured
  ↑ hairline outline                        ↑ 2px spine + 9% tint
```

---

### VECTOR 6 — 3D map HUD integration & viewport chrome

**What exists.** `#hudFrame` with four registration marks and a bearing pill (`console.css:1319–1328`; mounted at `commandConsole.ts:1004–1006`). The topbar and deck float with 12px gutters. This is a good skeleton.

**Defects**

- **D6.1 — No vignette or horizon fade.** `#map` is `inset: 0` (`console.css:445`) and the canvas renders edge-to-edge. Fog is distance-based only. The HUD has no tonal bed, so labels compete with high-contrast terrain at the frame edges. Aerion's map is graded and vignetted; the HUD sits in shadow.
- **D6.2 — No top scrim behind the topbar.** At 1440p the terrain horizon can run directly under 11px caps. Contrast is guaranteed by the glass, but the *perceived* separation is weak.
- **D6.3 — The always-on instrument deck was retired.** The 2026-11-04 crew-deck change replaced 204px of live widgets with 5 text glances + an L2 panel (`console.css:793–860`). That was the right density call, but it removed the "cockpit floor" that makes Aerion feel like a mission control. The fix is not to bring the widgets back — it is to give each L1 segment a **2px instrument underline** and one micro-viz.
- **D6.4 — No radar/minimap anchor.** The compass tool exists (`:489`), and the map itself is the situational view, so a minimap is arguably redundant. If one is added, make it an orthographic *inset of the current viewport* with a crosshair and waypoint pips (Aerion `MAP OVERVIEW`), not a second map.
- **D6.5 — HUD marks are barely visible.** `.hud-reg` is `opacity: .3` (`:1320`). At 11px they vanish on a bright terrain patch. Lift to `.45` and add a 1px dark outline (`filter: drop-shadow(0 0 1px rgba(0,0,0,.8))`) so they hold on both light and dark terrain.

---

## 3. Top 5 high-impact visual upgrades

Ranked by aesthetic leverage per line of code.

### 1. Machined card anatomy (ship first — pure CSS)
Add top specular, two-stage shadow, 14px radius, `--bg-surface-2` surface, 8px backdrop blur, and a state bloom. Normalize `.card h1/h2`, and promote the gate countdown to 18px.
**Why it wins:** every screen is made of cards. This one change moves the product from "outlined rectangles" to "lifted glass panels" and costs ~30 lines.
**Impact:** 40% of the total aesthetic delta.

### 2. Egress route instrument (waypoints + elevation)
Replace the cut-card prose block with a `WP1 → WP2 → CHOKE → SAFE` strip, an elevation profile, and a per-segment state. Keep the prose as the accessible description.
**Why it wins:** it is the only surface where a human is making a life-safety spatial decision. Aerion's waypoint vocabulary is the benchmark; Sentinel currently asks the operator to read a paragraph.
**Impact:** the single most "award-winning screen" moment available.

### 3. Decision-card instrument cluster + heroic stake
Add a 180° arc gauge (ROS / containment), a segmented confidence ring, and a 24×12 wind/fuel bar-equalizer. Move the gate deadline into an 18px `.card-stake` block with an uppercase label and the existing depleting bar.
**Why it wins:** it fixes the hierarchy inversion (D3.1) and gives the card a signature. It also promotes the data-viz vocabulary that already exists in L2.
**Impact:** the decision card becomes the product's hero component.

### 4. Viewport atmosphere
A CSS-only multi-stop vignette + top/bottom scrim on `#map`, a slightly stronger HUD mark, and a smooth `LIVE` breathe.
**Why it wins:** it creates depth between terrain and HUD for ~15 lines and zero JS. It is the difference between "a map with divs on it" and "a cockpit".
**Impact:** the whole frame reads more expensive instantly.

### 5. Control craft + KPI strip revival
Flat white pill primary (with a daylight ink override), unified keycap recipe, provenance capsules with a colour spine, soft status dots, a 4-step tracking scale, and a real topbar KPI strip (2 KPIs at 1280, 3–4 at ≥1560, full strip in the posture popover).
**Why it wins:** it removes the last "web app" tells and adds the Neurolinc metric rhythm the brief asks for. It also fixes two outright bugs (dead `.kpis`, invisible daylight CTA).
**Impact:** polish that reads at a glance and in screenshots.

---

## 4. Drop-in implementation

All colours are token-derived. No raw hex outside the existing primitive blocks, so the zero-raw-hex contract in `tools/verify.mjs` holds.

### 4.1 Token patch — add to `:root` after the Tier-3 card/button block (`console.css`, after `:222`)

```css
  /* =========================================================================
     CRAFT PASS 2026-11-10 — machined surface + instrument tokens
     ========================================================================= */
  --r-card: 14px;                 /* card outer radius (was --r-lg 10px) */
  --r-panel: 18px;                /* chat / popover / modal radius */

  --card-bg: var(--bg-surface-2); /* rgba(17,20,26,.92) dark · #F7F5EF daylight */
  --card-wash: linear-gradient(180deg, var(--p-alpha-w-04) 0%, transparent 44%);
  --card-shadow:
    inset 0 1px 0 var(--p-alpha-w-12),
    inset 0 0 0 .5px var(--p-alpha-w-06),
    0 1px 2px var(--p-alpha-b-45),
    0 24px 48px -28px var(--p-alpha-b-60);
  --card-shadow-hover:
    inset 0 1px 0 var(--p-alpha-w-18),
    inset 0 0 0 .5px var(--p-alpha-w-08),
    0 2px 6px var(--p-alpha-b-35),
    0 30px 60px -28px var(--p-alpha-b-60);

  --bloom-needs:
    0 0 0 1px color-mix(in srgb, var(--needs) 24%, transparent),
    0 0 30px -10px color-mix(in srgb, var(--needs) 50%, transparent);
  --bloom-critical:
    0 0 0 1px color-mix(in srgb, var(--critical) 30%, transparent),
    0 0 34px -10px color-mix(in srgb, var(--critical) 55%, transparent);

  --gauge-track: color-mix(in srgb, var(--p-slate-12) 8%, transparent);
  --gauge-tick: color-mix(in srgb, var(--p-slate-12) 18%, transparent);

  --tracking-label: .06em;
  --tracking-wide: .12em;
  --tracking-brand: .14em;
  --fs-card-title: 15px;
  --fs-stake: 18px;
```

### 4.2 Card anatomy — replace `console.css:639–658`

```css
/* cards — a lifted instrument panel, not an outlined rectangle.
   One accent only: the state rail + a perimeter bloom. Never a full coloured frame. */
.card {
  position: relative;
  display: grid;
  gap: var(--s-3);
  padding: var(--s-3) var(--s-4) var(--s-4);
  border-radius: var(--r-card);
  border: 1px solid var(--border-subtle);
  background: var(--card-wash), var(--card-bg);
  backdrop-filter: blur(8px) saturate(120%);
  -webkit-backdrop-filter: blur(8px) saturate(120%);
  box-shadow: var(--card-shadow);
  transition: box-shadow var(--dur-base) var(--ease-out),
              border-color var(--dur-base) var(--ease-out);
}
.card:hover { box-shadow: var(--card-shadow-hover); }

/* the 2px state rail: lit, not painted */
.card.needs::before,
.card.critical::before {
  content: "";
  position: absolute;
  left: -1px;
  top: 16px;
  bottom: 16px;
  width: 2px;
  border-radius: 2px;
}
.card.needs::before {
  background: var(--needs);
  box-shadow: 0 0 10px color-mix(in srgb, var(--needs) 55%, transparent);
}
.card.critical::before {
  background: var(--critical);
  box-shadow: 0 0 10px color-mix(in srgb, var(--critical) 60%, transparent);
}

.card.needs {
  border-color: color-mix(in srgb, var(--needs) 28%, var(--border-subtle));
  box-shadow: var(--card-shadow), var(--bloom-needs);
}
.card.critical {
  border-color: color-mix(in srgb, var(--critical) 32%, var(--border-subtle));
  box-shadow: var(--card-shadow), var(--bloom-critical);
}

/* routed / issued stay quiet: dashed rail, no bloom, no lift competition */
.card.routed {
  border-style: dashed;
  border-color: var(--border);
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

/* corner ticks: pull them inside the larger radius or they float in the arc */
.card::after {
  content: "";
  position: absolute;
  inset: 5px;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--dur-fast);
  border-radius: calc(var(--r-card) - 5px);
  background:
    linear-gradient(var(--border-strong), var(--border-strong)) left top / 10px 1px no-repeat,
    linear-gradient(var(--border-strong), var(--border-strong)) left top / 1px 10px no-repeat,
    linear-gradient(var(--border-strong), var(--border-strong)) right top / 10px 1px no-repeat,
    linear-gradient(var(--border-strong), var(--border-strong)) right top / 1px 10px no-repeat,
    linear-gradient(var(--border-strong), var(--border-strong)) left bottom / 10px 1px no-repeat,
    linear-gradient(var(--border-strong), var(--border-strong)) left bottom / 1px 10px no-repeat,
    linear-gradient(var(--border-strong), var(--border-strong)) right bottom / 10px 1px no-repeat,
    linear-gradient(var(--border-strong), var(--border-strong)) right bottom / 1px 10px no-repeat;
}
.card:hover::after { opacity: .55; }

/* one title rule for both levels — fixes the unstyled <h1> on the cut card */
.card h1,
.card h2 {
  margin: 0;
  font-size: var(--fs-card-title);
  font-weight: var(--fw-semibold);
  letter-spacing: -0.012em;
  line-height: 1.28;
  font-variant-numeric: tabular-nums;
  text-wrap: balance;
}
.card p {
  margin: 0;
  color: var(--text-2);
  font-size: var(--fs-body);
  text-wrap: pretty;
}
```

Then **delete** the old `box-shadow` override at `console.css:584` (the card now owns its elevation) or replace it with `box-shadow: var(--card-shadow);`.

### 4.3 Heroic stake + meta rail — add after the card block

```css
/* the one number that matters: gate deadline, 18px, tabular, with its unit label */
.card-rail {
  display: flex;
  align-items: flex-start;
  gap: var(--s-2);
  min-width: 0;
}
.card-stake {
  display: grid;
  justify-items: end;
  gap: 3px;
  margin-left: auto;
  flex: none;
}
.card-stake .countdown {
  font: var(--fw-semibold) var(--fs-stake)/1 var(--font-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  color: var(--needs);
}
.card-stake.bad .countdown { color: var(--critical); }
.card-stake small {
  font: var(--fw-semibold) var(--fs-badge)/1 var(--font-mono);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--text-3);
}
/* keep the depleting underline proportional to the larger readout */
.card-stake .countdown[data-from] { padding-bottom: 4px; }
.card-stake .countdown[data-from]::after { height: 2px; opacity: .55; }
```

Markup change in `buildCard` (`commandConsole.ts:730–731`): wrap the existing `.countdown` in `.card-stake`, move it out of `.meta` into a `.card-rail`, and let the existing `data-until` ticker keep working untouched.

```ts
<div class="card-rail">
  <i class="dot ${crit ? 'critical' : 'needs'}"></i>
  <span class="caps"><span class="mono">${fmtT(o.raisedAt)}</span> · ${esc(agent)} · ${it.kind === 'proposal' ? 'Proposal' : 'Needs you'}</span>
  ${o.expiresAt !== null || Number.isFinite(o.closesAt)
    ? `<span class="card-stake ${crit ? 'bad' : ''}">
         <span class="countdown" data-until="${Number.isFinite(o.closesAt) ? o.closesAt : o.expiresAt}" data-from="${o.raisedAt}"></span>
         <small>to gate</small>
       </span>`
    : ''}
</div>
```

### 4.4 Arc gauge + route instrument — TS helpers (`commandConsole.ts`, near `spark()` at `:1395`)

```ts
type GaugeTone = 'ok' | 'warn' | 'bad' | 'plan';

/** 180° instrument arc. value 0..1. Readout is passed as text so we never round silently. */
function arcGauge(o: { v: number; readout: string; label: string; sub?: string; tone?: GaugeTone }): string {
  const v = Math.max(0, Math.min(1, o.v));
  const a = Math.PI * (1 - v);
  const kx = (60 + 50 * Math.cos(a)).toFixed(1);
  const ky = (60 - 50 * Math.sin(a)).toFixed(1);
  const ticks = Array.from({ length: 13 }, (_, i) => {
    const ta = Math.PI * (1 - i / 12);
    const r1 = i % 3 === 0 ? 42 : 45;
    const x1 = (60 + 50 * Math.cos(ta)).toFixed(1);
    const y1 = (60 - 50 * Math.sin(ta)).toFixed(1);
    const x2 = (60 + r1 * Math.cos(ta)).toFixed(1);
    const y2 = (60 - r1 * Math.sin(ta)).toFixed(1);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }).join('');
  return `<figure class="gauge" data-tone="${o.tone ?? 'plan'}">
    <svg viewBox="0 0 120 68" role="img" aria-label="${esc(o.label)}: ${esc(o.readout)}">
      <g class="g-ticks">${ticks}</g>
      <path class="g-track" d="M10 60 A50 50 0 0 1 110 60" pathLength="100"/>
      <path class="g-fill" d="M10 60 A50 50 0 0 1 110 60" pathLength="100"
            stroke-dasharray="100" stroke-dashoffset="${(100 - v * 100).toFixed(2)}"/>
      <circle class="g-knob" cx="${kx}" cy="${ky}" r="3"/>
    </svg>
    <figcaption>
      <b>${esc(o.readout)}</b>
      <small>${esc(o.label)}</small>
      ${o.sub ? `<em>${esc(o.sub)}</em>` : ''}
    </figcaption>
  </figure>`;
}

type RouteWp = { label: string; elev: number; state: 'done' | 'active' | 'blocked' | 'future' };

/** Waypoint strip + elevation profile. Pass real elevations; omit the profile if you only have labels. */
function routeViz(pts: RouteWp[], caption = ''): string {
  if (pts.length < 2) return '';
  const W = 320, H = 32, pad = 8;
  const min = Math.min(...pts.map((p) => p.elev));
  const max = Math.max(...pts.map((p) => p.elev));
  const x = (i: number) => (pad + (i * (W - pad * 2)) / (pts.length - 1)).toFixed(1);
  const y = (e: number) =>
    (max === min ? H * 0.6 : H - 9 - ((e - min) / (max - min)) * (H - 20)).toFixed(1);
  const line = pts.map((p, i) => `${x(i)},${y(p.elev)}`).join(' ');
  const area = `${pad},${H - 3} ${line} ${W - pad},${H - 3}`;
  return `<div class="routeviz">
    ${caption ? `<div class="routecap"><span class="caps">${esc(caption)}</span><span class="prov modeled">mod</span></div>` : ''}
    <svg class="route-profile" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
      <polygon class="rp-area" points="${area}"/>
      <polyline class="rp-line" points="${line}"/>
    </svg>
    <ol class="route-steps" style="--n:${pts.length}">
      ${pts.map((p) => `<li class="wp ${p.state}"><i aria-hidden="true"></i><b>${esc(p.label)}</b></li>`).join('')}
    </ol>
  </div>`;
}

/** Vertical bar equalizer for a short series (wind gusts, fuel moisture). */
function barSpark(vals: number[], hiIndex = -1): string {
  if (vals.length < 2) return '';
  const w = 54, h = 14, gap = 2;
  const bw = (w - gap * (vals.length - 1)) / vals.length;
  const max = Math.max(...vals) || 1;
  return `<svg class="spark bars" viewBox="0 0 ${w} ${h}" aria-hidden="true">${vals
    .map((v, i) => {
      const bh = Math.max(2, (v / max) * h);
      const cls = i === hiIndex ? ' class="hi"' : '';
      return `<rect x="${(i * (bw + gap)).toFixed(1)}" y="${(h - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="1"${cls}/>`;
    })
    .join('')}</svg>`;
}
```

### 4.5 Instrument CSS — append to `console.css`

```css
/* ---- gauge cluster ------------------------------------------------------ */
.gauge-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-2);
}
.gauge {
  margin: 0;
  display: grid;
  justify-items: center;
  gap: 2px;
  padding: var(--s-2) var(--s-2) var(--s-1);
  border-radius: var(--r-md);
  background: var(--surface-sunken);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--inset-well);
  color: var(--plan-committed);
}
.gauge[data-tone="ok"]   { color: var(--done); }
.gauge[data-tone="warn"] { color: var(--needs); }
.gauge[data-tone="bad"]  { color: var(--critical); }
.gauge[data-tone="plan"] { color: var(--plan-committed); }

.gauge svg { width: 100%; max-width: 120px; display: block; overflow: visible; }
.g-ticks line { stroke: var(--gauge-tick); stroke-width: 1; }
.g-track { fill: none; stroke: var(--gauge-track); stroke-width: 6; }
.g-fill {
  fill: none;
  stroke: currentColor;
  stroke-width: 6;
  stroke-linecap: round;
  filter: drop-shadow(0 0 4px color-mix(in srgb, currentColor 55%, transparent));
  transition: stroke-dashoffset 320ms var(--ease-out-expo);
}
.g-knob { fill: var(--bg-surface-1); stroke: currentColor; stroke-width: 2; }

.gauge figcaption { display: grid; justify-items: center; gap: 1px; margin-top: -6px; }
.gauge figcaption b {
  font: var(--fw-semibold) var(--fs-display)/1 var(--font-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  color: var(--text-1);
}
.gauge figcaption small {
  font: var(--fw-semibold) var(--fs-badge)/1 var(--font-mono);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--text-3);
}
.gauge figcaption em { font-style: normal; font-size: var(--fs-micro); color: var(--text-4); }

/* ---- route instrument --------------------------------------------------- */
.routeviz {
  display: grid;
  gap: 6px;
  padding: var(--s-2) var(--s-3) var(--s-3);
  border-radius: var(--r-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-sunken);
  box-shadow: var(--inset-well);
}
.routecap { display: flex; align-items: center; justify-content: space-between; gap: var(--s-2); }
.route-profile { display: block; width: 100%; height: 32px; }
.rp-area { fill: color-mix(in srgb, var(--plan-committed) 9%, transparent); }
.rp-line {
  fill: none;
  stroke: color-mix(in srgb, var(--plan-committed) 62%, var(--text-3));
  stroke-width: 1.25;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}

.route-steps {
  display: grid;
  grid-template-columns: repeat(var(--n, 4), minmax(0, 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
}
.route-steps .wp {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 5px;
  font: var(--fw-semibold) var(--fs-badge)/1 var(--font-mono);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--text-3);
}
.route-steps .wp i {
  position: relative;
  z-index: 1;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gauge-track);
  box-shadow: 0 0 0 2px var(--bg-surface-1);
}
.route-steps .wp::before {
  content: "";
  position: absolute;
  top: 3px;
  left: -50%;   /* previous dot's centre → this dot's centre */
  right: 50%;
  height: 1.5px;
  background: var(--gauge-track);
}
.route-steps .wp:first-child::before { display: none; }
.route-steps .wp.done i { background: var(--done); }
.route-steps .wp.done::before { background: var(--done); }
.route-steps .wp.active i {
  background: var(--plan-committed);
  box-shadow: 0 0 0 2px var(--bg-surface-1),
              0 0 12px color-mix(in srgb, var(--plan-committed) 65%, transparent);
}
.route-steps .wp.active b { color: var(--plan-committed); }
.route-steps .wp.blocked i {
  background: var(--critical);
  box-shadow: 0 0 0 2px var(--bg-surface-1),
              0 0 12px color-mix(in srgb, var(--critical) 70%, transparent);
}
.route-steps .wp.blocked b { color: var(--critical); }
.route-steps .wp.future { color: var(--text-4); }
.route-steps .wp.future i { background: transparent; border: 1.5px solid var(--border-strong); }

/* ---- bar sparkline ------------------------------------------------------ */
.spark.bars rect { fill: var(--icon); opacity: .5; }
.spark.bars rect.hi { fill: var(--critical); opacity: 1; }
```

### 4.6 Control craft — replace `console.css:395–411` primary + keycap, and `:433–436` provenance

```css
/* primary: a crisp inverted pill. Contrast does the work, not a bevel. */
.btn.primary {
  border-radius: var(--r-pill);
  padding: 0 var(--s-4);
  background: var(--p-slate-12);
  color: var(--p-slate-0);
  border-color: color-mix(in srgb, var(--p-slate-12) 72%, transparent);
  font-weight: var(--fw-semibold);
  box-shadow:
    inset 0 1px 0 var(--p-slate-12),
    0 1px 2px var(--p-alpha-b-50),
    0 10px 24px -14px var(--p-alpha-b-60);
}
.btn.primary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--p-slate-12) 90%, var(--p-slate-9));
}
.btn.primary:active:not(:disabled) {
  background: color-mix(in srgb, var(--p-slate-12) 84%, var(--p-slate-9));
  transform: translateY(1px);
  box-shadow: inset 0 1px 2px var(--p-alpha-b-30), 0 1px 2px var(--p-alpha-b-45);
}

/* keycap: one recipe for .kbd and the option key */
.kbd,
.opt .k {
  display: inline-grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font: var(--fw-semibold) var(--fs-badge)/1 var(--font-mono);
  color: var(--text-2);
  background: linear-gradient(180deg, var(--p-alpha-w-08) 0%, var(--p-alpha-w-02) 100%);
  border: 1px solid var(--border-default);
  border-bottom-color: var(--border-strong);
  border-radius: 4px;
  box-shadow:
    inset 0 1px 0 var(--p-alpha-w-12),
    0 1px 0 var(--p-alpha-b-55);
}
/* .btn.sm is declared later in the file and would otherwise pull the primary pill's
   radius back to 4px — keep the pill for small primaries (dissent "Record"). */
.btn.sm.primary { border-radius: var(--r-pill); padding: 0 var(--s-3); }

/* provenance: micro-capsule with a colour spine and a tinted surface */
.prov {
  display: inline-flex;
  align-items: center;
  padding: 2px 5px;
  border: 1px solid color-mix(in srgb, currentColor 26%, transparent);
  border-radius: 3px;
  background: color-mix(in srgb, currentColor 9%, transparent);
  box-shadow: inset 2px 0 0 currentColor; /* spine survives the variant border-color */
  line-height: 1;
}

/* dot parity: every state gets the same soft ring */
.dot.done { box-shadow: 0 0 0 3px var(--done-soft); }
.dot.critical {
  box-shadow:
    0 0 0 3px var(--critical-soft),
    0 0 12px -1px color-mix(in srgb, var(--critical) 60%, transparent);
}

/* LIVE: breathe, don't blink */
.live::before { animation: live-breathe 1.9s var(--ease-in-out) infinite; }
@keyframes live-breathe {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 color-mix(in srgb, currentColor 45%, transparent); }
  50%      { opacity: .55; box-shadow: 0 0 0 4px transparent; }
}
```

**Daylight parity** — add to the `:root[data-theme="daylight"]` block (`console.css:1143`). Without this, the white pill disappears and the gauges lose their track:

```css
  --gauge-track: color-mix(in srgb, var(--text-1) 12%, transparent);
  --gauge-tick: color-mix(in srgb, var(--text-1) 18%, transparent);

:root[data-theme="daylight"] .btn.primary {
  background: var(--text-1);
  color: var(--text-inverse);
  border-color: color-mix(in srgb, var(--text-1) 80%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--p-slate-12) 30%, transparent),
    0 1px 2px color-mix(in srgb, var(--text-1) 18%, transparent);
}
:root[data-theme="daylight"] .btn.primary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--text-1) 88%, var(--p-slate-12));
}
```

### 4.7 Viewport atmosphere — append to `console.css` (or `index.html` inline style)

```css
#map canvas { position: relative; z-index: 0; }

/* one vignette + two scrims; sits above the canvas, below every HUD sibling */
#map::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(120% 92% at 50% 44%,
      transparent 40%,
      color-mix(in srgb, var(--bg-canvas) 38%, transparent) 76%,
      color-mix(in srgb, var(--bg-canvas) 76%, transparent) 100%),
    linear-gradient(180deg,
      color-mix(in srgb, var(--bg-canvas) 60%, transparent) 0%,
      transparent 14%),
    linear-gradient(0deg,
      color-mix(in srgb, var(--bg-canvas) 66%, transparent) 0%,
      transparent 20%);
}

.hud-reg { opacity: .45; filter: drop-shadow(0 0 1px var(--p-alpha-b-60)); }
```

**Daylight caveat:** the terrain stays dark in the daylight theme (documented at `console.css:1138–1141`). `--bg-canvas` is alabaster in daylight, so this vignette will haze the dark map toward beige. Test it; if it looks washed, pin the vignette to `--p-slate-0` instead of `--bg-canvas` and accept a dark frame around a light UI (which is the "truck hood at 10,000 lux" intent).

### 4.8 Deck meter — zero-width-cost instrument in L1

Instead of adding 46px sparklines to each segment (which breaks the 1280 width budget), give each segment a 2px instrument underline driven by a normalized value.

```css
.slots .seg { position: relative; padding-bottom: 11px; }
.slots .seg .meter {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 5px;
  height: 2px;
  border-radius: 1px;
  background: var(--gauge-track);
  overflow: hidden;
}
.slots .seg .meter i {
  display: block;
  height: 100%;
  border-radius: 1px;
  background: currentColor;
  transform: scaleX(var(--fill, 0));
  transform-origin: left center;
  transition: transform 200ms var(--ease-out-expo);
}
.slots .seg .meter[data-tone="ok"]   { color: var(--done); }
.slots .seg .meter[data-tone="warn"] { color: var(--needs); }
.slots .seg .meter[data-tone="bad"]  { color: var(--critical); }
.slots .seg .meter[data-tone="plan"] { color: var(--plan-committed); }
```

In `segHtml` (`commandConsole.ts:1475–1483`), add after the caret:

```ts
+ (g.meter != null
    ? `<span class="meter" data-tone="${g.tone ?? 'plan'}" aria-hidden="true"><i style="--fill:${Math.max(0, Math.min(1, g.meter)).toFixed(2)}"></i></span>`
    : '')
```

Extend `deckGlance` to return `meter`/`tone`: battery worst % → `batt/100` (`fleet`), zone-1 cleared → `cleared/100` (`evac`), containment → `contained` (`growth`). Omit the meter where no honest fraction exists.

### 4.9 KPI strip revival

Add to `renderTopbar` after the `sitbtn` (before `.posture`):

```ts
const acres = engine.reachedAreaAt(0);
const h60 = engine.reachedAreaAt(60);
const growthPct = acres && h60 ? Math.round(((h60 - acres) / acres) * 100) : null;
const kpi = (label: string, v: string, unit: string, delta?: string, opt = false) => `
  <div class="kpi${opt ? ' opt' : ''}"><small>${label}</small>
    <div class="kv"><b>${v}</b><em>${unit}</em>${delta ? `<span class="delta">${delta}</span>` : ''}</div>
  </div>`;
const kpiStrip = `<div class="kpis" aria-label="Incident metrics">
  ${acres != null ? kpi('BURNED', fmtN(acres / 4046.86), 'ac') : ''}
  ${h60 != null ? kpi('+60 MIN', fmtN(h60 / 4046.86), 'ac', growthPct ? `▲ ${growthPct}%` : undefined) : ''}
  ${kpi('ASSETS', String(ps.units.filter((u) => u.status !== 'standby').length), 'committed', undefined, true)}
</div>`;
```

```css
.kpis {
  display: flex;
  align-items: center;
  gap: 0;
  min-width: 0;
  overflow: hidden;
}
.kpi {
  display: grid;
  gap: 2px;
  padding: 0 var(--s-4);
  border-left: 1px solid var(--border-subtle);
  white-space: nowrap;
}
.kpi:first-child { border-left: 0; padding-left: 0; }
.kpi small {
  font: var(--fw-semibold) var(--fs-badge)/1 var(--font-mono);
  letter-spacing: var(--tracking-caps);
  color: var(--text-3);
}
.kv { display: flex; align-items: baseline; gap: 4px; }
.kv b {
  font: var(--fw-semibold) var(--fs-heading)/1 var(--font-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.015em;
  color: var(--text-1);
}
.kv em { font-style: normal; font-size: var(--fs-badge); color: var(--text-3); }
.delta { font: var(--fw-semibold) var(--fs-badge)/1 var(--font-mono); color: var(--done); }
.delta.down { color: var(--needs); } /* a falling metric is not life safety */

/* layout budget: 2 KPIs at the 1280 floor, 3 above 1560 */
@media (max-width: 1439px) { .kpis .kpi.opt { display: none; } }
@media (max-width: 1310px) { .kpis { display: none; } }
```

> **Layout honesty:** a Neurolinc-grade 32px KPI value needs ~96px of vertical strip, not Sentinel's 52px topbar. With `--topbar-h: 52px`, 17px values are the maximum that will not crowd the clock. Two options: (a) ship 2 compact KPIs at ≥1440 and a full 4-up strip inside the posture popover at 24px; or (b) raise `--topbar-h` to 60px and carry 3 KPIs. Do not force 4 KPIs into 1280 — the existing media queries already prove the collision risk.

---

## 5. Rollout & verification

### Order of work
1. **P0 — correctness:** `.card h1` style, daylight primary override, remove dead `--btn-primary-shadow` lip.
2. **P1 — card anatomy + stake hierarchy + vignette.** Pure CSS, no data dependencies. Ship behind a visual review.
3. **P1 — control craft:** pill CTA, keycap recipe, provenance capsules, dot parity, LIVE breathe.
4. **P2 — route instrument + gauge cluster.** Needs a small data adapter (waypoints/elevation, ROS/containment). Add behind a feature check: render only when the data exists.
5. **P2 — KPI strip + deck meter.** Wire from existing `engine.reachedAreaAt`, `EvacBoard`, and battery values.

### Verification checklist
- `npm run typecheck` — `arcGauge`, `routeViz`, `barSpark`, and the `deckGlance` return extension must compile.
- `npm run verify` — token/zero-raw-hex/contrast checks. All new colours are `color-mix` over tokens.
- `npm run shot` at **720×450, 1280×800, 1440×900, 1920×1080** (the four existing `vp-*.png` targets). Compare the card stack, the cut card, and the deck at each width.
- **1280×800 is the binding constraint.** Verify the 372px card + 372px chat displacement still fits, and that 2 KPIs + posture + TFR + clock + operator do not overflow the 52px topbar.
- **DPR 1 check.** `inset 0 0 0 .5px` disappears at DPR 1; the 1px specular must carry the edge. Test at 100% zoom on a 1× display.
- **Reduced transparency.** Extend the existing media block (`console.css:357`) to `.card`: `backdrop-filter: none; background: var(--surface-solid)`. Otherwise the new blur ignores the preference.
- **Reduced motion.** The gauge `stroke-dashoffset` transition and the LIVE breathe must collapse; the existing block (`:342`) already disables loops — add `.g-fill { transition: none; }`.
- **Daylight.** Re-shoot `?theme=daylight`; specifically the primary CTA, provenance capsules, gauge tracks, and the map vignette.
- **Contrast.** The state bloom must not reduce text contrast; it is a perimeter shadow, but verify `.card.needs p` against the tinted composite on both themes.
- **Performance.** `backdrop-filter` on up to ~4 stacked cards is fine; do **not** put it on the scrolling `#cards` container. Measure the 1280×800 frame budget with the map running.

### Risks
- **Radius ripple.** `--r-lg` is used by topbar, popover, widget, and modal. Introducing `--r-card` / `--r-panel` avoids changing them all at once. Do not globally bump `--r-lg`.
- **Backdrop blur on cards over a WebGL canvas** can be expensive on integrated GPUs. The 8% transparency means a 4px blur is visually sufficient; start at 6px if the frame budget complains.
- **`.card::after` conflict.** It is already used for corner ticks. The specular is delivered by `box-shadow`, not the pseudo-element, so there is no conflict. If you later want the diagonal `--rim-gradient` on cards, you will need a dedicated child element.
- **Data honesty.** The route profile and ROS gauges are only shippable if the values are real and provenance-marked. If elevation is unavailable, ship the waypoint strip alone.

---

## 6. Backlog (ranked)

| Priority | Item | Type | Files |
|---|---|---|---|
| P0 | Style `.card h1` with the `.card h2` rule | Bug | `console.css` |
| P0 | Daylight ink primary CTA override | Bug | `console.css` |
| P0 | Remove the `0 2px 0` primary lip | Craft | `console.css` |
| P1 | Card rim light / elevation / 14px radius / bloom | Craft | `console.css` |
| P1 | Heroic gate stake at 18px + `.card-rail` | Hierarchy | `console.css`, `commandConsole.ts` |
| P1 | Map vignette + scrim + HUD mark contrast | Atmosphere | `console.css` |
| P1 | Provenance capsules, keycap recipe, dot parity, LIVE breathe | Craft | `console.css` |
| P1 | Revive KPI strip (2 at 1280, 4 in popover) | Structure | `commandConsole.ts`, `console.css` |
| P2 | Route waypoint strip + elevation profile | Data viz | `commandConsole.ts`, `console.css` |
| P2 | 180° ROS/containment arc + confidence ring | Data viz | `commandConsole.ts`, `console.css` |
| P2 | Deck instrument underline (`meter`) | Data viz | `commandConsole.ts`, `console.css` |
| P2 | Wind/fuel bar equalizer at the decision layer | Data viz | `commandConsole.ts` |
| P2 | Tracking scale normalization (`.widget h3` etc.) | Type | `console.css`, `tokens.html` |
| P3 | Radar/orthographic minimap anchor | Stretch | `terrainEngine.ts`, `console.css` |

---

## Appendix — exact touch list

| File | Lines | Change |
|---|---|---|
| `console.css` | 193, 222 | Add craft tokens after button tokens |
| `console.css` | 395–411 | Replace primary button + keycap recipe |
| `console.css` | 420–425 | Dot parity + critical halo |
| `console.css` | 433–436 | Provenance capsule |
| `console.css` | 473–478 | LIVE breathe keyframes |
| `console.css` | 584 | Remove the duplicate card shadow override |
| `console.css` | 639–658 | Replace card anatomy + `h1/h2` rule |
| `console.css` | 668–673 | Countdown → `.card-stake` sizing |
| `console.css` | 1143+ | Daylight gauge + primary overrides |
| `console.css` | 1245+ | Append gauge / route / meter / vignette blocks |
| `console.css` | 342–359 | Extend reduced-motion/transparency to `.card`, `.g-fill` |
| `commandConsole.ts` | 572–591 | Insert KPI strip; add keycap to Review/Help |
| `commandConsole.ts` | 730–731 | `.card-rail` + `.card-stake` markup |
| `commandConsole.ts` | 1077–1090 | Route instrument in the cut card; `h2` not `h1` |
| `commandConsole.ts` | 1395+ | `arcGauge`, `routeViz`, `barSpark` helpers |
| `commandConsole.ts` | 1426–1483 | `deckGlance` meter/tone + `segHtml` meter |
| `terrainEngine.ts` | 4598–4601 | No change required; vignette lives in CSS |

---

### Closing note

The references are not prettier because they have more widgets. They are prettier because **each surface makes one claim, loudly, and supports it with an instrument.** Sentinel makes many claims, quietly, in 11.5px text. The top five upgrades are all the same move: give the decision layer one heroic number, one instrument, and one lit edge — then get out of the way.
