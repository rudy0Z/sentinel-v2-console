# Case Study Kit — Sentinel for a 0-YoE product designer

**Date:** 2026-11-05 · **For:** you, presenting this project to recruiters · **Rule:** never invent shipped metrics, users, or a title you did not have. The project is dense enough.

You do not need fake years of experience. You need to show that you design **systems, metrics, refusals, and evidence** — not screens. This kit is the case study skeleton, the research section you can honestly write, every UX law and PM framework mapped to something real in this repo, the v1→v2→deck evolution, and the number bank you are allowed to cite.

---

## 1 · How a 0-YoE designer presents this without getting exposed

Recruiters are not looking for a shipped product from a 0-YoE. They are looking for **senior-shaped thinking in a junior body**: can you decompose a brief, define metrics before pixels, kill your own work, work with engineering/legal constraints, and tell a story that is true.

**Say this, always:**
- “This is a design-challenge / portfolio build, not a shipped product. There are no production users. What I can show is the design system, the decision model, the failure states, and how I would measure it if an agency ran it.”
- “Every number in the product carries its basis. I hold my case study to the same rule.”

**Never say:**
- “Users loved it.” “We shipped and retention went up.” “I led a team of 12.” “CAL FIRE uses this.” “90-second evacuation, proven.”

**The one-line pitch (memorize):**
> A wildfire command console where the AI prepares and a human authorizes — and where every number admits where it came from. Governance is the interaction model, not a settings page.

That is already in `docs/CASE-STUDY-POINTERS.md`. This kit is how you write the rest of the story around it.

---

## 2 · The story spine (use this order; do not open with the logo)

1. **The founding scene, not the product.** 3:47 AM. 48 minutes of chaos vs a 90-second target. Then the real design problem: *cognitive overload, false confidence, and loss of control at speed* — not speed itself.
2. **The brief’s trap.** FlytBase asked for an operator experience that collapses decision time. The naive answer is a faster dashboard. The actual problem is an operator who manages many zones, is startled from standby, and cannot be allowed to rubber-stamp an AI.
3. **What I designed first (not screens).** A state machine. A two-tier authority model. A metric tree. A kill-list. Then the console.
4. **The artifact.** One map, one copilot, decision cards that exist only while a decision is open, a crew deck that curates one glance per category, failure states that are designed (lapse, false positive, contain-without-evac, model error).
5. **What I refused.** Persistent TALON panel. Process wizard. Auto-execute. Duty dashboard inside the console. Voice-first. Operator scoring. Legal inflation of a hash.
6. **How I know it works.** 45 + 35 automated gates; a full operator-protocol simulation; an independent T+116 probe of the worst moment; honest open items.
7. **What I would do next with a real agency.** Field companion, resident artifact, live-model battery, dual-control at 03:47, CAD ingest. Not “more polish.”

---

## 3 · Research section you can honestly write (and what not to fake)

You did not run 40 operator interviews. Write the research you actually did, and label the rest as “what I would run with an agency.”

### 3.1 Research you can claim (all real, in this repo)

| Method | What you did | Evidence to screenshot / cite |
|---|---|---|
| **Brief decomposition** | FlytBase S3 PD & Branding brief: 90-second paradox, 3:47 AM, operator-with-many-zones, branding as “AI co-pilot” | `docs/brief/FlytBase-Problem-Statement-Design-Fusion-S3-PD-and-Branding.md` |
| **Domain scan** | NIMS/ICS roles, wildfire WUI initial attack, alarm management (ISA-18.2), UAS-in-wildfire-airspace as a *design constraint* (not a law degree) | DESIGN.md §4–5; DELIVERABLE-1 if you want one legal slide, not twenty |
| **Competitive / anti-pattern teardown** | Generic “AI command center” = map + chat sidebar + KPI strip + a copilot that executes. You designed the opposite. | Layout explorations `DIRECTION.md` (category default refused); kill-list |
| **Internal design reviews** | Eight lenses (taste, impeccable, hallmark, stageshow, appllama, apple-design, better-ui, better-colors, better-layout, break-ui) → synthesis with scores and P0/P1 | `docs/design-reviews/00-SYNTHESIS.md` |
| **Dimensional spec** | 10-sheet anatomy set as the architecture-of-record (slots, spacing, layers) — research into your own product | `docs/anatomy/` |
| **Protocol simulation** | Operator diary across a full wui run; TALON first-person account; 18 findings, 6 fixed live | `SIM-REPORT-OPERATOR.md`, `SIM-REPORT-TALON.md` |
| **Independent probe** | Re-run of the canonical arc with a headless driver; the road-cut moment inspected at T+116 | `qa/audit-f1-out.json` |
| **Evaluation culture** | 45 verify + 35 e2e as the contract, not a smoke test | `tools/verify.mjs`, `tools/e2e.mjs`, DESIGN.md §7 |

### 3.2 Research you would run with a real agency (write this as “next”)

