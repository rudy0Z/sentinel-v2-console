# Deliverable 4 — Strategic Product Designer’s Blindspot Register

**Sentinel Command Console & TALON Copilot · 2026-11-04**

Ranked catalog of what a UX designer does not catch because the screen is clean in Figma, and what a Product Designer must catch before an EOC will take this. **P0 = deploy-blocker. Polish is not the audit.**

The brief’s thesis: the operator is NOT in a sci-fi control room staring at one screen; they manage multiple zones, dozens of sensors, several drones, and ongoing ops; the 3:47 AM alert may interrupt other work. The shipped product is a single-incident, single-operator, single-screen console. That gap is the register.

---

## P0 — deploy-blockers

### B1 · The statutory actor does not exist

**Figma story.** A confident operator name, a statutory-gate lock, an ORDER ISSUED banner, an ICS-205 bridge with a “statutory issuer.”

**What PD must catch.** A. Rao cannot issue anything. Lin’s title is a string. “Mandatory evacuation” is the wrong California legal object. Unified Command is a contact sheet. Contain’s “County Fire Authority” has no legal identity.

**Evidence.** `commandConsole.ts:569,1082`; `wui-breakout.json meta.bridge`; `talon.ts:112`; Cal. Gov. Code § 8593.11; Penal Code § 409.5.

**Real-world failure state.** Wrongful-death discovery opens on a hardcoded name that is not a qualified IC, sheriff, or fire marshal.

**Smallest systemic fix.** Party model + AHJ header + California Order/Warning vocabulary + “this console recommends; the named authority decides” on every public-facing gate. ADR-3 is not optional.

### B2 · The aircraft is not an aircraft

**Figma story.** Dock icons, battery pips, TFR label, Air Attack radio quote, SO-3 failsafe.

**What PD must catch.** No RPIC, no BVLOS authorization, no 107.35 multi-aircraft waiver, no 107.39 over-people envelope, no Remote ID, no 91.137 deconfliction, “autonomous — not a pilot” as a legal thesis.

**Evidence.** Repo grep for Part 107 / RPIC / BVLOS / Remote ID = 0; `wui-breakout.json meta.tfr`; `commandConsole.ts:1717`.

**Real-world failure state.** FAA/NTSB file in which the console is the control station and the record cannot name the pilot.

**Smallest systemic fix.** Sortie object with authorization class, RPIC party, airspace state (received), and hard refusal to launch outside the envelope. Disable speaker-over-public until Category/waiver is a chip on the option.

### B3 · The public warning is a banner, not a legal act

**Figma story.** Reach numbers, geofence check, REQ → Sheriff/OES, ack-pending.

**What PD must catch.** IPAWS origination is an authorized official’s act. 917 devices is not a warning. “Acknowledgements coming in” is a radio quote. No cancel/expire/multilingual/AFN. Delayed-warning vs false-alarm residual is unpriced.

**Evidence.** `plan.gate.reqs`; `order` item; Ready.gov / FEMA IPAWS.

**Real-world failure state.** The next fire’s cry-wolf, or this fire’s un-warned in-path household, with the console as the thing that “sent” (or failed to send) the alert.

**Smallest systemic fix.** WEA draft → requisition → **received** IPAWS id; originating official as a party; residual-risk line on the card; no verb other than “requisitioned” in the issued banner.

### B4 · The road cut cannot reach a heads-down operator (F1, still open)

**Figma story.** Orb turns serrated; drawer has the sentence; map has a marker.

**What PD must catch.** The climax of the flagship arc is invisible unless the drawer is open. Perceptual narrowing + radio + open plan card = missed escalation. Life-safety budget exemption does not help if the item never becomes a card. The 2026-10-27 same-day fix shipped the issued banner and ack loop — a different problem.

**Evidence.** `talon.ts` `state()` filters `ask`/`proposal`; `cut` and `correction` are `note`/`correction` kind; DEEP-AUDIT F1.

**Real-world failure state.** 19 homes above a cut road the operator was looking at a different card during.

**Smallest systemic fix.** Transient awareness cards for note-kind interrupts; life-safety notes get a red (life-safety) toast with “Open”; they close on ack or supersede, never on timeout alone.

### B5 · The record will not survive the subpoena it was designed to invite

