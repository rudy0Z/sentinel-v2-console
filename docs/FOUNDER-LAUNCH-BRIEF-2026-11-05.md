# Founder Launch Brief — Sentinel as a FlytBase product

**Date:** 2026-11-05 · **From:** the founder’s chair · **Question:** if we launched this app to the agencies who would actually use it, what would they demand, what would the authorities hit us with, and does the current build comply?

**Evidence base:** the live build (`0bdfc4c`), the 2026-11-04 Legal Matrix and Stakeholder Friction analysis, the 2026-11-05 Shippability Audit (verify 45/45, e2e 35/35, independent T+116 probe), and public source checks on California evacuation authority, FAA Part 107/108, and FEMA IPAWS/WEA origination.

---

## 1 · The product we actually have, versus the product we would be selling

**What is in the repo.** A single-operator, single-incident, single-screen training console for one invented canyon in Ventura County. TALON proposes; a hardcoded human (“A. Rao”) authorizes; standing orders cite SO-2/SO-3/SO-4 and run cards ENC-H/ENC-N; public warning is a requisition banner to a string named “LASD · Sheriff / County OES”; the export is a SHA-256 of a pretty JSON that the product itself refuses to call evidence. Every scenario is watermarked “Training exercise. Terrain, roads, structures and land cover are real; the fire, weather, units, times and TALON are invented.”

**What the FlytBase brand would be selling, if we put this in front of a fire chief.** “An AI co-pilot that collapses 48 minutes of manual wildfire response into 90 seconds — autonomous docks, live thermal confirmation, evacuation alerts to 917 devices, coordinated drones guiding the public out.” That is the brief. It is also a trial exhibit.

**The gap is not polish.** The gap is that the brief describes a product that would have to *originate public warnings, fly BVLOS in a wildfire TFR, and participate in Unified Command*. The build describes a product that *recommends, requisitions, and never sends*. Those are different companies. Launching the first while shipping the second is how public-safety vendors get sued.

---

## 2 · Stakeholder map — who shows up on day one, and what they will demand

### 2.1 The buyer (who signs the PO)

| Stakeholder | What they will demand on day one | Does the build have it? |
|---|---|---|
| **County Fire / CAL FIRE unit** (operations) | CAD interop (NG911 / CAD-to-CAD), unit roster from their RMS, ICS-201/205/209 that their IC actually files, run cards that match *their* preplans, no invented fire | **No.** Encinal is authored JSON. `tools/encinal-scenario.mjs` authors TALON. There is no CAD adapter. `LIVE-API-READINESS.md` correctly lists `sit.calls[]` and a dataset loader as *to-build*. |
| **County Sheriff / OES** (the statutory issuer) | A requisition path into *their* alert origination (IPAWS), *their* evac decision, *their* records — not a console that looks like it issued the order | **Partial, and dangerous.** OWNED/REQ split and ack-pending are the right *sketch*. The banner says “Evacuation order issued on your authorization.” Dir. E. Lin is a roster string labelled “statutory issuer.” `contain.json` has an empty bridge. |
| **Agency IT / Security** | SSO/SAML, MFA, RBAC, audit logs, no API keys in the browser, data residency, SOC 2 / StateRAMP, CJIS if LE data, a DPA, a BAA if PHI appears | **No.** No auth. Operator hardcoded. Live-model key in `localStorage`. Anthropic `dangerous-direct-browser-access`. Client-side everything. No tenancy. |
| **Agency counsel / records** | CPRA/FOIA retention, legal hold, chain of custody, who-signed-what, no “exercise” disclaimer on a live incident | **No.** Export is a post-hoc JSON dump with comms *counts*. The disclaimer will be Exhibit A. |
| **Procurement (Cal eProcure / state IT)** | VPAT / Section 508, WCAG 2.1 AA on the *contracted* viewport, plain-language data practices, insurance certificates, indemnification | **Partial.** axe-core 0 violations on four states; 10.5 px data-ink floor is a documented override; 1920 floor and phone-out-of-scope will fail a mobile/508 review; no VPAT. |
| **Union / operator bargaining unit** | Who is the operator of record, what the AI may do without them, that dissent is not a performance review, that the record cannot be used against them without process | **Partial.** Dissent is preserved (good) and TALON refuses to score the operator (good). Dissent is also over-broad (F4), so every tactical alternate becomes a named disagreement — which *will* be read in a grievance. |
| **Insurer (aviation + E&O + cyber)** | Named RPIC, waiver/COA on file, no automated public alerting, no automated evac, human-in-the-loop on every life-safety act, incident limits | **No.** No RPIC. “Autonomous — not a pilot.” WEA is a UI fiction. The 90-second marketing will be read as an undertaking. |

