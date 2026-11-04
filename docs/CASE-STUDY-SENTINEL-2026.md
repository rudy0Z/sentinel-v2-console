# FlytBase Sentinel — Case Study

**It is 03:47. A fire starts in the foothills. Asha has 90 seconds to authorize a response.**

*01 Problem · 02 Research · 03 Wrong First · 04 Decisions · 05 The Window · 06 The Map · 07 Failure · 08 Impact*

---

**Project** FlytBase Sentinel
**Origin** Design Fusion S3 — FlytBase
**Role** End-to-end Product Design (research → system → interface → verification)
**Year** 2026 · multiple shipped iterations
**Operator** Asha Rao · “A. Rao · Operator on authority”

This is not a dashboard case study. It is the story of designing the interface layer between autonomous drone hardware and a sleep-deprived human who is legally responsible for what happens next — and of every wrong version I shipped before the constitution landed.

---

## 01 — The Problem

### The hardware was fast. The interface wasn’t.

FlytBase builds autonomous drone infrastructure for public safety. Their docks can launch a drone without a pilot, stream live thermal, and coordinate a fleet. In a wildfire, that hardware can put a drone airborne and feeding within 30 seconds of detection. Getting from sensor alert to coordinated response in 90 seconds was already within reach — technically.

Their Design Fusion S3 brief gave me a specific job: design the command-center interface that makes those 90 seconds real. Not a concept. Not a Figma fantasy of a sci-fi control room. A structured operator experience sitting between the autonomous hardware and the human who has to act on it — in the dark, at 3 AM, while managing more than one zone.

The 48-minute baseline makes the problem concrete.

| Time | What happens | Cost |
|---|---|---|
| 03:47 | Sensor detects anomaly | 0 |
| 03:52 | Alert reaches the monitoring center | +5 min |
| 03:58 | Operator cross-references three systems | +11 min |
| 04:05 | Decision: “send someone” | +18 min |
| 04:18 | Crew confirms active fire | +31 min |
| 04:35 | Coordinated response | +48 min |

The sensor fires instantly. The drone can be airborne in under a minute. The 11 minutes between alert and decision are the operator assembling a picture from disconnected tools. That is not a hardware failure. That is the missing interface layer.

**The specific problem I wrote for myself:**

> Emergency operators fail to authorize containment inside the first ten minutes of confirmed detection because command tools require manually cross-referencing 4–6 disconnected data streams. Result: 48 minutes from alert to first coordinated response. In dry-season WUI terrain, fire spreads fast enough that the difference between 48 minutes and 90 seconds is whether 47 homes are a statistic or a story.

**The cognitive load is the bottleneck.** The data exists. The tools exist. The operator’s brain, doing assembly work the interface should handle, is what keeps 48 minutes possible when 90 seconds is not.

I am a 0-YoE designer. I did not interview a real wildfire dispatcher. I am being upfront about that. What I did instead was refuse to design a product that pretends those people do not exist — and I built the system so that a real operator could sit in the seat tomorrow and every number would admit where it came from.

---

## 02 — Research

### What I read — and the things that actually changed the design.

Desk research, not field research. Emergency dispatch workflows. Human-AI trust in critical decisions. Alarm management. Agentic UX. Responsible AI. Systems thinking. Then I stress-tested every conclusion against a protocol simulation of a full night watch.

Four findings changed every decision that followed.

**01 — Operators build the picture manually.**
Today’s dispatch tools do not talk to each other. The operator pulls from separate sensor dashboards, satellite feeds, and weather monitors. The mental model is theirs to assemble alone. *This is the work Sentinel exists to absorb — not the authority.*

**02 — More information at the wrong moment makes things worse.**
Under stress, people fixate. Flooding the screen at peak urgency slows decisions down. Easterbrook’s narrowing, Mackworth’s vigilance decrement, ISA-18.2 alarm load — the laws all say the same thing: at 03:47 the interface must get *quieter and more specific*, not richer.

**03 — Operators approve plans. They do not pilot assets.**
“Operator as pilot” breaks at fleet scale. What they actually do is decide whether a proposed plan is right. The mental model is judge, not joystick. (Agentic UX, Levels of Agency: the product lives at “AI proposes, human authorizes” — Level 3–4 — not at “AI acts, human watches” — Level 5.)

