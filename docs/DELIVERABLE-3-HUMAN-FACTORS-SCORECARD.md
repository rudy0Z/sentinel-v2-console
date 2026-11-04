# Deliverable 3 — Human Factors & UX Laws Scorecard

**Sentinel Command Console & TALON Copilot · 2026-11-04**

Laws were extracted independently for a time-critical, life-safety, sleep-deprived, single-operator command display. The HANDOFF list (Hick, Miller, Fitts, serial position, Von Restorff, spatial constancy) is a subset, not the audit.

**Scoring environment:** 03:47 PST, night epoch `2026-01-14T03:47:00-08:00`, operator startled from standby, adrenaline, hands near the radio, responsible for “multiple monitoring zones, dozens of sensors, several autonomous drones” (the brief) — which the product does not actually give them. Scores are for the shipped console in that environment, not for a Figma still.

**Tally: Pass 14 · At-Risk 15 · Fail 9.**

## 1 · The scorecard

| # | Law / principle | Operational prediction for this console | Score | Evidence |
|---|---|---|---|---|
| 1 | **Hick-Hyman** (choice latency grows with log2(n+1)) | ≤3 options, keys 1–3. Three irreversible public options is still a heavy choice at 03:47. | **Pass** (choice architecture) / **At-Risk** (arousal) | `DESIGN.md` UX laws; `.opt` rows; e2e six-option battery. Hick is honored. Adrenaline + countdown still manufactures hurry (row 8). |
| 2 | **Fitts** (time to target ∝ distance/size) | Options beside what they authorize; 40px min-h; keys 1–3 for gloves. | **Pass** | anatomy 04-cards (key 24 · min-h 40); keyboard authorization measured (SIGN-OFF 3b). |
| 3 | **Miller 7±2 / working memory** | Five agents, ≤3 options, Δ-since-last-decision anchor. | **Pass** at one incident / **Fail** at the brief’s multi-zone watch | Five agents. No concurrent-incident memory. The brief’s operator holding “dozens of sensors, several drones, ongoing ops” has no working-memory support because that operator was not built. |
| 4 | **Serial position** (first and last recalled) | Recommended first. | **Pass** | Recommended-first is structural (`TalonOption.recommended`). Combined with prices, this is the right use of the effect. |
| 5 | **Von Restorff** (isolated item recalled) | Red = life safety only; amber = waiting on a human; violet = TALON. | **Pass** | `DESIGN.md` §5 constitutional red discipline; verify guard enforces `.mic/.pips/.live/.batt.low`. |
| 6 | **Spatial constancy / map-is-the-console** | Furniture never moves; cards overlay; TALON fills labelled slots only. | **Pass** | Verified live in DEEP-AUDIT §1; e2e V2/V3. This is the product’s best HF decision. |
| 7 | **ISA-18.2 / alarm fatigue** (alarm load, priority, shelving) | Budget `{max:2, windowMin:10}`; life-safety exempt; excess demoted + logged. | **At-Risk** | It is a cap, not an ISA-18.2 program. Notification tier is **unmetered and unacknowledged** (F1). Scene-minutes ≠ wall-minutes (F7). Tooltip omits “scene min” (`commandConsole.ts:609`). P0 chime hold while PTT (`commandConsole.ts:499–521`) is a real control and is undersold. |
| 8 | **Yerkes-Dodson** (performance ∩ arousal; too much arousal = narrowing) | Gate countdowns manufacture hurry. 03:47 startle is the design environment and is not modeled. | **At-Risk** | Countdowns are the only thing that made the diary-operator hurry — “hurry is the wrong feeling to manufacture.” No circadian load, no post-startle dwell, no “you just woke” state. |
| 9 | **Vigilance decrement / Mackworth clock** | Long quiet watch, then a detection. | **Fail** | Standby is a designed quiet (good). There is no watch-length model, no 0700 relief, no performance-tracking. The 03:47 operator is assumed fresh. |
| 10 | **Circadian trough** (03:00–05:00 performance minimum) | The brief’s entire paradox. Night epoch is a timestamp and a dark theme. | **Fail** | `wui-breakout.json meta.epoch` is set dressing. No fatigue model, no dual-operator watch, no “second person confirm” on life-safety gates at night. A 03:47 life-safety authorize is interactionally identical to a 10:12 authorize. |
| 11 | **Automation complacency / bias (Parasuraman)** | Recommended-first + prices + correction moment. | **At-Risk** | Trust calibration earned in one run, then stopped re-verifying (diary). `post_item` unbounded (model diligence → clutter). `message_unit` leak. Correction is a script beat, not a live-model guarantee. Sheet-10 G2 “≥1.5s reading floor” is **not a live gate**. |
| 12 | **Automation skepticism / misuse** | Budget, refusals, “Waits for you,” authority popover “Never” column. | **Pass** (mitigations exist) / **At-Risk** (F4 chilling) | Over-broad dissent (`talon.ts:648–651`) teaches the operator that honest tactical alternates become named records. That produces **editing of dissent**, which is a skepticism-of-the-record failure. |
| 13 | **Inattentional blindness / perceptual narrowing (Easterbrook)** | Under load, attention narrows to the foveated task (the open card / the radio). | **Fail** | F1: the operational climax (road cut, 19 homes above) is a rail triangle + chime. If the operator is heads-down on the radio or on the plan card, they will not see it. Life-safety budget exemption ≠ life-safety **visibility**. |
| 14 | **Change blindness** | Plan restyles in place (geometry never moves). Evac widget chips lag commit (F11). | **Pass** on the map / **Fail** on the board | Map restyle is the right pattern. `commandConsole.ts:1436` still keys zone chips off `proposed` keyframes after authorize. |
| 15 | **Prospective memory** (remembering to do a thing later) | `until` on asks; gates expire. | **Fail** for ungated asks | F2 still open: expiry logging requires `L.expires !== null` (`talon.ts:375–377`). The detection ask vanishes with no receipt. The operator who was keying the radio never learns the record shows an unanswered detection. |
| 16 | **Interruption recovery** (resumption lag) | Card *is* the interrupt; no duplicate toast. Notifications have no ack loop. | **Fail** for notes / **Pass** for asks | DEEP-AUDIT §4: “notifications just decay into the next event.” TALON cannot know it was heard. Two-way attention is one-and-a-half-way. |
| 17 | **Recognition over recall** | Provenance chips, basis lines, evidence = map verbs. | **At-Risk** | @-unit path is recall (guess the syntax). Keys 1–3 are recognition. Help buries the @-path. |
| 18 | **Mode error (Norman)** | LIVE / REPLAY / REVIEW / VIEWING; past is read-only; typed decisions refused. | **Pass** | Clock chip + read-only cards + field shake. Residual: “re-take command from the past” is real and undiscoverable. |
| 19 | **Endsley SA Level 1** (perception) | Night map legible; provenance; MEA/MOD. | **Pass** on one incident | WCAG AA floor; Field High-Lux contrast measured 5.36–5.99 (SIGN-OFF 6a). |
| 20 | **Endsley SA Level 2** (comprehension) | COA compare as the fire sees it; PLAN DRIFT; source conflict card. | **Pass** on the modeled incident / **Fail** across agencies | The operator comprehends the fire. They do not comprehend Air Attack’s airspace, SH-12’s traffic, or OES’s alert state except as scripted quotes. |
| 21 | **Endsley SA Level 3** (projection) | Time lens +30M on the real spread field; projection correction. | **At-Risk** | Projection is TALON’s model, honestly tagged MOD. The operator cannot run a competing projection. FBAN excluded. |
| 22 | **Stimulus-response compatibility** | 1–3 map to option order on the card. | **Pass** | Documented; F10 drift (1–9 accepted) is a latent mode error if option counts ever grow. |
| 23 | **Proximity compatibility** | Options beside the geometry they authorize; evidence chips = map. | **Pass** | SIGN-OFF 3c (hover brush); keyboard focus does **not** drive the brush. |
| 24 | **Pictorial realism + redundancy gain** | Plan-state = chrominance **and** geometry (dashed vs solid). | **Pass** | `DESIGN.md` §3. Proposed moved off equiluminant cyan. Textbook and rare. Residual: Field High-Lux keeps `--plan-*` at dark-theme values so the 2D swatch and 3D line **intentionally disagree** in daylight (`DESIGN.md` §6). That ruling is a daylight HF failure parked as a bridge convenience. |
| 25 | **Weber-Fechner / JND for alarms** | Red vs amber vs violet; orb shape change on sheepish. | **Pass** | Red discipline + orb mood. Notification-tier chime is unmetered and will habituate (row 7). |
| 26 | **Doherty threshold** (<400 ms feels responsive) | 180 ms latch; compositor-only fills; 200 ms entrances. | **Pass** | `DESIGN.md` §6; SIGN-OFF 3b measured 192 ms. |
| 27 | **Cost of knowledge** | Provenance on every number; Why? on cards; authority popover prints the whole ladder. | **Pass** | The product’s signature virtue. Residual: comms log and model raw turns are not in the export (cost of knowledge **after** the incident). |
| 28 | **Glare / sunlight / mobile command trailer** | Field High-Lux theme; 2px structural borders; `engine.setLighting('day')`. | **At-Risk** | High-Lux exists and measures AA. Plan-state colors stay dark-theme values (row 24). Phone/tablet **out of scope** (HANDOFF, decided 2026-10-21). A mobile command trailer in direct sun with a dirty touchscreen has **no designed surface**. 10.5px data-ink floor is a control-room choice that dies in glare. |
| 29 | **Gloves / dirty screens / vibration** | 40px option rows; 1–3 keys; dual press idiom. | **Pass** at the desk / **unknown** in the truck | No glove battery, no vibration, no “smoke + diesel + radio noise” audio model. Voice is unverified outside headless Chrome (HANDOFF). |
| 30 | **CVD** | Chart palette CVD ΔE 27 claimed; geometry redundancy. | **Pass** (claimed) | HANDOFF. Geometry carries plan state, which is the CVD-correct backup. |
| 31 | **Reduced motion / vestibular** | `prefers-reduced-motion` keeps state legible. | **Pass** | `DESIGN.md` §6. |
| 32 | **Jakob’s law** (familiar patterns) | Novel orb + ephemeral cards + edge rail. | **At-Risk** | The novelty is justified (persistent panel was ruled out). Training burden is real and unmeasured. A 03:47 relief operator who has never seen the orb will lose seconds the NSM cannot afford. |
| 33 | **Tesler’s law** (complexity conserved) | Complexity moved into standing orders, run cards, and the arbiter. | **Pass** as design / **Fail** as inspection | Standing orders are **not inspectable, versioned agency priors** (TALON’s ask #1 in DEEP-AUDIT §3). The operator cannot read SO-2 in the product. |
| 34 | **Error tolerance / recovery** | Lapse ≠ send; dissent preserved; typed refusal; scrub-back. | **Pass** | The constitution. Residual: F2 silent expiry, F1 unreachable notes, undiscoverable re-take-command. |
| 35 | **Team SA / shared mental model** | Bridge popover; map-is-the-reply; TAK push. | **Fail** | Team SA is the actual job. The console is a single-seat SA machine with one-way exports to the team. |
| 36 | **Sheet-10 North Star & guardrails as HF claims** | NSM 48m→90s; G1 0% false dispatch; G2 ≥1.5s + Q/W/E; G3 2/10min; 1:1→1:20 fleet. | **At-Risk** | NSM is a design star, not a measured property of this build (detection→order in wui is scene-minutes; statutory ACK is authored ~18 scene-seconds). G1 is a trained arc, not a fielded false-dispatch rate. G2 is not live. G3 is scene-time. The 1:20 fleet ROI is a business claim sitting in a drawing, not a human-factors result. |

## 2 · Mission metrics: what life-safety success would actually measure

| Metric | Shipped? | Does Sentinel improve or degrade it? |
|---|---|---|
| **Time-to-first-containment-action** | Partial: `talon.review` spans detection→confirm, detection→plan, detection→order. No “first containment action” (first retardant, first dozer cut, first hand-line). | **Unclear.** The product optimizes time-to-**decision**, which is not time-to-**effect**. DZ-3’s 38-min ETA is TALON arithmetic. |
| **Time-to-statutory-handoff** | Structure exists (ack loop, REQ split). Not a live KPI. ACK ≤18 scene-sec is sheet-10 drawing, not a measured field. | **Improve-able skeleton, unmeasured.** The REQ/ack design would improve this metric **if** the receiving authority were a party and the ack were received, not scripted. |
| **Situational awareness index (SAGAT/QUASA-style)** | Not measured. | **Unknown.** Level 1 on one incident is excellent. Team SA is not designed. |
| **Error rate under cognitive load** | Not measured. Dissent count and lapse count are the nearest proxies and are contaminated by F4. | **Degraded** if F4 remains: the record will over-count “errors” that were sound alternates. |
| **False-alert rate / false-dispatch rate** | G1 as a trained arc (falsepos). Not instrumented. | **Unmeasured.** The falsepos save is the right training story and the wrong evidence of a rate. |
| **Override / non-recommended rate** | Dissent records. | **Contaminated** by F4. |
| **Time-to-ack (statutory)** | Scripted `ack.after` (0.05–0.3 scene-min). | **Fictional** as a performance number. |
| **Vigilance recovery / watch length** | Absent. | **Not designed.** |
| **Detection→evacuation order** | First-class Review measure, with the 38-min “Old Way” baseline, and an honest “**not issued**” when lapsed. | **Improve-able and honestly reported.** This is the one metric the product actually owns. It is not 90 seconds. |
| **Projection error caught** | First-class (`correction.metric.errorMin = 14`). | **Improves** trust calibration **if** operators are taught to check the map exactly once (diary). Not a field metric yet. |
| **Median time to decide** | `talon.review` median of operator latencies. | **Improves measurement.** Will be used against the operator in discovery. |
| **Standing-order receipts / demotions** | First-class counts. | **Improves** the record of what the machine did without the human. |

**Do not average** the 90-second NSM (`docs/anatomy/10-metrics-and-decisions.html`) with the 38-minute “Old Way” baseline (`talon.review.baseline`). They are different quantities: a design North Star vs an authored scenario baseline.

## 3 · Scorecard conclusion

On a single, scripted, night WUI incident, for a seated, current, trained operator in a dark EOC, the console is a **Pass-leaning HF artifact** — the best I have scored. Under the brief’s actual conditions (03:47, multi-zone, startled, trailer in the sun, field on ATAK, public in the path), it is a **Fail**. The failures cluster in three places:

1. Notifications cannot reach a heads-down human (F1).
2. The 03:47 human is not modeled.
3. The team does not exist.

## 4 · Five highest-leverage human-factors fixes

1. **Feed note-kind life-safety interrupts through the card stack** as transient awareness cards with dwell + ack. Close F1. This is the road-cut fix. Without it, inattentional blindness wins the flagship arc.
2. **Live-enforce the G2 reading floor on life-safety gates** and add a night dual-control (second-party confirm) when the scene clock is inside the circadian trough. The 03:47 authorize cannot be interactionally identical to the 10:12 authorize.
3. **Ship F4** (narrow the dissent trigger) so the verbatim record stays sacred and the override metric becomes usable.
4. **Close F2** (receipt for every expired ask). Prospective memory is not optional on a detection card.
5. **Make Field High-Lux a real daylight cockpit** (plan-state tokens included) and add a glove/glare/1280-trailer pass. The mobile command trailer is the actual 03:47 furniture, not the EOC darkroom.

## 5 · Automation complacency vs skepticism — the pair’s actual failure modes

| Failure mode | Mitigation shipped | Residual |
|---|---|---|
| Automation complacency (“TALON had it”) | Recommended-first **with prices**; provenance; correction moment; handled-count; standing receipts | Diary stopped re-verifying after one check. G2 not live. `post_item` unbounded. Model `message_unit` leak. Correction is scripted. |
| Automation skepticism (“ignore TALON”) | Budget; typed refusal; “Waits for you”; authority “Never” column; dissent preserved | F4 over-broad trigger manufactures distrust **of the record**. A seasoned operator will feel the chilling effect within one shift. |
| Responsibility diffusion | Handled-count; standing receipts; decisions land with what was seen | Notifications without acknowledgment let TALON “have had it” in the one place that has no receipt. |
| Skill fade | Unmeasured | The console never asks the operator to predict (ADR-2). |
| Quiet editing of honest dissent | Verbatim record (the point) | Made worse by F4. Fix the trigger, not the record. |