### 2.2 The users (who sit in the seat)

| Stakeholder | Expectation | Build reality |
|---|---|---|
| **EOC operator / duty officer** | One seat that does not lie, that hears the radio, that survives 03:47, that another human can relieve | The deck is the best seat we have shipped. No radio. No relief. No 03:47 human. Supervisor is a string. Transfer of command is a narrative section in the export. |
| **RPIC / fleet operator** | Aircraft they are legally responsible for, airspace they can trust, a waiver envelope, lost-C2 procedure | The console *is* the control station and does not name them. TFR is a label. SO-3 failsafe at 8% is a battery rule, not a 91.137 deconfliction. |
| **IC / Unified Command** | A decision-support tool that does not pretend to be command; ICS forms; a Safety Officer stop | No IC party. No Safety Officer. No stop-the-evolution control. The live surface thesis (“the operator follows the incident”) is correct and is being used to erase command. |
| **Field / ATAK / engine captain** | Two-way plan, a way to say “route blocked,” intel they can inspect | Push-to-TAK is one-way with a persistent receipt. `@E-31` is undiscoverable. Auto-“Copy.” in the model path is fabricated. |
| **911 dispatcher** | CAD as received state; a way to correct the console | CAD is a gated ask in `contain` (the best legal instinct in the product) and a scripted beat in `wui`. No dispatcher seat. |
| **The fleeing public** | A warning that is originated by an authorized official, in their language, that does not cry wolf | They are 917 devices and a radio quote. No Spanish, no AFN, no cancel/expire, no 911-surge. The brief’s “fleeing public” is a reach number. |

### 2.3 The regulators (who will actually hit us)

| Authority | Instrument they will use | Hit we would take |
|---|---|---|
| **FAA** | Part 107 waiver / public COA / SGI; 14 CFR 91.137 TFR; Part 89 Remote ID; § 107.31/35/39; enforcement + NTSB | **Primary.** Dock-launched “autonomous” sorties at 03:47 inside a wildfire TFR, three aircraft one pilot, speaker over people, no RPIC named in the record. Part 108 is *proposed and not in effect*; BVLOS still requires a waiver/COA today. |
| **FEMA IPAWS / FCC** | Alerting-authority origination rules; WARN Act; unauthorized origination | A vendor **cannot** originate a WEA. The build correctly refuses to send — and then *describes* a send (“WEA accepted — 917 devices”). If anyone wires this to IPAWS without an authorized official, that is federal. |
| **Cal OES / county OES** | SEMS/NIMS, California Warning System, alert origination authority | Lin is a string. No CalWAS, no IPAWS origination chain, no multilingual WEA, no AFN. |
| **CAL FIRE / county fire** | Fire authority to request resources, not to order the public out of a county | “ORDER MANDATORY EVACUATION” is the wrong California legal object (Order vs Warning; residents may remain; PC 409.5 closure is law enforcement). |
| **County sheriff** | Penal Code § 409.5 closure; evac execution | SH-12 is a contact. Road “cut” is a map marker, not a closure order. |
| **County counsel / AG** | Gov. Code § 815 (no liability except by statute), § 820.2 (discretionary acts), undertaken-duty cases | Discretionary immunity does not cover a vendor’s decision architecture, and an undertaken warning that increases harm is the fact pattern that defeats it. Gov. Code § 855.6 is **not** a fire/police immunity (it is examinations) — do not cite it that way in a board deck. |
| **NTSB / OSHA / grand jury** | Post-incident inquiry; spoliation | The export is not a record. No custodian, no comms log, no wall-clock on entries, no hash chain. The “not legal attestation” copy is honest and fatal if this is the only artifact. |
| **CPRA / privacy regulator / press** | Drone imagery of residences and fleeing people; facial-recognition bans; CPRA | Absent. No retention class, no blurring, no media protocol, no “this feed is a public record” treatment. |
| **CJIS / FBI** | If LASD data touches the system | Absent. A browser app with a localStorage LLM key is not a CJIS system. |

