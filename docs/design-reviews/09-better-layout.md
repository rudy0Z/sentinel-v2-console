# 09 · Design review — `better-layout` lens · Sentinel command console

- **Lens:** better-layout (layout — grouping, spacing rhythm, alignment, density, anchor logic, adaptive structure)
- **Rubric:** `C:/Users/rudra/.agents/skills/better-layout/SKILL.md` + its two recipe sheets (`grouping-and-alignment.md`, `spacing-and-adaptivity.md`), read in full this session.
- **Ground truth cited (not re-measured):** `docs/anatomy/index.html` (token + pattern tables), `docs/anatomy/01-shell.html`, `DESIGN.md`.
- **Visual evidence:** `qa/final-polish.png` (1440×901), `qa/final-rev.png` (1440×901), `qa/calm-plan.png` (1920×1080), `qa/e2e-break-1280.png` (1280×800) — all four read this session.
- **Code read in full:** `console.css` (1,141 lines). Targeted reads: `commandConsole.ts:535`, `:544`, `:1080-1104`; `index.html` head.
- **Not run:** no browser session in this review, so no live re-verification of any capture at HEAD; `node tools/verify.mjs` and `node tools/e2e.mjs` were not run (not asked, and the ask scopes this review to the provided evidence). Everything below that depends on a live render is marked **Not verified**. Grep commands run are listed in §(e) Verification.

---

## (a) Lens summary — what this skill demands

The skill sets **grouping, alignment, spacing and responsive structure**, then stress-tests that structure by resizing, translating and mirroring it. Its core rules: (1) **group with space first** — background shapes second, separator lines last, and the gap *between* groups must be ≥ 2× the gap *within* one; (2) **keep controls distinct from content** — every interactive element gets a shape, border, underline or a consistent placement zone; (3) **align to shared edges** — a small set of edges, one spacing step per nesting level; (4) **logical properties for anything that mirrors** (RTL); (5) **order by importance** — identifying content leads, metadata trails, visual order = DOM order; (6) **one primary action per view**; (7) **hint at hidden content** — every scroll/clamp needs a visible cue (peek, fade, or a disclosure that *names* what is hidden); (8) **borderless controls need clearance**; (9) **hold structure until it breaks** — breakpoints from content, not device presets; (10) **plan for growth and clipping** — `minmax(0,1fr)` / `min-width:0`, no fixed sizes on text boxes, nothing critical parked where resize/zoom clips it. A finding needs a **shown failure** (clip, overlap, broken mirror, misread group) — a value that merely differs from the skill's defaults is not a finding. Numbers apply only where the project has no spacing scale; this console has one, so its tokens govern. Severity: overlap or clip at a supported viewport = HIGH; harm to hierarchy/order/adaptability = MEDIUM; isolated polish = LOW.

## (b) Verdict + score

**6/10 — Block.** The console's spacing-scale, shared-edge and content-tuned-breakpoint discipline is genuinely excellent and the lens praises it loudly, but the lens's own stress test surfaces two HIGH failures at the console's *own verified floor*: a text-on-text topbar collision in the provided 1280×800 capture, and the map tool column structurally painted behind the open decision-card stack in two of the four captures.

## (c) Findings

Ranked P0 → P2. P0/P1/P2 here map to the skill's HIGH/MEDIUM/LOW. One row per root cause, every location listed.

### P0-1 · Order/clipping at a supported viewport — topbar cells collide at 1280 (skill: HIGH — "overlap at a supported viewport")

