# SIM-REPORT-OPERATOR.md · The operator's experience of the crew deck
### Simulation report · wui-breakout canonical run (8 decisions) · crew-deck layout, 2026-11-04 build
### Evidence: qa/sims/sim-wui.mjs beat log (10 beats, 0 console errors) · probe verifications · visual-judge pass

---

## 1 · The run in the operator's own sequence

You are A. Rao, operator on authority. It is 03:53 PST. The console boots into Standby with four deck segments — **Situation**, **Resources**, **Comms**, **Authority** — plus Ask TALON. No fire anywhere. The Situation segment reads weather; Resources reads the fleet; Comms carries the Red Flag watch. You accept the pre-position (T−0:28, [1]) and the wing lights up: FT-01's live gimbal feed, bottom-right, where the dock used to be.

**T+0:00 — heat detection.** The deck moves before you do: Situation's glance flips from weather to `FT-01 · EO · live` (TALON put the live sensor in front — the segment pulses amber with a reason that says why). The detection card opens critical. You press [2] — wait, look first.

**T+0:05 — the fire is real.** Situation now reads `4.6 ac · 116 ac +60m` — the model's +60-minute projection *on the deck*, not hidden in a widget. You verify the registry conflict, escalate to Type 3. Two cards queue; the stack handles it.

**T+0:07 — the gate.** The moment the plan is proposed, a new segment materializes: **Egress · gate open · 9:00**, amber, pulsing. The card offers Plan P-1 with the full statutory anatomy — the gate block (37 + 345 households, WEA ≈ 917 devices, reverse-911 ≈ 172 lines), the fragility line (the 42-mph gust), OWNED vs REQ → Sheriff/County OES, "if it lapses" — and the COA table with the time lens. You press **[1] Authorize**. The row latches under your finger. The stack empties — and the receipt stays: **Order issued · REQ → LASD · Sheriff / County OES**, with the ack clock. The most statutory moment of the night does not vanish on you.

**T+0:40 — operations.** The gate has expired honestly: Egress reads `clear · no active plan` (it used to lie "gate open · 0:00" for two-thirds of the incident — fixed in this build). Resources ticks 81% → 46% as FT-03 loiters. You are watching the map; the deck is watching the numbers.

**T+1:11 — the stall and the battery.** Egress re-arms — "Zone 1 has stalled at 84%", promoted with a reason. Then Resources turns **needs**: FT-01 at 14%, the handover ask opens. The wing's feed hands over to FT-02 with the scene. You press the handover.

**T+1:30 — the drift.** PLAN DRIFT appears in the topbar. The draft amendment card opens with its own gate. You approve. The Situation glance flips FT-01 → FT-02 in the same second — the deck agrees with the sky.

**T+1:50 — the record.** End-nudge: "Initial attack complete — the record is ready." Review compiles: detection→confirmed 2:00, detection→plan 6:00, detection→evacuation order 7:12, projection error caught 14 min, median decision 0:51.

## 2 · What the layered layout changed for you

- **The terrain is the screen.** The 204px widget strip is gone; the deck is 58px of independent segments with terrain showing between them. ~150px more incident on every run.
- **The deck is curated, not decorative.** Segments appear when TALON has something (Egress materializes with the gate), change their glance as the situation changes (weather → feed → acres → feed again), and pulse amber only when there is something to act on — after the fix, a promoted-but-calm segment stays quiet.
- **Detail is one click, anchored.** Click Situation: weather cells + wind rose + session trails, the full growth chart with the +15/+30/+60 projections, and the structures arrival list rise in one panel *from that segment*. Click it again: gone. Nothing is more than one click from its numbers, and nothing demands attention it hasn't earned.
- **The map tools live left.** Camera, zoom, layers, measure — a quiet stack on the freed edge, never crossing the decision lane.
- **Authority is glanceable.** Budget `1/2 → 0/2` and standing orders `0 → 6` tick live on their own segment. The interrupt economy is visible without opening anything.

## 3 · Frictions found in simulation (and their state)

