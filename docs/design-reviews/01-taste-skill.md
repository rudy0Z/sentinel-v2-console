# Design review · taste-skill (design-taste-frontend v2, app-screen rules)

Lens: **taste-skill** — art direction over the average AI page, applied here through the skill's
`references/app-screens.md` (the Sentinel console is an app screen: worked in, not read and scrolled).
Reviewed 2026-11-01 against: `console.css` (read in full, 1,141 lines), `DESIGN.md` (read in full),
`docs/anatomy/index.html` + `docs/anatomy/01-shell.html`, and the four supplied screenshots
`qa/final-polish.png` (1440×900), `qa/final-rev.png` (1440×900), `qa/calm-plan.png` (1920×1080),
`qa/e2e-break-1280.png` (1280×800).

**Inspector statement:** `lint.mjs` / `inspect.mjs` were **not run** — this reviewer is read-only and
the gate writes its artifacts to `.taste-skill/`. Per the skill's own special case ("say in the report
that the inspector could not run"), every visual claim below is grounded in the four screenshots or in
cited source lines; nothing was measured in a live browser this session. Dimensional facts are cited
from the anatomy set, which is the declared source of truth.

---

## (a) Lens summary — what this skill demands

For app screens the skill bans the generated-dashboard template (tinted sidebar, icon-circle KPIs,
sparklined tiles, zebra tables, rainbow charts) and demands: **colour spent on data, not chrome**
(median ~3% coloured pixels); **KPIs as type, not tiles**; flat surfaces (1px rule or one tone step,
shadows only on what truly floats); **no hero header** (noun title, 18–32px); charts with almost no
chrome (one hue on the main data element, 3–5 faint gridlines, straight lines, no markers); tables as
rules and alignment (right-aligned tabular figures); **honest data states** (zeros print, missing is a
dash, copies of one fact agree, every relative figure names its baseline). The screen must answer its
**one question** with its biggest block, put the **one finding** where it is read first, and put the
most frequent job **one click away**. House floors: no text under 11px, ≥4.5:1 on every tier that
carries words, one tracked-uppercase label per screen at most, no glass/backdrop-blur, no gradients on
buttons, radius bimodal and chosen once. The judge is the screenshot: "if a problem shows in a
screenshot, it is real, whatever the code says." Quiet is the starting point, not the goal — the
screen must still show the product: its name, its data at real size, the one thing to do next.

## (b) Verdict + score

**8.0 / 10** (Awwwards-weighted: design 8 · usability 7 · creativity 9 · content 9 = 0.4·8 + 0.3·7 +
0.2·9 + 0.1·9) — a genuinely art-directed command console whose colour discipline, data honesty and
frame arithmetic beat the template class outright, held back from 8.5+ by real collisions at its own
verified 1280 floor, axis labels erased by its own scroll-fade mask, and a 10.5px data floor under the
skill's 11px hard floor. (Note: two page-rule caps — monospace labels and a shadow visible at rest —
would formally bind the overall at 6.5; both are this console's documented house style, judged under
the app-screen allowances in §13 of the reference — see finding P2-7. One cap does bind unambiguously
through its effect: "content clipped off-screen: usability cannot exceed 5" is mitigated to the
usability 7 above only because the clipped axis labels are a fade, not a truncation.)

## (c) Findings, ranked

### P0-1 · Topbar cells collide at the console's own verified floor (1280×800)