| Severity | Location | Before | After | Why |
|---|---|---|---|---|
| HIGH | `qa/e2e-break-1280.png` (top-left, x≈150–365) · `commandConsole.ts:535`, `:544` · `console.css:423`, `:428-431`, `:537`, `:543`, `:997-1005` | Two text layers occupy the same pixels over the incident selector: the white bold incident title renders interleaved with an amber chip's glyphs (readable fragments "…UT PRO…"); the amber `TFR · AIR ATTACK OPS · UAS FLOOR < 150` chip renders fully to its right | Compact the *chip cluster*, not just the KPIs: at ≤1310 render the TFR chip short-form (`TFR · UAS < 150′`), collapse `PLAN DRIFT` into a dot on the posture pill, give `.posture`/`.gatechip`/`.chip.needs` in the topbar `min-width: 0` + `overflow: hidden` + `text-overflow: ellipsis`, and add `overflow: hidden` to `.topbar`. Add an e2e guard: at 1280 with the adversarial chip set, assert no bounding-box intersection between `.sitbtn`, `.posture`, and the TFR chip | The 1280 capture shows the collision while the compact tier is *visibly active* (KPIs hidden per `:1003`, `.sitbtn small` hidden per `:998`) — so the ≤1310 tier (`console.css:997-1000`) sheds only `.kpis .kpi.opt` and the sitbtn subtitle and does **not** clear the worst-case chip cluster. That cluster is code-named: the posture button embeds phase name + `GATE …` gatechip + optional `PLAN DRIFT` chip (`commandConsole.ts:544`), plus a sibling TFR `.chip.needs` (`:535`) — all `white-space: nowrap` (`:537`, `:401`) with no min-width escape. **Mechanism of the overlap (positioned map-anchored pill vs topbar overflow) is not determinable from the static capture — live repro at HEAD: Not verified.** The capture's own filename says the floor breaks; anatomy index:120 and `01-shell.html:80` claim "1280 = verified floor", so the capture and the doc conflict |

### P0-2 · Anchor logic — the map tool column is painted behind the open card stack (skill: "never park a critical action where resizing, zoom or scrolling clips it")

| Severity | Location | Before | After | Why |
|---|---|---|---|---|
| HIGH | `console.css:452` (`.tools { right: calc(var(--gap)*2 + var(--rail-w2)) }`) vs `:530`/`:547` (`.chat`/`.cards` same right anchor, width `--panel-w`=372) · layer tokens `:307-309` (`--z-map-ui:10` < `--z-talon:30`) · geometry: card max-height `:547` = 100vh−52−204−44 → at 800px card band = y 80–580 vs tools y 272–560 · anatomy `01-shell.html:164-168` (tools `tX=1172`) drawn inside the cards band `:179` and dashed chat band `:183`, **no CONFLICT flag** · index:112 Anchors row | With a decision card open, the zoom/pan/extent tool groups are invisible: `qa/calm-plan.png` (1920) shows only the bottommost two icons (layers, fire) clearing the card's lower edge — the +/−/extent groups are behind the card; `qa/e2e-break-1280.png` shows no tools at all. `.cards` is `pointer-events: none` (`:547-548`), so the hidden tools are even clickable blind zones | Relocate the tools column out of the card band — e.g. the quiet left edge above the readout: `.tools { right: auto; left: calc(var(--gap)*2); bottom: calc(var(--dock-h, 0px) + var(--gap)*3 + 26px + var(--gap)); }` (26px = readout height, `:461`), keeping the DOCKH+2·GAP logic; or dock the groups as a horizontal row above the timeline band. Update anatomy sheets 01/08 anchor diagrams to match | The console's primary working state (a gated plan open) hides the map controls an operator needs to verify the very plan on screen ("Show on map" exists on these cards, `qa/final-polish.png`). Both authoritative docs specify both anchors without resolving their overlap — the lens treats an invisible control as blocked. Mitigation noted: `qa/final-polish.png` shows tools visible when the stack is short, so the failure is height-conditional — but it occurs at the verified floor and at the projector reference alike |

### P1-1 · Group with space — the inter-card seam inverts the spacing hierarchy on the primary decision stack (skill: "gap between groups ≥ 2× gap within one")