- Contextual inquiry at a county EOC and a mobile command trailer (03:47 watch, radio, glare, gloves).
- Cognitive task analysis of detection→order with a current FI-qualified operator.
- Card sort of the mission taxonomy (Situation / Resources / Egress / Comms) with real dispatchers.
- Wizard-of-Oz TALON with scripted vs live model, measuring override rate and reading time.
- SAGAT freeze-probes for SA Level 1/2/3 at T+0, T+6, T+16.
- NASA-TLX after each decision block; SEQ after the gate.
- Shadow a CAD dispatch and a Sheriff alert origination (you designed a requisition; you have never watched one).
- Privileged access: a red-team of the HMI, not just the model (can a tired human stamp [1] in under 1.5 s without reading?).

### 3.3 Anti-research (do not write this)

“We surveyed 50 firefighters.” “In user testing, task success was 92%.” “Post-launch, detection-to-order dropped to 84 seconds.” You will be asked for the protocol. You do not have one.

---

## 4 · Metrics — the section that makes you look like a product designer, not a UI designer

This is the section you asked for. Lead with it after the problem frame. Recruiters remember candidates who define success before drawing.

### 4.1 The metric tree (define before UI)

**North Star (design star, not a shipped KPI):**
Verified Decision-to-Execution Latency — T_detect → [MEA sensor proof] + Operator auth + statutory ACK ≤ 90 s.
*Why “verified”:* optimizing raw click speed alone produces automation bias. The NSM is speed **with** sensor proof and a statutory sign-off.

**Guardrails (equally important):**
- **G1 · False-dispatch suppression:** 0% municipal dispatch on permitted burns (caught by SO-2 recon). Trained in the `falsepos` arc; not a fielded rate.
- **G2 · Epistemic calibration:** ≥ 1.5 s minimum reading floor on life-safety gates + 1-keystroke Q/W/E dissent when the field contradicts the model. Drawing note on sheet 10; not yet a live gate — say so.
- **G3 · ISA-18.2 attention budget:** hard cap ≤ 2 interrupts / 10 min; excess demote to queued asks; life-safety (P0) exempt. Implemented in `talon.ts`; counts **scene** minutes.

**Counter-metrics (what would tell us we are wrong):**
- Override / dissent rate climbing without new evidence → the ritual is chilling, not protecting (this is F4 — you found it yourself).
- Median time-to-decide collapsing below the reading floor → rubber-stamping.
- Lapse rate on the CAD report in the contain arc → the “always notify” obligation is too heavy, or the operator is gone.
- Trust calibration failure: operator re-verifying every number (too little trust) or never re-verifying after the first correction (too much — the diary caught this).

### 4.2 Numbers you are allowed to cite (the bank)

Every number below is in the repo. Cite the source next to it in your case study, the same way the product cites MEA/MOD/AUT.

| Number | What it is | Source |
|---|---|---|
| 48 min | Authored “Old Way” manual baseline from the FlytBase brief | brief; `talon.review.baseline` |
| 90 s | Design North Star, not a measured field result | anatomy sheet 10 |
| 7:12 | Detection→evacuation order **in the simulated canonical run** (scene time) | `talon.review()` / e2e W1 |
| 2:00 / 6:00 / 0:51 | Detection→confirmed / detection→plan / median time to decide (same run) | same |
| 14 min | Projection error caught (the correction) | `correction.metric.errorMin` |
| 2 / 10 min | ISA-18.2-style interrupt budget | `talon.ts` `INTERRUPT_BUDGET` |
| 0 | Auto-executions on lapse (nothing is sent) | e2e W3, C1 |
| 917 devices / 37+345 households / 172 lines | Authored reach on the P-1 gate — **not** a real county | `wui-breakout.json` item `plan` |
| 45 + 35 | Verify + e2e checks, all green on 2026-11-05 | gates |
| 18 | Simulation findings in the operator report (6 fixed live) | `SIM-REPORT-OPERATOR.md` |
| 58 px vs 204 px | Deck vs retired dock strip — ~150 px of terrain returned | DESIGN.md §8 |
| 16.1 : 1 | `--text-1` contrast on the widget surface (AA floor 4.5) | DESIGN.md §2 |
| 10.5 px | Data-ink floor — a **ruled override**, not an accident | DESIGN.md §8 |
| 1 : 20 | Fleet economics *illustration* on sheet 10 (1 operator : 15–25 docks) — a business claim, not an HF result | sheet 10 |
| 0 console errors | Across the canonical sim and the independent probe | sim reports; `qa/audit-f1-out.json` |
| 8 decisions | Canonical wui run | e2e W1 |

**How to phrase a metric in the case study (copy this pattern):**
> Detection → evacuation order in the canonical exercise run: **7:12 (scene time)**, against the brief’s 38-minute manual baseline (authored goal). This is not a field measurement. The product’s Review surface reports “not issued” when the operator lapses — we measure the miss as honestly as the hit.

### 4.3 Instrumentation plan (what you would log with a real agency)

Show you think in event names, not vibes:

- `detect_raised` / `detect_answered` / `detect_expired` (with `until`, latency, option)
- `gate_open` / `gate_latched` / `gate_lapsed` / `gate_ack` (reading time = latch − card_paint; refuse sub-G2 latches)
- `dissent_recorded` (gated vs alternate — after F4)
- `standing_executed` (citation id)
- `interrupt_demoted` (window, what was dropped)
- `model_refused` (truth-guard reason) / `model_latency` / `model_fallback`
- `tak_pushed` / `tak_received` (round-trip, currently one-way)
- `wea_requisitioned` / `wea_originated` (the second one is *not ours*)
- SA probes at freeze points; TLX after blocks

### 4.4 HEART mapped (Google) — so a PM interviewer hears a familiar frame

| HEART | Sentinel version | How measured today |
|---|---|---|
| **Happiness** | Operator trust calibration (diary; “I checked the map exactly once”) | Qualitative today; SUS/UMUX with a real operator later |
| **Engagement** | Does the operator open the deck panels, or only the cards? | Not instrumented; would log panel_open |
| **Adoption** | First decision without help (record loop is the cold start) | Record-loop telemetry |
| **Retention** | Wrong frame for a one-off incident; use **watch readiness** (standby → first correct triage) | falsepos / detect arcs |
| **Task success** | Canonical run: 8/8 decisions, order issued, cut on record, 0 errors | e2e W1 + probe |

Do **not** use DAU/MAU. This is incident software. If a PM asks “what’s the DAU,” the answer is “wrong metric; the unit is the operational period.”

---

## 5 · UX laws — complete map (including ones you have not written down yet)

You already have 36 in the HF scorecard. Recruiters will name-drop Hick and Fitts. Staff interviewers will name the ones you missed. Here is the full deck, scored, with the ones **not yet in your docs** marked ➕.

| Law / principle | Score | Where it lives |
|---|---|---|
| Hick-Hyman (choice latency) | Pass (≤3 options, keys 1–3) | cards |
| Fitts (target size/distance) | Pass (40 px rows, options beside geometry) | cards / map-is-the-reply |
| Miller 7±2 | Pass at one incident; Fail at the brief’s multi-zone | deck = 4 categories |
| Serial position | Pass (recommended first) | `.opt.rec` |
| Von Restorff | Pass (red = life safety only) | DESIGN.md §5 |
| Jakob’s law | At-Risk (novel orb/deck — training burden) | onboarding = record loop |
| Tesler’s law | Pass as design / Fail as inspection (standing orders not readable) | ADR-2 |
| Doherty (<400 ms) | Pass (180–192 ms latch) | SIGN-OFF 3b |
| Weber-Fechner (alarm JND) | Pass (red/amber/violet + orb shape) | red discipline |
| Yerkes-Dodson (arousal) | At-Risk (countdowns manufacture hurry) | gate countdown |
| Easterbrook / inattentional blindness | Fail (F1 road cut) | the last-mile item |
| Prospective memory | Fail for ungated expiry (F2) | `talon.ts` |
| Interruption recovery | Fail for notes (no ack) | F1 |
| Change blindness | Partial (map restyles in place; evac chip lags) | F11 |
| Mode error (Norman) | Pass (LIVE/REPLAY/VIEWING; typed refusal) | clock chip |
| Recognition over recall | Pass after the deck (was At-Risk) | glance layer |
| Endsley SA L1/L2/L3 | L1 strong pass; L2 pass on incident / fail across agencies; L3 at-risk (no competing projection) | |
| Parasuraman automation complacency | At-Risk (diary stopped re-verifying) | G2 not live |
| Automation skepticism | At-Risk (F4 chilling) | dissent trigger |
| Stimulus-response compatibility | Pass | 1–3 = option order |
| Proximity compatibility | Pass (hover brush); keyboard focus does not brush | SIGN-OFF 3c |
| Pictorial realism + redundancy gain | Pass (dashed vs solid, never colour alone) | plan-state ladder |
| Cost of knowledge | Pass (provenance free; missing after-incident comms log) | export |
| Circadian trough | Fail (03:47 is set dressing) | epoch |
| Vigilance decrement (Mackworth) | Fail (no watch length) | |
| Team SA | Fail (one-way TAK) | |
| Glare / sunlight | At-Risk (High-Lux exists; plan colours stay dark) | |
| CVD | Pass (geometry backup) | ΔE 27 claimed |
| Reduced motion | Pass | DESIGN.md §6 |
| ➕ **Aesthetic-usability effect** | Used, and dangerous here. The console is beautiful, which *increases* automation trust. Counter: provenance, prices, correction, refusal. Say this out loud — it is a mature answer. | |
| ➕ **Peak-end rule** | Designed. Peak = the statutory receipt surviving the emptied stack. End = Review that can say “not issued.” The road cut is an *un-designed* peak right now (F1). | |
| ➕ **Zeigarnik / open loops** | Open gates are the interrupt. Closed loops (ack) are the relief. `RECEIPT PENDING` forever is an unintended Zeigarnik — fix it. | |
| ➕ **Goal-gradient** | Clearance bars (Zone 1 10%→84%), budget pips, standing count. The operator can see progress toward “clear.” | evac widget / Authority seg |
| ➕ **Labor illusion** | TALON “working” lamps + busy minutes. Do not fake labor the model did not do — truth guard + provenance are the counter. | agents |
| ➕ **Mental model / conceptual model** | The authority popover *is* the conceptual model (“Always / standing / operator / Never”). Most portfolios never draw one. | authority popover |
| ➕ **Gulfs of execution & evaluation (Norman)** | Execution: 1–3, cards beside geometry. Evaluation: map restyles, receipts, Review. Gulf of evaluation fails at F1 (the system state “road cut” is not visible). | |
| ➕ **Seven stages of action** | Walk them for “authorize P-1”: goal (save Zone 1) → plan (COA) → specify (1) → perform (key) → world (committed layer) → perceive (restyled + receipt) → interpret (ack). The cut breaks perceive. | |
| ➕ **Match between system and real world** | Mission taxonomy (Situation/Resources/Egress/Comms) vs widget names — the deck is this law. ICS vocabulary (OWNED/REQ, DIV-ALPHA) is real-world match. “Mandatory evacuation” is a mismatch with California Order/Warning. | |
| ➕ **Consistency & standards** | Internal: tokens, zero-raw-hex, 4 px optical floor. External: ICS/NIMS standards partially met (bridge, OWNED/REQ) and broken (single operator as command). | |
| ➕ **Visibility of system status** | Strong on fire state; Fail on note-kind life-safety (F1) and on C2/link (offline toast only). | |
| ➕ **Error prevention** | Typed approval refused; uncited standing dropped; lapse ≠ send; past read-only. Strongest heuristic in the product. | |
| ➕ **Recognition rather than recall** | Deck glances; Δ since last decision; evidence = map verbs. @-unit path is still recall. | |
| ➕ **Flexibility & efficiency of use** | Keys 1–3 for expert, buttons for novice, voice as shortcut not mode. Record loop for the novice cold start. | |
| ➕ **Aesthetic & minimalist design** | The deck’s job. One glance per category. The 10.5 px floor is the defended exception. | |
| ➕ **Help users recognize/diagnose/recover from errors** | Lapse copy on the card; “Nothing was sent”; truth-guard reasons in-line. Silent expiry (F2) is the violation. | |
| ➕ **Help & documentation** | `?` keys; authority popover; basis lines. Standing orders not inspectable (Tesler fail). | |
| ➕ **Shneiderman’s 8 golden rules** | All eight map: consistency (tokens), shortcuts (keys), feedback (receipts), closure (ack), error prevention (gates), easy reversal (scrub; *not* post-hoc dissent edit), internal locus (operator picks), reduce memory (glances). Reversal is the interesting one: you can re-look, you cannot un-write a dissent — and that is a *design decision*, not a heuristic fail. | |
| ➕ **WCAG POUR** | Perceivable (AA, CVD geometry, reduced motion) · Operable (keys, 40 px, axe) · Understandable (basis, plain lapse copy) · Robust (axe 0 on 4 states; deck panel not yet in the battery). 10.5 px is a ruled exception with a recorded override. | |
| ➕ **Fitts’s other half — pointing at *what matters*** | The deck is a Fitts solution to a different problem: the target is not the button, it is the *category that is currently true*. | |

