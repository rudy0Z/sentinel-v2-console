# Deliverable 2 — Stakeholder Friction Analysis

**Sentinel Command Console & TALON Copilot · 2026-11-04**

The shipped user model is: **one operator, one incident, one screen, one copilot.** That is a deliberate thesis (“the operator follows the incident, not the process”) and it is the right thesis for the **live decision surface**. It is the wrong thesis if it is allowed to define **who exists**.

## 1 · The console’s user model vs the incident’s actual roles

| Real-world role | In the console | Friction / exclusion / endangerment |
|---|---|---|
| **Incident Commander / Unified Command** | Absent as a party. Reyes is “Field IC · Division Alpha supervisor” on the bridge — a division supervisor, not the IC. No Safety Officer. No PIO. No Liaison. No UC agreement. | The console’s “Operator on authority” is a **new, unnamed command role** that ICS does not have. In a real WUI fire the IC is a qualified officer with a staff; the console operator is a **decision-support seat**. The product endangers everyone by letting that seat look like command. |
| **Operations Section Chief** | Absent. | Tasking of E-31/E-32/DZ-3 is a TALON card, not an Ops function. The Ops Chief cannot see, accept, or refuse a TALON tasking in their ICS-204 world. Blind spot: HQ and Ops diverge silently. |
| **Safety Officer** | Absent. | The road-cut moment, the “hold FT-01 up 20 min” option, the speaker-over-public option — these are Safety Officer stops. There is no Safety override, no “stop the evolution” control that is not a TALON option. |
| **GIS / Fire Behavior Analyst (FBAN)** | TALON Spread agent is the FBAN. Projection is a self-similar growth model plus an elliptical spot fire, **not Rothermel** (HANDOFF). MOD/MEA tags are honest. | The FBAN cannot inspect or challenge the model. “I raised the spotting term for this incident” (`correction.why`) is a one-way confession. The analyst is excluded from their own product. |
| **911 Dispatchers / CAD** | CAD report is a gated ask in `contain` (always required, even with no evac — the best legal instinct in the product). In wui, the CAD is implicit in the Type 3 escalation. | Dispatch is not a seat. There is no CAD ack as a **received** object, only a TALON feed note. A dispatcher cannot correct the console. Information asymmetry: dispatch’s world (phones, ALI, CAD comments) does not exist. |
| **County OES / alert originator** | Lin, “statutory issuer,” IPAWS/WEA net. Ack-pending banner. | Lin is a string on a popover. OES can neither edit the WEA draft nor refuse it in the console (refusal happens, if at all, as a scripted radio quote). If OES is out of jurisdiction or the WEA polygon is wrong, the console has no failure state. |
| **Drone fleet operator / RPIC** | The console operator **is** the fleet operator, minus the license. “Drones are autonomous — the pairing is a standing order, not a pilot” (`commandConsole.ts:1717`). | The legally required human is designed out. Endangerment: the RPIC’s see-and-avoid duty has no surface. |
| **Field Strike Team / Engine captains (E-31, E-32)** | @-unit radio-to-text; scripted “Copy.” Intel packages under SO-4. Push to TAK = persistent receipt. Hail ducks TALON. | The field unit cannot initiate, contradict, or refuse. ATAK push is one-way. A strike team leader’s tablet (the brief’s “ruggedized tablets”) is not a product. **Fatal blind spot:** HQ sees a committed plan; the engine that has to hold the flank sees a text and a prayer. |
| **Air Attack (Cole, AA-07)** | Bridge contact, drone pairing FT-02 “Perimeter orbit · UAS floor,” scripted radio. | Air Attack cannot positive-control the UAS. There is no “Air Attack has the airspace / UAS is cleared / UAS is landed” state machine. This is the mid-air hole. |
| **Law enforcement / Sheriff (Vance, SH-12)** | Bridge, hairpin TCP, `owns: SH-12 traffic control`. | Evacuation execution is a REQ. Good. Traffic-control failure (stalled vehicle — already in Vance’s radio quote) has no surface back to the console except a scripted line. |
| **Mutual aid (DZ-3 LA County, DZ-4 county dozer, “2 engines”)** | Script beats. Type 3 escalation card. Cross-incident refs to S-03 dozer SLA. | No MEL, no FIRESCOPE agreement, no cost-share, no demobilization, no resource-competition with another incident. Private contract dozers and volunteer hand crews are **absent**. The brief’s “resources that do not belong to the primary agency” are a TALON sentence. |
| **The fleeing public** | Device counts. FT-03 speaker. WEA ≈ 917. | The public cannot ack, cannot 911, cannot be multilingual, cannot be AFN. They are the people the brief said the product was for. They are excluded from the user model and endangered by it. |
| **Regional Duty Supervisor** | `reraise.to` free string (`talon.ts:112`). Rulings arrive as script. | ADR-3 open. The backstop does not exist as a person who can be on duty at 03:47, be relieved at 07:00, or refuse a re-raise. |
| **The next operator / relief** | Nothing. Transfer of command is a **narrative section in the export** (“Handed to the relief…”) with no act, no identity, no open-item briefing a new human can accept. | The 03:47 operator is immortal in this software. Circadian reality is set dressing. |
| **Agency counsel / records / PIO** | Absent. | The export will be their first sight of the incident, and it will be incomplete. |

## 2 · Information asymmetry: EOC console vs field / ATAK / radio