### 2.4 The adversary (who arrives after the bad fire)

Plaintiff’s counsel will not read DESIGN.md. They will read: the 90-second marketing, the “autonomous” pairing, the hardcoded operator, the dissent that names the deceased operator as having “rejected” TALON, the missing comms log, the exercise disclaimer on a live incident, and the correction moment (“I was wrong about Encinal Canyon Rd”) as an admission the model was load-bearing on the evacuation route. Our honesty culture is our best engineering and our worst discovery posture if we launch it live.

---

## 3 · The compliance stack Sentinel would be *supposed* to handle

If we are serious about an agency putting this next to a radio, the design is supposed to comply with all of the following. This is the list I would put on the board, not a lawyer’s footnote list.

**A. Airworthiness and airspace**
1. A named Remote Pilot in Command for every sortie, on the record.
2. An authorization envelope (Part 107 waiver, public COA, or SGI) that the console can read and refuse to exceed.
3. Remote ID (Part 89) live per airframe; missing Remote ID = no launch.
4. Night authorization (§ 107.29 with anti-collision lighting, or a waiver).
5. Multi-aircraft waiver (§ 107.35) with a licensed fleet count, not a UI count.
6. Over-people envelope (§ 107.39 Category 1–4 or waiver) — **speaker/strobes is never a standing order.**
7. Wildfire TFR (14 CFR 91.137) as a received, staleable, **hard** layer; UAS floor as a geofence the console cannot authorize through; lost C2 is a legal event (Air Attack + FAA), not a battery widget.
8. Public-aircraft vs civil-aircraft program type as a setup fact (49 U.S.C. § 40102).

**B. Authority and public warning**
9. The console operator is a **recommender and requisitioner**, never the issuer. California evacuation vocabulary is Order/Warning, issued by the Governor, a county emergency management official, a sheriff, a chief of police, or a fire marshal (Gov. Code § 8593.11); area closure is Penal Code § 409.5 (peace officers).
10. WEA/IPAWS origination is an authorized Alerting Authority’s act through FEMA IPAWS. The console may draft and requisition; it may never send. Originating official as a party; IPAWS message id as received state; cancel/expire as received state.
11. Bilingual / AFN channels as requisition fields, not a later nice-to-have.
12. Unified Command identity on every public-facing gate: incident id, AHJ, UC composition, Safety Officer, “this console recommends; the named authority decides.”
13. Silence is never approval (already built — keep it). Auto-execution on lapse is forbidden (already killed — keep it).

**C. The record**
14. Authenticated operator identity; append-only event log including `message_unit`, model turns, demotions, acks, and what was on screen; wall clock **and** scene time; named custodian; CPRA/FOIA retention class; hash chain or RFC 3161 timestamp.
15. Exercise vs live interlock: live mode requires an authenticated statutory operator, an AHJ, and a “this is not an exercise” act.
16. No “90 seconds” marketing on a product whose Review can say “not issued.”

**D. People, privacy, procurement**
17. SSO/SAML, MFA, RBAC, no API keys in the browser; model proxy through the agency; DPA with the provider; CJIS if LE data.
18. CPRA notice, retention, and production protocol for drone imagery; no biometric search; media/JIC protocol.
19. Section 508 VPAT; WCAG AA on the contracted viewports; bilingual HMI for California.
20. Insurance: aviation liability sized to over-people ops, E&O sized to decision-support (not to “we evacuate people”), cyber.
21. Training and currency: RPIC Part 107 / COA conditions; operator ICS-100/200/300; TALON is not a qualification.

**E. What we must refuse to build, even if a customer asks**
22. Auto-origination of WEA.
23. Auto-execution of evac, road closure, or resource order on lapse or on model confidence.
24. Operator-reliability scoring from dissent history.
25. A duty-officer N-incident view inside this console (different user, different surface).
26. Chain-of-custody language on the SHA-256 digest.
27. Voice-first as a mode (the radio owns the channel).

Items 13, 25, 26, 27 are already in the kill-list and are the most legally mature decisions in the company. They are also the ones a customer will try to buy out of. The founder’s job is to refuse.

---

## 4 · Compliance scorecard — does the current build comply?