**04 — Every decision needs to be traceable, and silence is not consent.**
In a life-safety system you cannot have ambiguity about whether a human or a model made the call. Legal accountability and operational trust both depend on a permanent, verbatim record — including the disagreement.

I also read the boring documents. California does not let a software vendor originate a Wireless Emergency Alert. A county sheriff closes a road under Penal Code § 409.5; a fire agency does not unilaterally order the public out of a county. FAA Part 107 still requires a named Remote Pilot in Command; BVLOS is a waiver, not a feature. I am not a lawyer. I designed as if I might be deposed.

**The four findings mapped to decisions, not to mood boards:**

| Finding | Decision it became |
|---|---|
| Operators assemble the picture | TALON fuses; Asha judges. Provenance on every number. |
| More info at the wrong moment hurts | ISA-18.2 interrupt budget. Crew deck = one glance per category. Cards exist only while a decision is open. |
| Operators approve, they don’t pilot | Two-tier authority: `standing` (must cite) and `operator`. Effects run only on the pick. |
| Traceable, and silence ≠ consent | Dissent verbatim. Lapse sends nothing. SHA-256 that refuses to be a signature. |

I used AI as a research partner, not as a content generator. I fed it the brief, the 48-minute timeline, ISA-18.2, Endsley’s three levels of situation awareness, Parasuraman’s automation complacency, and asked it to attack my assumptions. The useful output was not copy. It was the questions a tired operator would ask that I had not drawn: *what if I’m on the radio? what if two sources disagree? what if I was wrong about the road?* Those became the edge-case battery in Section 07.

The hiring playbooks I read all say the same thing: the generic double-diamond portfolio fails because it shows a happy path and a pretty screen. Complex environments hire for edge cases, business logic, and engineering reality. I stopped trying to write a double-diamond and started writing a constitution.

---

## 03 — What I Got Wrong First

### My first version solved the wrong problem.

Finding 2 sent me the wrong way. More information at the wrong moment makes decisions slower, so the obvious answer seemed to be: compress the interface until it is one gesture.

**Early wireframe · the Escalation Slider.**
One control. Drag from Assess → Contain → Rescue. Each position fired a pre-set AI script — drones deploy, notifications go out, zones classify. Minimal UI. Maximum speed. I thought I was designing for 03:47. I was designing a macro.

**The problem:** dragging a slider is not a decision. Drag to Contain, and drones deploy to positions Asha never reviewed. The audit trail reads “operator moved slider at 03:48.” Nobody authorized anything. A gesture fired a war.

The wireframes had a second sin: ~120 text elements per phase. I was trying to reduce cognitive load while actively adding to it.

**Rejected** — Escalation Slider: drag triggers AI macros.
**Chosen** — AI proposes a specific plan. Operator reads it and explicitly approves. Every single time.

> I stopped trying to automate the operator’s job and started designing a system that helps them do it faster — without stealing the only thing they have left at 03:47, which is the decision.

From that point the question was: what exactly does the operator do, and what can the AI carry?

**TALON handles (standing, cited)**

- Sensor fusion + cross-reference
- Ignition / spread modeling
- Drone routing inside pre-cleared airspace (SO-2)
- Failsafe return below 8% (SO-3)
- Intel to assigned units (SO-4)
- Passive audit trail, timestamped

**Asha authorizes (operator tier)**

- Confirm or dismiss the detection
- Escalate to mutual aid
- Authorize or reject the evacuation plan
- Approve or reject a route amendment
- Override any proposal
- Handle what the system cannot

**The line I drew, and then redrew.**

My second wrong version was the opposite mistake: a persistent TALON panel, always on the right, always talking. That is the “AI copilot sidebar” every 2025 demo shipped. It failed the same finding that killed the slider — more information at the wrong moment. The panel never shut up. Asha’s furniture moved. The map reflowed. I had replaced a macro with a chatterbox.

The third wrong version was a process wizard: WATCH → DETECT → SIZE → ASSESS → ACT, as if the operator were onboarding into the fire. The operator follows the incident, not the process.

The shipped constitution is the one that survived all three funerals:

1. TALON never moves the operator’s furniture.
2. TALON never executes on its own initiative. Two authority tiers only: `standing` (must cite a run card, or the item is dropped) and `operator`.
3. Silence is never approval. A gated plan with no decision lapses. Nothing is sent.
4. Dissent is preserved verbatim. A re-raise cites new evidence only, and goes to a second authority.
5. Typed “approve” in chat cannot authorize a life-safety gate. Free text is not a signature.
6. The map is the console. Cards exist only while a decision is open.

