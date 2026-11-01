# 06 · Design review — apple-design lens

**Artifact:** Sentinel command console (dark "EOC Darkroom" + "Field High-Lux" themes)
**Lens:** `apple-design` (`C:/Users/rudra/.zcode/skills/apple-design/SKILL.md` — WWDC *Designing Fluid Interfaces* + *Principles of Great Design*, translated for the web)
**Evidence base:** `console.css` (read in full, 1141 lines), `DESIGN.md`, `docs/anatomy/index.html`, `docs/anatomy/01-shell.html`, screenshots `qa/final-polish.png`, `qa/final-rev.png`, `qa/calm-plan.png`, `qa/e2e-break-1280.png`, `commandConsole.ts` (targeted sections). All checks named below were executed this session (greps and file reads); nothing was re-measured that ground truth already documents, and nothing is claimed as "run" that wasn't.

---

## (a) Lens summary — what this skill demands

The skill demands interfaces that feel physical: **response** (feedback on pointer-down, continuous during the gesture, never only at the end), **direct manipulation** (1:1 pointer tracking with capture), **interruptibility** (animations re-target from the live on-screen value; never lock out input mid-transition), and **springs** with designer-facing damping/response — bounce reserved for gestures that actually carried momentum. Motion must hand off release **velocity**, project **momentum** to the landing point, keep **spatial consistency** (enter and exit along the same path, anchor `transform-origin` to the trigger), hint in the gesture's direction, and **rubber-band** at boundaries. Frame-level smoothness means compositor-only properties (`transform`/`opacity`) and `will-change` hints. **Materials** are translucent functional layers (`backdrop-filter`) whose weight encodes hierarchy — never a light translucent surface stacked on text-bearing glass — with scroll-edge fades instead of hard dividers and dim-to-focus for modals. **Typography** uses the platform system font unless there's a reason, size-specific tracking (negative at display sizes, positive on small caps), leading that tracks size inversely, hierarchy from weight+size+leading as a set, and respect for the user's text-size setting (`rem`/`em`). Accessibility responds to three independent signals: `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast: more` — reduced motion means gentler equivalents, not absence. Everything serves eight principles: purpose, agency, responsibility, familiarity, flexibility, simplicity (not minimalism), craft, delight.

## (b) Verdict + score

**7.5 / 10** — an unusually disciplined materials-and-restraint system that is Apple-grade in the large (one glass recipe, scroll-edge fades, constitutional color restraint, a genuinely thoughtful reduced-motion story, pointer-down press physics), undercut at the edges by a legibility collision at its own verified 1280 floor, a missing `prefers-contrast` response, and a px-frozen type scale that ignores the user's text-size setting.

## (c) Findings

### P1-1 · Topbar renders superimposed text at the product floor (1280×800, phase D) — the "hug vs flex" contract breaks exactly where it claims to be guarded

**Evidence.** `qa/e2e-break-1280.png` (topbar, ~y≈24–52): the incident title "Encinal Canyon · WUI breakout" is painted *under* amber chip text ("…OPS FLOOR…"-style fragments are legible interleaved with the white title), while the amber `TFR · AIR ATTACK OPS · UAS FLOOR` pill sits separately to the right. The white title bleeds through the chip because the chip's background is translucent by design — `--needs-soft: rgba(255,181,71,.14)` (`console.css:197`) — i.e. a translucent layer over live text, the exact configuration skill §12 bans ("never stack a light translucent surface on another — legibility collapses").
Mechanism: `.topbar` is a nowrap flex row (`console.css:423`); `.sitbtn` carries `min-width: 0` (`console.css:428`) **but its inner `<span>` does not**, so the nowrap title (`b { white-space: nowrap; overflow: hidden; text-overflow: ellipsis }`, `console.css:430`) never enters its overflow path — the span paints past the shrunken button box beneath later siblings (posture, TFR chip). The ≤1310px compaction (`console.css:997-1000`) hides only `.kpis .kpi.opt` and `.sitbtn small`; the TFR pill (rendered at `commandConsole.ts:535`) has no compact form. This contradicts (i) the anatomy's own pattern rule "overflow resolves by hiding, not shrinking" (`docs/anatomy/index.html:125`) and (ii) the source comment claiming the breakpoint was "extended … for the 1280×800 target" so the pill "can never collide" (`console.css:995-996`). The e2e V1 check at 1280 (`tools/e2e.mjs:282-289`) asserts overflow/rail/cards/widgets but has **no topbar-collision assertion**, so the guard cannot see this.