**How to talk about laws in an interview (30 seconds):**
> “I don’t apply laws as a checklist. I picked the ones that predict failure in this domain: Hick for the three-option gate, Fitts for gloves, Von Restorff for red discipline, ISA-18.2 for alarm load, Endsley for SA, Parasuraman for automation bias, Norman for modes and gulfs. The one I care most about is the gulf of evaluation at the road cut — the system knows the route died and the operator’s peripheral vision is told ‘clear.’ That’s a law violation I shipped, found in simulation, and haven’t closed yet.”

That answer is better than a 36-row table recited.

---

## 6 · Product-manager run-through (so you can sit in a PM interview too)

A 0-YoE designer who can hold a PM conversation gets callbacked. Use these frames **with the repo’s evidence**, not startup-theatre.

### 6.1 Jobs to be Done

**When** a heat tick lands at 03:47 and I am on another zone, **I want to** know in seconds whether this is real and what the fire will do to the people in its path, **so I can** act inside the window the fire gives me — without handing my authority to a model.

Related jobs:
- *Emotional:* “I do not want to be the one who stamped the wrong COA at 03:47.”
- *Social:* “I need a record that shows I saw what I saw and decided on purpose.”
- *Ancillary:* “I need to brief the relief at 07:00 without retyping the night.”

**Non-jobs (refused):** “I want the AI to evacuate them.” “I want one dashboard for six fires while I am in the seat.” Different products.

### 6.2 Personas (design ones, honestly labelled)

You did not interview these people. Design them as **informed personas** from the brief + ICS doctrine + the operator diary, and say so.

