# 05 · Design review — appllama-app-design-skill lens

Reviewed: 2026-11-01 · Reviewer: appllama-app-design-skill subagent (read-only)
Rubric: `C:/Users/rudra/.zcode/skills/appllama-app-design-skill/SKILL.md` (v1.3.0, read in full this session)
Ground truth cited, not re-measured: `docs/anatomy/index.html` (rev A · 2026-11-01), `DESIGN.md` (v2 polish pass 2026-10-28).
Visual evidence: `qa/final-polish.png` (1440×900), `qa/final-rev.png` (1440×900), `qa/calm-plan.png` (1920×1080), `qa/e2e-break-1280.png` (1280×800).
Evidence crops I generated this session (ffmpeg, 2× nearest-neighbor) live in `docs/design-reviews/_crops/` and are cited below.

---

## (a) Lens summary

The Appllama skill defines the bar for app UI that "sits on a phone next to the best-designed apps in the world": native fidelity (semantic color tokens in **both themes**, one icon family, a type hierarchy with **tabular numerals on anything that counts**, one elevation system, a strict 4/8 spacing base), navigation semantics where presentation carries meaning, and an **anti-slop code** enforced as a mechanical pre-flight: exactly 1 accent hue, all corner radii from a stated scale, 0 emoji in chrome, 0 unbranded gradients, 0 duplicate labels for one intent. It demands **full state cycles, not the happy path** — skeletons matching final layout, composed empty states, inline specific errors, truncation with long content — and a motion law: a frequency gate (100+×/day gets platform default), a named one-word purpose, timing under 300 ms with strong ease-out, exits faster than entrances, compositor-only properties, Reduce Motion respected. Its non-negotiable is the verification loop: a screen "does not exist until you have seen it running," hunted for one-frame glitches and truncation at 100% zoom, with tap targets ≥ 44 pt and contrast passing in both themes. This review adapts the phone-native laws to a fixed-viewport (1280 floor, "no phone layout") desktop command console and flags every untranslatable law as a documented conflict rather than a silent fail.

## (b) Verdict + score

**8 / 10** (skill defines no numeric scale; 1–10 used). This is one of the most disciplined design systems this lens can audit — the anti-slop pre-flight literally exists as CI guards — but the console's own QA screenshots contain two visible floating-region collisions (topbar at its documented 1280 floor; the also-waiting card queue under map zoom controls in the hero "final-polish" shot), which is exactly the truncation/clearance defect class the lens's simulator loop exists to catch.

## (c) Findings

### P1-1 · Topbar collides at the documented 1280 floor — incident title paints over the posture pill, the statutory gate countdown, and the TFR banner

**Evidence.** `qa/e2e-break-1280.png` — the project's own e2e capture at 1280×800, phase D (taken at `tools/e2e.mjs:286-288`), rendered at native size when I read it — shows "Encinal Canyon · WUI breakout" overlapping the `PLAN` pill, the amber `GATE 10:00 LEFT` chip, and the `TFR · AIR ATTACK OPS · UAS FLOOR ≤ 150'` pill as garbled double-printed text. My crop `docs/design-reviews/_crops/topbar-1280.png` (from that screenshot, topbar band at 2×) confirms glyph-on-glyph overlap.

**Root cause (read from source).** `.sitbtn` carries `min-width: 0` (`console.css:428`) but the button's inner flex item — the `<span><b>…</b><small>…</small></span>` rendered at `commandConsole.ts:543` — has no `min-width: 0`/`overflow` of its own. A flex item defaults to `min-width: auto`, so the `white-space: nowrap` content refuses to shrink; the ellipsis declared on `.sitbtn b`/`.sitbtn small` (`console.css:431-432`) never engages, and the button's content paints over its neighbors. The 1310 px compact query (`console.css:997-1000`) hides `.sitbtn small` and tightens gap/padding but cannot stop the overflow — and its own comment (`console.css:995`) claims the breakpoint exists so "the posture pill can never collide with the situation meta." The e2e shot disproves that claim at the stacked worst case (long title + posture + open gate + TFR banner). This violates the console's own hug-vs-flex rule — anatomy index, Pattern table: "text slots are min-width 0 + ellipsis; overflow resolves by hiding, not shrinking" — and the lens's DoD line "truncation with long content" verified.

**Why it matters at this severity.** 1280×800 is the product's documented verified floor (anatomy index note 4; shell sheet "1280 × 800 (product floor; no phone layout)"), and one of the occluded elements is the statutory gate countdown — the ISA-18.2 decision clock (DESIGN.md §4.2, §4.6). Unreadable statutory clock at a supported viewport is a functional defect, not a cosmetic one.

**Fix (buildable).** One line: `.sitbtn > span { min-width: 0; overflow: hidden; }` in `console.css` near line 428 (keep the existing ellipsis on `b`/`small`). Then harden the suite: in the V1 1280 check (`tools/e2e.mjs:285-292`), assert the `.sitbtn` rect does not intersect the `.posture`/`.gatechip`/TFR-chip rects at phase D — the current check only tests page overflow and `#cards` clearance.

