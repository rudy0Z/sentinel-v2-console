# Design review · 08 — better-colors (colour discipline)

Scope: Sentinel command console, reviewed strictly through the `better-colors` lens (C:/Users/rudra/.agents/skills/better-colors/SKILL.md), read in full this session. Evidence: `console.css` (read in full, 1,141 lines), `DESIGN.md` (read in full), `docs/anatomy/index.html`, screenshots `qa/final-polish.png`, `qa/final-rev.png`, `qa/calm-plan.png`, `qa/e2e-break-1280.png`, plus targeted greps into `commandConsole.ts`, `terrainEngine.ts`, `tools/verify.mjs`. All contrast and hue numbers below were computed by me this session from the declared token values (scripts inline via `node` stdin; no browser). Nothing is estimated.

Severity mapping: the skill grades HIGH / MEDIUM / LOW; this report uses P0 = HIGH, P1 = MEDIUM, P2 = LOW. Per the skill, "Whether a pair is required to pass belongs to better-accessibility" — threshold questions are therefore only touched where the console's own floor rule (DESIGN.md §2) sets the bar.

## (a) Lens summary

The skill demands that a colour system be **ramps, not colors**: one neutral ramp, one accent ramp, and only the status ramps the product actually renders — every step earning a role, no token maintained for zero pixels. Primitives are named by hue, semantics by role, and components may reference only the semantic tier. Each hue carries **one meaning** interface-wide (anything within 15° of OKLCH hue counts as the same colour), colour must never be the sole carrier of meaning, and filled colour marks exactly one primary action per view. Ramps must hold their hue end to end and step finely at the light end. Every reported contrast value must be **measured against the surface it actually renders on**, never estimated, and every check that could not be run must be reported as not verified. HIGH on sight: text failing its required ratio, meaning carried by colour alone, or a semantic colour used against its meaning. Report ends **Block** if any HIGH remains.

## (b) Verdict + score

**7 / 10 —** A genuinely measured, CI-enforced, two-theme token system whose documented dark-theme contrast contract verifies to the decimal, held back by one always-on semantic-red violation of its own constitution and three hue-band collisions the 15° rule flags.

## (c) Findings

Grouped by the principle violated, ordered by severity, one row per root cause. "Measured" = computed this session from declared token values (see Verification).

### Principle: one color, one meaning / a semantic colour used against its meaning

| Sev | Location | Before | After | Why |
|---|---|---|---|---|
| **P0 (HIGH)** | `console.css:444` — `.live { … color: var(--critical); }`; consumers `commandConsole.ts:554` (class `live`/`review`/`past`/`record` on the clock). Visible in every screenshot: `qa/final-polish.png`, `qa/final-rev.png`, `qa/calm-plan.png`, `qa/e2e-break-1280.png` (topbar "● LIVE T+…") | LIVE session indicator renders `--critical` `#FF5B4E` + `blink` (console.css:445) in red whenever the head is live — i.e. always during operations | `.live { color: var(--text-2); }` (liveness already carried by the blink, the word LIVE and the clock), or introduce `--live: var(--working)` if a hue is wanted; extend the verify-guard selector list (`tools/verify.mjs:343`, currently `mic/pips/batt.low` only) with `\.live` so the constitution is enforced wholesale | The console's own constitution says red = life safety **only** (`console.css:120` "life safety ONLY"; DESIGN.md §5 "Red = life safety only", enforced by the red-discipline guard). A session-state dot is not life safety; a permanently blinking red topbar element in every mode — including PLAN and SIZING with an open gate — dilutes the von Restorff isolation §5 exists to protect. Not documented as deliberate anywhere in DESIGN.md (§5's re-tokenization table lists exactly mic, pips, battery — `.live` is absent). This is the skill's HIGH-on-sight "semantic color used against its meaning" |

### Principle: token discipline — "Reuse the project's tokens" / the zero-raw-hex contract