**No.** It complies with the *exercise* frame it was built for, and it *instinctively refuses* several things that would be illegal to do (which is why the skeleton is worth keeping). It does not comply with the stack an actual agency would hit it with.

| # | Requirement | Build | Verdict |
|---|---|---|---|
| 1 | Named RPIC per sortie | Absent. “The pairing is a standing order, not a pilot.” | **FAIL** |
| 2 | BVLOS / COA / waiver envelope enforced | Absent. Grep for Part 107 / RPIC / BVLOS / Remote ID = 0. TFR is a string. | **FAIL** |
| 3 | Remote ID live | Absent | **FAIL** |
| 4 | Night ops authorization | Night is a theme and a timestamp | **FAIL** |
| 5 | § 107.35 multi-aircraft license | Three drones, one seat, no envelope | **FAIL** |
| 6 | § 107.39 over-people / speaker | `stall` option: “Send FT-03 · speaker + strobes” as a recommended-first-capable card | **FAIL** |
| 7 | 91.137 TFR as a hard layer | Label + Air Attack radio quote. No geofence the console cannot authorize through | **FAIL** |
| 8 | Public-aircraft vs civil setup | Absent | **FAIL** |
| 9 | Operator is not the issuer; CA Order/Warning vocabulary | Hardcoded A. Rao “authorizes”; “MANDATORY EVACUATION”; issued banner on a console click | **FAIL** |
| 10 | WEA never originated by the vendor; authorized official as party | REQ split is the right instinct; Lin is a string; banner describes a send | **PARTIAL — the only compliant instinct in the warning stack** |
| 11 | Bilingual / AFN | English only | **FAIL** |
| 12 | Unified Command identity | Contact sheet; `contain` bridge empty | **FAIL** |
| 13 | Silence ≠ approval; no auto-execute on lapse | Built and verified (lapse sends nothing; escalates) | **PASS** |
| 14 | Evidentiary record | Integrity digest, honest copy, not a record | **FAIL** |
| 15 | Exercise vs live interlock | Disclaimer only; same build would run live | **FAIL** |
| 16 | Auth / SSO / no browser key / tenancy | No auth; key in localStorage; single tenant | **FAIL** |
| 17 | CPRA / drone-imagery protocol | Absent | **FAIL** |
| 18 | 508 / VPAT / mobile | axe clean on 4 states; 10.5 px override; 1920 floor; phones out of scope | **PARTIAL** |
| 19 | message_unit gated | Existence check + auto-“Copy.”; prompt contradicts the tool | **FAIL** |
| 20 | Two-tier authority; uncited standing dropped; effects only on pick | Built, verified, load-bearing | **PASS** |
| 21 | Provenance + truth guard on words | Built (words, not acts) | **PARTIAL** |
| 22 | Authorities always notified even with no evac (`contain`) | Built as structure | **PASS** (the most legally mature beat) |
| 23 | Degradation / stale data | Offline toast; satloss is a feed note; map will show stale as live | **FAIL** |
| 24 | Shift change / transfer of command | Narrative in the export | **FAIL** |
| 25 | Field two-way (ATAK/radio) | One-way push; scripted Copy | **FAIL** |
| 26 | Multi-incident / span of control | One incident; record loop is the only gesture | **FAIL** (and correctly refused as an in-console duty view) |

**Score: 3 PASS · 4 PARTIAL · 19 FAIL** against the stack a real agency would impose.

The three PASSes are the constitution: two-tier authority, silence-is-never-approval, and authorities-always-notified. Those are why this skeleton is worth carrying into a real product. They are not a compliance program.

---

## 5 · What happens if Ventura County puts this in a real EOC tomorrow

Scenario: a night WUI run, the console is on the operator’s desk, a dock is on a ridge, LASD is on the bridge popover, the fire is real.

**Minute 0–2.** The operator is not A. Rao. The incident is not Encinal. The scenario JSON does not contain this fire. The console cannot ingest CAD, RAWS, or their preplan. It is a beautiful sandtable. **The launch fails at ingest, before any legal theory matters.**

**If we somehow point it at a real dock.** The first autonomous launch at night, beyond visual line of sight, in or near a 91.137 TFR, with no named RPIC in the record, is an FAA violation whether or not the fire is real. If FT-03 puts a speaker over evacuees, that is a § 107.39 event. If a tanker is on the drop, “keep your drones under one-five-zero” is not deconfliction.