| Path | What HQ sees | What the field receives | Fatal blind spot |
|---|---|---|---|
| **Push to TAK** | “✓ TAK synced” chip; “Push this plan’s waypoints and hazard pins” (`commandConsole.ts:1716`). | A persistent receipt. No round-trip of ATAK map objects, no officer’s ack, no “route blocked” from the tablet. | One-way. The field’s world (smoke, a stalled car, a downed tree) cannot update the plan except through TALON’s next scripted beat. |
| **Hail / mic** | Tri-state mic (On the Net / MUTED / TRANSMITTING). Hail ducks TALON. PTT is violet, not red (red discipline). | A patch. No recorded radio log as a first-class legal object (comms are **counts** in the export, `commandConsole.ts:1088`). | The radio — the actual incident net — is a metaphor. The console cannot be “next to the radio” because it does not hear the radio. |
| **@E-31 composer** | Radio-to-text; E-31 copies. Undiscoverable (DEEP-AUDIT: placeholder only). | A text. Auto-“Copy.” in the model path is fabricated (`commandConsole.ts` scripted ack). | The core ICS behavior (talking to your resources) is an easter egg. |
| **Intel package (SO-4)** | Logged standing action. | Unspecified payload. | “Intel” that cannot be inspected by the receiving unit is not intel. |
| **Map-is-the-reply** | Hover COA lights geometry. | Nothing, unless TAK-pushed. | The most beautiful interaction in the product is HQ-only. |

## 3 · Agency friction and mutual aid

The console treats mutual aid as a **decision** (“Escalate to Type 3 and request DZ-3 + 2 engines”) rather than a **federated transaction** (MEL hit, agreement, cost-share, ordering point, ETA as a received ETA, demob). DZ-3 “on scene in ~38 min” is TALON’s arithmetic (`escalate.body`). A private contract dozer, a volunteer hand crew, an OES fire engine from an adjacent county, and a CalGuard element do not have data shapes.

The contain arc’s best idea — the CAD report **queues the dozer** (`dz4`) — is the right causal insight and is then dropped: there is no resource-order object, only a feed note.

**Who is endangered by the interface.** Ranked:

1. The fleeing public, who are a device count.
2. The field engine that cannot talk back.
3. The unnamed RPIC / Air Attack pair, who share a TFR they cannot jointly control.
4. The operator, who is set up to be the only name on the trial exhibit.
5. The supervisor, who is a string.
6. The relief operator, who does not exist.
7. The FBAN / Safety Officer / Ops Chief, who are excluded from their own incident.

## 4 · Stakeholder topology the product actually models

Modeled as data (WUI only):

- `meta.bridge`: Reyes DIV-ALPHA CAL FIRE CMD-1 151.220; Vance SH-12 LASD LASD-TAC 482.812; Cole AA-07 A/G-1 168.550; Lin COUNTY OES IPAWS/WEA “statutory issuer.”
- Units: FT-01/02/03, E-31, E-32, SH-12, DZ-3.
- Standing orders: SO-2 verify in pre-cleared airspace; SO-3 failsafe return <8%; SO-4 share intel with assigned units; run cards ENC-H / ENC-N.
- TFR label; night epoch 2026-01-14T03:47:00-08:00.

Not modeled at all:

- IC/UC as a party; Safety Officer; PIO; Liaison; Ops Chief; FBAN as a human; 911 dispatcher seat; CAD as received state; IPAWS origination; ATAK round-trip; radio net as a record; private contract resources; volunteer hand crews; adjacent-county OES as a jurisdiction; the public as actors; shift change; the relief; agency counsel; another concurrent incident.

`contain.json meta.bridge` is empty — the legally best arc (authorities always notified) has the worst command model.

## 5 · Handoffs and the missing acts

The interaction contract has a healthy upward gradient (operator over TALON: dissent, typed refusal, effects only on pick) and a rare healthy downward gradient (TALON past the operator: new-evidence re-raise to a second authority). What is missing is the third direction: **nobody above the operator exists until the re-raise invents them** (ADR-3), and nobody **beside** the operator exists at shift change.

Minimum honest acts that do **not** violate the thesis:

- Party model for operator, supervisor, and each bridge leader (name / callsign / agency / qualification).
- “Transfer command” as a logged act with an open-item brief the relief must accept.
- “Close the operational period” as a Review act (ADR-2 / F8), not a tab people stumble into.
- CAD / WEA / TFR / ATAK as **received** state machines, not scripted quotes.

What must **not** be built (kill-list still holds): in-console incident switching during a live incident; a duty-officer dashboard inside this surface; a process/period strip; cross-incident TALON memory that is not inspectable data.

## 6 · What the product got right (do not undo)

- **OWNED vs REQ** on the gate face (`talon.ts:97–102`, rendered `commandConsole.ts:701`). Keep it; promote it to a party model.
- **Contain arc: authorities always notified, even with no evac.** Legal-notification obligation implemented as structure, not copy.
- **Ack loop + ORDER ISSUED · ACK PENDING** (`talon.ts:500–528`, `commandConsole.ts:654–679`) is closer to a closed-loop requisition than the “string supervisor” framing suggests.
- **Dissent + new-evidence re-raise past the operator** is a real governance mechanism. The trigger is what has to move (F4), not the record.
- **ICS-205 bridge + Hail + TAK push + drone pairing** is the closest thing to a multi-agency surface. It is WUI-only and one-way. Build on it; do not replace it with a duty dashboard.
- **Record loop P0 preemption with bookmark** (`commandConsole.ts:414–449`) already gestures at multi-incidence operator load and is undersold.

## 7 · Closing

Incident command is never a single-user video game. The console knows this in its bridge data and denies it in its user model. The result is a beautifully honest single-seat decision machine that would, in a real Unified Command, create the exact blind spots it was designed to prevent: HQ certainty, field silence, public as telemetry, and a record that cannot name who legally acted.