| Sev | Location | Before | After | Why |
|---|---|---|---|---|
| **P1 (MEDIUM)** | `console.css:1127, 1131, 1132, 1135, 1136, 1137, 1138, 1139` (`#F7F5EF`), `1141` (`#FFFFFF`) — the "daylight component adjustments" rules, which sit **outside** the `:root[data-theme="daylight"]` token block (block ends at 1124) | Raw `rgba()/hex` literals in selector-scoped theme rules: e.g. `:root[data-theme="daylight"] .glass { box-shadow: inset 0 1px 0 rgba(255,255,255,.9), … }` (1127), `.switch::after { background: #F7F5EF; }` (1139), `[aria-checked="true"] > .switch::after { background: #FFFFFF; }` (1141) | Promote each to a Tier-3 token declared inside the daylight block (`--glass-shadow-day`, `--track-line`, `--track-future`, `--pips-off`, `--bar-track`, `--conf-off`, `--knob-rest`, `--knob-day`, `--knob-on`) and reference them from the adjustment rules; re-run the documented scan | DESIGN.md §1 states "no raw `#hex` or `rgba()` literal may appear in `console.css` outside the two token blocks … Scanned clean as of 2026-10-28; keep it that way." I ran the scan (grep over `console.css`, excluding lines 17–317 and 1036–1124): **9 offending lines remain**, all in this section. The documented contract is violated or the scan is stale; either way the theme seam the contract protects is bypassed |

### Principle: one color, one meaning — the 15° OKLCH hue rule

Measured OKLCH (computed from declared hex): `--p-periwinkle-300` (plan-proposed) h261.1 L.781 · `--p-blue-500` (working) h257.4 · `--p-viz-blue` h264.3 · `--p-prov-blue` (prov-measured) h250.0 L.810 · `--p-amber-400` (needs) h73.3 · `--p-sand-300` h82.1 · `--p-orange-400` (plan-draft) h47.3 · `--p-orange-500` (fire front) h44.8 · `--p-viz-orange` h45.7 · `--p-prov-peach` (modeled) h47.1 · `--p-vermilion-600` (plan-cut) h31.5 · `--p-red-500` (critical) h28.1 · `--p-emerald-400` h154.0 · `--p-green-500` h155.0.