`qa/e2e-break-1280.png`, top-left: the amber scenario chip **"TFR · AIR ATTACK OPS · UAS FLOOR < 150°"**
is superimposed directly over the incident title **"Encinal Canyon · WUI breakout"** — text on text in
the primary chrome. This is the exact failure the skill's pass 13 names ("Is anything lying on top of
a headline…?") and its app critique question 6 ("Does any label collide with another label?"), at the
viewport the anatomy declares the product floor ("1280 is the verified floor",
docs/anatomy/01-shell.html note 8). The existing compaction guard does not cover it:
`@media (max-width: 1310px)` only hides `.kpis .kpi.opt` and `.sitbtn small`
(console.css:995-1000, whose own comment says it exists "before the posture pill can ever collide with
the situation meta") — a wide injected chip is a third actor the guard never met.

**Fix (buildable):** (1) make wide scenario chips flex-shrink-protected members of the overflow-hidden
`.kpis` strip (`console.css:436`) instead of free siblings, so the strip — not the title — absorbs the
clip; (2) when a chip wider than ~280px is present at ≤1310px, truncate `.sitbtn b` harder (drop to the
short incident name); (3) add a verify guard asserting zero bounding-box intersection among topbar
cells at 1280 with the TFR chip present (the suite already parses live DOM for guard 3,
DESIGN.md §7).

### P1-2 · The Fire growth chart's x-axis labels are erased by the widget's own bottom fade

`qa/final-polish.png` and `qa/calm-plan.png` (both widths, both scenarios): the bottom axis lane of the
Fire growth widget — the "0" tick and the time labels ("Jan 14 · 03:52…", "T+1:1…") — sits half-faded
into nothing at the dock's lower edge. Mechanism, from source: every `.wbody` carries the `.fade-y`
mask (`console.css:935-940`) with `--fade-len: 32px` (`console.css:240`), and `fade-y-run`'s 0%
keyframe sets `--fade-end: calc(100% - var(--fade-len))` (`console.css:960-964`) — so an unscrolled
widget body **always** fades its bottom 32px, which is exactly where `.chart .axis` labels live
(`console.css:858, 860`; `.chart` is `overflow: visible`). The skill: labels never collide with
nothingness — "a problem visible in a screenshot is real."

**Fix:** opt content-height (non-scrolling) widget bodies out the way `#cards` already is — reuse the
`fade-y-run-content` keyframe for `.wbody` when `scrollHeight <= clientHeight` (the TS layer knows;
`#cards` does precisely this at console.css:956-958, 966-971) — or reserve an axis lane inside the
growth widget: pad the SVG's bottom by `--fade-len` + 2px so the labels render above the mask stop.

### P1-3 · Map label collisions at 1280 (and one at 1440)

Three visible collisions in the evidence:

- `qa/e2e-break-1280.png` (~x 200-530, y 340-395): the **"CHOKE · ENCINAL HAIRPIN"** box sits on the
  **"ZONE 3 · SAFE ASSEMBLY"** label, and its subline "80° switchback · one lane outbound" overprints
  the zone label's second line "PCH westbound".
- `qa/final-rev.png` (top, ~x 1065-1105): the wind chip "WIND ENE 22 G38" overlaps another map chip,
  leaving only the fragment "ST" visible behind it.
- `qa/e2e-break-1280.png` (right edge, ~x 1210-1280, y 330-360): label fragments ("…TION", "T-05:15")
  clip at the viewport edge beside the rail.

The skill's chart law is "labels never collide," and its remedy is structural: priority-ranked labels,
each beside its own leader, lower-priority marks suppressed rather than overprinted (app-screens §6.4).
The map label layer lives in the engine, not `console.css`, so the fix is there.

**Fix:** a declutter pass at ≤1440: compute label/chip bounding boxes per frame beat; when two
intersect, hide the lower-priority one (choke > zone > unit) or offset it on a leader line — the
annotation-row discipline the skill prescribes. The anatomy already treats the map as L0 with a fixed
label budget; make the priority order explicit in `terrainEngine` and test it at 1280 in `e2e.mjs`.

### P1-4 · Documented 10.5px data floor vs the skill's 11px hard floor — deliberate conflict

`--fs-badge`, `--fs-chart`, `--fs-harness` are 10.5px (`console.css:248-250`), documented in DESIGN.md
§2 as a deliberate "data-ink floor 10.5px". The skill's app rules set a hard floor: "Nothing under
11px" (§13); axis ticks run 11-16px, median 12 (§6.3); the inspector "fails text under 11px" (§2.7).
This is a **reported conflict, not a silent fail**: the console's floor is documented, guarded, and
applied consistently to mono data badges and chart ticks. On the evidence it is the thinnest legibility
margin in the system — chart ticks and provenance badges at 10.5px are the smallest marks on a screen
whose reference display is a projector at 1920 (anatomy note 4).

**Fix:** lift `--fs-chart` and `--fs-badge` to 11px (two token lines + the DESIGN.md §2 floor sentence
+ one verify assertion), or document an explicit allow for chart-axis text only. Nothing else in the
type ramp (11 / 11.5 / 12.5 / 13.5 / 17 / 18 / 22 — `console.css:247-256`, 8 sizes, within the study's
4-9) conflicts with the skill.

### P2-5 · Mono glyph confusion in the 11px countdown: "7:00 1eft"

`qa/final-polish.png`, the ALSO WAITING card ("Two sources disagree on the heat"): the countdown reads
**"7:00 1eft"** — at 11px in Geist Mono the lowercase "l" of "left" is indistinguishable from the digit
"1" beside two real digits. `.countdown` is mono end-to-end (`console.css:625`). A clock that can be
read as "one left / 7:00 eft" in a decision queue is a wording defect, not a nitpick.

**Fix:** mono digits + sans word — render "left" in `--font-sans` inside `.countdown` (one nested
`<b class="sans">`), or reword to "7:00 to act". The larger card's "9:36 left" (same screenshot) reads
cleanly at caption size, which supports the size/face interaction.

### P2-6 · Dock overflow is affordance-guarded at 1280 and 1920 but raw-clips in between

`qa/final-rev.png` (1440): the fifth widget ("Fire growth") clips mid-header ("Fire grow…") and
mid-chart at the viewport edge; **no "+N widgets" pill is visible in this frame**. `qa/calm-plan.png`
(1920): a sliver of a further widget (letter fragment "…OSED") still shows past Fire growth — although
DESIGN.md §7 guard 3 documents "at 1920 asserts no overflow and no pill" (that guard runs its own
scenario; this scenario carries six widgets, ~2044px of content by the width ladder — widget widths at
`console.css:752-756` — against 1920). The affordance itself, `.dock-more`
(`console.css:744-747`), is exactly the honest clipped-state device the skill likes; it is only
guaranteed at the two guard widths.

**Fix:** render `.dock-more` whenever `.slots` actually overflows, at any width (its own comment,
`console.css:744-746`, already states that rule); extend the verify guard to assert pill-presence
iff overflow at 1440 as well.

### P2-7 · Documented-deliberate conflicts with the lens's bans (reported as conflicts, per the ask)

Each of these is a place where the console's written contract (DESIGN.md, anatomy) deliberately keeps
a device the skill bans. They are decided, systematic and tokenised — the opposite of slop — so each is
weighed with its defense and its cost on the evidence:

| # | Device | Skill ban | Console's documentation | Defense / cost on evidence |
|---|---|---|---|---|
| a | **Glass chrome** — `.glass` backdrop `blur(10) saturate(140%)` + inset rim + 0.5px hairline + two drop layers + 4.5% film grain (`console.css:365-367, 287`; anatomy index "Glass" row, `index.html:121`) | "Glows, glass, backdrop blur" (§13 banned table) | One glass recipe for all floating chrome; `prefers-reduced-transparency` swaps to solid surfaces (`console.css:343-345`) | Floating regions genuinely hang over a live WebGL map; the fallback exists. Cost: the blur is why content behind cards ghosts through (a doubled chip row is faintly visible through the decision card in `qa/final-polish.png`, y≈385-400 — one look recommended). Defensible; keep. |
| b | **Slate-tinted dark ground** — the whole neutral ramp is `--p-slate-*` (`console.css:23-35`), canvas `#07080B`, widget `#101218` | Dark study: "Ground: #000, #111, #171719. **No navy and no slate**" (§9.3); banned table: "a navy or slate dark theme" | The ramp *is* the brand and is shared literally with the WebGL bridge; OKLCH was traded away for exactly this (DESIGN.md §1) | The blue cast is mild and the text tiers clear 4.5:1 with margin (DESIGN.md §2). Cost ≈ none visible. Conflict stands as identity, not defect. |
| c | **Gradients on buttons and wordmark** — `--btn-bg` white-alpha sheen (`console.css:209`), `--btn-primary-bg` #FFF→#DCE0E8 (`:212`), `--wordmark-gradient` "engraved metal" (`:232`) | Pages: "No gradients… not on buttons"; apps: gradient only as a chart area fade (§13) | Deliberate avionics-hardware idiom; the press idiom collapses the specular highlight (DESIGN.md §6) | At 2-6% alpha the button sheen is invisible as a gradient; the wordmark is branding. Cost ≈ none. |
| d | **Tracked-caps labels** — `.caps` 11px/.08em (`console.css:357`), posture pill (`:537`), prov badges (`:408`), card kickers, order header, map labels; anatomy: "caps tracking .08em" (`index.html:114`) | "At most one tracked uppercase label on a screen" (§13) | Tactical art direction; every instance is load-bearing (provenance, authority, status, callsigns) | The study's ban targets decorative tracked caps; here each caps label carries a value or an authority state. Keep — but this is the budget the console most clearly exceeds; if ever trimmed, card kickers go sentence-case first. |
| e | **Shadow weight on floating regions** — `--shadow-2: 0 18px 50px` @50% black on `.chat` and every `.cards .card` (`console.css:286, 530, 550`); shell sheet "shadow envelope Y18 · BL44 · SP−18" (01-shell.html:131) | Resting card: at most a small blur under 8% black; floaters (menu, popover, composer) exempt (§13) | The regions truly float over the map — the exemption's own category | Defensible in kind, heavy in degree: 50% alpha at 50px blur on a dark ground is at the far end of what the study measured. Halving to ~30% would lose nothing on the evidence. |
| f | **Sparkline per fleet row** — `.spark` 54×14 grey polyline beside battery readouts (`console.css:822-825`) | "Sparklines on KPIs (0 of 23) → the trend in its own chart, or nowhere" (§13) | Documented as "battery trend: session-observed sparkline (MEA)" | Not on a KPI tile — it is row-level trend data in a dense monitoring list, in `--icon` grey. Borderline keep. |
| g | **Entrance animations** — `widget-in`, `chat-in`, `pop-in` (`console.css:468, 534, 761`) | App house rule: "Nothing on the screen performs an entrance" (§2.8) | DESIGN.md §6 entrance/exit asymmetry (120/80ms) | Event-driven arrivals (a new decision card) are the "row arriving" the same rule lists as legitimate feedback; the boot-time widget stagger is the weaker half. 6-10px of travel; harmless on evidence. |
| h | **No phone layout** — "Target: control-room and desktop displays, 1280px and up. No phone layout." (`console.css:1006`; anatomy note, `index.html:120`) | The app chapter requires a 390px check and a phone fold (§12) | Explicit product scope decision, documented | Outside the study's premise; reported as scope, not defect. The ≤780px-height and ≤1310px-width breakpoints (B2/B3, 01-shell.html:132) show the in-band compaction is real. |
| i | **Five panel radii + pill, and the anatomy's own CONFLICT** — 4/6/8/10/12/999 (`console.css:276-282`); "CONFLICT: applied inner radius on coa/dissent/menu is 4 where the formula yields 2" (`index.html:108`) | Radius bimodal, chosen once; inspector warns over three panel radii (§9.4) | Concentric rule documented; the 4-vs-2 deviation is self-reported in the anatomy | Panel radii in play are really 10 (cards/widgets), 12 (chat/modal), 6 (controls), 4 (nested wells) — warn territory, and the self-flagged 4-vs-2 should be resolved to the formula or the formula amended. |

## (d) What the lens would genuinely praise

1. **Colour is spent on data, and the map is the reply.** Chrome is neutral slate glass; every hue on
   screen means something: fire front orange, committed route in tactical cyan, proposed zones dashed
   periwinkle/amber, safe assembly green, red only where life safety lives (DET-1 chip, ORDER well,
   `--live`). `qa/final-rev.png` is the poster for this: the busiest frame in the set and the chrome
   still reads as grey. This is the skill's #1 separating habit ("colour goes on data, not chrome").
2. **State is carried by geometry, never colour alone** — proposed is dashed, committed is solid 1.5-2px,
   draft renders beside, cut is P0-only (DESIGN.md §3; visible on every map frame). This exceeds the
   lens's own standard: the skill asks that a series be identifiable without its legend; the console
   makes its *plans* identifiable without their colours — a washout projector or a CVD operator reads
   the same map.
3. **The decision card is the app-screen ideal.** Kicker provenance ("● DISPATCH · NEEDS YOU"), a
   countdown at the card's head, the question as the headline, one supporting sentence carrying the
   numbers (14 m/min, 2 hours, 9 homes, +38 min), keyed options with the recommended one marked
   (`.opt.rec`, `console.css:637-638`), evidence chips, "Waits for you", and "Why? / Show on map" —
   evidence beside the answer and the most frequent job one click away, exactly as §2.2 demands. The
   screen's biggest block (the map) answers its question ("where is this happening"), and the biggest
   *figure-bearing* surface (the card) answers "what needs me, by when".
4. **The data tells the truth.** Copies agree: Zone 1 "37 homes" + Zone 2 "345 homes" in the Evacuation
   widget equal "37 + 345 households" in the ORDER well (`qa/calm-plan.png`, `qa/e2e-break-1280.png`);
   relative figures name their baselines ("Open · cut projected T+1:55 (was T+2:09)", `qa/final-rev.png`;
   "est. T-0:10 · Trancas Cyn"); lapse consequences are written out ("If it lapses: Nothing is sent;
   escalate to the Regional Duty Supervisor"); the COA table compares like with like (16 vs 17 min; 37
   vs 15 homes through the hairpin); the epistemic state is on screen as content ("Two sources disagree
   on the heat"). The skill's §2.1/§2.7 data-honesty checks pass on the evidence shown.
5. **The frame's arithmetic closes and is written down.** One 12px margin on every region and one 12px
   gutter everywhere (`--gap`, `console.css:298`; anchors `2·GAP+TB=76`, `2·GAP+RAIL=68`, dock
   clearance "was 120px — 64px of dead card height; audit 2026-10-30", `console.css:547`; shell sheet
   figs, 01-shell.html:90-97). Equal margins, no lopsided sections, no blank stretches: the fixed
   screen passes the page-frame checks by construction, and the audit comment shows dead height is
   actively hunted and reclaimed.
6. **Motion is feedback, budgeted.** Dual press idiom (travel + specular collapse on wide controls,
   scale on chips), compositor-only `scaleX` bars with a documented width→`--fill` migration contract
   (`console.css:840-845`), 120/80ms asymmetry, and real `prefers-reduced-motion` and
   `prefers-reduced-transparency` fallbacks (`console.css:328-345`). No parallax theatre, no
   scroll-jacking; the continuous loops are status breathing, and reduced-motion stops them.
7. **Type is systematic with faces that have jobs.** Two self-hosted faces (Geist Sans + Geist Mono,
   `console.css:9-15`), tabular figures wherever a number renders (`.mono, .num`, `console.css:356`),
   numbers right-aligned with units as grey suffixes in the fleet/weather rows (`.urow`, `.wx`,
   `console.css:808-821`), widget headers sentence-case at 11.5px (`console.css:794`), 8 sizes
   (study range 4-9). The word "OVERVIEW" never appears; the words are of the trade: "Gimbal lock ·
   head", "Burned area · projected after now (dashed)", "ERC 78", "reverse-911 ≈ 172 lines".
8. **Honest overflow and honest emptiness.** The "+2 widgets ▸" pill in `qa/e2e-break-1280.png` is a
   guarded, counted affordance for a clipped state most dashboards hide silently; `verify`/`e2e`
   (69 checks, DESIGN.md §7) hold the line on the red discipline, the contrast floor and the dock
   affordance — the contract is enforced, not hoped for.

## (e) Hard gates, bans and floors — pass/fail

**Not run:** `lint.mjs --app` and `inspect.mjs --app` (read-only reviewer; the gate writes artifacts).
What follows is judged from source lines and the four screenshots.

| Gate / ban / floor (app-screen rules unless noted) | Status | Evidence |
|---|---|---|
| Text ≥ 4.5:1 on every tier | **PASS** (documented + verify-guarded) | DESIGN.md §2 table; `console.css:98-103`; guard 2 of §7 |
| Tabular figures on numbers; right-aligned columns; units as grey suffixes | **PASS** | `console.css:356, 438, 810, 818`; `qa/final-polish.png` fleet/weather |
| No zebra, no header band; row rules one step lighter | **PASS** | `.zrow` rule + `:last-child` off, `console.css:835-836` |
| Zeros print, missing is a dash, empty keeps its frame | **PASS** on evidence | "Nothing is sent", "ETA 0:13", "0 homes" chip, `qa/final-polish.png` |
| Fact shown twice is one variable; totals from parts | **PASS** on evidence | 37 + 345 households = zone rows (`qa/calm-plan.png`); wind ENE 22 G38 identical in widget and map chip |
| Relative figures name their baseline | **PASS** on evidence | "(was T+2:09)", "est. T-0:10", "at T+0:05" (`qa/final-rev.png`, `qa/final-polish.png`) |
| Colour says good/bad, not up/down; one status mark per row | **PASS** | `.batt` level ladder with amber-not-red below 25% (`console.css:831-834`), verify-guarded (DESIGN.md §7.1) |
| Accent on data only; no tinted nav rows / coloured pills on chrome | **PASS** | "One accent: state = 2px edge cue + tinted bg 14% — never a full colored frame" (`index.html:122`; `console.css:604-608`); rail active states are neutral (`console.css:385, 457`) |
| No icon tiles / icon-in-circle KPIs | **PASS** | No such construct in `console.css`; widgets lead with labels and numbers |
| Product named + scope shown; main job one click away | **PASS** | SENTINEL + incident + "A. Rao · Operator on authority" (topbar); options + "Authorize P-1" in the card (`qa/calm-plan.png`) |
| One question answered by the biggest block; finding read first | **PASS** | Map is the biggest block; "9:36 left" + "Escalate to Type 3…?" top-right (`qa/final-polish.png`) |
| Nothing lies on top of a headline | **FAIL at 1280** | P0-1, `qa/e2e-break-1280.png` |
| Labels never collide | **FAIL at 1280/1440 (map layer)** | P1-3 |
| Nothing under 11px | **FAIL (deliberate)** | 10.5px floor, `console.css:248-250`; DESIGN.md §2 — conflict reported as P1-4 |
| Content clipped / erased on screen | **FAIL (partial)** | P1-2 faded axis labels; P2-6 raw widget clip mid-width |
| No glass / backdrop blur | **CONFLICT — deliberate** | P2-7a |
| No navy/slate dark; neutral darks only | **CONFLICT — deliberate** | P2-7b |
| No gradients on buttons/wordmark | **CONFLICT — deliberate** | P2-7c |
| At most one tracked-uppercase label per screen | **CONFLICT — deliberate** | P2-7d |
| Shadows on rest ≤8% black (floaters exempt) | **PASS in kind / heavy in degree** | P2-7e |
| No sparklines on KPIs | **PASS (rows, grey, documented)** | P2-7f |
| Nothing performs an entrance | **PARTIAL** | P2-7g |
| Radius chosen once; inspector warns >3 panel radii | **WARN + self-reported CONFLICT** | P2-7i |
| Phone fold / 390px check | **CONFLICT — scope decision (1280 floor)** | P2-7h |
| Equal margins; no lopsided sections; no blank stretches; first-screen title | **PASS** | 12px anchors (`console.css:423, 508, 547, 741`; 01-shell.html:90-97); topbar names product + incident in every screenshot |
| `lint.mjs` / `inspect.mjs` run on the final build | **NOT RUN** | Read-only reviewer; stated per the skill's special case |

**The three changes that would move the console most** (the skill's "fix first" order):
1. Kill the 1280 topbar collision and add the no-intersection guard (P0-1).
2. Let non-scrolling widget bodies skip the bottom fade, or reserve an axis lane in the growth chart (P1-2).
3. A priority-ranked label declutter pass on the map at ≤1440 (P1-3) — then lift the 10.5px floor to 11px (P1-4).
