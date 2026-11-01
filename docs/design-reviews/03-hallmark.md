# Design review 03 · Hallmark (anti-AI-slop) · Sentinel command console

Reviewer: hallmark lens, v2.0.0 (SKILL.md + references/gates.md + references/flow.md § App screens and § The sweep, for a page Hallmark did not build).
Date: 2026-11-01. Scope: `console.css` (1,141 lines), `index.html`, `harness.html`, `commandConsole.ts`/`talon.ts` (string evidence), DESIGN.md, docs/anatomy/index.html, qa/final-polish.png, qa/final-rev.png, qa/calm-plan.png, qa/e2e-break-1280.png.

Checks actually run in this review:

- `node C:/Users/rudra/.zcode/skills/hallmark/scripts/sloplint.mjs console.css` → **32 FAIL, 43 REFLEX, 5 WARN**
- `node C:/Users/rudra/.zcode/skills/hallmark/scripts/sloplint.mjs console.css --scope app` → **32 FAIL, 43 REFLEX, 4 WARN** (app scope per flow.md § App screens)
- `node .../sloplint.mjs index.html --scope app --render` (static file) → 34 FAIL, 43 REFLEX, 4 WARN — shots captured the console's no-server fallback only
- `node tools/serve.mjs 8130` + `node .../sloplint.mjs index.html --scope app --render --url http://127.0.0.1:8130/` → **37 FAIL, 47 REFLEX, 4 WARN**, 10 live screenshots in `.hallmark/shots/`
- `node tools/verify.mjs` → **44/44 checks passed** (exit 0), including the live `--text-4` contrast guard (5.36:1 widget / 5.16:1 token) and the dock-affordance guard, whose own output records the label `"+2 widgets ▸"`
- grep scans: colour literals outside token blocks, `transition: all|width|…`, `100vw`, `::selection|caret-color`, emoji, `ORDER ISSUED`, boot-layer markup

Not run / not applicable, stated plainly: `tools/e2e.mjs` was not run (the ask does not name it; verify.mjs covers the design-system guards). The gates.md § 6 fresh-context hero/finish reviews were not run as separate subagents — this file is the single-lens pass. docs/anatomy/01-shell.html was not deep-read; the index's token/pattern tables (the designated ground truth) carried everything needed. The hero/fold/word-budget gates (6, 44, 58) are skipped by the skill itself for app screens.

---

## (a) Lens summary

Hallmark exists to make machine-built UI read as *made, not generated*. It binds every output with a **Floor** of 16 unwavable items: everything tokenized; no `transition: all`, no animating `width/height/top/left`; instant `:focus-visible` on everything interactive; a `prefers-reduced-motion` fallback for every animation and nothing hidden at rest behind a script; no invented metrics/testimonials/logos; no eyebrows; no tracked-caps labels; no middle-dot meta strings, glued arrows or decorative dots; no purple-blue gradient, card-in-card, emoji icon or drawn browser chrome; content visible without scripting. Above the Floor sit **Reflex** gates (model defaults, waivable on the record with a real reason) and **Finish** F-checks (craft detail, answered, never blocking). This console is an **app screen**, so per `flow.md` § App screens the marketing gates (hero, fold, 80-word budget, section rhythm, chrome, photo rules) step aside and the rest binds: tokens, contrast, focus, states, no eyebrow, no tracked-caps label, no invented figure. Because Hallmark did not build it, the sweep variant applies: fix only the material half, print structural findings, and the build stamp is replaced by a check stamp.

## (b) Verdict + score

**6/10.** The console's voice is genuinely made — no eyebrows, no reflex composition, engineered data honesty, state carried by geometry — but it currently fails a mechanical cluster of unwavable Floor letters (32–37 sloplint FAILs), led by a systemic tracked-caps label voice, twelve colour literals that contradict its own "zero-raw-hex" contract, a focus ring that fades in, and a live `width` transition; every one of them is small and buildable, and together they are the only thing keeping this off the Floor.

## (c) Findings

### P0-1 · Floor 67 — the tracked-caps label voice is systemic (house rule, not waivable)

Gate 67 (Floor, house rule): no label, caption, table head, tag or chip at ≤15px set uppercase or letter-spaced past 0.03em. sloplint flags **ten selector-level FAILs** in `console.css`:

| selector | line | evidence |
|---|---|---|
| `.caps` | 357 | 11px uppercase, `letter-spacing: var(--tracking-caps)` = `.08em` (263) |
| `.prov` | 408 | 10.5px mono uppercase `.06em` |
| `.live` | 444 | 11px, `.08em` |
| `.posture` | 537 | 11.5px uppercase `.04em` |
| `.gatechip` | 543 | 11px mono `.05em` |
| `.dock-more` | 747 | 11px mono `.04em` |
| `.exercise::before` | 767 | "EXERCISE" 10.5px uppercase `.12em` |
| `.chart .evflag-lbl` | 869 | 10.5px mono `.06em` |
| `.boot div` | 925 | 11.5px mono `.06em` |
| index.html boot text | 18 | "LOADING ENCINAL CANYON…" caps ×2 (render run) |

It is visible in every screenshot: "DISPATCH · NEEDS YOU" and "ALSO WAITING" (qa/final-polish.png), "EGRESS · PROPOSAL", "ORDER MANDATORY EVACUATION · ZONE 1 + WARNING · ZONE 2", map labels "ZONE 3 · SAFE ASSEMBLY", "CHOKE · ENCINAL HAIRPIN", "IGNITION AREA" (qa/calm-plan.png), "EXERCISE" on the timeline (.hallmark/shots/127.0.0.1-8130-1280x800.png). The anatomy index records `caps tracking .08em` as an observed token (docs/anatomy/index.html, Observed token system → Type), but **DESIGN.md nowhere defends it as a deliberate decision** — so this is a fail, not a documented conflict. Honest tension to record: tracked caps are a real avionics/mil-console genre convention, and gate 67 is a *house* rule, not a truth; a tactical-console owner could reasonably argue it. Under this lens it is still the single largest machine-tell on the screen.

**Fix:** strip `text-transform` and `letter-spacing` from `.caps`, `.prov`, `.live`, `.posture`, `.gatechip`, `.dock-more`, `.exercise::before`, `.evflag-lbl`, `.boot div`; set labels in the body face (or Geist Mono for figures) one step smaller, sentence case. `.brand` (line 424, `.14em`) stays — a wordmark is gate 67's legal case. If the owner insists on the genre voice, that is a DESIGN.md amendment to negotiate with the rubric, not a silent keep.

### P0-2 · Floor 48/7a — twelve colour literals outside the token blocks, contradicting the console's own contract

DESIGN.md § 1: "Zero-raw-hex enforcement: no raw `#hex` or `rgba()` literal may appear in `console.css` outside the two token blocks… Scanned clean as of 2026-10-28." That claim is now false. My grep places **12 literals** after the daylight token block (which ends at line 1124), all in the Field High-Lux component-adjustment rules: `rgba(255,255,255,.9)`, `rgba(17,20,28,.05/.10/.22)` (1127), `.24` (1131), `.3` (1132), `.18` (1135), `.14` (1136), `.16` (1137), `.22` (1138), `#F7F5EF` (1139), `#FFFFFF` (1141). sloplint independently fails all of them (48 ×12) plus **7a** for the pure `#FFFFFF` switch knob (1141). The dark side is clean — every literal I scanned between the two `:root` blocks resolved to tokens.

**Fix:** lift the nine rgba values into `:root[data-theme="daylight"]` as named tokens (e.g. `--day-specular`, `--day-ink-24`, `--switch-knob`, `--switch-knob-on`), then extend the verify red-discipline-style scanner to fail on any literal outside the two blocks so the contract re-becomes true and stays true.

### P0-3 · Floor 15 / 26a — the focus ring fades in; map chips have no keyboard focus at all

The global ring (`console.css:355`) is drawn in `box-shadow`. `.btn` (370) and `.opt` (630) both `transition: … box-shadow var(--dur-fast) …`, so the keyboard ring animates in over 120ms — gate 15 requires instant. sloplint: `FAIL 15 :370`, `FAIL 15 :630`. Sharper still, the live render run failed **26a** outright: the map unit chips (`div.tte-pill`, made interactive by `#map .tte-chip .tte-pill { cursor: pointer; }`, console.css:421) "nothing shows keyboard focus" — clickable controls with no focusable state.

**Fix:** draw the ring with `outline` (never transitioned) and keep the press idiom in `box-shadow`; or add `:focus-visible { transition: none; }` next to line 355. Give `.tte-pill` chips `tabindex="0"` (or make them buttons) so the global `:focus-visible` ring applies; verify catches it with a keyboard-walk in e2e.

### P0-4 · Floor 10a — a `width` transition is live in the stylesheet (documented legacy, still unwavable)