**If we somehow let it “issue” a WEA.** It cannot. IPAWS will not accept it. If we fake the send (the banner already describes one), we have originated a fictional public warning in a system whose job is to not lie. If we wire it to a county IPAWS feed without the authorized official in the loop, that is federal, and the “ack” is theatre.

**If the fire kills someone.** The subpoena arrives for the console, the model, the standing orders, the dissent, the comms, and the marketing deck. We produce: a JSON with a hardcoded name, comms *counts*, an exercise disclaimer, a SHA-256 the copy says is not evidence, and a 90-second brand story. County counsel will invoke § 815 / § 820.2. Plaintiff’s counsel will argue undertaken duty, design defect, and reliance. Our own correction moment (“I was wrong”) will be read as the model driving the route. The dissent box will be read as the operator rejecting safety advice. We will settle. The agency will too — and they will remember who sold them the seat.

**If the FAA asks who was PIC.** The record cannot answer. That is the end of the public-safety relationship and possibly of the operator’s certificate.

**What will *not* happen:** TALON “taking over.” The constitution holds. Effects run only through the pick. Silence does not send. That is why the skeleton is the asset. It is also why launching the *story* (90 seconds, autonomous, evacuation) over the *skeleton* (recommends, never sends) is the founder-level failure mode.

---

## 6 · The only launch path that does not end in a deposition

I would not launch “Sentinel: autonomous wildfire command” to a county. I would launch, in this order:

**Stage 0 — Exercise product (this build, hardened).**
Ship the console as a **training and tabletop system** for ICS/UAS familiarization, explicitly not connected to a live dock, explicitly not a warning origination path, exercise watermark always on, `message_unit` gated or disabled. This is what the code already is. Sell it to academies, CAL FIRE training, county OEM exercises. The 45/35 gates, the dissent record, the lapse law, and the correction moment are genuinely excellent training. Close the five prototype gates from the shippability audit (F1 surface, dangling receipt, threat-aware Egress glance, doc sync, axe on the deck) so the training product does not teach the wrong lesson about the cut.

**Stage 1 — DFR / recon console under an existing authorization.**
One dock, one named RPIC, one COA or Part 107 waiver, daylight or night-with-lighting, **no public alerting, no evac vocabulary, no “order issued” banner.** The console is a recon and intel tool: detect, verify, push intel to assigned units under a cited SO-4, CAD report as a requisition. This is the actual FlytBase DFR business, and it is the only aviation-legal product in this codebase’s future. Build: sortie object (RPIC, waiver id, Remote ID, airspace state), hard refuse outside the envelope, Remote ID on the fleet widget, `message_unit` gated to SO-4.

**Stage 2 — Decision support inside a real ICS.**
Read-only CAD/RAWS ingest, ICS-205 as received data, Safety Officer stop, transfer of command as an act, authenticated operator, SSO, agency-hosted model proxy (no localStorage key), append-only log, CPRA retention. Still no WEA send, no evac issue. REQ banners name a party and a received state.

**Stage 3 — Warning *requisition* into the county’s IPAWS.**
The console drafts; the authorized official originates in *their* system; the console displays the IPAWS message id as received state. Multilingual draft. Cancel/expire as received. We are a drafting surface, never an origination surface.

**Stage 4 — The 90-second story, if it is ever true.**
Only after Stage 3 is boring, the insurer has underwritten it, and the FAA has a program (Part 108 or a mature COA fleet) that the console can read. I would not put that on the website this year. The brief’s 90-second fantasy is a design north star and a legal suicide note if it ships as a claim.

---

## 7 · Why it does not scale as a SaaS today (the founder-ops list)