### P1-2 · The "ALSO WAITING" card queue has no right-hand clearance — live countdown text renders under map zoom controls and rail buttons

**Evidence.** `qa/final-polish.png` (1440, the "final polish" ship capture) read at native size: the zoom toolgroup's `+` button sits directly on the mini-card's countdown "7:00 left" and the `−` button clips the `FT-02` chip. My crop `docs/design-reviews/_crops/alsowaiting-polish.png` (2×) shows the buttons overlapping the amber countdown text. At 1280 the same queue slides under the right rail: `docs/design-reviews/_crops/rail-1280.png` (from `qa/e2e-break-1280.png`) shows card text fragments ("…TION · EA", "T+0:16", "FT…") painted beneath the rail's mic/shield buttons.

**Coverage gap (read from source).** The V1 viewport check asserts clearance only for the decision-card stack: `cardsOverlap: cards.left < rail.left - 4` (`tools/e2e.mjs:285-292`). The also-waiting queue — a different element — is never tested against `#rail` or the map zoom toolgroup. Z-order makes it worse: the glass controls sit above the card text (map-ui layer at z10 vs. the queue), so the collision reads as content swallowed by chrome — the "elements that reflow after appearing / swallowed content" class the lens's full-motion pass hunts.

**Fix (buildable).** Give the mini-card queue the same right inset as the cards column — e.g. `right: calc(var(--gap) * 2 + var(--rail-w2))` or a `max-width` clamp — in the queue's rule in `console.css` (the `.mini`-adjacent block, cf. `.mini .row` at `console.css:682`); and extend the e2e V1 evaluate to collect the queue's rects and assert `right <= rail.left - 4` and no intersection with the zoom toolgroup, at both 1280 and 1440.

### P1-3 · Dock overflow affordance is missing at intermediate widths — a widget clips at 1440 with no "+N widgets" pill

**Evidence.** `qa/final-rev.png` (1440) read at native size plus my crop `docs/design-reviews/_crops/dock-right-1440.png`: the fifth dock widget ("Fire growth", `206 ac`) is sliced by the right viewport edge and **no** `+N widgets ▸` pill is visible. DESIGN.md §7.3 specifies the pill as the overflow affordance and the guard asserts it — but only at exactly 1280×800 phase D (pill present, count correct, scroll advances) and at 1920 (no overflow). 1440 is between the two tested points and is the viewport of two of the four hero screenshots. Per the lens, overflow that resolves silently ("overflow resolves by hiding, not shrinking," anatomy index) must still be discoverable; here a whole widget's existence is not.

**Fix (buildable).** Drive `.dock-more` visibility from measured overflow at any width (e.g. on resize: `slots.scrollWidth > slots.clientWidth` toggles the pill and its count) instead of the current phase/width-conditioned rendering, and add a 1440×900 case next to the existing 1280/1920 assertions in the docking guard (DESIGN.md §7.3).