**Figma story.** Export evidence, SHA-256, “not a signature,” dissent verbatim, decisions with latencies.

**What PD must catch.** No custodian, no comms log (counts only), no model turns, no screen-state, no wall-clock on entries, no hash chain, no retention class, hardcoded operator, exercise disclaimer. The honest copy is necessary and fatal if this is the only artifact.

**Evidence.** `commandConsole.ts:1069–1114`.

**Real-world failure state.** Spoliation narrative plus a jury reading “not legal attestation” as the vendor’s own estimation of the product.

**Smallest systemic fix.** Append-only event log from day one of any non-exercise use; identity interlock; wall+scene time; comms and model turns in the export; keep the honest copy.

### B6 · Degraded infrastructure is a toast

**Figma story.** Satellite-loss note with confidence honestly dropping; offline/online toasts.

**What PD must catch.** Cell towers burn over; C2 drops; satellite backhaul loses packets. There is no staleness clock, no layer shedding, no “this perimeter is 4 minutes old,” no fail-graceful. The map will show **stale data as if live**. DIRECTION §3 designed network degradation and route-blocked partial evac; HANDOFF lists them as not authored.

**Evidence.** `commandConsole.ts:250–252` (offline/online toast only); `satloss` feed note; HANDOFF “Left to do.”

**Real-world failure state.** An operator authorizing Route A on a perimeter that has not been measured since the link died.

**Smallest systemic fix.** Every telemetry surface carries age + source; on C2 loss the layer goes stale-styled and non-authoritative; plans cannot be authorized on stale geometry without an explicit override that is logged as a risk acceptance.

---

## P1 — must resolve before any agency exercise that could be mistaken for operations

### B7 · Multi-zone / concurrent-incident operator is a different user

The brief’s operator is not this console’s operator. The thesis (“follow the incident, not the process”) is correct for the live surface and has been allowed to erase the duty officer. Minimum honest handle remains DEEP-AUDIT §6: registry + refs + close-the-period act — **not** an in-console duty view. The record loop (S-04 → S-05 preemption) already gestures at multi-incidence and is undersold.

### B8 · Shift change and the next human do not exist (F6 / ADR-3)

Supervisor is a string. Operator is hardcoded. Transfer of command is a narrative in the export. The 03:47 operator is immortal. Circadian trough has no operational cure except a second human. Smallest fix: “Transfer command” as a logged act with party identity and an open-item brief the relief must accept.

### B9 · Dissent ritual is a chilling, discovery-hostile overreach (F4)

Every alternate becomes a named disagreement. The constitution is right; the trigger is wrong. See Human-Factors Scorecard rows 12 and 36; Legal Matrix §2.

### B10 · `message_unit` contradicts the constitution (F3)

A send button the rulebook says the copilot does not have. Prompt-injection-to-radio. Smallest fix: enforce SO-4, log as TALON’s act, stop auto-“Copy.” Until then, disable in any non-exercise build.

### B11 · Automation complacency is being marketed as calibration

The diary stopped re-verifying after one correction. G2 is not live. `post_item` is unbounded. The model has no conversational memory and still feels like a colleague. PD catch: recommended-first is a compliance tactic that **works**, and that is the problem. Proportional friction + inspectable priors + two-way attention (“Ask TALON about this”) are the smallest honest moves.

### B12 · The mobile command trailer has no product

1920 floor; phone/tablet out of scope; 10.5px data-ink; Field High-Lux plan colors stay dark; glove/glare/vibration/noise untested; voice unverified. The brief’s operator is as often in a truck as in a darkroom. Shipping an EOC-only console is a scope decision that must be on the box, not in HANDOFF.

### B13 · Mutual aid and non-owned resources are dialogue

No MEL, no agreement, no cost-share, no private dozer, no volunteer crew, no demob. Contain’s “CAD queues the dozer” is the right causal model and is then a feed note.

### B14 · Field / ATAK is one-way; the radio is a metaphor

See Stakeholder Friction §2. The fatal HQ-vs-front-line blind spot is designed in.

### B15 · Live-model honesty is unverified on the only path that matters

Truth guard checks words not acts; no real-key smoke test; key in localStorage; Anthropic browser header. The “no key = scripted, unchanged” story is true and is not the deployment story.