I did not get there by iterating pixels. I got there by burying three products.

---

## 04 — Decisions

### Eight decisions that shaped the final system.

These are not aesthetic choices. Each one changed how the system and the operator share responsibility. The before/after is what changed; the reasoning is why it mattered. Several of these are the PDF frameworks I had been reading, forced to survive contact with a fire.

---

**1 · Full-screen alert → the map is the console; the card is the interrupt.**

Jumping to a new screen every alert wiped out the spatial context Asha was already working with. The v1 “modal over the map” was better, and still wrong: a modal is furniture that arrives.

**After:** the map is the console. A decision card exists only while an item is open, slides into the right lane, and the tools step aside so the map stays navigable. Keys `1–3` answer. The card *is* the interrupt — no duplicate toast. When the decision closes, the card is gone.

**Tradeoff I accepted:** the alert is quieter than a full-screen takeover. A missed alert is recoverable if the record escalates. A containment decision made without spatial context is not.

*Agentic UX, Intent Design:* the operator’s intent at 03:47 is not “see a new screen.” It is “judge this, here, without losing the fire.”

---

**2 · Confidence percentage → provenance on every number.**

A score alone gives the operator nothing to push back on. Showing the inputs does.

**After:** every number wears `MEA` (measured), `MOD` (modeled), or `AUT` (authored). TALON shows prior burn history, wind vector, thermal delta — not just “71% match.” The live model has a truth guard: it cannot state a number that is not in the snapshot (“47” ≠ “247”). It cannot claim it sent a report. It cannot impersonate the incident commander.

**Responsible AI, Bounded Autonomy:** the model may `read_situation` and `post_item`. It has no tool that fires a gated action. Effects run only in `talon.answer()`. That is not a prompt. It is a tool shelf with the dangerous tools missing.

---

**3 · Same density everywhere → the interface gets quieter as the fire gets louder.**

120 elements during active rescue is the opposite of reducing cognitive load.

**After:** three layers.
**L1 — Crew deck.** 58 px of independent segments (Situation · Resources · Egress · Comms · Authority). One glance value each, provenance chip, state dot. TALON curates. The interface becomes less visible — Ambient AI’s glanceable principle, forced into a 1920 console.
**L2 — Category panel.** Rises from a clicked segment. The old widgets live inside it, unchanged.
**L3 — Topbar.** Verbs and status only.

When a statutory gate opens, an Egress segment *materializes* — `gate open · 9:30`, amber, pulsing. When it closes, it goes quiet: `clear · no active plan`. The furniture does not move. The information contracts.

**ISA-18.2 on top of the deck:** at most 2 interrupts per 10 minutes. Excess demotes to an ask or a feed line, and the demotion is logged. Life-safety interrupts bypass the cap — a spot fire cannot be silenced by two routine gates.

**Tradeoff I got wrong first:** I shipped “gate open · 0:00” after the gate expired. A permanently expired emergency alarm teaches the operator to ignore me exactly once. Fixed: the glance keys off `gate.open`.

---

**4 · Free-text during an emergency → keys, chips, and a composer that cannot decide.**

Typing “Route A, 15 personnel” at maximum stress is the wrong model.

**After:** keys `1–3` on the live card. `Q / W / E` doctrinal chips in the dissent box. `@E-31 hold at the hairpin` goes out as radio-to-text. Typing “approve” while a gate is open shakes the field and raises **STATUTORY GATE LOCKED**. Free text cannot authorize.

**Consequence Ladder (Agentic UX Pillar 5):** the higher the consequence, the more explicit the human act. A chat message is a low-consequence act. An evacuation order is not. The interface prices them differently.

---

**5 · Calling it “AI” → giving it a name, a constitution, and a mood.**

You cannot audit “AI.” You can audit TALON.

TALON is five agents (Recon, Spread, Egress, Dispatch, Notify) on an edge rail. Its actions log as TALON. Asha’s log as the operator. Always separated. It has a mood: calm, focused, alert, sheepish. Sheepish is a designed state — “I was wrong about Encinal Canyon Rd” keeps the old projection visible and flags SPOT-1 where it jumped.