*(Side note from the same crop, not a finding: the Evacuation widget title truncates TALON's dissent note to "TALON · I was wron…". The verbatim dissent is preserved elsewhere per DESIGN.md §4.4, but "I was wron…" is an awkward public preview; consider a shorter title-side label with the full note on hover/detail.)*

### P2-1 · The console's own concentric-radius rule is violated in three components (self-documented CONFLICT)

**Evidence.** Anatomy index, Radii row: "Concentric rule: r_in = max(2, r_out − pad). **CONFLICT:** applied inner radius on coa/dissent/menu is 4 where the formula yields 2." Source confirms: `.menu-item { border-radius: var(--r-xs) }` with comment "concentric: 10px pop − 12px padding → 4px" (`console.css:470`), same pattern on `.coa` (`console.css:654`) and `.dissent` (`console.css:673`); `--r-xs: 4px` at `console.css:277`. The lens's shape-lock law: "One corner-radius scale, stated as a rule … and never violated. Mixed radii without a stated rule read as assembled-from-parts" — the scale exists (4·6·8·10·12·pill, `console.css:277-282`) and all values are on it, but the stated *rule* is breached by its own components.

**Fix.** Either apply `max(2, …)` honestly (2px inner radius on those three), or amend the rule to `r_in = max(4, r_out − pad)` and update the anatomy CONFLICT note. One or the other; the current state is the worst of both.

### P2-2 · Two unicode dingbats ride in chrome beside the SVG icon set

**Evidence.** The lens bans emoji-as-iconography and demands one icon family. The console has a proper SVG system (`ic('check','xs')`, `ic('mic')`, rail/tool icons throughout), yet two text dingbats appear in chrome: `⚠` in the fragility line (`commandConsole.ts:687`, "⚠ Fragile if: …" — visible in `qa/e2e-break-1280.png` gate block) and `⟡` in the ICS-205 drone chip (`commandConsole.ts:1440`). My grep for emoji/dingbat codepoints in `commandConsole.ts` returned only these plus `✓` used as a text prefix (e.g. "✓ acknowledged", `commandConsole.ts:656`), which reads as product voice rather than iconography.

**Fix.** Add `warning` and `star` glyphs to the `ic()` symbol set and swap the two literals; keep `✓` prefixes if desired (they are typographic, not pictographic).

### P2-3 · `--dur-slow: 320ms` exceeds the lens's 300 ms timing ceiling

**Evidence.** `console.css:292` (`--dur-slow: 320ms`), echoed by the anatomy motion row "120 / 200 / 320ms". The lens: "Everything else is timing, under 300 ms, strong ease-out." Mitigations the lens itself grants: the frequency gate rates sheets/modals/drawer as "occasional → standard motion," and its spring vocabulary accepts a 400 ms settle — so this is a borderline miss, not a violation, and the curve family (`--ease-out-expo`, DESIGN.md §6) is exactly the "strong ease-out" the lens wants.

**Fix.** Trim to 280 ms, or record 320 ms as deliberate in DESIGN.md §6 so the deviation is stated rather than implicit.

## (d) What the lens would genuinely praise

- **The slop pre-flight is not a checklist here — it is CI.** The lens says "the slop pre-flight is mechanical. … A failed count is a fix, not a judgment call." DESIGN.md §7 implements exactly that: the verify guard parses the live stylesheet and fails on red-discipline breaches, recomputes the `--text-4` WCAG ratio in-page (≥ 4.5:1), and asserts the dock overflow affordance. I did not re-run the suites in this read-only review; I cite them as documented and code-inspected.
- **Full state cycles, proven adversarially.** The e2e battery I read (`tools/e2e.mjs:236-262`) injects six-option cards, a zero-option ask, duplicate/empty/uncited items, demoted interrupts, time edges, and 200% zoom — the "ship full state cycles, not the happy path" law taken literally. Composed quiet states exist (`.quiet` dashed empty pattern, `console.css:689`).
- **Motion grammar is the lens's grammar.** Frequency gate respected (continuous loops confined to status dots, LIVE pip, and mascot — I enumerated every `animation:` rule: `console.css:396, 445, 517, 586-596`); exits faster than entrances (80/120 ms, DESIGN.md §6); compositor-only fills (`scaleX`/`translateX`, DESIGN.md §6); dual press idioms documented per element class; and **Reduce Motion is complete** — the stop list at `console.css:331` covers all six continuous loops I found, durations collapse to 80/120 ms (`console.css:329`), presses and shakes go still (`console.css:338-340`), with a `prefers-reduced-transparency` fallback on top (`console.css:343-346`).
- **Numbers formatted like a product, and tabular everywhere.** `tabular-nums` on every data token (`.mono/.num` `console.css:356`, `.kpi b` `:438`, `.measure b` `:724`, `.batt` `:832`); screenshots show "1-h 4% · ERC 78", "ENE 22 G38 mph", "9:36 left", "206 ac", "ETA 0:13" — the lens's law 11 verbatim.
- **One grey family, one glass recipe, one accent spent where the money is.** A single neutral ramp (`--p-slate-0..12`, DESIGN.md §1); one glass formula for all floating chrome (anatomy Glass row); cyan reserved for the committed plan with solid geometry while proposed is dashed periwinkle (DESIGN.md §3 — chrominance AND geometry, the anti-equiluminance fix §3 documents is exactly the kind of decision this lens rewards).
- **Inline, specific epistemic content.** `qa/calm-plan.png` shows the COA table bolding the winning value per row (16 vs 17 min, 15 vs 37 homes); `qa/e2e-break-1280.png` shows the statutory gate with OWNED/REQ authority pills, a fragility line ("Holds while SH-12 keeps the hairpin open — a gust over 42 mph…"), and an explicit lapse consequence — "errors are inline and specific," exceeded.
- **Keyboard focus designed, not defaulted:** `:focus-visible` with ring + 7px halo (`console.css:354`).
- **Two-family typography with data floors:** Geist Sans + Geist Mono (`console.css:245-246`) with 10.5/11 px floors and a CI-guarded contrast contract (DESIGN.md §2).

## (e) Hard gates, bans, floors — pass/fail table

| Lens gate / ban / floor | Status | Evidence |
|---|---|---|
| Truncation & clearance verified at 100% zoom (simulator loop) | **FAIL** — topbar overlap at the documented 1280 floor | `qa/e2e-break-1280.png`, crop `_crops/topbar-1280.png`; root cause P1-1 |
| Content never swallowed by chrome (full-motion pass hunt list) | **FAIL** — countdown under zoom buttons; card text under rail | `qa/final-polish.png` crops `_crops/alsowaiting-polish.png`, `_crops/rail-1280.png`; P1-2 |
| Overflow is discoverable (hide, don't shrink — affordance required) | **FAIL at 1440** — clipped widget, no pill (pass at 1280 per documented guard; pass at 1920) | `_crops/dock-right-1440.png`; DESIGN.md §7.3; P1-3 |
| Emoji in UI chrome = 0 | **PASS** (two dingbats ⚠/⟡ flagged P2-2; no emoji) | grep over `commandConsole.ts`, this session |
| One grey family | **PASS** | DESIGN.md §1 (`--p-slate-0..12`) |
| Corner radii from a stated scale | **PASS** (all values on the 4–12/pill scale) | `console.css:277-282` |
| Shape rule never violated | **FAIL (self-documented CONFLICT)** — concentric rule breached in 3 components | anatomy index Radii row; `console.css:470, 654, 673`; P2-1 |
| Gradients without brand reason = 0 | **PASS** — wordmark gradient + glass rim are brand/material tokens | DESIGN.md §1 (Tier 3 tokens) |
| One accent, locked | **CONFLICT, documented-deliberate** — semantic state palette (amber/violet/red/periwinkle) alongside the cyan accent; the lens's override clause is arguably met (accent = committed plan only; every state also carried by geometry) | DESIGN.md §3, §5; anatomy "One accent" row |
| Contrast passes (≥ 4.5:1) | **PASS as documented + CI-guarded; not re-run in this review** | DESIGN.md §2 + §7 guard 2 |
| Light + dark verified | **PARTIAL** — Field High-Lux documented with deliberate 3D-stays-dark limitation; **no daylight screenshot provided, so not visually verified here** | DESIGN.md §6 |
| Reduce Motion respected | **PASS** — all 6 continuous loops stopped, durations collapsed, presses stilled | `console.css:328-341`; loop inventory this session |
| Timing under 300 ms, strong ease-out | **BORDERLINE** — 320 ms slow tier; curve family matches the lens | `console.css:290-292`; P2-3 |
| Tap targets ≥ 44 pt | **CONFLICT, documented-deliberate** — 22–40 px controls on a mouse-driven, fixed-viewport console ("no phone layout"); flagged because EOC wall displays are sometimes touch | anatomy Control heights row; `console.css:1007`; anatomy Layout row |
| Full state cycles designed | **PASS** | adversarial battery `tools/e2e.mjs:236-262`; `.quiet` `console.css:689` |
| No full-screen spinner for partial updates / skeletons only where shape known | **PASS** — no spinner/skeleton rules exist; state is scrub-derived (instant), boot layer covers startup only | grep of `console.css` (0 hits for spinner/skeleton); DESIGN.md §4.6 |
| 200% zoom / Dynamic-Type equivalent | **PASS as documented; not re-run** | e2e B7 `tools/e2e.mjs:258-262` |

**Verification statement.** Run this session: full read of SKILL.md, DESIGN.md, anatomy index; native-size reads of the four named screenshots; ffmpeg crops at 2× of the three collision regions; greps of `console.css` (radii, durations, fonts, tabular-nums, user-select, reduced-motion, keyframes/animation inventory, spinner/skeleton, media queries) and `commandConsole.ts` (topbar template, TFR pill, dingbat scan); source reads of `tools/e2e.mjs:230-300`. Not run: `node tools/verify.mjs` / `node tools/e2e.mjs` (this is a read-only design review; those suites are cited as documented in DESIGN.md §7 and code-inspected, not executed). Not verified visually: Field High-Lux light theme (no screenshot provided). Dimensions were not re-measured — anatomy index and DESIGN.md are treated as ground truth per the brief.