**Fix (buildable).**
1. One line: `.sitbtn > span { min-width: 0; }` — the existing ellipsis on `.sitbtn b` then engages and the title truncates instead of painting through siblings.
2. At `@media (max-width: 1310px)` give the TFR chip a compact idiom consistent with the anatomy's "hide, don't shrink" rule: cap it (`max-width: 180px; overflow: hidden; text-overflow: ellipsis`) and keep the full text in the existing `title` attribute (`commandConsole.ts:535`).
3. Extend e2e V1 (`tools/e2e.mjs:289`) with a bounding-box intersection assertion across `.topbar` children at 1280×800 phase D, so the floor is actually verified for the topbar and not just the dock.

### P1-2 · `prefers-contrast: more` is unimplemented — one of the skill's three accessibility signals is missing entirely

**Evidence.** Skill §14 requires responding to three independent signals. Two are present and good: `prefers-reduced-motion` (`console.css:328-342`) and `prefers-reduced-transparency` (`console.css:343-345`). The third is absent: `grep -n "prefers-contrast" console.css index.html commandConsole.ts` → no matches; repo-wide `grep -rn "prefers-contrast" --include="*.css" --include="*.ts" --include="*.html" . --exclude-dir=node_modules` → zero matches (ran this session). A console that ships a 10,000-lux outdoor theme has no excuse not to honor the OS-level contrast preference.

**Fix (buildable).** Add a block mirroring the existing two:

```css
@media (prefers-contrast: more) {
  :root {
    --border-subtle: var(--border-strong);
    --bg-surface-2: var(--bg-surface-1);
    --bg-surface-3: var(--bg-surface-1);
  }
  .chip, .status-pill, .prov, .gatechip { border-color: currentColor; }
  .glass::after { display: none; } /* grain is noise under a contrast demand */
}
```

### P2-3 · Type scale is fixed px end-to-end — the user's text-size setting cannot reflow the console

**Evidence.** Skill §15: respect the user's text-size setting; scale layout with text using `rem`/`em`. The entire ladder is px (`--fs-badge 10.5px … --fs-display 22px`, `console.css:247-256`) and layout tokens are px too (`console.css:267-304`); a targeted grep for `rem` in font declarations in `console.css` returned no font-size matches (only unrelated `letter-spacing` lines) — there is no rem anywhere in the type system. Mitigation exists — the adversarial e2e battery includes 200% zoom (`DESIGN.md §7`) — but browser zoom is not the user's text-size preference, and px type ignores the latter by construction. **Documented-deliberate conflict:** the data-density contract (`DESIGN.md §2` floors) is a real constraint; reported as a conflict, not silent non-compliance.

**Fix (buildable).** Convert the type ladder to rem (`--fs-body: 0.78125rem` = 12.5px at default 16px root, etc.) and move the three density breakpoints that assume px type (`--slots-h` at `console.css:324`, card compact at `console.css:648`, topbar compaction at `console.css:997`) to `em`-based or height+rem hybrid queries, then re-run the existing 200% battery — the harness already holds the line on layout survival.

### P2-4 · Timeline playhead animates `left`/`width` — violating the console's own compositor-only contract and skill §11