| Severity | Location | Before | After | Why |
|---|---|---|---|---|
| MEDIUM | `console.css:547` (`.cards { gap: var(--s-2) }` = 8px) vs `:605` (`.card { gap: var(--s-3) }` = 12px) · shown in `qa/final-polish.png`: the DISPATCH card and the ALSO WAITING card sit ~8px apart while each card's internal blocks sit 12px apart | Between two whole cards (separate groups): 8px. Within one card (one group): 12px — between-group < within-group, the exact inversion the skill forbids | `.cards { gap: var(--s-3) }` (12px, on-scale). Cost: 4px per additional stacked card — affordable against the 64px the 2026-10-30 audit recovered on this same rule (source comment, `console.css:547`) | Two separate decisions read as one blob at glance distance; grouping on the most consequential surface is carried only by the glass shapes, while the rhythm says the opposite |

### P1-2 · Hint at hidden content — the `+N widgets` affordance overlaps the widget it protects

| Severity | Location | Before | After | Why |
|---|---|---|---|---|
| MEDIUM | `console.css:747` (`.dock-more { bottom: calc(100% - var(--s-4)) }` → pill's bottom edge sits 16px *inside* the dock, over the 38px widget header, anatomy index:107) · shown in `qa/e2e-break-1280.png`: the amber `+2 widgets ▸` pill covers the Fire growth widget's header row | Pill intrudes ~13–16px into the clipped widget's header | `bottom: calc(100% + var(--s-2))` — the pill floats 8px clear above the dock band | The cue for hidden content must not itself obscure content; it also visually merges with the widget header it counts |

### P1-3 · Hidden-content cue coverage — 1440 capture shows dock overflow with no pill

| Severity | Location | Before | After | Why |
|---|---|---|---|---|
| MEDIUM | `qa/final-rev.png` (dock: Fire weather → Fire growth, last widget clipped to ≈90px sliver, **no `+1 widget ▸` pill visible**) vs `commandConsole.ts:1089-1103` (`updateDockMore()` renders the pill for *any* `hidden > 0`) · verify guard 3, `DESIGN.md` §7 asserts the pill at 1280 and its absence at 1920 | Overflow at 1440 with the counted-pill affordance absent; the only cue is the widget's own peek | Re-verify the pill's render timing at HEAD (it measures `offsetLeft` after render, `:1091`; a capture race is plausible). If conditional, widen the guard to assert the pill at *every* supported width where `hidden > 0`, not just 1280 | **Not verified live.** The peek (≈90px of the next widget) satisfies the skill's minimum cue, so this is MEDIUM, not HIGH — but the console's own affordance contract (DESIGN.md §7.3) is width-scoped where the failure is not |

### P2-1 · Plan for growth — plain `1fr` text tracks without `minmax(0,1fr)` (skill detection table, row 1)

| Severity | Location | Before | After | Why |
|---|---|---|---|---|
| LOW | `grep -n "1fr" console.css` → tracks at `:475` `.lrow`, `:487` `.airow`, `:499` `.facts`, `:630` `.opt`, `:654` `.coa`, `:676` `.record`, `:682` `.mini .row`, `:686` `.wrow`, `:694` `.entry`, `:722` `.measures`, `:727` `.drow`, `:816` `.urow`, `:835` `.zrow`, `:853` `.erow`, `:915` `.modal li`, `:922` `.keys` — only `.wx` uses `minmax(0, 1fr)` (`:808`, `:813`) | `grid-template-columns: … 1fr` on tracks holding text | `minmax(0, 1fr)` on the text-bearing tracks, starting with `.opt` (`:630`) and `.entry` (`:694`) | Hardening per the skill's detection table, **not a shown failure**: no clip in the four captures, and the ellipsis rows already neutralize min-size correctly via `overflow: hidden` (`.wrow span :688`, `.urow span :819`, `.sitbtn b :430`); the rest wrap, so min-content = longest word. Long unbreakable tokens (callsigns, URLs pasted in chat) are the residual risk |

### P2-2 · Density — off-scale spacing values inside the console's own "strict 4px grid"

| Severity | Location | Before | After | Why |
|---|---|---|---|---|
| LOW | `:895` `.bridge { margin: 0 4px 10px }` · `:747` `.dock-more { padding: 0 10px }` · `:1017` `.dchips { gap: 5px }` · `:1021` `.refs { gap: 5px }` · `:509` `.rail .statuspill { gap: 7px; padding: 10px 7px }` | 5px / 7px / 10px values one-off from the `--s-*` scale (4·8·12·16·20·24·32·40, anatomy index:106 "strict 4px grid") | 5→`var(--s-1)` (4px), 7→`var(--s-2)` (8px), 10→`var(--s-2)` or `var(--s-3)` as optical fit | The skill: "Deeper nesting repeats the same spacing step rather than inventing a new one" — and the console's own contract declares the grid strict. Sharpest instance: `.evid` chip rows gap 4px (`:627`) vs `.dchips` chip rows gap 5px (`:1017`) — the same pattern, two steps. Sub-4px gaps in pips/dots (`:525`, `:563`, `:873`) are optical tuning at micro scale and are fine |

### P2-3 · Density/overlap — map-label collisions and card/gutter clipping (data-anchored)

| Severity | Location | Before | After | Why |
|---|---|---|---|---|
| LOW | `qa/final-rev.png`: SPOT FIRE chip overlaps the wind readout pill's right edge; a label fragment ("…of the front") clipped behind it · `qa/calm-plan.png` and `qa/e2e-break-1280.png`: the CHOKE · ENCINAL HAIRPIN box overlaps the ZONE 3 · SAFE ASSEMBLY label · `qa/e2e-break-1280.png`: label fragments clipped in the 12px card↔rail gutter · `qa/final-polish.png`: the wind readout pill appears partially occluded by the card stack's left edge | Labels collide with labels and with floating regions at several camera positions | Declare an anchor-priority and keep-out rule in the label placer (terrainEngine side): wind readout > event chips > unit labels, and a ≥16px keep-out inset from the cards/rail band edges; defer to anatomy sheet 08, which owns map chrome | Camera-dependent and transient (labels are data-positioned at `--z-map-ui`), so LOW — but the same two collisions reproduce across two captures, so it is systematic, not noise |

### P2-4 · Conflicts the console documents as deliberate (reported as conflicts, per the rules)

| Severity | Location | Conflict | Resolution offered |
|---|---|---|---|
| — | anatomy index:120, `01-shell.html:80`, `console.css:1006` ("No phone layout", 1280 floor) vs the skill's 320px / 200% zoom stress mandate | The skill demands a 320px mirror/resize check; the console explicitly excludes phone layouts as product scope | Accepted as a documented scope decision — the lens does not judge it, but notes 200% zoom coverage is *documented* (e2e adversarial battery, `DESIGN.md` §7) and **Not verified here** |
| — | skill's logical-property/RTL standard vs zero RTL handling | `grep -n "\[dir\|dir=" console.css index.html commandConsole.ts` → **0 hits**. Load-bearing physical transforms exist: card-stack displacement `translateX` (`console.css:553`), `chat-in translateX(10px)` (`:534`), switch knob `translateX(12px)` (`:485`), field shake (`:878`), plus physical `left/right` anchors throughout. RTL is neither supported nor documented as excluded in `DESIGN.md` | If RTL is out of scope, say so in DESIGN.md; if it ever enters scope, every transform above needs a `[dir="rtl"]` override or a logical rewrite. **Not verified — no RTL mode exists to switch** |
| — | skill's `100dvh` detection row vs `100vh` ceilings on `.chat`/`.cards`/`.pop` (`:466`, `:530`, `:547`) | `100vh` on full-height panes is the skill's flagged pattern — but its failure mode (mobile browser chrome) cannot occur in a documented desktop-only, `body{overflow:hidden}` (`:352`) console | No change required within stated scope; revisit if a tablet/touch posture is ever added |

### LOW-5 · Shared edges — one anchor, two tops (and two widths at ≥1680)

| Severity | Location | Before | After | Why |
|---|---|---|---|---|
| LOW | `console.css:530` (chat top = 2·GAP+TB = 76) vs `:547` (cards top = same **+4px** = 80); anatomy index:112 "chat/cards top 76/80" · widths: chat `--panel-w` 400 at ≥1680 (`:325`) vs cards hardcoded `372` (`:547`) | Two alternate occupants of one anchor diverge by 4px vertically (always) and 28px horizontally at ≥1680 | Either drop the +4 and derive both tops from one calc, or keep it and document the optical reason beside the token; derive the cards' width from `var(--panel-w)` so the alternates share one dimension | The anatomy records the 4px offset without a CONFLICT flag; the lens asks why a single anchor has a second top. Isolated alignment polish |

### LOW-6 · Group with space — a separator where the space already did the job

| Severity | Location | Before | After | Why |
|---|---|---|---|---|
| LOW | `console.css:427` (`.vsep`, 1×22px hairline between brand and situation button) with `--s-3` gaps on both sides (`:423`) | Hairline separator inside a 12px-gap flex row | Drop `.vsep` and let the 12px gap carry it, or keep it and document it as chrome punctuation | The skill: separators last, "never pair it with a large gap that already did the job." Borderline — the topbar is a shaped, dense zone where the tick reads as punctuation, hence LOW only |

## (d) What the lens would genuinely praise

1. **The spacing system is real and consumed.** A strict 4px scale (`--s-1..10`, `console.css:266-274`) with `--gap` explicitly snapped to it (`:298`), and components that read only tokens — exactly the precondition under which the skill waives its own default numbers, and the density is *preserved*, not inflated ("Preserve an established, usable density").
2. **Anchor logic expressed as formulas, not magic numbers.** One 12px screen margin; every floating region derives from it: `CARDS-R = 2·GAP + RAIL = 68`, `CHAT-TOP = 2·GAP + TB = 76`, tools/readout/timeline bottom = `DOCKH + 2·GAP` (anatomy index:112; `01-shell.html:128-129`). Shared-edge alignment (skill rule 3) is systematic and self-documenting — and the inspector's top (`2·GAP+TB`, `:495`) matches the chat's, so transient regions land on the same edges.
3. **Breakpoints come from the content.** Five breakpoints (1680w / 1310w / 780h / 980w / 900h — `01-shell.html:132` brk table; `console.css:324-325`, `:648-653`, `:997-1005`) each carry a comment naming the exact collision they prevent ("compact the topbar before the posture pill can ever collide", `:995-996`; the ≤900h card compaction citing the 2026-10-30 audit, `:646-647`). No device presets anywhere. The ≤900h belt demonstrably holds in `qa/e2e-break-1280.png`: the gated card fits its gate, fragility lines, auth pills and both options above the dock, with the COA collapsed behind a disclosure that **names** what is hidden ("Compare courses of action") — the skill's disclosure rule verbatim.
4. **Grouping hierarchy is respected in the main.** Glass background shapes + negative space carry the structure; hairline separators appear only where the skill sanctions them — dense data rows (`.zrow :835`, `.drow :727`, `.coa :654-667`).
5. **Overflow has a voice.** The `+N widgets ▸` pill *counts* the clipped widgets and scrolls to them (`commandConsole.ts:1102`, visible in `qa/e2e-break-1280.png`); scroll edges use the project's established 32px fade cue (`console.css:935-990`, anatomy index:126); ellipsis rows correctly pair `min-width: 0` + `overflow: hidden` (`.sitbtn b :430`, `.urow span :819`, `.wrow span :688`).
6. **Displacement by transform, never layout.** Opening the chat shifts the card stack with `translateX(calc(-1 * (var(--panel-w) + var(--gap))))` (`:551-553`) — the map canvas never reflows (anatomy `01-shell.html:136-137`, notes 1–2), which is anchor logic done at the compositor.
7. **Nested edges follow a documented concentric rule** (`r_in = max(2, r_out − pad)`, applied with comments at `:470`, `:654`, `:673`; anatomy index:108 — which even self-reports the one CONFLICT where the formula is violated). Alignment of inner-to-outer radii is exactly the "shared edges" discipline the lens wants.

## (e) Hard gates, bans and floors — pass/fail

**Skill gates the console PASSES**
- Spacing via the project's own token scale (strict 4px grid) — pass, with the P2-4 exceptions listed.
- Group with space → shapes → lines (separators confined to data rows) — pass (`.vsep` LOW-6 is the only residue).
- Controls distinct from content — pass: every control is shaped/bordered or lives in a consistent placement zone (card footer, toolgroup, rail); no static-text-lookalike actions found in the four captures.
- Order by importance — pass: identifying content leads on every inspected row/card/topbar (card meta + countdown first, options before basis chips; topbar brand → incident → posture → clock).
- One primary action per view — pass: `opt.rec` highlighted row per card (`:637`); no competing primaries observed.
- Hidden-content cues — pass in mechanism (fade + peek + counted pill + named disclosure), with the P1-2/P1-3 placement/coverage defects.

**Skill gates the console FAILS**
- HIGH: overlap at a supported viewport — the 1280 topbar collision (P0-1).
- HIGH: a critical action parked where content clips it — the tool column behind open cards (P0-2).
- The 2× between/within group-gap ratio — inverted at the card stack (P1-1).

**Floors and stress checks**
- 320px: **excluded by documented product scope** (conflict reported, not judged — P2-4a).
- 200% zoom: documented as covered by the e2e adversarial battery (`DESIGN.md` §7) — **Not verified here** (suite not run).
- RTL mirror: **Not verified — no RTL mode exists** (P2-4b).
- Resize ladder 1280 / 1440 / 1920: evidenced by the four captures — passes structurally except for P0-1, P0-2, P1-2, P1-3.

**Verification record (what was actually run this session)**
- Read in full: skill `SKILL.md`, `grouping-and-alignment.md`, `spacing-and-adaptivity.md`, `DESIGN.md`, `docs/anatomy/index.html`, `docs/anatomy/01-shell.html`, `console.css` (1,141 lines); the four named screenshots.
- `wc -l` on the three code/doc files (1,141 / 136 / 259 lines — sized the reads).
- `grep -n "1fr" console.css` → 16 plain-`1fr` tracks + 2 `minmax(0,1fr)` (P2-1 locations above).
- `grep -n "100vh|100vw|dvh|svh|scroll-padding|minmax|safe-area|@container|container-type" console.css` → `100vh` at :466/:530/:547/:554/:750; `100vw` at :1002 (safe: `body{overflow:hidden}`, `:352`); `minmax` only :808/:813; **no** `dvh`, **no** `scroll-padding` (no sticky-header-in-scroll issue exists — widget/table headers sit outside their scrollers), **no** container queries (floating regions are viewport-anchored, so viewport MQs are the correct tool here).
- `grep -n "translateX|…physical properties…" console.css` → physical transform/edge inventory (P2-4b).
- `grep -n "\[dir|dir=" console.css index.html commandConsole.ts` → **0 hits** (RTL absent).
- `grep -n "TFR|tte-pill|dock-more|…" commandConsole.ts` and read of `:1080-1104` → TFR chip at `:535`, posture/gatechip/drift cluster at `:544`, `updateDockMore` renders the pill for any `hidden > 0` with label `+N widget(s) ▸` at `:1102`.
- `grep -n viewport index.html` → `index.html:5` carries `viewport-fit=cover` (safe-area-ready, though `console.css` uses no `env()` insets — fine for a fixed desktop shell).
- **Not run / Not verified:** any live browser render (HEAD re-check of P0-1, P1-3, the 320px/200%/RTL stress set), `node tools/verify.mjs`, `node tools/e2e.mjs`. Anatomy dimensions were cited as ground truth per the ask, not re-measured.

**Call: Block** — two HIGH findings remain. Everything else in the table is work to do.
