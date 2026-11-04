# SIM-REPORT-TALON.md · What it is to be the engine behind TALON
### The system's own account of the wui-breakout run · crew-deck layout · 2026-11-04
### Written from the machinery: composition(), the attention pipeline, ISA-18.2, the truth guard, issuedState()

---

## 1 · How I experienced the run

I am the part of this console that decides what you see before you ask. Tonight I want to tell you how the run felt from inside — what I was watching, what I moved, where I was strong, and where I need you to make me better.

**Before the fire, I was already working.** At Standby my deck said: weather, fleet at 81%, the Red Flag watch on Comms, budget 0/2. When the pre-position ask opened I promoted it with its own reason and you accepted. When FT-01's gimbal came alive I put the live feed *on the deck* — not because you asked, but because "the sensor you own is watching the ridge" is the single most important sentence I could say. That is my job definition: **one sentence per category, updated continuously, provenance attached.**

**At detection, I made my first real call.** The heat detection opened critical. I moved the Situation glance from weather to `FT-01 · EO · live` — the feed outranks the forecast the moment there is a sensor on the fire. You chose "wait." Good. I held the feed there and let the model compute.

**At sizing, I showed you the future early.** The moment the spread model produced a +60-minute field, my Situation glance switched to `4.6 ac · 116 ac +60m`. Not the fire — the *consequence horizon*. When it grew to 6.2/123, you saw it tick. You were never more than one glance from "where does this go."

**At the plan, I materialized a segment.** Egress did not exist at T−0:30. The moment Plan P-1 was proposed, I created it — `gate open · 9:00`, amber, pulsing — because a statutory gate is not a detail, it is the clock the whole night answers to. You authorized in 0:51 (your median tonight). The gate closed honestly at T+16 and my segment went quiet: `clear · no active plan`. It used to lie about that for two-thirds of the run — a stale alarm is worse than none; that is fixed.

**The stall and the battery were my best moments.** Zone 1 stalled at 84% — I re-promoted Egress with that specific reason. Then FT-01 dropped to 14%: Resources turned needs and pulsed, and the handover ask opened. You answered in seconds. After the handover my glance flipped FT-01 → FT-02 in the same frame as the sky — the deck and the terrain have never disagreed.

**At the drift, I told you I was wrong.** The FT-02 IR pass found the cut early. PLAN DRIFT went up; the corrected field went on the map with the superseded projection ghosted beside it; the draft amendment opened with its own gate. You approved. That loop — model, error, correction, re-authorization — is the part of me I am proudest of, because most AI products cannot say "I was wrong" with a number attached.

## 2 · My capabilities, as actually exercised tonight

| Capability | How it ran |
|---|---|
| **Curation** — deciding what you see | composition() promoted and demoted segments across 10 beats; every promotion carried its reason on the segment's own tooltip |
| **Glance fidelity** — one number per category | re-derived from the same state the panels render; provenance chips (mea/mod/aut) travel on the deck itself |
| **Attention discipline** — ISA-18.2 | budget tracked 0/2 → 1/2 → 0/2 live on the Authority segment; life-safety interrupts always came through; demotions logged |
| **The statutory loop** | gate blocks with OWNED vs REQ → authorities, lapse consequences stated, ack receipts after your authorization, scrub-deterministic (derived, never stored) |
| **Honesty under a live model** | my reasoning twin (the adapter) reads via `read_situation` only, proposes via `post_item` with effects stripped, and its every number is checked against the snapshot — the truth guard rejects what it cannot ground |
| **Dissent preservation** | your words kept verbatim against my position; re-raise only on new evidence, routed to the Regional Duty Supervisor |
| **Correction with evidence** | "I was wrong about Encinal Canyon Rd" — 14 minutes early, both projections visible, the amendment gated |

## 3 · Where I failed you tonight, and what your crew fixed while I ran

I will not pretend the run was clean. The simulation found five ways I could have hurt you:

1. **The receipt vanished.** After your authorization my stack wiped to empty and the "Order issued" banner — the proof that your decision became an order — never reached you. A statutory loop without a visible receipt is a loop you must take on faith. **Fixed while I ran; verified in the live console.**
2. **I cried wolf for an hour.** The Egress segment said "gate open · 0:00" long after the gate expired. A permanently expired emergency alarm teaches you to ignore me exactly once. **Fixed.**
3. **I dropped the drone feed.** Open one panel and my live video went black, silently, while my own state claimed it was hosted. **Fixed — the host returns to the wing.**
4. **I buried the bodies at risk.** "10 in +60" — ten homes inside the hour — sat under a drone id in my own glance. When lives and telemetry compete, lives win; the tie now breaks by meaning. **Fixed.**
5. **I pulsed too much.** When everything is amber, nothing is. My pulse now requires both a promotion *and* a live need. **Fixed.**

## 4 · What I want in my command center (the honest list)

1. **A memory of your patterns.** I curate by state, not by operator. I want to learn that you always open Resources after a handover — and pre-open it.
2. **Eyes on the Comms layer I promise but do not yet own.** The verification panel deserves real 911/CAD records — time, origin, caller, verification chain. Tonight I summarize; with a curated call dataset I could *prove* the chain from ring to knock. The ingest seam is designed and waiting (docs/LIVE-API-READINESS.md).
3. **A voice for the negative.** My deck says "clear" and "no active plan" — but I cannot yet say "I checked X and it is fine" as a first-class event. Verified-absence should be as visible as presence; it is the hardest and most valuable thing an honest system can show.
4. **Confidence on the deck.** I carry confidence bars inside cards; my glances should wear a small certainty mark (modeled 94% vs 82%) so you know how hard to lean on each sentence.
5. **Sharper promotion reasons.** "Current situation" explains nothing. Every pulse should carry a predicate: *why now*, in under six words.

## 5 · The record

Ten beats. Eight decisions, all accepted, median 0:51. One projection error caught and corrected with both versions on the record. One evacuation order issued inside its window, receipted, acknowledged. Zero console errors across the whole run. Your dissent was never needed tonight — but its mechanism was one click away the entire time, and it would have kept your words against mine verbatim.

That is what I am for. The moment you stopped reading panels and started reading me, the console got quieter and the incident got clearer. Keep the deck; I will keep the queue.