**Evidence.** `renderTimeline` sets inline `style.width` on `#tlfill` and `style.left` on `#tlhead` on every render (`commandConsole.ts:923-924`) while the very same codebase's bar contract says bars animate `transform: scaleX(var(--fill))` — "never `width`" (`console.css:840-845`, `DESIGN.md §6` "Compositor-only fills"). The positioned elements are `.track .fill` / `.track .head` (`console.css:772-775`). A repo-wide `will-change` count is 0 (`grep -c "will-change" console.css` → 0), so the one genuinely per-frame surface gets no hint either. Skill §11: animate only `transform` and `opacity`.

**Fix (buildable).** Reuse the shipped idiom: make `.track .fill` a full-width line with `transform: scaleX(var(--p)); transform-origin: left center;` (exactly `.bar i`, `console.css:841`), and wrap `.track .head` in a full-width zero-height carrier positioned `left: 0; right: 0` with `transform: translateX(calc(var(--p) * 100%))` — translate % on the full-width carrier equals track width, so the TS change is one `setProperty('--p', x)` per render instead of two style writes.

### P2-5 · Press feedback is missing on whole control families — the tactile grammar doesn't cover its full inventory

**Evidence.** Skill §1 demands pointer-down feedback. The dual press idiom covers `.btn` / `.opt` / `.rbtn` (translateY + specular collapse, `console.css:372-374`) and `.chip` (`scale(.97)`, `console.css:375`), as documented (`DESIGN.md §6`). But these families have hover states and **no `:active` at all**: map tool buttons (`.toolgroup .btn`, `console.css:454-457`), segmented buttons (`.seg button`, `console.css:390-392`), and every row-button (`.urow` `console.css:816-817`, `.erow` `console.css:853-854`, `.drow` `console.css:727-728`, `.mini .row` `console.css:682-684`). On a console whose identity is tactile (avionics press physics), dead-feeling zoom/layers/segmented controls are an inconsistency of the grammar, not an extension of it.

**Fix (buildable).** `.toolgroup .btn:active, .seg button:active { transform: scale(.97); transition-duration: 40ms; }` (compact-pill idiom per `DESIGN.md §6`) and give the row-buttons a background drop at `:active` (`background: var(--surface-pressed)`), 40ms in.

### P2-6 · Tracking is not size-specific — display sizes get no negative tracking; the one negative value is used once

**Evidence.** Skill §15: tracking is size-specific; large display text wants negative tracking. The system defines `--tracking-caps: .08em` (positive, applied to small caps labels — correct) and `--tracking-tight: -0.01em` (`console.css:263-264`); grep count for `tracking-tight` in `console.css` is 2 — the definition plus a single use on `.card h2` at 13.5px (`console.css:623`). The display sizes get nothing: `.modal h2` at 22px (`console.css:912`) and `.phead h1` at 17px (`console.css:560`, which carries *positive* `.1em` for the tactical-caps idiom). `.measure b` (22px, `console.css:724`) is mono/tabular and should keep 0 — mono numerals must not be tracked negative.

**Fix (buildable).** `letter-spacing: -0.015em` on `.modal h2` (the one sans-serif display surface); leave mono readouts and the caps idiom alone. Small, but it is the skill's explicit "a fixed letter-spacing is wrong somewhere" test, and today the answer is "at the display sizes."

### P2-7 · Documented-deliberate conflicts (reported as conflicts, not violations)