- **Single hardcoded operator, single incident, single canyon.** Multi-tenancy is not a feature; it is a different company. The live-surface thesis is correct and cannot be diluted with an in-console duty view. The duty officer is a different product.
- **Client-side everything, key in localStorage, no auth.** Cannot pass a county IT review. Cannot pass CJIS. Cannot pass a SOC 2. The adapter is demo-safe and production-unsafe; `LIVE-API-READINESS.md` is honest about the demo and silent about the SOC 2.
- **Authored JSON per incident.** `encinal-scenario.mjs` is a scenario compiler, not a data platform. Real scale is CAD → Situation, RAWS → telemetry, RMS → units, IPAWS → received alerts. That is the four-piece ingest in LIVE-API-READINESS, and it is the actual company.
- **Live model on the incident data.** Sending an active wildfire’s unit positions, addresses, and evacuation geometry to OpenAI or Anthropic from a browser is a records, CJIS, and DPA problem before it is an AI problem. Proxy, redact, ground, and keep the truth guard — or do not turn the key on a live incident.
- **Insurance will not write the live-evac/WEA risk** at seed-stage terms. The Stage 0–1 scope is what an aviation/E&O broker can actually place.
- **The brand.** FlytBase’s enterprise story is docks, autonomy, DFR, BVLOS programs. Sentinel’s current story is a constitutional copilot for a training canyon. Selling the second as the first is how the first gets a deposition.

---

## 8 · Founder decisions I would take on Monday

**Keep, and tell the market.** Two-tier authority; silence is never approval; authorities always notified; dissent preserved; provenance on every number; truth guard; the map never moves; the kill-list; the exercise watermark; the refusal to auto-execute.

**Refuse, even if a customer asks.** Auto-WEA. Auto-evac. Auto-execute on lapse. Operator scoring from dissent. In-console N-incident duty view. Legal inflation of the digest. Voice-first. A speaker-over-people standing order.

**Build next, in order.** (1) The five prototype gates so Stage 0 is honest. (2) Sortie object + RPIC + Remote ID + TFR-as-hard-layer + gate `message_unit` — the Stage 1 aviation minimum. (3) Auth, SSO, server-side model proxy, append-only log, incident id — the Stage 1 IT minimum. (4) CAD/RAWS ingest seam (`sit.calls[]`, dataset loader) — the Stage 2 data minimum. (5) Party model for operator/supervisor/bridge — ADR-3, the Stage 2 command minimum.

**Hire / retain.** Aviation counsel (Part 107/COA/TFR), California public-safety counsel (evac authority, CPRA, Gov. Code), a broker who will actually place UAS-over-people E&O. Do not launch on founder legal opinions.

**Say on the website.** “A training and recon console for dock-based wildfire recon. The AI prepares; a human authorizes; public warning and evacuation remain with the authorized official. Exercise data unless an agency has contracted a live program.” Do not say 90 seconds. Do not say autonomous evacuation. Do not say “command.”

**The sentence I would not survive without.** If we ever put a live dock under this console, every sortie carries a named RPIC and an authorization id, and the console refuses to fly outside them. If we ever put a live warning path under this console, the originating official is a party and the vendor cannot press send. Everything else is negotiable. Those two are the company.

---

## 9 · Verdict

**Does the current build comply with what the authorities who might actually use this product would hit it with?**

**No.** Three of twenty-six requirements pass, and they are the governance skeleton — real, rare, and not sufficient. Nineteen fail, and the failures are not gaps in polish; they are the absence of an aviation program, an alerting program, an identity program, a records program, and a command model. The build is a superb exercise and a dangerous live product.

**Would I launch it?** As a training product for agencies who understand it is a sandtable: yes, after the five prototype gates. As FlytBase Sentinel, autonomous wildfire command, to a county EOC: no. Not this build. Not this year. The skeleton is the company. The 90-second story is the lawsuit.

---

*Cross-refs: Legal Matrix (`docs/DELIVERABLE-1-LEGAL-EXPOSURE-MATRIX.md`), Stakeholder Friction (`docs/DELIVERABLE-2-STAKEHOLDER-FRICTION.md`), HF Scorecard (`docs/DELIVERABLE-3-HUMAN-FACTORS-SCORECARD.md`), Blindspot Register (`docs/DELIVERABLE-4-BLINDSPOT-REGISTER.md`), Shippability Audit (`docs/SHIPPABILITY-AUDIT-2026-11-05.md`). Statutory and aviation facts checked against CDC PHLP / Cal. Gov. Code § 8593.11 / Penal Code § 409.5 / FAA Part 107 waiver table / Part 108 status (proposed, not in effect) / Ready.gov & FEMA IPAWS / Cal. Gov. Code §§ 815, 820.2. Cal. Gov. Code § 855.6 is not a police/fire immunity and is not cited that way.*