`console.css:841`: `.bar i { … transition: transform 160ms var(--ease-out-expo), width var(--dur-slow) var(--ease-out); }` — animating `width` is Floor-banned. It is a **documented-deliberate** accommodation: DESIGN.md § 6 ("The width transition survives only for legacy width-set bars") and the BAR FILL CONTRACT comment at 842–845 ("the TS layer still sets width:X% inline"). Reported as that conflict: the compositor path exists, but the stylesheet still carries the banned transition and the TS layer still exercises it.

**Fix:** finish the migration — update the bar setters in `commandConsole.ts` to write `--fill` only, then drop `width` from the transition list. One passing `grep -n "style.width" commandConsole.ts` should be the acceptance check.

### P0-5 · Floor 40 (render) — a map label paints at 3.43:1

Live render run: `FAIL 40 [1280px] contrast 3.43:1 against the pixels behind < 4.5:1 on div.tte-item.tte-label "Pacific Ocean"`. Terrain place-name labels fall below the 4.5:1 text floor against the terrain pixels. The widget/card text tiers are genuinely AA — the project's own guard computes 5.36:1/5.16:1 live (verify 44/44) — but map chrome text is outside every guard.

**Fix:** lift the map-label ink one step (toward `--text-2`) or give labels the same treatment as unit chips (a dark backing pill), and add a map-label contrast assertion to verify.mjs so it is guarded like everything else.

### P1-1 · Floor 34 — `overflow: hidden`, no `clip`, a `100vw`, and a documented no-phone conflict

`console.css:352`: `body { overflow: hidden; }` — gate 34 wants `overflow-x: clip` on both `html` and `body`, "never hidden"; `html` carries none. `console.css:1002` uses `100vw` in `--panel-w: min(400px, calc(100vw - 40px))`. The live render run confirms no horizontal scroll at 1280–1920, but at 375 `span.chip` runs 111px past the screen, hidden only by the clip. Conflict to record: the console documents "1280 px floor… No phone layout" (console.css:1006; anatomy index → Layout), which deliberately refuses the gate's 320–1920 range. The letter is still worth fixing: `overflow: clip` on `html, body`, `100dvw` for the panel.

### P1-2 · Floor 39a — disabled by opacity alone; a focus state built from border

`.btn:disabled { opacity: .4; cursor: default; }` (376) and `.opt:disabled { opacity: .45; cursor: default; }` (633) — sloplint fails both: disabled needs fill, ink and cursor channels plus the native attribute, and `cursor: default` is not `not-allowed`. `.field:focus-within` (715) signals focus with `border-color` only — gate 39a's "focus ring built from border" tell (the inner input does get the global ring, so this is a letter miss, not a usability hole).

**Fix:** `cursor: not-allowed` on both disabled rules (keep the native `disabled` attribute the TS layer sets); give `.field:focus-within` the standard ring shadow.

### P1-3 · Floor 62 — the boot layer ships in static markup behind a script

`index.html:18` and `harness.html:368` both carry `<div class="boot">` in the HTML; `.boot` (console.css:923) is an opaque full-screen overlay at `--z-boot: 90`, removed only when the TS layer adds `.gone`. A script failure ships a permanent blank console — gate 62's exact shape. sloplint also flagged `.tip` (555) and `.track .scrubtip` (786); I **dismiss** those two as hover-gated auxiliary tooltips, not script-revealed page content. 

**Fix:** inject the boot div from the script (no JS → no overlay → static content shows), or render it hidden and `.js`-scope it per the gate's safe shape.

### P1-4 · Floor 63 — the middle-dot meta idiom and glued arrows (documented-deliberate conflict)

Gate 63 (Floor, house rule) bans middle-dot-joined meta strings and arrows glued to button text. This console uses " · " as its universal meta separator, visibly: topbar "S-05 · 34.047°N 118.872°W · Training exercise" and "Jan 14 · 03:52 PST" (qa/final-polish.png), card and gate meta, map labels "CHOKE · ENCINAL HAIRPIN" (qa/calm-plan.png). The glued arrows are worse by the letter: the dock overflow pill reads **"+2 widgets ▸"** — confirmed live by the project's own guard (`verify` output: `label="+2 widgets ▸"`; CSS comment at console.css:744–746) — and the issued banner is documented as `ORDER ISSUED · REQ → <by>` (talon.ts:168; DESIGN.md § 4.6). This is a genuine **documented-deliberate conflict**: the idiom is the console's house style and a military-documenting convention, but 63 is a house-rule Floor that admits no waiver. Reported as a conflict, not silently judged. Route arrows ("Route A · Encinal → PCH", qa/final-rev.png) I judge legal — the arrow carries route direction, it is data, not link ornament.

