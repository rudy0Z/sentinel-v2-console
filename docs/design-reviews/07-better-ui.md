# 07 · Design review — better-ui lens (components, states, affordances)

Reviewed: Sentinel wildfire command console · dark theme (EOC Darkroom) unless noted.
Rubric: `C:/Users/rudra/.zcode/skills/better-ui/SKILL.md` (read in full this session).
Ground truth cited, not re-measured: `docs/anatomy/index.html`, `DESIGN.md`.
Visual evidence: `qa/final-polish.png`, `qa/final-rev.png`, `qa/calm-plan.png`, `qa/e2e-break-1280.png`.

**Verification method.** Static reads + greps of `console.css` / `commandConsole.js` / anatomy sheets, plus six live headless-Chrome probes (puppeteer-core via the repo's own `tools/serve.mjs` + `tools/browser.mjs`, scenario `wui-breakout`) that only measured in-page geometry/animations and wrote nothing into the repo; screenshot crops were written to the system temp dir only. `node tools/verify.mjs` and `node tools/e2e.mjs` were **not run** — both write `qa/*.png` captures, and this review is restricted to writing only its own report file; their assertions are cited as documented, not as checks I executed.

---

## (a) Lens summary

`better-ui` is the visual-polish pass over surfaces, icons and motion, applied **only once the underlying interaction is sound** — a polish finding never outranks a broken interaction. It demands exact values, not ranges: pressed controls scale to `0.96` over `150ms` `ease-out` (disabled never moves), entrance/exit asymmetry (exits shorter and smaller), transitions — never keyframes — for interactive state, because keyframes cannot reverse mid-flight. High-frequency interactions (keystrokes, hovers, tab switches) respond instantly or within `150ms` on `opacity`/`background-color`; every animated state change also leaves a static cue; all movement is gated behind `prefers-reduced-motion` with an opacity cross-fade fallback. Nested surfaces obey the concentric rule (outer radius = inner radius + padding + border); elevation comes from layered shadows while borders are for structure; icons are one library, `currentColor`, stroke matched to adjacent text weight; hover styling sits behind `@media (hover: hover)`; scrollable overlays get `overscroll-behavior: contain`; transitions name their properties and theme switches suppress them. The project's own consistent conventions are preferences, not findings — but the same detail done two ways inside the project **is** a finding.

## (b) Verdict + score

**6/10 — Block.** The motion/token discipline is genuinely excellent (zero `transition:all`, zero `will-change`, exemplary reduced-motion tiering), but two verified interaction-breaking defects at the console's own reference widths — the map tool column rendered click-dead under open decision cards, and the incident title garbling the posture/gate controls at the 1280 floor — plus a dock overflow affordance that misses state changes, are exactly the class of broken interaction this lens refuses to polish over.

## (c) Findings — ranked

### P0-1 · HIGH — `#cards`/`.chat` and `.tools` share one right lane; open decision cards render over (and click-dead) the entire map tool column

**Principle violated:** a polish lens assumes sound interaction; here two fixed chrome regions occupy the same lane, so an open card disables the map tools.

- Evidence (CSS): `console.css:452` `.tools { … right: calc(var(--gap) * 2 + var(--rail-w2)); … }` and `console.css:547` `.cards { … right: calc(var(--gap) * 2 + var(--rail-w2)); width: 372px; … }` — the identical `right` anchor; `.chat` (`console.css:530`) shares it too. Computed z (probe): `#cards` = 30 (`--z-talon`), `.tools` = 10 (`--z-map-ui`).
- Evidence (live probe, wui-breakout): overlap of the two boxes is **42×302px @1280×800 T+6, 42×117px @1440×900 T+5, 42×302px @1920×1080 T+6**. `elementFromPoint` at each tool button centre: at 1920 T+6 **all seven tool buttons** (Reset to north, 2D/3D, Zoom in, Zoom out, Frame the incident, Layers, Thermal map) are covered by card children (`SPAN.check`, `SPAN.fragility`, `SPAN.auth-pill.owned`, `SPAN.lapse`, `ARTICLE.card.needs`, `DIV.opts`, `BUTTON.opt`) — the whole column is click-dead while the gate card is open; at 1440 T+5 `Zoom in` is covered by the ALSO-WAITING `BUTTON.row`.
- Evidence (screenshots): `qa/final-polish.png` — the zoom tool pill sits inside the ALSO-WAITING row's band next to "7:00 left", with the map's FT-02 label running under the "−" button; temp crop `live-1440-overlap.png` (fresh load, same state) shows the same fusion.
- Why it matters: the operator loses map navigation exactly when a decision card is open — the highest-stakes moment. Per the skill's severity scale this is `HIGH` on sight.

**Fix (buildable):** give the tool column its own lane instead of sharing the cards/chat lane. In the `:root` scale block add
`--lane-cards: calc(var(--gap) * 2 + var(--rail-w2) + var(--tools-w) + var(--gap));` ( = 68 + 40 + 12 = 120px at 1×; `--tools-w` = 40 per `docs/anatomy/index.html:128`), then use it on `console.css:547` (`.cards`) and `console.css:530` (`.chat`) — cards/chat shift 52px left of the tool column; the tool column keeps `right: calc(var(--gap)*2 + var(--rail-w2))`. Update the anchor note "chat right 68 = 2·GAP+RAIL(44)" (`docs/anatomy/index.html:112`) to 120. Add a verify check asserting no pairwise box intersection of `.tools`, `#cards`, `.chat` at 1280/1440/1920.

### P0-2 · HIGH — At the 1280×800 verified floor the incident title paints over the posture/gate pill (topbar garble, current build)

**Principle violated:** "text slots are min-width 0 + ellipsis" is the console's own pattern (`docs/anatomy/index.html:125`) — it is applied one element too low, so the ellipsis never engages.

- Evidence (live probe @1280×800, T+6, current CSS): `.sitbtn` layout box is **25px** wide `[148..174]`, but its `<b>` title renders at `[157..340]` with `scrollWidth == clientWidth == 182` (no clipping — the ellipsis in `console.css:430` never fires because the `<b>` is content-sized inside an unclamped `<span>`), while `.posture` starts at x=182 — i.e. the title paints **158px over the posture pill** ("PLAN · GATE 10:00 LEFT"), garbling both. `textPaintsOverPosture: true`; zero page errors.
- Evidence (screenshots): fresh capture `live-1280-topbar.png` (temp) is a pixel match for the shipped `qa/e2e-break-1280.png` garble — the break captured 2026-10-27 (commit `fcd5f58`) is **still live**; the 1310px compact rule (`console.css:997-1000`, comment "compact the topbar before the posture pill can ever collide") reduces padding/gap but does not fix the overflow.
- Root cause: `console.css:428` puts `min-width: 0` on the `.sitbtn` flex item, but the inner wrapper `<span>` (rendered at `commandConsole.js:536`) has no `min-width: 0`/`overflow: hidden`, so the shrink lands on the button box while the nowrap content escapes it.

**Fix (buildable, one line):** `.sitbtn > span { min-width: 0; overflow: hidden; flex: 0 1 auto; }` — then the existing `text-overflow: ellipsis` on `.sitbtn b/small` (`console.css:430-431`) engages and the title ellipsizes instead of painting over neighbours. Add a verify check that at 1280×800 no topbar child's *content* box crosses a sibling's border (`scrollWidth`-aware, not just `getBoundingClientRect`).

### P1-3 · MEDIUM — Dock overflow affordance (`.dock-more`) misses state changes; clipped widgets sit with no pill after time-scrub or most resizes

**Principle violated:** an affordance that exists only in the state a test happens to load is not an affordance — component states must be complete.

- Evidence (live probe @1280×800): fresh load → `hidden=0`, no pill (correct); after `player.setTime(6)` → **2 widgets clipped (`offsetLeft+offsetWidth > clientWidth+1`), pill absent**; after resize 1280→1281 → still 2 clipped, **pill absent**; after resize 1281→1280 → pill appears. Zero page errors. Repeated across independent page loads.
- Evidence (code): the only call site is `commandConsole.js:1116` (inside the dock render); creation logic `commandConsole.js:1118-1131` computes the same `hidden` count my probe reproduced in-page (2) — so the function is evidently not reached on every path that changes widget layout.
- Evidence (screenshots): `live-1280-dock.png` (temp) — Fire growth clipped mid-chart, no pill; `qa/final-rev.png` @1440 — the Fire growth widget cut by the viewport edge with no pill and no fade cue strong enough to read as "more".
- Context: `DESIGN.md §7` guard 3 and the D3 comment (`commandConsole.js:1117`) specify the pill whenever `.slots` clips at 1280; `tools/verify.mjs:390` only exercises a **fresh `phase=D` load**, so the miss-path is invisible to the suite. Verify/e2e were **not run** here (they write `qa/` captures; restricted to report-writing only) — the guard passing is cited as documented, the miss-path is what I measured.
- Impact: `MEDIUM` — the clipped content is still wheel-scrollable, but the documented affordance vanishes in normal operation (advancing scene time), which is precisely when new widgets appear.

**Fix (buildable):** make the affordance reactive instead of render-pass-coupled: after any `setTime`/layout commit, call `updateDockMore()` inside a double-`requestAnimationFrame` (measure after layout settles), or attach a `ResizeObserver` on `#slots` plus a `MutationObserver` on its child list that call `updateDockMore()`. Extend `tools/verify.mjs` D3 with a "load → setTime → assert pill" step so the miss-path is guarded.

### P1-4 · MEDIUM — Theme switch smears ~35 simultaneous colour transitions console-wide; no suppression on swap

**Principle violated:** the skill's detection row — "Color transitions plus a theme toggle with no `disableTransitionOnChange` or override → the theme-switch suppression recipe."

- Evidence (live probe): 30ms after setting `data-theme="daylight"` (what `applyTheme` does — `commandConsole.js:272-279`), `document.getAnimations()` shows **38 transitions in flight, 35 of them colour transitions** (sample: `color`, `color`, `color`, `border-bottom-color`, `box-shadow`).
- Evidence (CSS): colour-carrying transitions at `--dur-fast` 120ms on `.btn` (`console.css:370`), `.opt` (`:630`), `.chip` (`:401`), `.seg button` via parent, plus the daylight override block (`:1079+`). `DESIGN.md §6` documents the toggle and the theme-color meta, but no suppression.
- Impact: every EOC Darkroom ↔ Field High-Lux toggle smears every surface for ~120ms — visible inconsistency on an infrequent, deliberate moment.

**Fix (buildable):** the suppression recipe — on toggle, add `html.theme-swapping *, html.theme-swapping *::before, html.theme-swapping *::after { transition: none !important; }` around the attribute change, force a style flush (`getComputedStyle(document.documentElement).color`), then remove the class on the next `requestAnimationFrame`. ~6 lines in `applyTheme` (`commandConsole.js:272`).

### P2-5 · MEDIUM — Collapsing one widget replays the 200ms `widget-in` entrance on **every** widget in the dock

**Principle violated:** "High-frequency interactions respond instantly… Reserve expressive motion for infrequent moments" — a routine collapse/expand is neither infrequent nor expressive-worthy, and mass re-entrance reads as the dock re-booting.

- Evidence (live probe @1440×900): clicking one widget's collapse button (`[data-act="wmin"]`), sampled 80ms later — `fleet`, `weather`, `events` all running `animation: widget-in` at `currentTime 0`.
- Evidence (code): `commandConsole.js:1103-1107` rebuilds **all** widget nodes (`slots.innerHTML = …`) whenever the layout tuple changes, and `ui.min` is part of that tuple; `.widget` carries `animation: widget-in var(--dur-base) …` (`console.css:751`, 200ms).

**Fix (buildable):** exclude collapse/expand from the rebuild trigger (collapse should toggle a class on the existing node, not rebuild the strip), or scope the entrance to genuinely new slots: add the `widget-in` animation via a `.widget.is-new` class applied only to inserted nodes (and remove it on `animationend`).

### P2-6 · LOW — Documented motion contract (entrances 120ms / exits 80ms) does not match the shipped entrance tier — doc/source drift

**Documented-deliberate conflict, reported as such.** `DESIGN.md §6` ("Entrance/exit asymmetry: entrances 120ms, exits 80ms") and the anatomy Motion row (`docs/anatomy/index.html:113`) state 120/80, but every entrance animation ships at `--dur-base` **200ms** — `.pop` (`console.css:466`), `.chat` (`:530`), `.widget` (`:751`), `.toast` (`:889`), `.scrim` (`:908`) — and the modal at 320ms (`:910`). Only `.tip` implements the contract (enter 120 / exit 80, `console.css:555-556`). Either the docs are stale or the entrance tier is; the lens only asks that the same detail not be done two ways silently. **Fix:** retime the one-shot entrances to 120ms or amend DESIGN.md §6 to name the 200ms popover/card tier and the 320ms modal as deliberate exceptions.

### P2-7 · LOW — Concentric-radius conflict on `coa`/`dissent`/`menu` inners (documented CONFLICT)

**Ground-truth conflict, reported as such.** `docs/anatomy/index.html:108` records: "Concentric rule: r_in = max(2, r_out − pad). CONFLICT: applied inner radius on coa/dissent/menu is 4 where the formula yields 2." The source even encodes the wrong arithmetic in its own comments — "concentric: 10px pop - 12px padding → 4px" (`console.css:470`; same note at `:654`) when 10 − 12 clamps to 2. At `--r-lg` 10 with `--s-3` 12 padding (`console.css:277-281`, 466), the inner should be 2px; shipped `--r-xs` is 4px. **Fix:** inner items at `border-radius: max(2px, var(--r-lg) - var(--s-3))` (or clamp a new `--r-in` token to 2px) on `.menu-item`, `.coa`, and the dissent block — a 2px visible tightening at popover/card corners.

### P2-8 · LOW — `overscroll-behavior: contain` on only one of six scrollable overlays

- `console.css:573` `.pbody` has `overscroll-behavior: contain` — the only one. Missing on `.pop` (`:466`, `overflow: auto` — the skill's exact dialog/menu case), `.cards` (`:547`), `.slots` (`:742`), `.app.calm .slots` (`:750`), `.widget .wbody` (`:796`), `.suggest` (`:718`).
- Mitigated today: `body { overflow: hidden }` (`console.css:352`) means nothing behind them scrolls, so impact is minimal — but the skill's detection row is unconditional for menus/dialogs. **Fix:** add `overscroll-behavior: contain;` to the six rules above.

### P2-9 · LOW — 30 `:hover` rules, none behind `@media (hover: hover)` — documented desktop-only scope (conflict, not silently judged)

Grep: 30 `:hover` occurrences in `console.css`, zero `@media (hover: hover)` guards. The skill requires hover-only styling behind the query because `:hover` latches on touch; this console documents the opposite scope — "Target: control-room and desktop displays… No phone layout" (`console.css:1006`, anatomy: "No phone layout; 1280 floor"). **Reported as a deliberate-scope conflict, not a defect**; if a touch panel ever runs this console, the latch behaviour becomes P1. No fix required while the documented scope holds.

### P2-10 · LOW — Press guard done two ways: `.btn`/`.opt` exclude disabled, `.rbtn`/`.chip` don't

`console.css:372` `.btn:active:not(:disabled)` and `:632` `.opt:active:not(:disabled)` carry the guard; `:373` `.rbtn:active` and `:375` `.chip:active` don't (the reduced-motion block `:338` mirrors the same mix). Browsers don't match `:active` on disabled buttons, so impact is nil today — but the skill flags exactly this "same detail two ways". **Fix:** `:not(:disabled)` on both for consistency.

### P2-11 · LOW — Icon stroke fixed at 1.7px regardless of adjacent text weight

`console.css:360` sets `svg.ic { stroke-width: 1.7 }` for the whole kit; the skill wants rendered stroke tracking adjacent weight (1.5px @400 → 2.5px @700). Most pairings here are medium/semibold, where 1.7 sits acceptably; next to `--fw-bold`/semibold headings it reads slightly light. Partially verified (static read; no per-pair measurement). **Fix (optional):** `b svg.ic, .caps svg.ic { stroke-width: 1.9 }` — or accept as project convention and note it in DESIGN.md.

**Not verified / not run:** `node tools/verify.mjs`, `node tools/e2e.mjs` (both write `qa/*.png`; this review may only write its report) — their documented assertions (red discipline, text-4 contrast, dock guard, axe 0 violations) are cited from `DESIGN.md §7`, not re-executed. The `phase=D` widget set was not reproduced, so the exact trigger condition of P1-3 is inferred from observed behaviour, not from the code path. Per-pair icon-stroke rendering (P2-11) was not pixel-measured.

## (d) What the lens would genuinely praise

- **Transition hygiene is airtight.** Zero `transition: all` and zero `will-change` in 87KB of CSS (grep counts: 0 and 0); all 17 `transition` declarations name their properties — the skill's two most-violated rows elsewhere are clean here.
- **The reduced-motion tier (`console.css:328-342`) is exemplary** — durations re-tiered to 80/120ms, continuous loops stopped, entrances collapsed to opacity-only (`from { opacity: 0 }` redefinitions), presses/shakes neutralized — plus a `prefers-reduced-transparency` block (`:343-345`). This is the skill's gating requirement done completely, including the opacity-survival fallback.
- **Hidden entrance state lives in the `from` keyframe**, base rules stay visible (`:333-336`, `:468`, `:534`, `:761`) — exactly the pattern the skill's checklist prescribes; no `opacity: 0` base rules waiting on animation.
- **Icons:** one kit (`svg.ic`), `stroke: currentColor`, states taken from CSS colour/opacity — zero hardcoded `fill="#"`/`stroke="#"` in `commandConsole.js` (grep: 0); no `<img>` elements exist, so the image-outline rule is satisfied vacuously.
- **`.tip` (`console.css:555-556`) implements the enter-120/exit-80 asymmetry exactly** as the contract describes, with the comment to match.
- **The scroll-fade system** (registered `@property --fade-start/--fade-end` driven by each element's own scroll timeline, `:321-322`, `:949-972`) is high-craft affordance work — overflow edges that explain themselves.
- **The dock-more pill concept** (`commandConsole.js:1118-1131`) is the right affordance — counts clipped widgets, scrolls on click, disappears when nothing clips; only its trigger wiring fails (P1-3).
- **Token architecture** (three tiers, zero-raw-hex outside token blocks, documented OKLCH deviation — `DESIGN.md §1`) keeps components consuming tokens only; spot-checked rules all read `var(--…)`.

## (e) Skill hard gates, bans and floors — pass/fail

| Gate / ban / floor | Status |
|---|---|
| No `transition: all` (ban) | **PASS** — 0 occurrences |
| `will-change` only when needed, named property | **PASS** — 0 uses |
| Keyframes never for interactive state toggles (ban) | **PASS** — state changes use transitions; keyframes are one-shot entrances + ambient loops, all stopped under reduced motion |
| Press scale `0.96` / 150ms ease-out | **CONFLICT (deliberate)** — documented dual idiom: `translateY(1px)` wide + `scale(0.97)` chips, 40ms in / 120ms `--ease-out-expo` (`DESIGN.md §6`; anatomy "Press idioms") — consistent project convention = preference, not a finding |
| `bounce: 0` (motion library) | **N/A** — no motion library in use |
| Hidden state in `from` keyframe, not base rules | **PASS** |
| Reduced-motion gating on all movement (floor) | **PASS** — `console.css:328-342` |
| Theme-switch suppression | **FAIL** — verified 35 in-flight colour transitions per swap (P1-4) |
| Icons: one library, `currentColor` (floor) | **PASS** — 0 hardcoded fills/strokes |
| Icon stroke tracks adjacent text weight | **PARTIAL** — fixed 1.7px (P2-11) |
| `@media (hover: hover)` for hover styling | **FAIL literally** (0/30) — documented desktop-only scope (`console.css:1006`); reported as deliberate-scope conflict (P2-9) |
| `overscroll-behavior: contain` on scrollable overlays | **PARTIAL FAIL** — 1 of 6 scrollables (P2-8) |
| `:active` excluded on disabled | **PARTIAL** — `.btn`/`.opt` yes, `.rbtn`/`.chip` no (P2-10) |
| Concentric radius (outer = inner + padding + border) | **CONFLICT (documented)** — anatomy flags inner 4 where formula yields 2 on coa/dissent/menu (P2-7) |
| Image outlines (pure black/white, 1px inset) | **N/A** — no `<img>` elements in console markup |
| Forced-colors: keep an edge under shadow removal | **NOT HANDLED** — no `forced-colors` query; all primary surfaces carry real 1px borders so structure survives, but the box-shadow-only focus ring (`console.css:122`) would vanish (focus rings belong to `better-accessibility`; noted as boundary, not scored) |

**Verdict per the skill's reporting rule: `Block`** — two HIGH findings remain (P0-1, P0-2); everything in the table stays as work to do.