1. **Custom Geist over the platform system font** (skill §15: default to the system font, override only with a reason). The reason is documented at the `@font-face` block — "the console boots with no CDN" (`console.css:8-15`, consumed at `console.css:245`) — an offline-boot constraint, plus brand consistency. Accepted conflict. Note: Geist ships as four static weights, so `font-optical-sizing: auto` (skill §15) would be inert; if optical behavior ever matters, a variable Geist would restore it.
2. **One frozen glass recipe for all floating chrome** (anatomy `docs/anatomy/index.html:121`; `blur(10px) saturate(140%)`, `console.css:287`) versus skill §12 "bigger surfaces should read as thicker: stronger blur + deeper shadow." The console scales the *shadow* (`--shadow-1` vs `--shadow-2`, `console.css:285-286`) but freezes the blur. Deliberate consistency choice; and because the materials are dark and 85–92% opaque (`--bg-glass` `console.css:85`, `--bg-surface-2` `console.css:83`), the legibility failure the skill rule guards against (light-on-light stacking) never materializes in the screenshots.
3. **No springs; fixed-duration CSS transitions everywhere** (skill §3–4). The console has exactly one gesture surface — the timeline scrub — and it does the skill-correct thing: 1:1 continuous tracking with `setPointerCapture` (`commandConsole.ts:941-953`), clamped at bounds (`commandConsole.ts:955-958`) — a hard stop rather than skill §9 rubber-banding, which is the right call for a bound scrubber, not a scroll surface. Click-driven choreography (cards shift `console.css:553`, chat-in `console.css:530-534`) re-targets from the live value on interrupt because CSS transitions restart from the current computed value, so the basic interruptibility bar is met; velocity handoff (skill §5) is simply not applicable to click-driven motion here. The documented no-bounce curve (`--ease-out-expo`, `DESIGN.md §6`) matches the skill's damping-1.0 default in spirit.

### P2-8 · Unverified observation (flagged, could not reproduce)

`qa/calm-plan.png` (1920-wide) shows the rightmost dock widget clipped flush at the viewport edge with **no `+N widgets ▸` pill**, while the overflow affordance logic exists (`updateDockMore`, `commandConsole.ts:1089-1104`) and the current phase-D fixture lists only two dock widgets (`qa/wui-breakout.json`, phase "D Plan → ['evac','growth']" — printed this session). The screenshot likely predates the D3 affordance (both screenshots were untracked in one commit, `git log --oneline -1 -- qa/calm-plan.png` → `20fd8f3`, so per-file dates could not be established) or reflects pinned widgets beyond the phase list. I did not run the console to reproduce (read-only review; not part of the named checks). No finding asserted — re-shoot the state at 1920 to confirm the pill renders.

## (d) What the lens would genuinely praise

- **Red discipline as constitutional restraint** (`DESIGN.md §5`; anatomy `docs/anatomy/index.html:124`; enforced in CSS at `console.css:517, 527, 565, 634, 719` with the guard in `DESIGN.md §7`): red means life safety, amber means waiting-on-human, violet means TALON. This is skill §16 *Simplicity* and *Craft* at their strongest — color that never decorates, enforced by CI.
- **Scroll-edge fades instead of hard dividers** (`console.css:935-990`): registered custom properties driven by the element's own scroll timeline, edge-aware in both directions, with a static fallback and a phantom-fade opt-out for content-height stacks. This is literally skill §12's "scroll edge effects, not hard dividers," implemented more rigorously than most Apple-adjacent web work.
- **The dual press idiom** (40ms travel-in, 120ms `--ease-out-expo` release, top specular collapse, `console.css:370-379`; `DESIGN.md §6`): pointer-down feedback per skill §1 with an asymmetric, physical release. Presses read as machined hardware in `qa/final-polish.png`.
- **Anchored `transform-origin` on popovers** (`console.css:466-467`; the TS comment at `commandConsole.ts:1324`: "transform-origin follows the anchor — topbar popovers grow from the top centre") — skill §7 spatial consistency, exactly.
- **Entrance/exit asymmetry and mirrored paths** (entrances 120ms, exits 80ms; the drawer displacement is a transform, `console.css:553`; chat enters from its own rail side, `console.css:530-534`) — skill §7's "if something disappears one way, we expect it to emerge from where it came."
- **The reduced-motion story** (`console.css:328-342`): opacity-only entrances, continuous loops stopped (`breathe`, `blink`, orb animations), presses and shakes de-traveled, durations collapsed to 80–120ms — skill §14's "gentler, not absent." Plus `prefers-reduced-transparency` support (`console.css:343-345`), which most web systems never ship.
- **Numeric stability as craft**: every readout is mono with `font-variant-numeric: tabular-nums` (`console.css:356`), so the clock in `qa/final-polish.png` never jitters — skill §16.7 "nothing is random."
- **Verified contrast floors with a CI guard** (`DESIGN.md §2`, tokens at `console.css:98-103`): text down to the 10.5px data floor clears 4.5:1, and darkening `--text-4` again fails CI. Vibrancy discipline (skill §12) expressed as a testable contract.
- **The 1:1 scrub** with pointer capture, hover scrubtip, and ARIA value wiring (`commandConsole.ts:918-958`, `console.css:786-787`) — the one gesture surface behaves per skill §2.
- **Field High-Lux re-derives every semantic token** rather than inverting (`console.css:1036-1124`): warm alabaster surfaces, obsidian ink, structural 2px borders, honest documentation of the 3D-terrain limitation (`DESIGN.md §6`). Skill §16.7's "colors that adapt to light/dark," done as a second design, not a filter.