**Fix (if the contract ever moves):** "+2 more" without the glyph; banner separator as a hairline or line break; keep route/data arrows. Otherwise record it in DESIGN.md explicitly as a known conflict with Hallmark's house rules.

### P1-5 · Reflex 24b — 43 off-scale spacings against a guard of three

sloplint counts **43** raw off-scale paddings/gaps/margins (guard: three optical nudges at most). Densities: micro paddings of 5/6/7px throughout the widget internals (408, 475, 509, 630, 656, 686, 694, 747, 786, 816, 853…), and the whole audit-fix add-on block (1013–1022: `gap: 4px/5px`, `padding: 1px 6px`, `margin-top: 8px` raw where `--s-*` exists). The 4px grid is real for the big surfaces and fictional at the small end.

**Fix:** snap 5→4 or 8, 6→4 or 8, 7→8; where a value is genuinely optical (the 0.5px rim, 3px dot gaps), keep it and note it in the stamp as one of the three allowed nudges per family.

### P2 — Finish checks (answered, never blocking)

- **F15 (radius per nesting level):** the anatomy index itself logs the conflict — "applied inner radius on coa/dissent/menu is 4 where the formula yields 2" (docs/anatomy/index.html → Radii). Set `--r-xs` → 2px on `.coa`, `.dissent`, `.menu-item` (654, 673, 470).
- **F16 (browser surfaces):** no `::selection`, no `caret-color` anywhere (grep returned nothing); `scrollbar-color` exists on `.pbody` (573). Add the two on the committed palette.
- **F19 (weights):** Geist loads 400/500/600/700 (console.css:9–15) — four weights in running use. Answer: justify, or drop 500 and let 400/600 carry.
- **F3:** no `text-wrap: balance` on any head (sloplint WARN). `.card h2` (623) wraps at 372px card width — add `balance` there; the single-line chrome heads don't need it.
- **F24:** hairline under a wide soft shadow on `.glass` (365) — **answered, deliberate**: the anatomy index documents the one-glass recipe (inset rim + hairline + two drop layers); it is the signature surface, not an accident.
- **F7:** pill radius on five non-control selectors — **dismissed**: `.readout`, `.posture`, `.tip`, `.dock-more` are all controls or status pills.
- **F26/F17:** the live render tier reported no stub-line or sliver findings at 1280/1440 for the console URL; the 375 findings are the documented no-phone conflict (P1-1).
- **39b (app control range):** map chips at 22px, `.chip` 22, `.btn.sm` 26, `.seg` 24 sit under the 32–40 app range without hit-target expansion (sloplint live REFLEX; heights from anatomy index → Control heights). Desktop-mouse console, so severity is low; add hit-target padding if touch ever matters.
- **75 (text that strains):** documented conflict at the data floor — DESIGN.md § 2 sets a deliberate 10.5px data floor / 11px functional floor against the gate's 12/11; body 12.5px clears the letter. The live render did find map tooltip text (`div.tte-mt`) at **10px** — below even the console's own floor. Lift to `--fs-badge` 10.5px minimum.
- **Daylight contrast gap:** the daylight token comment (1057) admits `--text-4` reaches only "≥4.3:1 on #E6E3DA" — under the 4.5 text floor on canvas. The verify guard computes contrast on the **dark** theme only (DESIGN.md § 7). No daylight violation was demonstrated (canvas rarely carries text), but the guard should be extended to `:root[data-theme="daylight"]` before this can be called pass.
- **7b/2b (reflexes, guard-passing):** `--btn-primary-bg-hover: #FFFFFF` (213) — pure-white primary on near-black ink is a deliberate avionics control; declare the surface posture in the stamp. `.brand span` gradient text (425) — single-hue silver ramp `#F5F7FB→#B9C0CD→#8E97A8` (232), stops within 40°; 2b's guard passes.
- **20 (stamp):** no Hallmark stamp on line 1 of the CSS — expected: Hallmark did not build this. Per flow.md's sweep section, a `/* Hallmark · checked: … */` check stamp would be the artifact of adopting this review; add it when the fixes land.

## (d) What the lens would genuinely praise