**Division of Labor (Agentic UX Pillar 7):** TALON gathers, models, proposes, handles standing mechanical decisions (battery failsafe), and narrates. Asha judges, authorizes, dissents, and handles exceptions. Neither does the other’s job.

**The leak I had to name:** the live model’s `message_unit` tool could send radio-to-text to any unit — a send button the constitution says TALON does not have. The truth guard checked the model’s *words*, not its *acts*. That is a P1. The next commit gates it behind SO-4 or kills it. I am putting the miss in the case study because a portfolio that only shows wins is a demo.

---

**6 · Auto-execute on silence → silence is never approval.**

The old slider executed on drag. The obvious “fix” for a missed gate is: if Asha doesn’t answer, TALON does the safe thing.

**There is no safe thing to do without her.** A gated plan that expires sends nothing. TALON escalates to the Regional Duty Supervisor and keeps the plan current. The contain arc’s CAD report does the same — and that report is what queues the mutual-aid dozer. Silence is a decision the record can defend. A secret execution is not.

**Responsible AI, Designer’s 5 Questions:** Who acted? On what basis? What did they see? What was refused? Who can reverse it? If I cannot answer all five from the record, the interaction is not done.

---

**7 · Every disagreement is a dissent → only the ones that matter.**

v1 logged every pick. A seasoned operator choosing “keep FT-01 up 20 minutes” — a sound tactical call — would be written down as having *declined the recommendation*, both names on the record. The chilling effect arrives within one shift. Operators will stop writing the truth in the box.

**Shipped:** dissent is verbatim, and the re-raise is new-evidence-only, routed past the operator. **Still wrong, named:** the trigger is over-broad (any non-recommended pick). The next commit reserves the ritual for gated / life-safety conflict and records the rest as “Alternate taken.”

**System Thinking, Consequence Rule:** if the system acts on the operator’s words, the operator must see the consequence before it happens. The dissent box tells her the words go on the record. That is the point — and the cost.

---

**8 · A persistent copilot panel → presence without furniture.**

The 2025 default is a chat sidebar. I shipped it. I killed it.

**After:** orb in the topbar (mood + interrupt-budget pips + handled-under-standing-orders count). Cards in the right lane while a decision is open. Drawer on demand (`T` / ESC). Deck for ambient situation. The copilot is a colleague in the room, not a column on the screen.

*Ambient AI:* the interface becomes less visible. The fire becomes more visible. That is the entire layout thesis.

---

## 05 — The Window

### How control passes between TALON and the operator.

Three actors. One stage model. Every action belongs to TALON or requires a human gate — never ambiguous.

```
WATCH ──detect──▶ DETECT ──▶ SIZE ──▶ ASSESS ──▶ ACT ──▶ STABILIZE ──▶ RESOLVE
 standing          confirm     fusion     authority   branch    exceptions    contained /
 orders,           or false    spread     packet +              corrections    transferred
 red flag          positive    model      send — ALWAYS
```

The posture pill shows the current stage and any open gate. The full arc is on demand. *The operator follows the incident, not the process.*

**JTBD:** When a heat tick lands at 03:47 and I am on another zone, I want to know in seconds whether this is real and what it will do to the people in its path, so I can act inside the window the fire gives me — without handing my authority to a model.

### The canonical 90 seconds, as shipped (not as marketing)

**T−0:30 · WATCH.** Quiet. Orb calm. Dock is *hers* — fleet with battery %, fire weather with ERC 78, every number wearing its tag. Nothing is asking her to click. The console was tuned by someone who has been bored on a night watch.

**T+0:00 · DETECT.** Interrupt card: “S-7 thermal mast · 71% match… FT-01 is on its way, on scene in 1:04.” Two things happen before she touches anything: the drone is already retasked (SO-2, cited), and the *recommended* answer is **Wait for FT-01**. A system whose first recommendation is patience is calibrating her correctly.

**T+0:04 · SIZE / source conflict.** Registry says permitted burn. IR says heat. The card does not hide it. Recommended: the EO look. Priced alternative: “Proceed on live IR.”

**T+0:05 · She declines the escalation.** The dissent box: both positions go on the record verbatim. She types “E-32 has the flank; wait for the FT-02 map.” One second of her captain’s voice — *anything you write can be read back at the burn review* — then she writes it anyway.

