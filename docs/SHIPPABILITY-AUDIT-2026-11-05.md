# Sentinel — End-to-End Shippability Audit

**Date:** 2026-11-05 · **Build:** `0bdfc4c` (main) · **Audited state:** 10 commits past the last signed-off audit (`a6cfc66`)
**Method:** full re-read of the changed surface, the three new evidence docs, `DESIGN.md` delta, the crew-deck code; both gate suites re-run on this machine; an independent live probe of the canonical run (`qa/audit-f1-probe.mjs`, results in `qa/audit-f1-out.json`); every finding from the 2026-11-04 audit re-scored against the live build.

---

## 0 · Verdict first

| Question | Answer |
|---|---|
| Is it a **shippable prototype**? | **Not yet — five items from it.** The engine, gates and governance are stable; the crew deck is a genuine improvement. What blocks the word "shippable" is documentation drift (3 places) and two surface edges on the flagship arc (the road cut still doesn't reach a heads-down operator; one requisition dangles forever). |
| Is it **mission software**? | **No — unchanged from yesterday.** Every P0 in the Legal Matrix (statutory actor, unnamed RPIC/airspace, WEA origination, `message_unit`, non-record export, degradation) is untouched. This build is a shell/HF pass. It never claimed otherwise; the shippability claim must be scoped to *prototype*. |
| Did the build get better? | **Yes, materially.** Six of the 18 simulation findings are fixed and I re-verified five of them live. The deck buys ~150 px of terrain, continuous peripheral SA, and a visible authority economy. |
| What is the single worst thing in the build? | **F1.** At T+116 the road is cut and the operator's screen says `EGRESS · clear · no active plan`. No card, no pulsing segment, no DOM text. Chime, orb, map marker, attention focus, and a closed drawer. Live-verified today. |

**One line:** the shell got better; the world outside the shell did not change.

---

## 1 · What actually changed

`git diff a6cfc66..HEAD` — 10 commits, 66 files, **+6,530 / −187**.

| Area | Change | Size |
|---|---|---|
| **Crew deck (L1/L2/L3)** | Bottom 204 px widget strip → 58 px independent category segments (Situation · Resources · Egress · Comms · Authority · Ask), each one glance value + provenance chip + state dot; clicking rises a category panel that reuses the old widget bodies; feed wing keeps the drone pip hosted; map tools moved to the **left** edge; dock-more/pinning/step-aside rules retired | `commandConsole.ts` +549 · `console.css` +216 |
| **Layout transplants 1–4** | Gate bar (GATE chip + countdown in the posture line), T+ scene-time stamps on card meta, decision-surface hierarchy, thread tabs | same |
| **Tactile pass** | Pressed controls sink (`--inset-well`) instead of lit top edge; rim-light overrides recorded in DESIGN.md | `console.css` |
| **Feed wing / attention semantics** | Wing re-hosts the pip when a panel takes it; pulse now requires `needs` **and** promotion (a working drone no longer pulses amber) | `commandConsole.ts` |
| **Gates** | verify 45 (new crew-deck fit/panel check), e2e 35 (V3 settle hardened; tools-parked-left assertions) | `tools/*` +251 |
| **Engine** | Minor (draw-call/palette plumbing) | `terrainEngine.ts` +62 |
| **New docs** | `SIM-REPORT-OPERATOR.md` (18 findings), `SIM-REPORT-TALON.md`, `LIVE-API-READINESS.md`, `layout-explorations/` (A/B/C + pick A) | +6 docs |
| **Unchanged** | `talon.ts`, `talonAgent.ts`, `scenarioPlayer.ts`, `data/scenarios/*` — **zero diff** | — |

That last row is the whole story of this audit: **the governance runtime is byte-identical.** Every open governance finding from yesterday (F1–F4, F6, F7) survives this build untouched; the deck is a presentation-layer change.

---

## 2 · Gate chain, re-run on this machine

| Command | Result |
|---|---|
`node tools/verify.mjs` | **45/45 PASS** — incl. red discipline, zero-raw-hex, `--text-4` contrast (5.36:1), crew deck fit at 1280/1920, record loop, bridge, mic, epistemic layer, COA height guard, day lighting |
`node tools/e2e.mjs` | **35/35 PASS** — W1–W5, X1–X2, C1–C3, F1–F4, S1, SB1, B1–B7, V1, V2, V3 ×2 viewports, V4 |
My probe (full W1 run, 1920×1080) | **0 page errors**; 5 review measures reproduce exactly (`2:00 · 6:00 · 7:12 · 14 min · 0:51`) |

No red. The suite culture is intact and the new checks are real checks, not decoration: the V3 settle now waits for a frame after the class flip and for zero live transitions (a 2026-11-04 flake, correctly fixed by hardening the check rather than the claim).

---

## 3 · Live verification of the new deck (independent probe, not the sim report)

Confirmed **fixed** since yesterday:

| # | What I checked | Live result |
|---|---|---|
| SIM-1 | Statutory receipt survives the emptied stack | After `[1] Authorize`: cards = `ORDER ISSUED · REQ → LASD · SHERIFF / COUNTY OES` + `ACK PENDING (15s)` + `Evacuation order issued on your authorization` ✅ |
| SIM-2 | Egress glance no longer lies after expiry | After authorize: `EGRESS · AUT · clear · no active plan` (keys off `ps.gate?.open`, `commandConsole.ts:1389`) ✅ |
| SIM-3/11 | Feed wing remounts and yields to a feed-hosting panel | Wing renders with drone + EO/IR toggles; code path guards `panelHostsFeed` ✅ |
| SIM-4 | Glance tie-breaks by meaning | At cut: `SITUATION · MOD · 19 in +60 · 0 reached` (structures outrank feed) ✅ |
| SIM-12 | No false attention pulse | At the cut, `anyAttnSeg = false` — no routine `working` state pulses ✅ |
| — | Egress materializes at the gate | `EGRESS · AUT · gate open · 9:30`, class `seg attn` at T+6.5 ✅ |
| — | Authority economy is ambient | `0/2 · 0 standing` → `1/2 · 4 standing` → `1/2 · 6 standing` ✅ |
| — | Tools parked left | V2/V3: tools at x=12, zero covered buttons, both viewports — the 2026-11-02 both-open collision class is structurally dead ✅ |
| — | Gate bar in the posture line | `GATE <countdown>` chip renders from `ps.gate.open` ✅ |

This is real, load-bearing work. The deck is not a re-skin: it changes what the operator sees without asking, and it does it with the same tokens and the same scenario determinism.

---

## 4 · Yesterday's open findings, re-scored against this build

### 4.1 Deep-audit findings F1–F13

| ID | Status today | Evidence |
|---|---|---|
| **F1** note-kind interrupts have no card | **OPEN — live-verified, and now sharpened** | At T+116: `openIds=[]`, cut not a card, `anyAttnSeg=false`, no DOM text; only chime + orb (`mood alert`, attention `cut`) + map marker + closed drawer |
| **F2** ungated asks expire silently | **OPEN** | `talon.ts:375–377` unchanged — receipt requires `L.expires !== null` |
| **F3** `message_unit` unguarded | **OPEN** | `talonAgent.ts` zero diff; existence check only; shell auto-`Copy.`; prompt still says the model cannot send |
| **F4** every alternative = verbatim dissent | **OPEN** | `talon.ts` dissent trigger unchanged |
| **F5** export identity | **FIXED (mostly)** | operator/period/refs + ICS-201 section + comms counts; digest still honestly labelled non-attestation |
| **F6** supervisor is a string; operator hardcoded | **OPEN** | `talon.ts:112`; `commandConsole.ts:569,1082` |
| **F7** scene-time budget mislabelled | **OPEN** | tooltip still omits “scene min” |
| **F8** Review is a tab, not a period close-out | **PARTIAL** | ICS-201 narrative in export; still no “close the period” act |
| **F9** boot overlay stays in a11y tree | **OPEN** | `console.css:1024` — `opacity:0` only, no `hidden` |
| **F10** keys 1–9 vs documented 1–3 | **OPEN** | `/^[1-9]$/` twice (`:2656`, `:2687`) |
| **F11** evac widget chips “proposed” after commit | **OPEN** | zone rows still key off `z.state === 'proposed'` (`:1575`) |
| **F12** `truncateThread` dead | **OPEN** | `talon.ts` untouched |
| **F13** renderer crash under screenshot farms | Harness-only | unchanged classification |

### 4.2 Blindspot register B1–B16

| ID | Status |
|---|---|
| **B1** statutory actor does not exist | OPEN — unchanged |
| **B2** aircraft is not an aircraft (RPIC/BVLOS/TFR) | OPEN — unchanged |
| **B3** WEA is a banner, not an origination | OPEN — unchanged |
| **B4** road cut cannot reach a heads-down operator | **OPEN — confirmed live; see §5 N4 for the new edge** |
| **B5** record will not survive subpoena | OPEN — unchanged |
| **B6** degradation is a toast | OPEN — unchanged |
| **B7** multi-zone / concurrent operator | OPEN — record loop is still the only gesture |
| **B8** shift change / relief absent | OPEN — unchanged |
| **B9** dissent ritual over-broad | OPEN — unchanged |
| **B10** `message_unit` leak | OPEN — unchanged |
| **B11** complacency marketed as calibration | **PARTIALLY IMPROVED** — ambient budget/standing/gate layer raises peripheral awareness; G2 reading floor still not live; `post_item` still unbounded |
| **B12** trailer / glare / gloves have no product | OPEN — Field High-Lux exists; plan-state colors still dark-theme values |
| **B13** mutual aid is dialogue | OPEN — unchanged |
| **B14** field/ATAK one-way | OPEN — and one clarification: the “crew deck” is the **operator’s** deck, not a field-crew surface. The name risks over-claiming |
| **B15** live-model honesty unverified on the real path | OPEN — now explicitly framed in `LIVE-API-READINESS.md` (still no real-key run) |
| **B16** 90-second story vs shipped arithmetic | OPEN — unchanged |

### 4.3 Legal Matrix Top-10

All ten stand. Nothing in this build touches statutory authority, aviation law, IPAWS origination, evidentiary chain, or degradation. The crew deck does not move a single legal exposure.

---

## 5 · New findings introduced by this build

**N1 · P1-doc · The anatomy drawing set is one generation stale.**
Sheets `01-shell`, `03-dock`, `08-map-chrome` still document the retired shell: the bottom widget strip, `TOOLS-R · tools right · 2·GAP+RAIL = 68`, the step-aside rules, the dock-more affordance. The shipped product has the 58 px deck, tools at `left: var(--gap); top: 50%` (`console.css:481`), and no step-asides. The 2026-11-02 sign-off treats this set as architecture-of-record; it now documents a product that no longer exists. Sheet 03 in particular (“Dock”) describes removed chrome.
*Fix:* re-draw 03 as “Crew deck”, 08 tools-left anchors, 01 the L1/L2/L3 layer stack, 04 the segment/panel radii — or banner the whole set “superseded by DESIGN.md §8 (2026-11-04)”.

**N2 · P1-doc · HANDOFF and README are stale on the one number a reviewer checks first.**
Both say **44** headless checks; the suite is 45/45 + 35/35. HANDOFF has not been touched since `798ae1b` (pre-deck): “What is built” still lists the dock widget strip; there is no mention of the crew deck, threads tabs, gate bar, V4, or the three new evidence docs. README has the same count drift.
*Fix:* one pass — counts, table rows, and a “crew deck (2026-11-04)” row. This is the cheapest credibility win in the repo.

**N3 · P1-product · One requisition dangles forever: `RECEIPT PENDING`.**
At T+116 the cards carry `ORDER ISSUED · REQ → SHERIFF / COUNTY OES` + **`RECEIPT PENDING`** for the T+93 WEA update — indefinitely, because the `revised` script item carries no `ack`. `talon.issuedState()` is behaving correctly (it refuses to claim a receipt the data does not log); the defect is upstream: the data has no receipt and the UI has no wording for “none will come”. It contradicts the product’s own rule 7 (“no escalation dangles in a string”) and it is the one place the statutory loop is visibly open on screen.
*Fix (data, not governance):* add `ack: { by: 'LASD · Sheriff / County OES', after: 0.05 }` to the `revised` item, **or** render `NO RECEIPT IN SCRIPT · EXERCISE` when `ackAt === null`.

**N4 · P1-product · The Egress segment actively misleads at the cut.**
At T+116 the segment reads `EGRESS · AUT · clear · no active plan`. The gate is indeed closed and the amendment did move the upper canyon north — but the primary route just died above the hairpin and 19 homes are inside the hour. A glance whose job is “what does egress need from me” answers “nothing” at the worst possible moment. This is worse than a missing signal: it is a confident wrong one, and it sits in the operator’s peripheral vision where F1 already fails.
*Fix:* Egress glance must fold life-safety egress notes — `cut` → `attn` + `route cut · 19 above` (and re-arm after a plan amendment if the cut invalidates it).

**N5 · P2 · `.seg` is an overloaded class.**
Deck segments (`.seg`, `.seg-auth`, `.seg.ask`) and segmented-control groups (log filter, drone picker, EO/IR, theme toggle, all `class="seg" role="group"`) share one name. My independent probe read 8 “segments” where the deck has 6, because two control groups matched. Harmless today; fragile the first time someone styles `.seg` globally, and it makes third-party verification harder than it should be.
*Fix:* rename the control groups (`.sectl`) or scope deck segments (`.deck .seg`).

**N6 · P2 · axe coverage did not grow with the new surface.**
`verify` runs axe over standby, detection-card, drawer, review — not over an **open category panel**, the **feed wing**, or the **deck with an `attn` segment**. The new DOM is the most interactive thing in the product; it should be in the a11y battery.

**N7 · P2 · SIM open items carried.**
Panel overflow with hidden scrollbar (#7), Authority→popover unconfirmed in the walker’s probe (#8), T+ stamp wording (#9), report-gate countdown continuing after the report is sent (#14). All four are recorded open in the sim report and remain open; none blocks a demo, three of four are one-line fixes.

**N8 · P3 · Nomenclature debt.** The deck still lives in `<section class="dock" id="dock">` with `<div class="slots" id="slots">`; `--slots-h` was renamed to `--deck-h` in CSS only. Cosmetic, but the drawing set and the reader both trip on it.

**N9 · P3 · The statutory receipt's on-screen life is ~18 scene-seconds.** After the ack resolves the banner disappears (verified: gone by T+9) and the receipt lives only in log/thread. Defensible — ack = closed loop — but during a demo the most important sentence of the night vanishes while the operator is still looking at the map. A persistent `LAST ORDER` chip in the posture line would cost nothing.

---

## 6 · Human-factors re-score for the new shell

Indicative tally: **Pass 14 → 15 · At-Risk 15 · Fail 9 → 8.**

**Genuinely improved**

| Law | Before → after | Why |
|---|---|---|
| Endsley SA L1 (perception) | Pass → **stronger pass** | Ambient glance layer: one number per category, always on screen, with provenance. No click required to know the fire grew. |
| Recognition over recall | At-Risk → **Pass** | Category state is now a glance (gate open · 9:30), not a widget you must remember to open. |
| Change blindness (board) | Fail → **partial** | Segments update in place with state dots; the evac widget chip inside the panel still lags commit. |
| Miller / working memory | Pass at one incident → **stronger at one incident** | Four sentences instead of five widgets to scan; but still no multi-zone support. |
| Cost of knowledge | Pass → **stronger** | Budget and standing count are ambient, not buried in a popover. |

**Unchanged, and now more conspicuous by contrast**

- **Inattentional blindness (Fail).** The deck raises the ambient baseline; a life-safety event with *no* ambient signal is now more anomalous, not less dangerous. F1 is the whole gap.
- **Circadian trough (Fail)**, **vigilance decrement (Fail)**, **prospective memory (Fail, F2)**, **interruption recovery (Fail for notes)**, **team SA (Fail)**, **Yerkes-Dodson (At-Risk)** — untouched.
- **ISA-18.2 (At-Risk).** The budget is now visible on the deck, which is a real improvement in trust; it is still a scene-minute cap, not an alarm-management program, and the notification tier is still unmetered.

**The honest read:** the deck converted three peripheral-awareness deficits into strengths. It did not touch the three that kill at 03:47 — a silent climax (F1), a human who is assumed fresh, and a team that cannot talk back.

---

## 7 · Shippability gates

### Tier A — “shippable prototype” (public, recruiter-facing, demo-safe). Five items:

1. **F1 gets a surface on the flagship arc.** Minimum: the road cut renders as an awareness card (or an `attn` Egress segment with its reason) that closes only on ack. This is the demo's most dramatic beat; today the product *shows* a cut the interface never announces.
2. **N3 close the dangling requisition** (add the ack to `revised`, or label “no receipt in script”).
3. **N4 make the Egress glance threat-aware** so it cannot say “clear” while the route is cut.
4. **N1/N2 doc sync** — anatomy set re-drawn or bannered superseded; HANDOFF/README counts and the “what is built” table brought to `0bdfc4c`.
5. **N6 extend axe** to an open panel + wing state.

Estimate: 1–1.5 days of work, no architecture change. After that the prototype is honest end-to-end: every surface it shows is either true or labelled.

### Tier B — “mission software”. Unchanged and not close:

Statutory actor as a party · RPIC/BVLOS/TFR/Remote ID envelope · IPAWS origination chain · `message_unit` gated or removed · append-only record with custodian and hash chain · degradation with staleness clocks and layer shedding · shift change and transfer of command · field-side surface (the crew deck is not one). Those are the seven P0s from yesterday; this build addressed none and did not claim to.

---

## 8 · What to keep, without argument

- **The deck's information model.** L1 glance / L2 panel / L3 verbs is the correct hierarchy, and it is executed with the same tokens, the same provenance chips, and the same scenario determinism as everything else. The map gained ~150 px; the operator gained ambient SA; the authority economy became visible. This is the best shell the product has had.
- **The receipt that survives the emptied stack.** A statutory answer that vanishes is a statutory answer the operator must take on faith. Fixing that was the highest-value single change in the commit range.
- **The suite culture.** 45 + 35, both green, with the checks hardened rather than the claims softened (V3 settle). The new deck check asserts fit at 1280 and 1920 and panel open/close — a real guard.
- **The simulation reports.** They found five defects I would have found only by probing, and they record their own open items honestly. `SIM-REPORT-OPERATOR.md` is the most useful document in the repo for a reviewer.
- **The kill-list.** Still standing: no duty view inside this console, no auto-execution on lapse, no chain-of-custody inflation, no operator-reliability scoring. The deck did not tempt anyone to break it.

---

## 9 · Bottom line

The build is **better, and it is closer**. The crew deck is a real product-design move, not a re-skin: it changes what the operator knows without asking, and it does it inside the constitution. Both suites are green, the canonical run reproduces exactly, and six of eighteen simulation findings are fixed and re-verified live.

It is **not yet shippable as a prototype** for one honest reason: on the flagship arc, the single most important sentence of the night — *the road is cut, nineteen homes are above it* — still does not reach a heads-down operator, and the segment that should carry it says “clear”. Fix that, close the dangling receipt, sync the three stale documents, extend axe to the new surface, and this becomes a prototype you can put in front of a fire chief without a footnote.

It remains **not shippable as mission software**, exactly as yesterday: the deck did not make the console legally deployable, and nothing in this commit range was meant to. Say “prototype” on the box, and the box is nearly ready.

---

*Evidence: `qa/audit-f1-probe.mjs` (independent probe, full W1 run, 0 page errors) · `qa/audit-f1-out.json` (raw results) · `qa/audit-f1-cut-t116.png` (the cut frame) · gate tails from `npm run verify` / `npm run e2e` re-run 2026-11-05 on this machine.*