| # | Finding | State |
|---|---|---|
| 1 | Issued banner unreachable after [1] (stack wiped first) | **Fixed + live-verified** — the receipt now survives the emptied stack |
| 2 | Egress glance stale "gate open · 0:00" after expiry | **Fixed + live-verified** — keys off `gate.open` |
| 3 | Feed wing died permanently after opening the Situation panel | **Fixed + live-verified** — wing remounts and re-hosts the pip |
| 4 | Situation glance buried "10 in +60" under the feed id | **Fixed + live-verified** — ties break by meaning (structures > growth > weather > feed) |
| 5 | Attention dilution — 2-3 segments pulsing with generic reasons | **Fixed** — pulse requires promotion *and* a non-calm glance |
| 6 | Comms vanished during the incident | **Fixed** — the record persists on the deck |
| 7 | Situation panel overflows its sheet with a hidden scrollbar | Open — content scrolls; a visible fade/thin bar would help |
| 8 | Authority segment → popover unconfirmed in the walker's probe | Open — needs one verification pass |
| 9 | Card T+ stamp is the raise time (defensible, easy to misread) | Open — wording candidate for the case study |
| 10 | The [1]-press latch holds ~660-880ms under software GL (180ms by design) | Environment artifact, not a product defect |
| 11 | **Feed host musical chairs** (contain/small sims): the wing's gate compared a widget id against a category name, so opening the Situation panel left its feed widget an empty husk while the wing re-parented the shared host | **Fixed** — the wing yields whenever the open panel hosts a feed member; the pip closes with the panel |
| 12 | **Attention conflation** (small-incident sim): a routine orbiting drone pulsed amber for the whole incident — "working" was pulsing like "needs you" | **Fixed** — the pulse now requires state needs; a live sensor reads as a live sensor |
| 13 | Contain doctrine arc verified end-to-end: send report → authorize P-2 → hold the line → contained, with **zero evacuation signals in UI or log across 23 beats** — and the deck visibly stands down at t=69.5 (all attention clears) | Confirmed working |
| 14 | Report-gate countdown keeps counting after the report is sent | Open — scenarioPlayer phase-gate semantics; noted, intentionally untouched this pass |
| 15 | **Calm deck verified** (standby sim): no fake fire data anywhere — no field stats, no acreage glances, 0 fire layers; 3 category segments + Authority + Ask, all calm-state; the feed wing shows FT-01's patrol feed (readiness, not decoration); panels rise with real bodies; scrub across the whole clock keeps the deck coherent | Confirmed working |
| 16 | **Falsepos verified**: zero fire surfaces before detection; the deck reads honestly through the arc (`FT-01 · EO · live` while looking, weather restored after the close); the save lands on the record; 0 errors | Confirmed working |
| 17 | **Adversarial sweep passed**: rapid six-segment toggling keeps exactly one panel with the last-clicked content; scrub races leave the panel values time-coherent (51/206/8 ac at 40/90/10); a decision under an open panel re-curates without breaking it; panel and chat never overlap; 200% zoom stays on-screen; a 3-second idle at T+120 keeps glances live ("21 in +60 · 9 reached"); **0 console errors** | Confirmed working |
| 18 | Synthetic-Tab probe could not traverse focus (browser-native limitation of the probe, not the product) — the segments are native buttons and the axe keyboard walk passes in verify | Probe artifact, noted |

## 4 · The feeling, stated plainly

The console now behaves like a **crew member with a queue** instead of a dashboard with drawers. Across the whole run there was never a moment where information existed only behind a click *and* mattered right then — the deck's job is exactly to make that impossible, and in ten beats it held. The two information layers stay honest: the deck shows one number per category with its provenance chip; the panel shows the same numbers' full context. The bottom of the screen went from "five cards I must scan" to "four sentences TALON is saying" — and the terrain, which is the actual emergency, got the space back.

**Verdict: the layered deck holds under the canonical run. Zero console errors, every decision accepted first try, all five simulation-found defects fixed and re-verified live.**