### B16 · “90 seconds” is a trial exhibit the product cannot survive

Sheet-10 NSM vs authored 38-min baseline vs shipped scene-minute arcs. Do not average. Marketing that says the product collapses 48 minutes to 90 seconds will be read next to a Review that says “detection → evacuation order: not issued.” PD catch: the brand story and the HMI must use the same verb.

---

## P2 — systemic, not decorative

**B17 · Review is still a tab, not a period close-out (F8).** Identity landed in the export; the act did not.

**B18 · Keyboard 1–9 vs documented 1–3 (F10).** Latent Hick/mode error.

**B19 · Scene-time budget tooltip (F7).** The ISA-18.2 story is not the wall-clock story.

**B20 · Evac widget proposed-chip after commit (F11).** Change blindness on the board.

**B21 · `truncateThread` dead (F12).** Scrub-back can leave future chat in the thread.

**B22 · Boot overlay remains in the a11y tree (F9).**

**B23 · Contain bridge is empty.** ICS-205 is incident-fragile; the legally best arc has the worst command model.

**B24 · Keyboard focus does not drive map brush.** Proximity compatibility is mouse-only (SIGN-OFF 3c).

**B25 · ANS/DIS timeline marks unused on fresh records.** The record vocabulary is half-built.

**B26 · Geofence “no spill beyond 150 m” is a sentence, not a check.** WEA polygon error is a national problem; the card treats it as a done row.

**B27 · No Spanish / AFN / 911-surge.** Civil-rights and effective-warning gap.

**B28 · Cross-incident refs (S-03/S-04) already exist** and are undersold as a registry seed. Do not build the duty view; do finish the doctype (incident id, period, operator, refs) as **acts**.

**B29 · Skill fade unmeasured.** No debrief question back to the operator (ADR-2). The console never asks “what did you expect at T+0:16?”

**B30 · Record-loop cold start** puts a first-time visitor inside a closed incident and then preempts to live. Brilliant and dangerous: it trains the wrong person on the wrong incident unless the exercise frame is unmistakable in the first 500 ms.

---

## What a UX designer would have shipped anyway (and PD must not let them)

A persistent TALON panel. A process wizard. Auto-execution on gate expiry. A duty dashboard inside this console. Chain-of-custody language on the digest. Operator-reliability scoring from dissent history. Voice-first. Per-unit chat threads. Counterfactual what-if replay from past states. Rothermel cosplay.

The kill-list (DEEP-AUDIT §7) is the PD contribution that looks like restraint and is actually the product’s legal and HF spine. Keep it.

---

## UX execution vs Product Design — the actual split

| Superficial UX (what the screen does) | Strategic Product Design (what the system does in the world) |
|---|---|
| Plan-state chrominance + geometry; 180 ms latch; AA contrast; map never moves; cards exist only while open | Who the law recognizes as the actor; what the aircraft legally is; whether the warning can be originated; whether the climax can be seen; whether the record can be sworn to |
| Hick/Fitts/serial-position honored; red discipline constitutional | 03:47 circadian unreality; unmetered notification tier; team SA absent; trailer has no product |
| Dissent box, truth guard, provenance, correction moment | F4 chilling; words-not-acts guard; export that refuses to be evidence and is then the only artifact |
| Exercise disclaimer on every scenario | Dual-use installation one keystroke from a live fire |
| 90-second NSM on a drawing | A Review that honestly says “not issued,” next to marketing that cannot |

The UX execution is above the bar this prototype set for itself. The Product Design is not finished. The remaining work is not in `console.css`.

---

## Closing verdict

**Would I put this next to the radio?**

As a **training console** for the contain / falsepos / wui exercise arcs, with the exercise frame unmistakable and `message_unit` disabled or gated: **yes**, with the conditions the 2026-10-27 operator diary already named (F1, F4) plus the party model.

As the system an agency uses to recommend a WEA or fly a dock-launched sortie in a 91.137 TFR at 03:47: **no.** Not this build. Not without the P0 register closed.

The product is afraid of lying to the operator, and that fear is a design system. It is not yet afraid of the things that happen **outside** the operator — the sheriff who never sees the requisition, the tanker that never sees the drone, the resident who never sees the warning, and the grand jury that sees everything the console chose not to keep.