| Persona | Job in this product | What they will do that breaks your UI |
|---|---|---|
| **A. Rao / the operator** (FI-qualified, keyboard-first, hands near the radio) | Authorize, refuse, talk to units, keep the record | Key the radio during the detection card (F2); pick the sound alternate (F4); stamp [1] in 0.4 s |
| **The relief at 07:00** | Take command without a legend | No transfer act; hardcoded name; deck they have never seen (Jakob) |
| **The RPIC / fleet** | Be legally responsible for three aircraft | The console erased them (“not a pilot”) |
| **SH-12 / the sheriff** | Execute evac / close the road | Gets a banner and a scripted radio quote, not a requisition they own |
| **Lin / OES alert originator** | Originate the WEA | A string labelled “statutory issuer” |
| **The resident in Zone 2** | Know whether to leave | 917 devices; no language; no lock-screen |
| **The Safety Officer** | Stop an evolution | No stop control that is not a TALON option |
| **The FBAN / GIS** | Challenge the spread model | Model is TALON’s; MOD tags are honest and closed |

### 6.3 Kano

| Feature | Kano class | Why |
|---|---|---|
| Map that never moves; provenance; lapse ≠ send | **Must-be** (absence = outrage) | The constitution |
| Correction moment; dissent verbatim; deck glances | **Performance** (more = better) | Differentiators |
| Speaker-over-public; 90-second brand story | **Indifferent / reverse** for a real agency | Scare them |
| Operator-pattern memory; verified-absence; confidence on deck | **Delighters** (TALON’s own asks) | Do not build #1 without consent |
| Persistent chat sidebar; process wizard | **Reverse** | You killed them |

### 6.4 RICE on the open last-mile items (score honestly, 1–5)

| Item | Reach | Impact | Confidence | Effort | Score | Call |
|---|---|---|---|---|---|---|
| F1 awareness card + threat Egress glance | 5 (every canonical run hits the cut) | 3 (life-safety visibility) | 5 (live-verified hole) | 2 | **15** | Do |
| F4 narrow dissent | 4 | 2 (record quality / chilling) | 5 | 1 | **8** | Do |
| F2 expiry receipt | 3 | 2 | 5 | 1 | **6** | Do |
| Gate `message_unit` | 2 (only live-model) | 3 (constitution) | 5 | 1 | **6** | Do |
| Resident lock-screen artifact | 3 (interviewer ask) | 2 | 4 | 2 | **4.8** | Spec |
| ATAK two-frame | 3 | 2 | 4 | 2 | **4.8** | Spec |
| Dual-control 03:47 | 2 | 3 | 3 | 3 | **2** | Rule now, build later |
| CAD ingest | 5 | 3 | 2 (no data) | 5 | **1.8** | Next product, not this case study |

### 6.5 Opportunity solution tree (Teresa Torres) — the trunk

**Desired outcome:** verified detection→action inside the fire’s window, without automation bias or loss of control.

Branches (opportunities):
- Operator can see *what is true* → provenance, MEA/MOD, source-conflict card
- Operator can see *what is asked of them* → cards, budget, deck pulse
- Operator can see *what happens if they do nothing* → lapse copy, contain CAD, “not issued”
- Operator can *disagree on the record* → dissent, re-raise
- Operator is *not surprised by the model* → correction, PLAN DRIFT, truth guard
- Operator is *not surprised by the world* → F1 (open), degradation (open), field two-way (open)

For each leaf: the experiment you ran (sim, gate, review lens) and the evidence.

### 6.6 Business / viability (the PM close)

Sheet 10’s 1:1 → 1:20 fleet ratio is the commercial story FlytBase wants. Your job is to bind it to the guardrails: 1:N is only sellable if G1 (false dispatch) and G3 (attention) hold, and if the legal stack (RPIC, WEA origination) is someone else’s signature. Packaging: **exercise product now; DFR recon console next; warning origination never (it is the county’s).** Pricing is not in this case study. Span of control is.

### 6.7 OKR you would write as if this shipped to a training academy

- **O:** Operators who finish the canonical run trust the machine exactly as far as they can verify it.
- KR1: 90% of life-safety latches ≥ 1.5 s reading floor (G2 live)
- KR2: 0 unauthorized dispatches on the falsepos arc across 100 seeded runs
- KR3: 100% of lapses produce “nothing was sent” + supervisor escalation on the record
- KR4: median time-to-decide inside the operator’s own baseline ±15%, not a race to the bottom
- KR5: every note-kind life-safety interrupt acknowledged or escalated (F1 closed)

---

## 7 · Design decisions log — alternatives, and why we moved

This is the section recruiters re-read. For each: the naive version, the shipped version, the alternative you refused, the metric/tradeoff.

**D1 · TALON is not a panel.**
Naive: persistent chat/panel on the right (v1; every AI demo). Shipped: orb (always) + decision cards (while open) + drawer (on demand). Refused: the category-default copilot sidebar. Metric: baseline cognitive load; ≤5 chrome regions at a decision moment; map never reflows. Owner ruling 2026-10-25. Evidence: DIRECTION §1; v2 shipped.

**D2 · The operator follows the incident, not the process.**
Naive: phase strip / wizard (WATCH→DETECT→…). Shipped: posture pill + on-demand arc. Refused: resurrecting the wizard as onboarding. Metric: no process pages during a live incident. Supersedes ADR-4.