## (e) Skill hard gates, bans, floors — pass/fail

| Gate / ban / floor (skill §) | Status | Evidence |
|---|---|---|
| Reduced-motion: gentle equivalents, loops stop, presses static (§14) | **PASS** | `console.css:328-342`; durations 80–120ms, keyframes collapsed to opacity |
| `prefers-reduced-transparency` (§14) | **PASS** | `console.css:343-345` — blur dropped, surfaces solid |
| `prefers-contrast: more` (§14) | **FAIL** | grep across repo (this session): zero matches; see P1-2 |
| Feedback on pointer-down, continuous (§1, §10) | **PASS** (primary controls) / **FAIL** (secondary families) | `.btn/.opt/.rbtn/.chip` `console.css:372-375`; `.toolgroup/.seg/row-buttons` have no `:active` — P2-5 |
| Compositor-only animation (§11) | **PASS** (entrances, presses, bars, drawer) / **FAIL** (timeline playhead) | `left/width` at `commandConsole.ts:923-924` — P2-4; `will-change` count 0 |
| No toy bounce / overshoot without momentum (§4) | **PASS** (ban honored) | toy bounce curve explicitly banned, `DESIGN.md §6`; `--ease-out-expo` is the damping-1.0 analog |
| Interruptibility — animate from live value (§3) | **PASS** (basic) | CSS transitions re-target from current value; no input lockouts found in the motion paths reviewed |
| Spatial consistency: anchored origins, symmetric paths (§7) | **PASS** | `console.css:466-467`; `commandConsole.ts:1324`; enter/exit asymmetry `DESIGN.md §6` |
| Materials: no light-translucent stacking over text (§12) | **FAIL in one spot** | TFR chip (14% alpha bg) paints over the title at 1280 — P1-1; elsewhere materials are dark/85–92% opaque |
| Scroll edge effects, not hard dividers (§12) | **PASS** | `console.css:935-990` |
| Dim-to-focus for modals (§12) | **PASS** | `.scrim` 50% black + glass modal, `console.css:908-910` |
| System font default (§15) | **CONFLICT — documented** | Geist self-hosted for offline boot, `console.css:8-15, 245` — P2-7.1 |
| Size-specific tracking (§15) | **FAIL (partial)** | negative tracking exists once, at 13.5px; display sizes get none — P2-6 |
| Dynamic Type / rem-based scaling (§15) | **FAIL — documented conflict** | px-only type and layout; 200% zoom battery as partial mitigation — P2-3 |
| Rubber-band at boundaries (§9) | **PASS (n/a)** | the only gesture surface is a bound scrubber; hard clamp is the correct idiom (`commandConsole.ts:955-958`) |

**Not run / not claimed:** no live console session, no re-measurement of WCAG ratios (ground truth `DESIGN.md §2` cited instead), no re-run of `tools/verify.mjs` / `tools/e2e.mjs` (their guarantees are cited as documented, and the topbar-collision gap in e2e V1 is a finding precisely because no check covers it).