**T+0:09 · It comes back — not to her.** RE-RAISED · ROUTED TO REGIONAL DUTY SUPERVISOR. New evidence only. Both positions quoted, hers in quotation marks. Watching her decision get re-litigated over her head stings — then the ruling arrives, attributed, her copied. That is the phone call her world actually makes, minus the phone.

**T+0:10 · The plan.** COA table the fire can read: Clear Zone 1 16 vs 17 min · through the hairpin 37 vs 16 homes · drive to safety 5.5 km vs 0.9 km. Gate: 917 WEA devices, geofence check, “If it lapses: Nothing is sent.” OWNED · geofence / SH-12 traffic. REQ → Sheriff / County OES. She authorizes with 3:12 on the gate because for the first time she can see the cost of picking *and* of not picking.

**T+0:13 · Committed.** The map restyles in place. Same geometry, new state. Her furniture never moved the whole incident.

**T+1:14 · Battery.** “FT-01 at 14% — hand the head watch to FT-02? Below 10% FT-01 loses the gimbal on the flight home.” She hands over. Later she checks the log: had she held, SO-3 would have failed it home at 8% — cited, standing. The system was ready to be right without her.

**T+1:29 · The orb changes shape.** “I was wrong about Encinal Canyon Rd.” Chart keeps the earlier projection. Board prints “(was T+2:09).” She has never had a model tell her it was wrong in a way she could verify on her own map. This is the moment she stopped grading it like a demo.

**T+1:55 · The road is cut.** Map marker: ROAD CUT · ENCINAL CYN RD, fire on the road, 19 homes above. The orb turns serrated. And — in this build — **no card.** The most important sentence of the incident lives in a drawer she has not opened. If she is the bottleneck resource — and she is — this is exactly the moment she misses.

I am leaving that miss in the 90-second walkthrough. The hiring playbooks say stop showing only the happy path. The happy path is 7:12 detection-to-order in the canonical run. The honest path includes the cut she might not see. The next commit is the awareness card.

**She types “approve” into the composer.** The field shakes. TALON: “I don’t take decisions from typed text… so the decision is on the record with what you saw.” Then she types `@E-31 hold at the hairpin` and it goes out as radio-to-text. Typed chat can reach her units but cannot decide. The right split. Nothing taught it to her; she found it by trying.

**Second run, silence test.** She lets the county-report gate expire with her hands off. “Nothing is sent. The report is still required. I escalate to the Regional Duty Supervisor.” Verified twice, in two arcs.

**Review, after.** “Detection → evacuation order: **not issued**.” Because she lapsed her own run. The measures do not scold; they state. The export wrote a digest and told her it is not a signature.

### What “90 seconds” actually means now

I do not claim 90 seconds as a result. The brief’s 90-second fantasy is a design north star. The canonical exercise run measures **7:12** detection-to-order (scene time) against the brief’s 38-minute authored baseline. Median time to decide: **0:51**. Projection error caught: **14 min**. Eight decisions, all accepted, zero console errors.

If an agency ever runs this live, the metric I instrument first is the one I wrote in the old case study and still believe: **override rate**. Rubber-stamp above 85% is a safety risk dressed as efficiency. Override above 40% means TALON’s priors do not reflect the field. That number tells you whether the AI is earning its authority or borrowing it.

The other metric, more important and harder: **time-to-ack** on a statutory requisition. A WEA that the Sheriff never acknowledged is not a warning. It is a banner.

---

## 06 — The Map

### The map and the UI are two separate things. That separation is what makes both work.

v1 said: the map is Reality (3D), the UI is Intelligence (2D vectors floating above). That split still holds, and it got stricter.

**The map is the console.** Full-bleed WebGL terrain — USGS 3DEP, OSM roads, ESA land cover. Real ground, invented fire. Nothing reflows it. Cards overlay. The deck is 58 px of independent segments with terrain showing between them. ~150 px more incident than the 204 px widget strip I retired.

**Signature interactions are provenance-honest.** The spatial tether, the counterfactual time lens (+15 / +30 / +60 on the *real* spread-field isochrone), and the ground probe may only display values derived from live state — unit anchors via `engine.projectPoint`, acreage via `reachedAreaAt`, battery from the session trail, ground data from `engine.pick()`. No hardcoded coordinates. No invented telemetry. A fabricated number on this console breaks the product’s own truth guard.