1. **Invented facts are not merely avoided; the console is engineered against them.** The harness labels the scenario ("EXERCISE" tag, console.css:767; "Training exercise" in the topbar meta, qa/final-polish.png), every figure carries provenance (MEA measured / modeled / authored badges, 408–411), TALON's plan states its source and deltas ("Adapted from playbook ENC-3 (pre-computed at T-0:42)… (was T+2:05)", qa/calm-plan.png, qa/final-rev.png), silence is stated as inaction ("If it lapses: Nothing is sent. I escalate…", qa/calm-plan.png), and empty states name their absence ("No evacuation plan exists.", commandConsole.ts:1167). This is Floor 8 and gate 70's spirit at a level few marketing pages reach.
2. **State is carried by geometry, and the screenshots prove it reads.** Dashed proposed vs solid committed is legible on the map itself (green dashed Zone 3 ring vs solid cyan Route A, qa/calm-plan.png), exactly as DESIGN.md § 3 and the anatomy's plan-ladder row demand. Red discipline (amber = waiting on human, violet = TALON) is enforced by a stylesheet-parsing CI guard — and `node tools/verify.mjs` passes 44/44 live, including real WCAG math on `--text-4`.
3. **Motion grammar is disciplined:** no bounce (the toy curve is banned by name, DESIGN.md § 6), compositor-only bar fills with the transform path already shipped, entrance/exit asymmetry, and a real `prefers-reduced-motion` block (328–342) that keeps state legible rather than blanking it — plus a `prefers-reduced-transparency` fallback (343–345), which most systems never think of.
4. **No reflex composition anywhere:** no eyebrows, no AI nav, no card-in-card, no emoji icons (one typographic "✕" glyph, harness.html:4227), no glow washes, one glass recipe, one 2px edge-cue accent discipline (606–608), tabular numerals on every figure (356, 438, 724, 832), sentence-case headings, and the product is the screen — there is no hero because there is nothing to pretend.

## (e) Floor / gate scorecard

| Floor item | Verdict | Evidence |
|---|---|---|
| 1 tokens (48) | **FAIL** | 12 literals outside token blocks, console.css:1127–1141 (P0-2); dark side clean |
| 2 motion (10a) | **FAIL** | `width` transitioned on `.bar i`, :841 (P0-4); no `transition: all` anywhere (grep clean) |
| 3 italic word (38i) | PASS | no `font-style: italic` in any heading rule (only `.record .quote`, prose) |
| 4 overflow (34) | **FAIL** | `body{overflow:hidden}` :352; `100vw` :1002; render: no scroll 320–1920, 375 clip (P1-1) |
| 5 grid tracks/heads (50) | PASS | `minmax(0,1fr)` on `.wx` (808, 813); min-width:0 + ellipsis discipline throughout (430–431, 795) |
| 6 focus (26a/15) | **FAIL** | ring fades via transitioned box-shadow (370, 630); `.tte-pill` no focus (live 26a) (P0-3); global `:focus-visible` itself is instant and ≥3:1 |
| 7 reduced motion / hidden at rest (27/62) | **FAIL (partial)** | strong reduce block (328–342), but static boot layer (P1-3); `.switch::after`, `.compass svg`, `.tip` transform transitions lack reduce handling (minor) |
| 8 invented facts (46a) | PASS | none; honesty systems above (d-1) |
| 9 eyebrow (54) | PASS | none — meta rows carry facts (provenance, authority, countdown), not announcements |
| 10 punctuation (63) | **FAIL (documented conflict)** | `+2 widgets ▸` (verify output), `ORDER ISSUED · REQ →` (talon.ts:168), dot-meta everywhere (P1-4) |
| 11 bans (2a/4/30a/47a) | PASS | wordmark gradient is single-hue silver (232); no card-in-card; no emoji; no drawn chrome |
| 12–14 hero/fold/container (44b/58/44d) | N/A | app screen — skipped by the skill's own app-screens branch |
| 15 stamp (20) | expected absent | not a Hallmark build; check stamp on adoption |
| 16 sloplint | **RUN** | 32 FAIL / 43 REFLEX / 5 WARN static · 37/47/4 live (commands in header) |

Reflex gates named by the lens: **eyebrow headings** — pass; **tracked caps** — fail (P0-1); **one coloured word (38iii)** — pass (no accented word in any heading, CSS and all four screenshots); **empty frames (47b/68/81)** — pass (no device frames, no empty slots; drone feed is a rendered feed with an inner hairline, 802); **hero without the product (84)** — pass trivially (the product is the screen); **signup everywhere (85)** — pass trivially (no email capture in an operational console). Colour/type reflexes: 1 pass (Geist Sans + Mono is not the banned list; mono is the material here — data, coordinates, timestamps — so 64 passes), 2b/7b/22/23/29 pass or guard-pass (restraint is real: state tints at 12–14% alpha), 24b fail (P1-5), 39b/75 noted in P2, 64 pass with the mono-is-material caveat.