**D3 · Silence is never approval.**
Naive: timeout = confirm (or timeout = ignore). Shipped: lapse sends nothing, escalates to a supervisor, stays on the record. Refused: auto-execute on expiry. Metric: 0 unauthorized actions on lapse (e2e W3, C1). This is the sentence the product is built on.

**D4 · Dissent is verbatim — and the trigger was too wide.**
Naive: log the pick. Shipped: both positions verbatim; re-raise only on new evidence, past the operator. Learned: every alternate became a dissent (F4) — chilling. Next: ritual only on gated/life-safety conflict. Metric: dissent that a second authority actually needs, not a performance review. You found this in your own audit. Put the miss in the case study; it is more impressive than a clean story.

**D5 · Red is life safety, nothing else.**
Naive: red for recording, live, low battery, errors. Shipped: amber = waiting on a human; violet = TALON; red = life safety only. Live dot is blue. Enforced by a verify guard. Metric: Von Restorff intact at 03:47.

**D6 · Proposed is not committed.**
Naive: cyan for both (equiluminant under stress). Shipped: ice-blue + dashed/hollow vs cyan + solid. Geometry, never colour alone. Metric: CVD + washed projector.

**D7 · The dock became a deck.**
Naive: five 204 px widgets always on (the operator scans cards). Shipped: 58 px curated segments, one glance each, panels on demand, feed wing, tools left. Metric: ~150 px of terrain back; ambient SA; ISA-18.2 visible (budget on the deck). Found defects in sim (stale “gate open 0:00,” feed host musical chairs, attention dilution) — fixed and re-verified. This is your strongest “I iterate” story.

**D8 · Record loop as cold start.**
Naive: empty standby or a tour. Shipped: first visit boots *inside* a closed permitted-burn record, preempted ~9 s later by the live breakout; bookmark; resume. Metric: the brief’s “operator reviewing earlier footage” is the onboarding. Suites skip it via params.

**D9 · Contain-without-evac is a first-class ending.**
Naive: every incident escalates to evac (the demo high). Shipped: contain arc — authorities always notified; CAD report queues the dozer; zero evac signals. Metric: the legal-notification obligation as structure. Most mature beat in the product.

**D10 · The false positive is the save.**
Naive: hide the falsepos arc (boring). Shipped: dismissal is the recommended call; G1 guardrail; registry discipline trained for S-05. Metric: 0% false dispatch as a *trained* outcome, not a claimed rate.