**Plan-state is chrominance AND geometry, never colour alone.** Proposed = ice-blue, dashed, hollow. Committed = cyan, solid. Draft = orange, beside (never over) the committed plan. Cut = red, P0 only. Under stress or on a washed projector, dashed vs solid still reads.

**Field High-Lux.** The 03:47 darkroom is the default. The mobile command trailer in direct sun is the other reality. One toggle: warm tactical alabaster surfaces, obsidian ink, 2 px structural borders, `engine.setLighting('day')`. The terrain re-skins with the chrome. (Honest gap: plan-state colours still follow the dark-theme values so the WebGL bridge cannot disagree — a daylight HF failure I parked as a bridge convenience. Named, not hidden.)

**Design States, Not Screens** (Systems Thinking): the console does not have a “containment screen” and a “rescue screen.” It has one map and a set of states the map can be in. Calm column in standby. Bottom strip in phase D. Card lane occupied. Both-open. Past-viewing. Review. Each state is designed. Screens are how you get lost at 03:47.

**Engineering reality:** the design system is enforced by 45 verify checks and 35 e2e checks. If I want red on the mic, I have to beat a guard that parses the stylesheet. Zero raw hex outside the token blocks. Scrub determinism: map + TALON restore exactly. Design that cannot be verified is decoration. I wrote the gates with the runtime, not after it.

---

## 07 — Failure States

### What happens when the system doesn’t work cleanly.

A wildfire at 4 AM does not give you clean inputs. I designed these late, then I designed the product around them. How a system handles failure tells you more than how it handles success.

---

**Chaos 01 · The false positive — the save.**

Heat on Trancas ridge. Registry: permitted burn, plot AU-2214. The recommended call is **close it**. The save is the story. Zero fire surfaces ever drawn. Cross-incident: S-05 cites S-04’s registry discipline. Guardrail G1: 0% municipal dispatch on permitted burns — trained, not claimed as a fielded rate.

---

**Chaos 02 · Containable fire — no evacuation, authority still notified.**

The demo high is always “evacuate 47 homes.” The more honest arc is the one that does *not*. Direct attack, anchor and cut, CAD report to the county even with no evac — and that report is what queues the dozer that makes containment possible. Zero evacuation signals in UI or log across the whole contain run. The deck stands down at the hold. First-class ending.

---

**Chaos 03 · Two sources disagree.**

Registry vs live IR. The card recommends the EO look and prices the shortcut. Unresolved conflict proceeds on live IR *on the record*. No silent pick.

---

**Chaos 04 · Model error — the sheepish correction.**

FT-02 IR finds a spot fire 274 m ahead of the front. The road closes 14 minutes earlier than modeled. TALON: “I was wrong.” Both projections stay visible. PLAN DRIFT badge. Draft amendment with its own gate. She approves. The loop — model, error, correction, re-authorization — is the part of the system I am proudest of, because most AI products cannot say “I was wrong” with a number attached.

---

**Chaos 05 · Battery — the one moment TALON acts without asking.**

FT-01 at 14%. Handover is a card. If she holds, SO-3 fails it home at 8%, cited, standing. Autonomous battery handoffs are mechanical decisions the system makes faster than a human can. The narration is immediate. She can stand down the mission if the handoff does not satisfy her.

This is the old case study’s “one moment TALON acts without asking,” survived into the new constitution as a *cited standing order*, not a vibe.

---

**Chaos 06 · Satellite loss / feed death.**

“GOES-West IR feed lost — Fusion continues on FT-01/FT-02 IR and the RAWS. Projection confidence drops. Nothing here needs you. I am telling you because the map will look different.” Capability + consequence + recovery, in one breath.

**Still open, named:** network degradation and C2 link drop are designed (DIRECTION §3) and not authored. The offline path is a toast. The map will show stale data as if live. That is a P0 for any live use and a P1 for the case study’s “I designed failure” claim. I will not pretend the toast is a degradation state machine.

---

**Chaos 07 · The operator dismisses — the fire spreads anyway.**

Rejected: system secretly re-activates containment. Chosen: re-escalation as a new event. Fresh, conscious decision required. If the system can secretly override Asha, Asha is the illusion of control. The system can challenge her with new data. It cannot steal her authority.

The new build’s version is stricter: the re-raise routes *past her*, to a second authority, on new evidence only. She is copied, not bypassed.

---

**Chaos 08 · The road is cut and she is on the radio.**

