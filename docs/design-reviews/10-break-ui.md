# 10 · break-ui — Sentinel command console

Reviewer: break-ui lens (adversarial worst-case data, Emil Kowalski's design-engineering standards).
Scope of this pass: review of the shipped design against worst-case *realistic* data and viewport/zoom
extremes, using the four provided QA screenshots, `console.css`, `DESIGN.md`, `docs/anatomy/index.html`
and `docs/anatomy/01-shell.html`. **No browser session was launched and no fixture was wired** (the ask
supplied screenshots as visual evidence); every finding below states whether it was *verified visually*
(in a screenshot, with crop coordinates), *verified in code* (file:line), or *inferred* (CSS reasoning).
Crop reproductions: PIL crops of the named PNGs at the pixel boxes given per finding.

---

## (a) Lens summary

break-ui takes a UI that looks right on kind demo data and feeds it the worst *realistic* case for every
value it renders — `bartholomew.fitzgerald@northwind-industries-holdings.example.com`, a one-letter name,
a count of exactly 1, an empty list, 1,284 members — then reports every break with a signature, a cause
and a fix. Hard rules: values must be plausible or schema-backed, never random nonsense ("unbounded" is
itself a finding); you change the data, never the component; one worst-case dataset must hit every
applicable row at once; the Demo/Worst-case toggle is dev-only; report before fixing. It checks the
component at its real container width, at 320px, at the widest supported layout, at 200% browser zoom,
and in dark mode and RTL where supported. Its failure signatures are concrete: squished avatars
(missing `flex-shrink:0`), overflowing text (missing `min-width:0`), emails past the edge (missing
`overflow-wrap:anywhere`), "1 members" pluralization, jittering proportional digits, clipped diacritics,
truncation with no way to read the full value, and 1,000-row lists with no virtualization. It ends with
Part 1 "what broke" (worst first), Part 2 "decisions for you", Part 3 "what held up".

## (b) Verdict + score

**7/10.** The console already implements most of this lens's core disciplines with unusual rigor
(min-width:0 + ellipsis everywhere, pluralization on the one boundary count, tabular numerals, tooltips
on truncated text, real empty states) — but its own shipped evidence shows the dock overflow affordance
missing at 1440, a sub-25 % battery rendered red against its written red-discipline contract, a 1280
topbar overprint, and a hardcoded "1 homes" with an unbounded, wrap-unprotected composer.

## (c) Findings — worst first

### P1-1 · Dock clips its last widget at 1440/1680 with no affordance — the guard never tests those widths

- **Verified visually.** `qa/final-rev.png` (1440×900) and `qa/final-polish.png` (1440×900) both show the
  dock overflowing: five widgets (Fire weather 336 + Fleet 316 + Drone feed 344 + Evacuation 316 + Fire
  growth 380 = 1692 px, + 4×8 gaps + 2×12 margins = **1748 px**; widths from `console.css:752-756`). The
  Fire growth widget is cut mid-glyph at the right viewport edge — heading reads "Fire grow…", the
  "206 ac" readout and chart are sliced (crops: full dock strip `(0,680)-(1440,900)` of each file;
  right-edge detail `(1360,560)-(1440,800)` of final-rev). **No `+N widgets ▸` pill is visible in
  either**, while `qa/e2e-break-1280.png` (1280×800) shows the pill working ("+2 widgets ▸").
- **Code.** The pill renders "only when `.slots` overflows horizontally" (`console.css:744-747`); the TS
  measures `w.offsetLeft + w.offsetWidth > slots.clientWidth + 1` (`commandConsole.ts:1091`). At 1440 the
  overflow is 308 px, so the current code *should* render a pill — the screenshots and the code
  disagree, and the guard cannot tell us which side is right because it only exercises 1280 and 1920
  (`DESIGN.md` §7 guard 3: "at 1280×800 (phase=D) asserts .slots clips, that .dock-more then exists…
  at 1920 asserts no overflow and no pill"). 1366 / 1440 / 1600 / 1680 — the most common desktop widths
  — are untested; the 5-widget composition clips at **every viewport < 1772 px** (394 px overflow at
  1366, 92 px at 1680).
- **Fix (buildable).** (1) Extend the phase-D dock guard matrix to 1366×768, 1440×900 and 1680×1050:
  whenever `slots.scrollWidth > slots.clientWidth`, assert the pill exists and its count equals the
  number of clipped widgets. (2) Re-shoot `qa/final-*.png` against the current build so the evidence and
  the code stop contradicting each other. (3) Optionally let `.slots` cap at `100%` and wrap TALON-added
  widgets into the Evacuation widget's rows instead of a sixth column at <1772 px.

### P1-2 · Conflict with the console's own contract: a sub-25 % battery renders red in two shipped screenshots

- **Verified visually (pixel-sampled).** `qa/final-rev.png`: the Fleet & units row "FT-01 · Gimbal lock ·
  head" renders **14 %** in red — dominant glyph bucket `(224,64,64)` from crop box `(620,725)-(665,745)`
  (amber `#FFB547` would bucket `(224,160,64)`; red `#FF5B4E`/vermilion `#E5533C` bucket `(224,64,64)`),
  while 58 % and 100 % sample green `(32,160-192,96-128)`. `qa/calm-plan.png` (1920×1080) confirms it:
  60 red glyph pixels at `(692,916)…`, color `(229,83,60)` — an exact match to `--plan-cut #E5533C`.
- **Contract.** `DESIGN.md` §5 (deliberate, "constitutional"): drone battery < 25 % → `--needs` amber;
  "red stays reserved for auto-land / link-lost failure states". `console.css:832-834` has no red path
  (`.batt` green, `.batt.warn`/`.batt.low` amber), and `commandConsole.ts:1206-1209` applies only
  `warn`/`''` — the comment there says exactly this ("B1 red discipline: <25 % is a handover floor
  (amber)… red stays reserved"). **Current code cannot produce red; the evidence set can and does.**
  The §7 live-DOM guard polls the amber at T+76, so it passes today and cannot catch stale screenshots.
- **Fix.** Re-shoot the `qa/final-*` set against the current build; in the shot pipeline (`tools/cshot.mjs`)
  assert the sampled pixel color of a sub-25 % battery equals the resolved `--needs` so the evidence and
  the contract are re-verified together. Reported as a **documented-deliberate conflict**, not a silent
  bug: the deliberate decision is right; the evidence is stale.

### P1-3 · The repo's own 1280 evidence shows the gate pill overprinting the incident title at the reference width

- **Verified visually.** `qa/e2e-break-1280.png`, topbar crop `(0,10)-(700,62)` at 2×: the amber posture
  pill contents "PLAN · GATE 10:00 LEFT" (`.posture` + `.gatechip`, `commandConsole.ts:543-544`) are
  painted directly over the situation title "Encinal Canyon · WUI breakout" (`.sitbtn`,
  `commandConsole.ts:542`). Both strings occupy the same pixels; the title is unreadable at what the
  anatomy calls the verified floor (`docs/anatomy/01-shell.html` note 8: "1280 IS THE VERIFIED FLOOR").
- **Code.** The current CSS defends this class of break: `.topbar` is a plain flex row
  (`console.css:423`), `.sitbtn` carries `min-width:0` with ellipsis on `b`/`small` (`428-431`), and the
  ≤1310 compaction hides the subtitle and claims it prevents "the posture pill… collid[ing] with the
  situation meta" (`995-1000`). A static flex row cannot overprint, so this frame is most plausibly a
  pre-fix build — **but the collision class remains reachable in current code**: `.posture`,
  `.status-pill`, `.clock`, `.op` are all `white-space:nowrap` with no `flex-shrink` floor
  (`537`, `432`, `441`, `733`), and the worst realistic topbar — a longer incident title (unbounded:
  `data/scenario.json` `meta.title` is just data; "Encinal Canyon" is 14 chars where ICS names run much
  longer) + drift chip ("PLAN DRIFT", ts:544, ~110 px) + gate chip + clock + operator cell — exceeds the
  1256 px row at 1280, at which point the only give-way items are `.sitbtn` and `.grow`: the title
  ellipsizes to nothing (information lost; only the `title="Incidents"` tooltip survives).
- **Fix.** Give the fixed-content cells `flex-shrink: 0` (`.posture`, `.status-pill`, `.clock`, `.op`,
  `.btn` in the topbar) and cap the flexible one: `.sitbtn b { max-width: 32ch }` so a long title
  ellipsizes early instead of consuming the row. Add an e2e fixture: 45-char title + gate open + drift
  chip at 1280×800, asserting no cell overflows the topbar and ≥ 20 ch of title remains visible.

### P2-4 · Hardcoded plural: "1 homes"

- **Verified in code.** `commandConsole.ts:1161` renders `` `${z.households} homes` `` and
  `commandConsole.ts:1174` renders `` `${fmtN(st.threatened)} homes` `` — a 1-household zone (rural
  single dwelling: plausible, not contrived) or 1 threatened home reads "**1 homes**". The lens's
  classic signature, sitting in the primary Evacuation widget.
- **Fix.** Same pattern the dock pill already uses correctly (`commandConsole.ts:1102`:
  `` `+${hidden} widget${hidden > 1 ? 's' : ''}` ``): `` `${n} ${n === 1 ? 'home' : 'homes'}` `` (or
  `Intl.PluralRules` if localized copy ever lands).

### P2-5 · Composer is unbounded and nothing in the stylesheet can break an unbreakable string

- **Verified in code.** `grep -i maxlength` over `commandConsole.ts`, `console.css`, `index.html` →
  **zero hits** (reported per Hard Rule 1 as *unbounded*); `grep overflow-wrap|word-break|line-clamp`
  over `console.css` → **zero hits**. The operator bubble (`.entry.operator .bubble`,
  `console.css:703`, `max-width: 92%`) and thread titles (`.entry .title`, `699`) have no
  `overflow-wrap`: one pasted unbreakable token — `bartholomew.fitzgerald@northwind-industries-holdings.example.com`,
  a `https://` link, a coordinate pair — overflows the chat card horizontally (signature: "email or URL
  runs past the edge"); `.pbody` scrolls vertically only (`573`), so the text is clipped, not scrollable.
- **Fix.** `overflow-wrap: anywhere` on `.entry .bubble`, `.entry .title`, `.pbody` and `.zrow small`;
  add a `maxLength` to the composer input that matches a real backend limit — and since none exists
  today, either add one on both sides or document the field as deliberately unbounded in DESIGN.md.

### P2-6 · Map-anchored receipts have no keep-out against fixed chrome — text clipped mid-glyph

- **Verified visually.** `qa/final-polish.png`, crop `(1240,440)-(1440,560)` at 3×: the map receipt
  "Two sources disagree on the heat · Recon · **7:00 left**" and the fleet callout "● FT-02 · 9…"
  ("the map is the reply", commit P4) are cut mid-glyph by the opaque map toolgroup (+/− buttons,
  `console.css:452-458` — anchored `right: calc(var(--gap)*2 + var(--rail-w2))` = 68 px, bottom:
  `dock-h + 24`). `qa/e2e-break-1280.png` shows the same class on map icons: the choke label loses its
  first glyphs behind the choke flag ("**witchback** · one lane outbound" — "SW" occluded; the same
  label is intact at a different map position in `qa/calm-plan.png`). The annotation anchor is
  data-driven; the tool band and drawer band are not keep-out regions.
- **Fix.** When placing an annotation label, test its rect against the fixed chrome bands (tools:
  right 56–120 px, above dock+24; cards/chat: right 68–452 px) and flip the label to the opposite side
  of its anchor, or shorten it to the verb + countdown and move the sentence into the card stack. A
  pure-CSS variant is not available here — this is TS placement logic in the annotation renderer.

### P2-7 · 200 % zoom: claimed by the contract, reasoned here, not re-run

- **Inferred (not run).** Every token is px (`console.css:247-303`), so browser zoom is a uniform
  scale: 1440 @ 200 % ≙ 720 logical px, which drops below the ≤980 breakpoint (`.kpis` hidden,
  `--panel-w: min(400px, 100vw − 40px)`, `console.css:1001-1004`) while the dock keeps fixed px widget
  widths (`752-756`) — degradation is horizontal scroll + the pill from P1-1, and the 372 px
  chat/cards (`530`, `547`) still fit 720. `DESIGN.md` §7 states the e2e adversarial battery includes
  "200 % zoom"; I did not run `node tools/e2e.mjs` in this pass (no browser session), so this remains
  the repo's claim, plausibly supported by the CSS but not re-verified here.

### Documented-deliberate conflicts (reported as conflicts, not judged silently)

1. **320 px check vs the 1280 floor.** The lens checks at 320 px; the console documents "No phone
   layout; 1280 floor" (`docs/anatomy/index.html` pattern table; `01-shell.html` note 8;
   `console.css:1006`). Deliberate and reasonable for a control-room product — the lens check is
   therefore out of scope by contract, and only the *in-between* widths of P1-1 are a genuine gap.
2. **RTL.** No `dir`/`rtl` handling anywhere (`grep -i "rtl\|dir=" console.css commandConsole.ts
   index.html` → zero hits). The product is an English-only command console and RTL is not a documented
   requirement, so the lens's RTL check is not applicable — noted because every right-anchored absolute
   region (`console.css:423, 508, 530, 547, 741`) would need an audit if that ever changes.
3. **Red battery evidence** — see P1-2: the deliberate decision (§5) contradicts the shipped
   screenshots; the decision stands, the evidence needs re-shooting.

## (d) What the lens would genuinely praise

- **The "hug vs flex" contract is actually implemented everywhere it matters** (anatomy pattern table:
  "text slots are min-width 0 + ellipsis"): `.sitbtn b/small` (`console.css:430-431`), `.widget > header
  .grow` (`795`), `.wrow span` (`688`), `.urow span` (`819`), `.wx .cell b` (`810`) — and truncated
  things are recoverable: widget headers carry `title` tooltips including the TALON reason
  (`commandConsole.ts:1109-1110`), the situation button has `title="Incidents"` (ts:542), the battery
  span explains itself ("Battery 14% · below the 25% handover floor", ts:1209).
- **Pluralization is right where counts actually vary at the boundary**: the dock pill
  (`commandConsole.ts:1102`). The failure signature "1 widgets" is handled; only "homes" misses (P2-4).
- **Real empty states, not placeholder debris**: `.cards:empty { display:none }` (`549`),
  `.readout:empty { opacity: 0 }` (`462`), `.feedhost .empty` / `.wbody .empty` (`804`), "No drone
  airborne." (ts:1224), "No events yet." (ts:1196) — and a zone with no households omits the value line
  entirely instead of rendering an orphan (ts:1161 conditional).
- **Numbers don't jitter**: `tabular-nums` on `.mono/.num` (`356`), `.kpi b` (`438`), `.batt` (`832`),
  `.measure b` (`724`); big areas/homes go through `fmtN` (Intl formatting, ts:1174).
- **Overflow resolves by hiding, with fade masks instead of hard cuts** (anatomy pattern; implemented at
  `console.css:935-990`): clipped content fades (calm-plan's Evacuation "Hairpin · no traffic control
  yet" row; the card stack in final-polish) — the lens's "last row cut mid-glyph" signature is
  deliberately engineered away.
- **The dock-overflow affordance exists, is accessible, pluralized, and works at 1280**
  (`e2e-break-1280.png` "+2 widgets ▸"; `aria-label`, ts:1098) — the 1440 gap is a guard-coverage hole,
  not a missing feature.
- **Odd-state resilience beyond this lens's minimum**: `prefers-reduced-motion` keeps state legible
  (`328-342`), `prefers-reduced-transparency` swaps glass for solid (`343-345`), and a ≤900 h compact
  card mode recovers density so gated cards fit (`648-653`, documented from audit 2026-10-30).
- Hard Rule 6 note: no prompt-injection or instruction-steering strings were encountered in any file read.

## (e) Lens gates — pass / fail

| Gate (break-ui SKILL.md) | Status | Evidence |
|---|---|---|
| Plausible or schema-backed worst cases; "unbounded" reported as a finding | **Pass** | Composer/titles verified unbounded (`grep maxlength` → 0 hits); no invented limits used |
| Change the data, not the component | **Pass (review-only)** | No code or CSS changed in this pass; no fixture was wired (not asked, no browser session) — the console's own e2e adversarial battery (`DESIGN.md` §7) was **not re-run here** |
| Check at the real container width | **Pass** | Crops of all four provided screenshots at their true sizes (1280×800, 1440×900 ×2, 1920×1080) |
| Check at 320 px | **Conflict — out of scope by contract** | Documented 1280 floor (anatomy index; `console.css:1006`) |
| Check at the widest layout | **Pass** | calm-plan @1920 verified: 4-widget dock ends ~1360 px, clean, no clip, no pill needed |
| Check at 200 % zoom | **Not re-run** | Inferred from px-token CSS (P2-7); repo claims e2e coverage (`DESIGN.md` §7) |
| Dark mode + RTL "if the product supports either" | **Pass (dark default + light theme) / N-A (RTL)** | `:root[data-theme="daylight"]` (`1036-1124`) with documented 3D-map limitation (§6); RTL absent, not a documented requirement |
| Failure-signature sweep with a fix per break | **Pass** | P1-1…P2-6, each with cause + buildable fix |
| Report before fixing (Hard Rule 5) | **Pass** | This report only; no fixes applied |

---

### Part 2 — Decisions for you (breaks with more than one right answer)

- **Incident title in the topbar**: truncate at the end at ~32ch with the existing tooltip, or wrap to
  two lines? Recommendation: end-truncate (recommendation: keep the 52 px topbar; the full name already
  lives in the situation popover). *Why: the row is the most width-contended strip in the product.*
- **Fleet-row detail** (`.urow span`, ellipsized, no title): add a `title`, or rely on the inspector
  opened by clicking the row? Recommendation: rely on the inspector (the row is a button with a detail
  view — the lens's "full value elsewhere" condition is already met); add the title only if telemetry
  shows hover-without-click.
- **Dock at <1772 px**: keep scroll + pill, or shrink the TALON-added widgets? Recommendation: keep
  scroll + pill (numbers and charts must never truncate — lens rule), but make the pill state provable
  at 1440 (P1-1 fix) before trusting it.

### Part 3 — What held up (worst cases already handled — do not touch)

Long situation title (ellipsizes + tooltip), long TALON widget reasons (`.grow` + title), clipped
widgets at 1280 (pill + aria + smooth scroll), empty boards/feeds/event lists, zero-item zones (line
omitted), the one count at the plural boundary (dock pill), number jitter (tabular-nums everywhere),
short viewports (172 px dock + compact cards), reduced-motion/transparency environments, and the map
annotation fade on clipped card stacks. A short list on a console this fortified is the expected result
— the gaps found are in *width coverage* and *evidence freshness*, not in the core disciplines.