| Sev | Location | Before | After | Why |
|---|---|---|---|---|
| **P1 (MEDIUM)** | Primitives `console.css:40,42,52,53`; consumers: plan-proposed legend/map labels `commandConsole.ts:1416`, provenance badge `.prov.measured` `console.css:409`, working `.dot.working` `console.css:396`, viz series `.chart .s1/.s2` `console.css:861,863` | **Four roles inside one 15° band.** Worst pair: plan-proposed (#8FB8FF, h261.1) vs prov-measured (#8FC6FF, h250.0) — Δh 11.1°, ΔL only 0.029. A proposed-plan legend row beside a `MEA` provenance badge reads as the same colour carrying two meanings | Move `--p-prov-blue` ≥15° off h261 (e.g. toward h≈230) and widen ΔL to ≥0.08, then re-measure the badge pair ≥4.5:1 in both themes; alternatively accept the alias **and document it** in DESIGN.md §1 as one shared "operator-instrument blue" | The 15° rule treats these as one colour with two meanings (plan state vs provenance). Blue-500/periwinkle/viz-blue sit 3.3–6.9° apart too — four distinct jobs, one band |
| **P1 (MEDIUM)** | `console.css:136` (`--map-amber: var(--plan-draft)`), `44` (plan-draft), `51` (viz-orange), `54` (prov-peach); consumers `commandConsole.ts:1154` (Zone-2 "Warning" swatch = `var(--map-amber)`), `commandConsole.ts:1417` (legend "Draft revision" = same token), fire/viz legend `qa/final-polish.png` (orange chart line) | **Four meanings in a 2.6° cluster (h44.8–47.3):** TALON draft revision, physical fire front, data-viz series 1, provenance "modeled" — plus `--map-amber` aliasing makes the evac board's Zone-2 Warning swatch the *same token* as the legend's "Draft revision" (same hue, both dashed on the map: ts:1416–1417 dash language vs zone outlines in `qa/final-rev.png`) | Split the jobs: keep fire-front + viz-1 aligned (same subject, defensible); move `--p-prov-peach` ≥15° (toward h≈60); give evac-zone categories their own token (`--zone-warning`) distinct from `--plan-draft`, or disambiguate purely by geometry (zone = translucent fill, draft = dashed line) and say so in the legend | One hue, two documented meanings in the same legend (zone category vs plan revision state) is exactly the confusion the plan ladder's colour/geometry contract was built to prevent. Also `--p-amber-400` (needs) vs `--p-sand-300` (suppression) at 8.7° — two meanings, one colour by the rule |
| **P1 (MEDIUM)** | `console.css:665` — `.coa button.hd[aria-pressed="true"] { box-shadow: inset 0 -2px 0 var(--map-cyan); }` (visible in `qa/calm-plan.png`: COA A column underlined cyan while "GATE 10:00 LEFT" is open and the plan is a proposal); `console.css:851` — `.srow .dot.info { background: var(--map-cyan); }` (no consumer found in `commandConsole.ts` — grep "dot info" empty — a dead selector still armed) | Cyan (committed-plan hue) used as a COA-selection underline on an *uncommitted* plan, and mapped to a generic "info" dot | COA selection: `box-shadow: inset 0 -2px 0 var(--text-1)` to match the `.ptabs` selected treatment (`console.css:571`), or `--talon-ink` for a TALON recommendation; delete `.srow .dot.info` or remap to `--idle` | DESIGN.md §3: "The remaining cyan is reserved for committed (solid geometry only)." A selection affordance and an info dot are neither committed nor geometry |

### Principle: a ramp step no role consumes ("maintenance for zero pixels")

| Sev | Location | Before | After | Why |
|---|---|---|---|---|
| **P2 (LOW)** | `console.css:199` + `1086` (`--tint-committed-bg`, both themes); `console.css:143–148` + `1097–1102` (`--state-*` ladder) | `--tint-committed-bg` has zero product consumers (grep across `.ts/.js/.html` excluding node_modules: only the `tokens.html` documentation page lists it). The whole `--state-*` ladder has **zero** `var(--state-…)` consumers in `console.css`, `commandConsole.ts`, `terrainEngine.ts`, `index.html` (grep exit 1) — yet DESIGN.md §1 justifies the alias layer by "the TS bridge and older rules read them", and `TOKEN_KEYS` (`commandConsole.ts:258–272`) reads only `--plan-*`, `--prov-*`, `--map-*`, `--text-*`. The daylight `--state-proposed: #3B55C4` (`console.css:1097`) also diverges from the bridge-fed `--plan-proposed` (#8FB8FF), leaving two values for one meaning | Delete the dead ladder or shrink it to aliases with a verified consumer, and note the audit in DESIGN.md §1 | The skill bans steps/tokens nothing imports; a divergent dead alias is a trap for the next contributor |

### Principle: measure the rendered pair (text dimmed by opacity)

| Sev | Location | Before | After | Why |
|---|---|---|---|---|
| **P2 (LOW)** | `console.css:856` — `.erow.future { opacity: .35; }`; `console.css:480` — `.lrow.absent { opacity: .38; }` | Future timeline events measure **2.24:1** (text-2 at .35 over card surface) and absent map layers **1.93:1** (text-3 at .38) — computed composites | Add a precomposed `--text-dim` token (a solid step measured ≥3:1 against the card) or floor the opacity at ≈.55 and re-measure; keep the hierarchy by pairing with position/label ("future" rows are also right-aligned after the playhead) | The dimming *is* the meaning and the rows are not disabled controls, so the skill's "text on alpha: measure the rendered result, or use a solid token" applies — today the pair is unmeasurable at token level and fails the console's own 4.5 floor for content that is still real copy (timestamps, layer names) |

### Principle: hold the hue across the ramp / every step has a job

| Sev | Location | Before | After | Why |
|---|---|---|---|---|
| **P2 (LOW)** | `--p-slate-0..12` (`console.css:23–35`); `--p-emerald-400` vs `--p-green-500` (`console.css:48–49`) | Slate hue holds h264.3–270.6 end to end (good), but light-end steps are coarse: dL 0.131 (9→10), 0.113 (10→11), vs the skill's ≈0.04–0.05 light-end guidance; mid-ramp peaks at 0.135 (7→8). Dark end is properly fine (0.019–0.034). Separately, emerald-400 and green-500 are the same colour twice: Δh 1.0°, ΔL 0.021, two tokens with two meanings (safe zone vs done/ok) | For a dark-first UI the coarse light end is benign (those steps are text/inverse surfaces — all measured ≥4.5), so record the deviation rather than rebuild. Consolidate the greens: one primitive, two semantic tokens (`--map-ok: var(--done)`) or differentiate ≥15° | Ramp hygiene; the green duplication is the "second accent hue earns its place only when two things must be distinguishable" rule inverted — these two must *not* be distinguished, so they should be one token |

### Principle: one accent hue = TALON (focus borrows it)

| Sev | Location | Before | After | Why |
|---|---|---|---|---|
| **P2 (LOW)** | `console.css:122` — `--focus-ring: 0 0 0 2px var(--p-slate-0), 0 0 0 4px var(--p-violet-300);` | Focus ring is TALON violet (Δh 5.0° from `--talon`, 2.1° from `--talon-ink`) | Neutral ring (`--p-slate-9`), matching the daylight theme's own ink-ring approach (`console.css:1079`), or document violet as the interaction hue in DESIGN.md §5 | Focus is an operator/instrument state, not TALON activity; the halo geometry means meaning never rides on colour alone, hence LOW |

### Documented-deliberate conflicts (reported, not judged)

1. **OKLCH spec vs exact hex primitives** — DESIGN.md §1 documents the deviation (hex so the WebGL `terrainEngine` PALETTE shares literal values via `readDesignTokens()`, verified at `commandConsole.ts:258–299` and `terrainEngine.ts:397`). Notation is otherwise 100% hex/rgba + `color-mix(in srgb)`; the skill accepts a consistent project notation. Pass as documented.
2. **DESIGN.md §6 vs code on the daylight map** — §6 says "the 3D terrain keeps its dark lighting in every theme" as a documented limitation, but `commandConsole.ts` `applyTheme()` now calls `engine.setLighting('day', 900)` in daylight (P7 comment: "split-brain HIGH", visual audit 2026-10-30). The doc is stale relative to code. Colour consequence: `--plan-*` are still *not* overridden in the daylight block, so the bridge keeps feeding dark-theme vivid line values to a now day-lit terrain — whether those pairs hold on the bright surface is **Not verified** (no browser).
3. **Daylight map-ink alias divergence** — the CSS `--map-*` aliases switch to darker inks (`console.css:1091–1096`) while the terrain keeps the vivid dark values (per §6's own note). By design, the 2D board swatch and the 3D line for the same zone disagree in Field High-Lux; consequence worth a line in §6 when it is next edited.

## (d) What the lens would genuinely praise

- **The contrast contract is real and it verifies.** I independently recomputed all eight documented dark pairs: text-1..4 measure 16.12 / 9.92 / 6.32 / 5.16 on `#101218` and 16.63 / 10.24 / 6.52 / 5.33 on `#0C0E13` — matching DESIGN.md §2 (16.1/9.9/6.3/5.2 · 16.6/10.2/6.5/5.3) to the decimal — and text-4 on the `--bg-raised` composite computes 4.68:1, confirming the "lifted past spec" claim. Daylight text-1..4 compute 16.16/8.54/7.19/6.04 on `#F2F0EA` and 14.35/7.59/6.38/5.37 on the canvas — all ≥4.5, better than the theme block's own conservative comment ("≥4.3:1").
- **Status-on-tint pairs all clear the floor** (computed over the effective card composite): chip.critical 5.15, chip.needs 8.07, chip.talon 7.41, chip.ok 7.68, chip.working 5.29 dark; needs 5.04, critical 5.18, done 5.18, talon-ink 6.57, working 5.13 daylight.
- **Red discipline is architectural, not aspirational** — a constitutional rule (DESIGN.md §5), a CI guard that parses the live stylesheet and the rendered DOM (`tools/verify.mjs:306–350`), and three documented re-tokenizations; amber = "waiting on a human" is then held consistently across the gate chip, countdown, interrupt pips (`console.css:527,565`), hold message, `mk.ask` timeline mark, focused mascot mood and battery states.
- **The plan ladder never lets colour work alone** — proposed is dashed + hollow, committed is solid 1.5–2px, in CSS, in the 2D board (the TS renders a hollow dashed swatch with an explanatory `title`, `commandConsole.ts:1161`) and in the map legend (`commandConsole.ts:1416–1417`); vermilion/critical and plan-cut sit 3.4° apart — same meaning, same colour, as the rule wants.
- **One filled action per view, structurally** — `.btn.primary` is a neutral white gradient (`console.css:212,377`); the recommendation row is a neutral elevation step (`--opt-bg-rec`); no accent fill competes with the status hues, and the many tinted backgrounds encode distinct states/categories, which the skill explicitly allows.
- **Translucency is a ladder, not a habit** — 17 declared alpha steps; masks are alpha-only and theme-independent; chrome icons/wordmark/composites all measure ≥6.3:1 where checked (wordmark bottom stop 6.57:1 on raised; rail badge 10.99:1; primary button 15.14:1).
- **`--p-viz-orange` ships with a measured CVD note** ("validated: dark surface --p-slate-2, CVD ΔE 27", `console.css:51`) — the kind of evidence-over-vibes the skill asks for.

## (e) Hard gates, bans and floors

| Skill gate / floor | Status |
|---|---|
| Text pairs ≥ required ratio (console's own floor: every text token ≥4.5:1, DESIGN.md §2) | **Pass** — 14 dark + 15 daylight pairs computed; only the two deliberate opacity-dimmed states fail (P2 finding), disabled controls exempt |
| Meaning never by colour alone | **Pass** — plan ladder (geometry), timeline marks (shape), provenance/status (text labels) all paired |
| Semantic colour never against its meaning | **Fail** — `.live` in `--critical` (P0) |
| Ramps-not-colours: no token maintained for zero pixels | **Fail (light)** — `--tint-committed-bg`, `--state-*` ladder unconsumed (P2) |
| One meaning per colour (15° OKLCH rule) | **Fail** — blue band (proposed/working/viz-blue/prov-measured), warm band (draft/fire/viz/modeled), amber-vs-sand, cyan reservation broken twice (P1 ×3) |
| Fill exactly one action per view | **Pass** — neutral primary fill; tinted backgrounds encode states/categories |
| Notation consistency; no stray `oklch()` in a hex codebase | **Pass** — 100% hex/rgba + `var()`/`color-mix(in srgb)`; OKLCH deviation documented; the zero-raw-hex contract itself is violated by 9 lines (P1) |
| Gamut of every declared colour | **Pass** — every value is sRGB hex/rgba; no `oklch()`/P3 declarations exist to exceed gamut |
| Both theme blocks present, one switching mechanism | **Pass** — `:root` + `:root[data-theme="daylight"]` only; no `prefers-color-scheme` mixing; `prefers-reduced-motion/-transparency` blocks touch motion/surfaces, not hue semantics |
| Hold the hue across the ramp; fine light-end steps | **Pass with deviation** — hue holds 264–270°; light-end dL 0.10–0.13 vs ≈0.05 guidance (P2, benign for a dark-first UI) |
| Verification: "report every check you could not run as Not verified" | **See below** |

**Verdict per the skill's reporting rule: Block** (one HIGH remains — the P0).

## Verification

Ran this session (commands via bash + `node` reading program from stdin, no files created):

1. **Ramp/hue scan** — node script converting all 13 slate steps and 18 chromatic primitives to OKLCH and listing every primitive pair with Δh < 15° (outputs quoted in finding (c) tables).
2. **Contrast computation** — node script computing WCAG relative-luminance ratios from the declared token values: 14 dark pairs (text ladder on `#101218`/`#0C0E13`/effective card composite/card+`--bg-raised`; five status-on-tint chips; provenance on card; `.live`; badge; primary button; wordmark; the two opacity-dimmed states) and 15 daylight pairs (text ladder on four surfaces; five status-on-tint; badge). Values as quoted above.
3. **Raw-literal scan** — `grep -nE '#[0-9A-Fa-f]{3,8}\b|rgba?\(' console.css` with token-block ranges (17–317, 1036–1124) excluded: 9 hits at 1127–1141, all inside the daylight adjustment rules.
4. **Consumer greps** — `--tint-committed-bg`, `var(--state-`, `dot info`, `sw` zone map (`commandConsole.ts:1154`), `TOKEN_KEYS` (`commandConsole.ts:258`), `.live` class assembly (`commandConsole.ts:554`); `tools/verify.mjs` guard section read (`:306–381`); `terrainEngine.ts` `PALETTE`/`setLighting` declarations read.
5. **Visual inspection** of the four named screenshots (eyeball only — no pixel sampling).

Not run / Not verified:

- `node tools/verify.mjs` and `node tools/e2e.mjs` were **not executed** (they drive a served page + browser; not named by this ask). Guard *presence* is cited from reading `tools/verify.mjs`, not from a passing run.
- **Rendered contrast over the live WebGL terrain** — `.readout` text, `.dock-more`, and the map's own `tte` labels float on the map with no declared backdrop, so their real pairs depend on the terrain beneath; not measurable without a browser.
- **Daylight 3D rendering after `setLighting('day')`** (P7) — whether the dark-theme `--plan-*` values fed to the bridge hold on the day-lit terrain; not verified.
- The anatomy index (`docs/anatomy/index.html`) is monochrome by design (its own header: "Monochrome by design"), so it contributes pattern rules (plan ladder, red discipline, one-accent edge cue) but no colour measurements; `docs/anatomy/01-shell.html` was not needed for any finding and was not read.