**D11 · The export refuses to be evidence.**
Naive: “court-ready SHA-256 chain of custody.” Shipped: honest digest, “not a signature and not legal attestation.” Refused: legal inflation (kill-list #8). Metric: the copy is the design.

**D12 · 1920 floor; 10.5 px stays; phones out.**
Naive: responsive everything. Shipped: product floor 1920; 1280 insurance; 10.5 px data-ink ruled; phones out of scope 2026-10-21. Metric: case-study stills pixel-identical; control-room density. Cover the field with a tablet spec, not a squeezed console.

**D13 · Layout exploration A/B/C, then a different ship.**
You explored split / inbox / command, picked A (Crewed Deck), and then shipped an *evolution* (the layered deck) rather than the full seated-colleague rebuild — because A touches the guarded layout contract and needs its own engagement. That is a Staff decision (ship the hierarchy, don’t rewrite the shell on a portfolio deadline). Write it that way. `docs/layout-explorations/DIRECTION.md`.

**D14 · Craft passes that look like decoration and are not.**
Backlit keycaps, wind rose from the live RAWS, fleet endurance pips from the session trail, corner registration marks, TALON cadence equalizer — all tokens, all zero-raw-hex, all carrying a value or a state. The tactile review called lit top edges a dark-theme lie; pressed states now sink. If a reviewer says “gamery,” answer with the ruling in DESIGN.md §8.

---

## 8 · Why we moved from the older versions (the iteration narrative)

Tell this as four moves, each with a before/after and a reason that is not “it looked better.”

**Move 1 · v1 persistent TALON → v2 orb/cards/drawer (2026-10-25→26).**
Before: half-screen panel, always there, operator’s furniture moved. After: copilot on an edge, cards only while a decision is open. Reason: baseline cognitive load; the constitution (“TALON never moves the operator’s furniture”). Verify: attention contracts, 32/32.

**Move 2 · Process strip → posture pill.**
Before: linear phase strip (the old repo’s 20-state machine rendered as a journey). After: the operator follows the incident; the arc is on demand. Reason: process pages during a live fire are a wizard. The state machine stayed — as *data* (edges with gates and reasons), not as chrome.

**Move 3 · Design-system v2 polish (2026-10-26→11-02).**
Before: CDN fonts, halo frames, 22 px blur, cyan proposed, red misuse, hash language. After: self-hosted Geist, tabular nums, accent-bar cards, 10 px blur, plan-state ladder, red discipline, honest digest, 4 px optical floor, inspector on the readout line, both-open lane guarded (V3). Reason: legibility over the night map; avionics identity; the sign-off walkthrough (17 items).

**Move 4 · Dock strip → crew deck (2026-11-04).**
Before: 204 px widget strip; five cards to scan; TALON suggestions filling labelled slots. After: L1 glance / L2 panel / L3 verbs; tools left; feed wing; attention pulse only when needed. Reason: the brief’s operator does not scan widgets; they need four sentences and the terrain. Sim found five ways the deck could hurt (receipt vanished, cried wolf, dropped the feed, buried bodies-at-risk, pulsed too much) — fixed while the run was live. That last clause is the interview gold: *the simulation found the defects and the fixes landed in the same build.*

---

## 9 · UX / UI designer vs product designer — the section that answers the brief

The original audit brief asked you to separate the two. Use this as a two-column slide.

| The UX designer’s clean Figma story | The product designer’s catch |
|---|---|
| A confident operator name on a statutory gate | The name is hardcoded and is not a statutory actor — the gate copy must say *recommends / requisitions* |
| Beautiful dock widgets, always on | The operator at 03:47 does not scan five cards; they need four sentences (deck) |
| TALON recommended-first, always confident | Automation complacency is the product risk; prices, provenance, correction, G2 floor are the counters — and the diary shows trust overshoot |
| Dissent box for every alternate | Chilling effect; discovery exhibit; narrow the trigger |
| “Mandatory evacuation” / WEA sent | California Order/Warning; a vendor cannot originate; the public is not 917 devices |
| 90-second hero metric | NSM is a star; the shipped measure is scene-time and can honestly say “not issued” |
| Speaker drone guiding the public | Over-people ops; never a standing order |
| Sat-loss as a toast | Stale-as-live will kill; degradation is a state machine |
| One operator, one incident, one screen | The brief’s operator has many zones; cover with registry + refusal of the duty view |
| Beautiful export with a hash | It is not evidence; say so |

---

## 10 · Accessibility & craft appendix (short, but have it)

- **axe-core 0** on standby, detection-card, drawer, review — *not yet* on an open deck panel or the feed wing (open item).
- **Keyboard:** 1–3, `/`, `V`, `M`, `T`, `R`, `C`, `L`, `I`, Space, `?`. Timeline is a real slider. Drift: 1–9 accepted vs 1–3 documented (F10).
- **Contrast:** all text tokens ≥ 4.5:1 in both themes (dark min 5.36, day 5.99).
- **Motion:** `prefers-reduced-motion` keeps state legible; presses don’t travel.
- **CVD:** geometry carries plan state; viz palette CVD ΔE 27.
- **10.5 px floor:** defended override for control-room data-ink; not an accident.
- **200% zoom** battery; 1280 insurance vs 1920 product floor.

---

## 11 · The case study outline (with budgets)

A recruiter spends 3–5 minutes. A design-manager interview spends 25. Write for both: a 3-minute top, a 25-minute middle, an appendix.

**0 · Title / cover (1 line).** Do not lead with “Sentinel — AI Wildfire Command Dashboard.” Lead with the thesis: *“The AI prepares. A human authorizes. Every number admits where it came from.”*

**1 · The scene (150 words).** 3:47 AM. 48 minutes vs 90 seconds. The real problem is overload, false confidence, control — not speed.

**2 · Brief → problem frame (150 words).** What FlytBase asked; the trap; what I chose to design (operator experience in the 90-second window, with governance as the product).

**3 · Research (200 words).** Brief, domain scan, anti-pattern teardown, 8-lens reviews, protocol sim, gates. Then “what I would run with an agency” (EOC inquiry, CTAs, SAGAT, TLX, CAD shadow). No fake users.

**4 · Metrics before pixels (200 words).** NSM, G1–G3, counter-metrics, the number bank (7:12 / 14 min / 2-per-10 / 0 auto-execute), instrumentation plan, HEART remapped to incident software. *This is the section that answers your ask.*

**5 · The state machine as the design artifact (200 words + one diagram).** WATCH→DETECT→SIZE→ASSESS→ACT→STABILIZE→RESOLVE; contain and falsepos as first-class endings; edges carry gates and reasons. Show one zoomed edge: lapse.

**6 · Four shipped surfaces (400 words + 4 images).** (a) decision card anatomy (COA, gate, OWNED/REQ, lapse); (b) crew deck (L1/L2/L3); (c) map-is-the-reply (tether, lens, probe); (d) record/review/export. For each: the decision, the alternative, the metric.

**7 · Iteration (250 words).** The four moves (panel→orb; wizard→pill; polish; dock→deck). Include a miss (F4; F1; deck defects found in sim) and the fix. Recruiters trust a designer who shows a miss.

**8 · Failure as a designed state (150 words).** Contain, falsepos, satellite loss, battery, correction, lapse. Consequence chains, not toasts.

**9 · What I refused (100 words).** Kill-list. This is the Staff signal.

**10 · How I know (150 words).** 45+35 gates; 18 sim findings; independent probe; open items (F1, live-model untested, phones, field). Honest.

**11 · If an agency hired me Monday (100 words).** Field companion, resident artifact, dual-control, CAD ingest, real-operator study. Not “more polish.”

**12 · Appendix.** Coverage map (last-mile doc), metric tree, decision log D1–D14, UX-law map (the short list, not 36 rows), number bank with sources.

**Images that carry the story (already exist in `qa/`):**
1. Standby calm deck (the boring watch — you designed for bored)
2. Detection card (patience as the recommended action)
3. Gate + COA + OWNED/REQ + lapse copy
4. Issued receipt surviving the emptied stack
5. The correction (“I was wrong”) with both projections
6. Dissent box
7. Contain arc (no evac, authority notified)
8. Falsepos save
9. Review saying “not issued”
10. The road-cut frame — *include the miss.* Caption: “F1, found in simulation, open in this build. The next commit is the awareness card.”

---

## 12 · Interview Q&A (rehearse these)

**“You have no shipped product. Why should I believe you design for users?”**
> “I designed for a user I can describe in behavioral detail and for failure modes I could verify. I did not invent a user study. I ran a protocol simulation, eight internal reviews, and a gate suite that fails if I lie to the operator. With an agency I would replace the simulation with a real operator in a real trailer. The thinking does not change.”

**“What’s the metric?”**
> “North Star is verified decision-to-execution latency, not raw click speed. Guardrails: zero false dispatch, a reading floor so a tired human cannot stamp, and an ISA-18.2 interrupt cap. In the canonical exercise the detection-to-order time is 7:12 against a 38-minute authored baseline. I do not claim 90 seconds as a result. The Review surface can say ‘not issued,’ and that honesty is the metric I am proudest of.”

**“What did you get wrong?”**
> “Three things I shipped and then caught. I treated every alternate as a dissent, which will chill honest operators. I left note-kind life-safety interrupts — the road cut — off the card surface, so the climax of the flagship arc lives in a drawer. And the deck’s Egress glance said ‘clear’ at that cut. All three are in the last-mile list. The first two are governance misses; the third is a human-factors miss. Fixing them is the next commit.”

**“Why not just a ChatGPT sidebar on a map?”**
> “Because the job is not chat. The job is a statutory decision with a record. A sidebar has no authority model, no lapse law, no provenance, and no refusal. I built the boring thing that does not execute, and I killed the exciting thing that would have.”

**“How did you work with engineering?”**
> “The design system is enforced by 45 checks. If I want red on the mic, I have to beat a guard that parses the stylesheet. If I want a new surface, I have to keep scrub determinism. Design that cannot be verified is decoration. I wrote the gates with the runtime, not after it.”

**“FlytBase asked for branding too. Where is it?”**
> “Violet as TALON’s identity, Geist as the instrument face, the wordmark, and the tone: confident, never cute, never a science-fiction HUD. The brand is the constitution. A logo that implies autonomy-without-a-human is a brand failure in this domain.”

---

## 13 · Anti-checklist (what gets a 0-YoE thrown out)

- Fake users, fake percentages, fake “we shipped to 3 counties”
- Leading with the 90-second fantasy as a result
- A case study that is only screens
- No misses, no kill-list, no open items
- Claiming legal or aviation authority you do not have (one slide of constraints is enough)
- “Users can call the AI anything they want” energy — TALON is a copilot that cannot execute; that is the brand
- Hiding the road-cut miss
- Twenty pages of laws recited without a prediction about *this* console

---

## 14 · One-page cheatsheet (print this)

**Thesis:** AI prepares, human authorizes, every number has a basis.
**Scene:** 3:47 AM, 48 min vs 90 s, overload not speed.
**Designed first:** state machine, authority tiers, metric tree, kill-list.
**Shipped:** map-is-console, cards-while-open, crew deck, failure states, honest record.
**Metrics:** NSM 90 s (star) · G1 0% false dispatch · G2 1.5 s floor · G3 2/10 · canonical 7:12 / 14 min catch / 0 auto-execute · 45+35 gates.
**Moved:** panel→orb · wizard→pill · dock→deck · cyan→geometry · red→life-safety-only.
**Missed, then found:** F4 dissent chill · F1 road cut · deck’s five sins (fixed live).
**Refused:** auto-execute, duty view in-console, voice-first, operator scoring, legal hash, speaker standing order.
**Next with an agency:** field ATAK, resident artifact, dual-control 03:47, CAD ingest, real-operator CTA/SAGAT/TLX.
**Never say:** users loved it · we shipped · 90 seconds proven · CAL FIRE uses this.

---

*Everything in this kit is already in the repo: `CASE-STUDY-POINTERS.md` (the 8 pointers), `docs/anatomy/10-metrics-and-decisions.html` (NSM/G1–G3), `SIM-REPORT-OPERATOR.md` / `SIM-REPORT-TALON.md` (protocol sim), `docs/design-reviews/00-SYNTHESIS.md` (8 lenses), `DELIVERABLE-3-HUMAN-FACTORS-SCORECARD.md` (36 laws), `SHIPPABILITY-AUDIT-2026-11-05.md` (gates + probe), `PD-LAST-MILE-2026-11-05.md` (what is left), `DIRECTION-2026-10-25.md` / `DESIGN.md` / `HANDOFF.md` (the four moves).*