The operational climax of the flagship arc. Life-safety interrupt, budget-exempt, chime + serrated orb + map marker + attention focus. In this build, no card, no deck pulse, no DOM text. The Egress segment — I verified this at T+116 — says `clear · no active plan`.

A confident wrong glance in peripheral vision is worse than a missing one. This is the finding that keeps the case study honest. The hiring playbooks say make edge cases visible. This one is visible because I probed it, not because it is pretty.

---

**Chaos 09 · Infrastructure total loss.**

v1 designed a full-screen manual protocol: radio channel, dispatch landline, last known state, restart. The new build’s offline path is a toast. I would rather have the v1 last-resort screen than the v3 toast. That is a regression I intend to fix, not a lesson I intend to unlearn.

**ABORT is not a mode.** In v1 it lived in the action bar, one tap, no modal. In v3 the equivalent is “go live” from the past, and “stand down the mission” on a battery handoff. When something is catastrophically wrong, she should not hunt through menus.

---

## 08 — Impact

### What “earlier” actually means — and what I will not claim.

**The calculation I will defend.**

The interface is designed to collapse operator decision lag from 48 minutes toward 90 seconds per incident. In the canonical exercise run, detection → evacuation order is **7:12** (scene time) against the brief’s 38-minute manual baseline. Detection → confirmed: **2:00**. Detection → plan: **6:00**. Median decision: **0:51**. Projection error caught: **14 minutes**.

Those are exercise numbers. They are not a fielded result. I will not multiply them by “tens of thousands of incidents” and invent acres saved. The old case study did that arithmetic (Forest Survey of India volume × NFPA initial-attack effectiveness). I have kept the *direction* of the argument and thrown away the invented precision.

**What I can defend as designed outcomes:**

- 0 unauthorized dispatches on the falsepos arc (G1, trained)
- 0 auto-executions on lapse (silence ≠ approval, gated in e2e)
- 100% of gated plans that expire produce “nothing was sent” + supervisor escalation
- Every number on every surface carries MEA / MOD / AUT
- Live model cannot claim a gated action, impersonate the IC, or invent a number
- Dissent preserved verbatim; re-raise new-evidence only
- Scrub back restores the map and TALON exactly

**Why the human stays in the loop.**

Full autonomy would be faster. It would also mean docks launching over a residential canyon at 3 AM based on a thermal reading that could be a permitted burn. When something goes wrong at scale, there is no accountability chain and no legal clarity. FAA airspace, county evac authority, and municipal protocols do not accommodate “the AI decided and launched.”

The human gate is not cautious design. It is what makes the system legally operable. TALON proposes, Asha authorizes, every time, without exception. That boundary is the audit trail. The audit trail is the only thing that makes future delegation possible.

**Levels of Agency, answered.** I was asked to design for autonomy. I designed for *bounded* autonomy — Level 3–4 on the agency spectrum, with a documented “Never” column. The slider was a Level 5 fantasy. The panel was a Level 2 chatterbox. The product is a colleague who has already read everything, seated where you can see them, who cannot fire the thing you have to fire.

**What’s next, in order of hireability.**

1. Close F1 — the road cut reaches a heads-down operator. Awareness card or Egress `attn`. This is the next commit, not a roadmap item.
2. Narrow the dissent trigger. Verbatim record stays sacred; routine alternates stop being trials.
3. Gate `message_unit`. The copilot does not get a send button its rulebook denies.
4. Field companion (ATAK two-way) and a resident lock-screen (EN/ES). The brief’s ground teams and fleeing public are not device counts.
5. Dual-control inside the circadian trough. A 03:47 life-safety authorize should not be interactionally identical to a 10:12 authorize.
6. Real-operator study: CTA, SAGAT freeze-probes, NASA-TLX, the override-rate instrument. Replace the diary with a person.

**The sentence I would put on the wall.**

> I started designing screens. I ended up designing a constitution. Those are not the same thing — and every section of this case study is the moment I noticed the difference.

Good interface design disappears when you need it most. What is left is exactly the decision worth making — and a record that does not lie about who made it.

---

*FlytBase Sentinel · Design Fusion S3 · End-to-end product design · 2026*
*Exercise data. Terrain, roads, structures and land cover are real (USGS / OSM / ESA). The fire, weather, units, times and TALON are invented. Every number in the product — and in this case study — carries its basis.*
