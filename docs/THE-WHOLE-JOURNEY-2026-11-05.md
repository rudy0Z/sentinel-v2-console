# Sentinel — The Whole Journey

**From the Escalation Slider to the crew deck. Every version, every kill, every survivor, every number.**
**Date:** 2026-11-05 · **Build at time of writing:** `0bdfc4c` · **Purpose:** live the whole thing again, in one place.

This is the document that lets you walk the entire project as it actually happened — including the versions that were wrong, the documents that lied, the decisions that were killed, and the few things that survived every rewrite. It is not a portfolio piece. It is the archaeology.

---

## 0 · How to read this

Four repos, one product.

| Home | What it was | When |
|---|---|---|
| `D:\portfolio porjects\portfolio final run` | HTML showcase case studies (Sentinel, Feul.AI, LokAI) — the first public story | Apr–Jun 2026 |
| `D:\portfolio porjects\flytbase` | The React “Spatial OS” prototype — 20 scenes, three map renderers, Rail v3, the vault | May–Oct 2026 |
| `D:\Downloads\Sentinel new version` | The rewrite that shipped: engine + scenario player + TALON constitution + console | Oct–Nov 2026 |
| `D:\Downloads\Mobile Devices\pdfs` | The theory load: Agentic Design, Ambient AI, Responsible AI, Systems Thinking, hiring playbooks | Sep 2026 |

Precedence when versions disagree: **the shipped console wins**, then the decision registers (`DECISIONS.md` in the old repo; `DESIGN.md` / `HANDOFF.md` / kill-list in the new one), then the vault, then the HTML case study. The HTML case study is the *story we told*. The old React repo is the *system we almost drowned in*. The new console is the *product that survived*.

A decision may appear in three generations. When it does, I mark it **SURVIVOR**, **MUTATED**, or **KILLED**.

---

## 1 · The through-line (if you read nothing else)

Every version was an attempt to answer the same three questions. The answers changed. The questions did not.

1. **What does the operator actually do?** Judge a proposed plan under time pressure, or pilot a fleet?
2. **What may the AI do without asking?** Anything, staged things, or only cited standing orders?
3. **What does the interface owe a person at 03:47?** More information, less information, or the *right* information at the *right* consequence?

The Escalation Slider answered (1) with “press a handle,” (2) with “the script fires,” (3) with “almost nothing on screen.” That was wrong.

The Spatial OS answered (1) with “walk 20 scenes,” (2) with “a constitution we sometimes faked,” (3) with “a beautiful instrument buried under four chrome generations.” That was closer, and it drowned.

The shipped console answers (1) with “AI prepares, human authorizes,” (2) with two tiers and a kill-list, (3) with a map that never moves, cards that exist only while a decision is open, and a deck that gets quieter as the fire gets louder.

The rest of this document is the receipts.

---

## 2 · Version archaeology (the timeline)

```text
2026 Q2        HTML showcase era
  │            Escalation Slider → rejected in the first case study
  │            Asha · 4 phases (Scan/Verify/Contain/Rescue) · 2s hold · TALON named
  │
2026 Q3        React Spatial OS (flytbase)
  │            20 scenes / 39 edges / 4 gated actions
  │            Intelligence → Operations two-phase model
  │            Three map renderers (2D SVG · 3D Explorer · hairline)
  │            TALON read-only · deriveTalonSurface() · Class 1/2/3 HITL
  │            Hash-language the system did not earn
  │            Vault 00–09 master plan · Rail v3 halt 2026-10-07
  │            Forensic audit 2026-09-29: “constitution real, trust narrative partly fabricated”
  │            Map ruled 2026-10-21: one world, three fidelities; hairline dead
  │
2026-10-21+    THE REWRITE (Sentinel new version)
  │            baseline f920ea1 · console + TALON + engine · verify 20/20
  │
  ├─ 35bfc12   design system v2 (Geist, violet, plan-state ladder)
  ├─ 7c3f5c1   surfaces v2 (TALON de-panelled: orb + cards + drawer)
  ├─ 2a599ec   journey v2 (contain-without-evac + falsepos + wui injects)
  ├─ d63e999   live-model adapter + truth guard
  ├─ 892f639   a11y (axe, 4 states)
  ├─ 829021d   One rebuild (edge pill rail)
  ├─ 4232c57   response pass (independent widgets, calm column)
  ├─ d2ef12f   a11y icon pass
  ├─ 4b99d20   e2e battery 31/31
  ├─ 4e90182   evidence export (SHA-256 that refuses to be a signature)
  ├─ e23ca67   sparklines + structures-at-risk
  ├─ ff763d5   tactile polish
  ├─ 1af1845   DEEP AUDIT (13 findings, kill-list, ADR-2/3)
  ├─ 3a8e96a   audit-fix (P0 budget-exempt, ack loops, OWNED/REQ)
  ├─ 81276ff   v2 master polish
  ├─ 2c64049…  final layer (record loop, ICS-205, mic, map-is-the-reply, epistemic)
  ├─ a6cfc66   design reviews + anatomy
  ├─ 7ea28eb   sign-off + avionics + layout explorations
  └─ d05b830…0bdfc4c   crew deck + sims + this audit session
```

---

## 3 · V0 — The HTML showcase (portfolio final run)

**What it was.** A long-form HTML case study (`sentinel-case-study.html` → v2) that *told* the product before the product existed. Asha Rao. Altadena / later Encinal. 90 seconds. 48-minute baseline. Four phases. Six decisions. Chaos set. Projected impact.

**What it got right — and what survived every later rewrite.**

| V0 decision | Fate | Where it lives now |
|---|---|---|
| Open with the scene, not the logo | **SURVIVOR** | Every case-study draft since. `CASE-STUDY-POINTERS.md` pointer 1. |
| 48 min vs 90 s as the founding contrast | **SURVIVOR, MUTATED** | Still the brief. No longer claimed as a *result*. NSM is a star; canonical run is 7:12. |
| Reject the Escalation Slider | **SURVIVOR** | The constitution’s first sentence. Kill-list #6: auto-execute on lapse. |
| AI proposes, operator approves, every time | **SURVIVOR** | Two-tier authority. Effects only in `Talon.answer()`. |
| Name the AI TALON; log TALON in one voice, operator in another | **SURVIVOR** | Five agents, `who: 'talon' \| 'operator'`, dissent verbatim. |
| Modal over the map, not a new screen | **SURVIVOR, MUTATED** | Map *is* the console. Card exists only while open. Furniture never moves. |
| Confidence % → show the reasoning | **SURVIVOR, MUTATED** | MEA/MOD/AUT + `why[]` + basis. Truth guard on invented numbers. |
| Density scales with urgency | **SURVIVOR, MUTATED** | Scan/Verify/Contain/Rescue died as *screens*. Reborn as deck L1/L2/L3 + ISA-18.2 + posture pill. |
| 2-second hold to authorize | **KILLED in the rewrite, mourned** | Class-3 hold lived only in legacy ActionBar (old-audit finding #2). New console uses keys 1–3 + 180 ms latch + STATUTORY GATE LOCKED. The *friction* moved from hold-time to authority-tier. |
| Team chips before Rescue | **KILLED as UI; SURVIVOR as concept** | ICS-205 bridge (Reyes / Vance / Cole / Lin). @-unit radio-to-text. Not pre-assigned chips. |
| LiDAR fallback when smoke kills the camera | **MUTATED** | One world, three fidelities (old repo ruling 4.1). New console: EO/IR feed + world model; satellite-loss is a feed note, not yet a full degradation ladder. |
| Voice “Change Plan” in the brief | **KILLED** | Kill-list #7: voice-first. Radio owns the channel. `V` is a shortcut, not a mode. |
| Override with pre-computed alternate | **SURVIVOR, MUTATED** | COA compare (route-a / route-b). Dissent. Not “TALON had both options ready” as a magic act — as priced columns. |
| Battery handoff: the one autonomous act | **SURVIVOR** | SO-3 failsafe at 8%. `battery` ask at 14%. The old two-column RECALLING/TAKING OVER card became a priced ask + standing failsafe. |
| Re-escalation as new event, never secret override | **SURVIVOR** | Re-raise past the operator, new evidence only. Silence ≠ approval. |
| ABORT always in the action bar | **MUTATED** | Go-live from the past. Stand down the mission on handoff. Not a persistent red button (red = life safety only). |
| Override rate 15–40% as the first instrument | **SURVIVOR** | Still the first metric I would instrument. F4 exists because the dissent trigger was too wide — the instrument would have caught it. |
| “FAA / liability / municipal protocols don’t accommodate ‘the AI decided’” | **SURVIVOR** | Legal Matrix 2026-11-04. OWNED/REQ. WEA never originated. |

**What V0 got wrong, and how we paid for it.**

- It *claimed* 90 seconds as a result (“46 minutes earlier”). The new case study refuses that arithmetic.
- It invented hash-chained confidence before a hash existed. The old React repo then *shipped fake hashes* (“RECEIPT · SHA-256 e62d93c8…” hardcoded). The new export computes a real SHA-256 and says **it is not a signature**.
- It designed chaos as a late chapter. The new product made failure a first-class journey (contain, falsepos, sat-loss, battery, correction, lapse).
- It used a 2-second hold as the signature friction, then the React repo shipped that hold only on the legacy bar. Two layouts, two safety envelopes. The rewrite killed the hold rather than ship it twice.

**V0 documents to re-read:** `sentinel-case-study-v2 (1).html` (the six decisions, the chaos set, the impact close). `CASE-STUDY-POINTERS.md` is the distilled survivor.

---

## 4 · V1 — The React Spatial OS (the flytbase repo)

**What it was.** A real system. Next/React, 20-scene state machine, TALON surface derivation, disagreement model, server with SQLite hash-chain + LLM gateway, three map renderers, Rail v3, a 78-doc vault. The most ambitious thing in the portfolio. Also the thing that proved a constitution can drown in its own surface area.

### 4.1 Identity (PRODUCT.md — still worth reading)

- Primary user: **Asha, operator on authority.** Decide whether incomplete evidence is strong enough to notify authorities; supervise without losing exceptions, assets, or TALON’s limits.
- Secondary: relief operator, regional commander (handover / escalation packet).
- Scripted portfolio prototype. No live drones, no production AI, no dispatcher testing.
- Brand: *precise, calm, accountable.* Not cinematic. Not a military-game HUD.
- Seven design principles that are still the product: one command picture · AI prepares, humans authorize · uncertainty is operational data · urgency reduces density · spatial state and panel state agree · every consequential action leaves a receipt · prototype claims stay honest.

**SURVIVOR set from V1 identity:** Asha, the two-phase intent (later stage-first), uncertainty as data, receipts, honesty boundary, 1920 target, WCAG AA, reduced motion, “no glowing orbs / neon / glass-card walls” (the anti-references — which we then spent v2 polish *earning* rather than performing).

### 4.2 The decision register (DECISIONS.md — the kill protocol)

The old repo’s best document was not a screen. It was a register that outranked every other doc. Status vocabulary: ACTIVE / SUPERSEDED / REJECTED / OPEN. Rule: a decision may not change without marking the old one SUPERSEDED.

**What it locked that the new console still obeys:**

| Old ID | Decision | New-console fate |
|---|---|---|
| 1.1 | Scripted portfolio prototype. No FlytBase API, no fire-trained model. | **SURVIVOR.** Exercise watermark on every scenario. |
| 1.3 | Honesty as *labelling* (measured / modeled / authored), not disclaimer of capability | **SURVIVOR.** MEA/MOD/AUT is the product’s signature. |
| 1.4 | Human authorization is structural. Staged actions expire; expiry is never execution. | **SURVIVOR.** Lapse sends nothing. Silence ≠ approval. |
| 1.5 | Tokens are the source of truth | **SURVIVOR.** Zero-raw-hex scanner. Three-tier tokens. |
| 2.1–2.3 | Cyan = TALON, amber = degraded, red = danger, teal = confirmed; fire-orange reserved for the fire | **MUTATED.** New: violet = TALON identity, amber = waiting on a human, red = life safety only, cyan = committed plan. Fire-orange still banned from chrome. |
| 2.4 | Warm console direction | **REJECTED then, rejected again.** Field High-Lux is a *lighting state*, not a warm-console revival. |
| 3.1–3.4 | v3 rails default; v2 and legacy behind flags | **KILLED.** The rewrite refused four chrome generations. One shell. |
| 4.1 | One world model, three fidelities; switching is a fidelity switch | **MUTATED.** `terrainEngine.ts` is one world. EO/IR is a feed, not yet the full ladder. Hairline is dead (no parallel renderer in the new repo). |
| 4.2 | Hairline is dead | **SURVIVOR.** The new repo never grew a second three.js. |
| 4.2b | Degradation ladder is a designed state, not an error | **PARTIAL.** Named as the differentiator; sat-loss is a feed note; offline is a toast. Still the biggest unfinished V1 idea. |
| 4.6 | Encinal Canyon, Malibu, USGS 3DEP + OSM | **SURVIVOR.** Same ground. |
| 5.1 | 20 scenes / 39 edges / 4 gated actions | **MUTATED.** The new journey is a stage graph (WATCH→RESOLVE) with authored edges as *data*, not a 20-scene enum. Contain and falsepos became first-class, not extra scenes. |
| 5.4 | Staged actions expire; expiry never executes | **SURVIVOR.** The constitution’s finest sentence. |
| 5.5 | Attention arbiter: one pop, runner-ups become badges | **MUTATED.** ISA-18.2 budget + orb + deck. The old `attention.ts` 19-check contract became the interrupt budget + life-safety exemption. |
| 6.1–6.2 | Gates green before any portfolio claim | **SURVIVOR.** 45 + 35. Same religion, new suite. |
| 7.1 | Every planning doc opens canonical / historical / exploratory | **MUTATED.** New repo used status lines, then stopped being as disciplined. This journey doc is the make-good. |
| 8.1 | Tablet recomposition deferred | **Still deferred.** Phones out of scope 2026-10-21. |
| 8.2 | FLIR PiP / IR-Ironbow not built | **PARTIAL.** IR feed exists; Ironbow as a designed IR *world* does not. |
| 8.5 | Live server undersold (Fastify + WS + SQLite + LLM gateway) | **MUTATED.** New adapter is client-side, key in localStorage, truth guard headless-verified, never smoke-tested against a real provider. The old server was more infrastructure and more risk. |

**Open questions V1 never closed (and where they went):**

| Old open Q | New-console answer |
|---|---|
| Q6 Where does TALON live? (centre bay / right console / quiet echo) | De-panelled. Orb + cards + drawer. Then deck. The question died when the furniture died. |
| Q7 Typography (IBM Plex vs “better fonts”) | Geist Sans + Geist Mono, self-hosted. Ruled 2026-10-26. |
| Q1 Which map renderer survives | One engine. `terrainEngine.ts`. The three-renderer war is over. |
| Q2 Hairline future or dead | Dead. Confirmed by absence. |
| Q3 Delete v2+legacy chrome? | The rewrite deleted them by not porting them. |

### 4.3 The vault (sentinel-v2-master-plan) — what the plan got right before the build drowned

The Sept 2026 vault is still the best *thinking* document set in the old repo. What it said that the new console eventually did:

- **04 TALON constitution:** LLM behind a state machine; hijacked model = “an odd sentence in the chat log.” New: truth guard + effects stripped + standing-without-citation dropped. The odd sentence is now a visible “Held by the truth guard.”
- **Three-tier HITL (Class 1 telemetry / Class 2 staged / Class 3 hold):** mapped onto the Consequence Ladder. New: standing / operator / life-safety. The hold died; the tiers didn’t.
- **01 Fire science:** NWCG, Rothermel, ICS-209, CAD. New: we refused Rothermel cosplay (kill-list #4). Self-similar growth + honest MOD tags. The old repo’s fire-science *reading* survived as humility, not as a model.
- **07 Eval harness:** prompt injection, refusal quality. New: `verify` live-model battery. Adversarial TALON still matters.
- **09 Orb identity:** “a Siri blob cannot show gates/lockouts.” New: the orb has a mood (calm / focused / alert / sheepish) and budget pips. Smaller, honest.

**What the vault got wrong:** it planned a Spatial OS so large that four chrome generations coexisted, 7,400 LOC became unreachable, and the most-polished TALON surface (`TalonCopilotPanel`, 72.9 KB) was not the live UI. The Sept 29 forensic audit is the autopsy.

### 4.4 The Sept 29 forensic audit — the first honest mirror

Read this if you read one old document. Verdict in one line, still true as a warning:

> Sentinel is a genuinely strong interaction architecture wrapped in a trust narrative that is partly earned and partly fabricated — and the fastest way to raise the portfolio ceiling is to delete the fabricated half and close the structural bypasses.

**The three sins it named, and where they are now:**

| Sin | Then | Now |
|---|---|---|
| Authority-packet `gate-none` bypass | `operator.authorities-notified` flipped the “sent” flag; server hash-chained it | Contain arc: report is a *gated ask*. Lapse sends nothing. Ack is scripted received state, not a write of `sent=true`. |
| Class-3 hold only on legacy ActionBar; v2 Command Deck = plain click | Two layouts, two safety envelopes | One shell. Keys 1–3. No second layout. |
| Fake crypto (“SHA-256 e62d93c8…”, “Cryptographic Receipt AUDIT-8842”, hardcoded PIN as “cryptographic transfer”) | Violated the repo’s own honesty boundary | Real SHA-256 of the JSON. Copy: *not a signature and not legal attestation.* Kill-list #8: never inflate. |

**Also true then, still true as a caution:** the most-polished surface was on the non-default path. The rewrite’s first ruling was: one shell, or nothing ships.

### 4.5 Rail v3 (2026-10-07) — the halt that predicted de-panelling

The v3 handoff picked One-style collapsed rails + peek language + gooey morphs, built domain + components, and *halted before wiring*. Interrupt budget ≤2/10 min was already in the spec. “Left never auto-opens.” “Orb is the interrupting surface; dots/peeks are badges.”

That halt was the beginning of de-panelling. The new surfaces v2 (orb + cards + drawer) is Rail v3’s intention without the goo. **MUTATED SURVIVOR:** the budget, the “left never auto-opens,” the orb-as-interrupt. The peek/goo died with the React shell.

---

## 5 · V2 — The rewrite (Sentinel new version)

### 5.1 Baseline (`f920ea1`) — what “as received” meant

Console + TALON copilot + engine, verify 20/20. The decision was not “improve the React repo.” It was “leave.” Take the constitution, the honesty boundary, Encinal, Asha, and the verification religion. Leave the four chromes, the three renderers, the fake hashes, the 7,400 unreachable LOC, the server that hash-chained a bypass.

That leave-taking is the most important design decision in the project. It does not appear in a Figma file.

### 5.2 Design system v2 (`35bfc12`)

Self-hosted Geist (no CDN). Violet `#9B8AFF` as TALON identity. Plan-state ladder as tokens mirroring the engine palette. Accent-bar cards (halo frames gone). Lighter glass. `tokens.html` as the live sheet.

**Old → new colour law:**

| Role | V0 / V1 | Shipped |
|---|---|---|
| TALON | cyan | violet (identity); cyan reserved for committed plan |
| Waiting on human | mixed | amber (`--needs`) |
| Life safety | red for many things | red **only**; mic, pips, LIVE, low-battery re-tokenized off red |
| Degraded | amber | amber for needs; degraded feeds use capability+consequence+recovery copy |
| Confirmed | teal | done / committed geometry |

Q7 (typography) closed here. IBM Plex died in a drawer.

### 5.3 Surfaces v2 (`7c3f5c1`) — TALON de-panelled

This is the kill of Q6. Persistent panel → orb (always) + decision cards (while open) + drawer (on demand). Timeline replay-only. Stage-first board. Posture pill.

The old four-phase Scan/Verify/Contain/Rescue *screens* died here. The information-contract idea (urgency reduces density) did not — it became the deck, the budget, and the posture pill.

### 5.4 Journey v2 (`2a599ec`) — contain and falsepos become first-class

The old repo had 20 scenes including source-conflict, contain-awaiting-teams, rescue-partial-evac, handoff-pending. The rewrite refused 20 scenes as a tour. It shipped three authored arcs that *mean* something:

- **wui-breakout** — the 90-second fantasy, then the road cuts.
- **contain** — no evacuation; authority still notified; CAD queues the dozer.
- **falsepos** — the dismissal is the save.

Plus injects: source conflict, battery handover, satellite loss. Network degradation and route-blocked stayed designed-not-authored (still true).

This is where V0’s “chaos set” stopped being a chapter and became the journey.

### 5.5 Live-model adapter (`d63e999`)

“A reasoner strapped to a constitution.” Read/propose only. Truth guard: execution claims, impersonation, uncited dispatches, invented numbers (token-level, “47” ≠ “247”). Key in localStorage. No key → scripted, unchanged.

Old vault 04’s dream, minus the server, minus the fake hashes, plus a visible hold. Never smoke-tested against a real provider (still true — `LIVE-API-READINESS.md`).

### 5.6 One rebuild (`829021d`) and the response pass (`4232c57`)

TALON as edge pill rail — full-height panel deleted. Then: independent widgets, calm left column, per-widget collapse, exercise/autopilot into a dev menu, map tools bottom-right, mic tri-state, operator block, S-id navigator.

The One-style rail from Rail v3 finally shipped, lighter. Then the crew deck would demote it again. Presence without furniture is a loop: panel → rail → orb+deck. Each iteration smaller.

### 5.7 e2e + export + polish (`4b99d20` → `ff763d5`)

31/31 journeys including lapse, dissent, monitor, failsafe, inject-boundary, zoom, viewport. Evidence export: JSON+MD, real SHA-256, labelled an integrity digest. Battery sparklines, structures-at-risk from the live field, field shake on refusals, film grain, metal wordmark.

The old “ Cryptographic Receipt AUDIT-8842” died here, replaced by a number you can recompute and a sentence that refuses to oversell it.

### 5.8 Deep audit (`1af1845`) and audit-fix (`3a8e96a`)

Three lenses (design engineer, operator, TALON) + interaction contract. 13 findings. Kill-list formalised. ADR-2/3 content proposed. Then the surgical fix:

- P0 life-safety interrupts exempt from the budget (ADR-1 partial)
- Closed-loop acks on WEA, lapses, re-raises (ADR-3 partial)
- OWNED vs REQ pills on evacuation/CAD gates
- Q/W/E doctrinal dissent chips
- WGS84 + Ask-TALON in the inspector
- Cross-incident refs
- ICS-201 transfer brief in the export

**F1–F13 born here.** F1 (note-kind interrupts have no card) is *still open* as of the crew-deck build. The issued banner that shipped in the same-day fix is a different problem and must not be confused with F1.

### 5.9 Final layer (`2c64049` → `798ae1b`)

Record loop (the brief’s cold start: boots inside S-04, preempted by S-05, bookmark, resume). ICS-205 command bridge (Reyes DIV-ALPHA, Vance SH-12, Cole AA-07, Lin COUNTY OES) with Hail and Push to TAK. Tri-state mic. Map-is-the-reply (spatial brushing, MOD-vs-MEA, map-verb receipts). Epistemic adds: fragility lines, Δ-since-last-decision, PLAN DRIFT.

This is V0’s chaos set, v1’s disagreement model, and the brief’s “operator reviewing earlier footage,” finally in one shell.

### 5.10 Design reviews, anatomy, sign-off (`a6cfc66` → `7ea28eb`)

Eight-lens design-review synthesis. Ten-sheet anatomy (the old repo never had a dimensional drawing set; it had four chromes). Walkthrough sign-off 17 items. Avionics pass (tether, time lens, ground probe). Layout explorations A/B/C — A (Crewed Deck) picked as a *direction*, then the shipped deck arrived as an evolution, not the full seated-colleague rebuild.

SIGN-OFF 6b (both-open occlusion) failed, then V3 parked the tools left and the collision class died. Mic verify flaked, then R3 settled 45/45.

### 5.11 Crew deck (`d05b830` → `0bdfc4c`) and this session

Three information layers. Mission taxonomy. Walker’s five findings fixed live. Operator sim (18 findings). TALON’s own account. Contain / small-incident / calm / adversarial evidence. Feed-wing yields. Attention means needs-you.

Then the 2026-11-04 audit (Legal Matrix, Stakeholder Friction, HF Scorecard, Blindspot Register) and the 2026-11-05 shippability re-audit (verify 45/45, e2e 35/35, T+116 probe: F1 still open, Egress says “clear” at the cut, RECEIPT PENDING forever, tools parked left).

---

## 6 · Comparison tables — the same problem, every version

### 6.1 Authority: who may do what

| Version | Model | Execution path | Silence | Dissent |
|---|---|---|---|---|
| **V0 HTML** | TALON handles fusion/routing/modeling; Asha authorizes dispatch / confirm / contain / evac guidance | 2s hold; slider rejected | Unspecified (later: re-escalate as new event) | Override pills + reason logged so “future recommendations can learn” |
| **V1 React** | Class 1 telemetry / Class 2 staged / Class 3 hold; 4 gated actions; 39 edges with guards | CommandTile hold → handleAction → modal **on legacy only**; v2 deck = plain click | Staged expiry back to watch (implemented late / partly) | `requiresDissent` on edges; disagreement.ts; contested-watch scene |
| **Shipped** | `standing` (must cite SO/run card, else dropped) + `operator`. Life-safety P0 budget-exempt. Model items stripped of effects, demoted from interrupts. | `Talon.answer()` only. Typed text refused. Keys 1–3. 180 ms latch. Issued banner → ack. | Lapse: nothing sent; escalate to supervisor. Verified wui + contain. | Verbatim both positions; re-raise new-evidence only, routed past the operator. **Trigger still too wide (F4).** |

**Survivor across all three:** expiry is never execution. The slider died so that this sentence could live.

**Killed:** Class-3 hold as the signature friction; fake crypto receipts; gate-none bypass; two layouts with two envelopes; “future recommendations learn from overrides” (kill-list: no operator-reliability scoring).

### 6.2 TALON surface

| Version | Surface | Voice | Memory | Guard |
|---|---|---|---|---|
| V0 | Named partner; cyan log entries; voice Change Plan | Confident narrator | Implicit | Audit trail as a story |
| V1 | Persistent panel (legacy) / Command Deck (v2) / Rail v3 dots+peek (unwired) / `deriveTalonSurface()` crown jewel | Authored briefs + microcopy; read-only | Session engine; reconciliation memory planned | Eval battery; server truth-guard; surface-truth validator |
| Shipped | Orb + cards + drawer + deck curation + five agent lamps | Scripted items in situation JSON; optional live model behind the same runtime | **No memory.** Function of (situation, scene time, decisions). Scrub-restores exactly. Agency priors are *asked for*, not learned | Truth guard on words; effects stripped; standing needs a citation; `message_unit` leak named |

**The V1 crown jewel survived as an idea:** one derivation, never disagreeing surfaces. The new `talon.state()` is that idea without the React.

**The V1 dream that is still a dream:** inspectable, versioned agency priors (TALON ask #1). ADR-2.

### 6.3 Map

| Version | Geography | Renderers | Degradation | Honesty |
|---|---|---|---|---|
| V0 | Altadena then Encinal; 3D reality + 2D intelligence | Storyboard | LiDAR fallback; yellow/amber/red infra grades | Cinematic |
| V1 | Encinal, USGS+OSM; 3.5 MB PNG basemap; two disagreeing fire geometries; hairline twin | 2D SVG (gated) · 3D Explorer (ungated) · hairline (orphan) | Ruled: EO → IR → world model; never built as shipped ladder | PNG pixelates; landuse baked never drawn |
| Shipped | Encinal, USGS 3DEP + OSM + ESA; one `terrainEngine` | One WebGL engine, ≤20 draw calls, idle 0 GPU | Offline toast; sat-loss feed note; EO/IR feed; no full ladder | Real ground, invented fire, provenance on layers |

**Killed:** hairline; PNG basemap; three-renderer war; FireTrace-as-day-product envy (High-Lux is a lighting state).

**Still owed from V1 ruling 4.2b:** the degradation ladder as a designed state. It is the old product’s differentiator and the new product’s biggest unfinished idea.

### 6.4 Attention & cognitive load

| Version | Interrupt model | Density | Furniture |
|---|---|---|---|
| V0 | Phase-gated actions; modal | 120 elements → urgency strips prose | Full-screen then modal then panels |
| V1 | Attention arbiter (one pop, badges, log); INTERRUPT_BUDGET ≤2/10 in Rail v3 spec | Urgency reduces density (principle 4) | Four chromes; deck 88px; orb 64px; rails |
| Shipped | ISA-18.2 {2, 10 min}; excess demoted + logged; P0 exempt; card *is* the interrupt; PTT holds non-P0 chimes | Deck L1 58px one glance; L2 panels; L3 verbs; 10.5px data-ink floor ruled | Map never moves. Ever. |

**F1 is the attention debt every version owed and none paid in full.** V0 put the cut in a chaos chapter. V1 had an arbiter. The shipped console chimes and serrates the orb and still, at T+116, tells the Egress glance to say “clear.”

### 6.5 Failure states

| Failure | V0 | V1 | Shipped |
|---|---|---|---|
| False positive / permitted burn | Mentioned as risk in “why human stays in loop” | Source-conflict scene | `falsepos` arc; G1; S-04 cited by S-05 |
| Contain without evac | Not the demo | Scenes existed | First-class `contain` arc; CAD queues dozer |
| Source conflict | — | Dedicated scene + pause | `conflict` card; proceed-on-IR on record |
| Battery | Two-column handoff card; “one moment TALON acts” | — | `battery` ask + SO-3 failsafe at 8% |
| Model error / correction | — | — | Sheepish correction at T+89; both projections; PLAN DRIFT |
| Satellite / feed | LiDAR; yellow/amber/red infra | Degradation ladder *ruled*, not built | `satloss` feed note; confidence drops; no ladder |
| Network / C2 | 340ms yellow → satellite amber → full-screen radio protocol | — | Offline/online toast. **Regression from V0.** |
| Road cut | — | — | Life-safety note; F1; Egress glance lies “clear” |
| Silence / lapse | Re-escalate as new event | Expiry back to watch | Nothing sent + supervisor + “not issued” in Review |
| Secret override | Rejected | — | Kill-list #6. Never rebuilt. |

### 6.6 Metrics, honestly

| Claim | V0 | V1 | Shipped |
|---|---|---|---|
| 48 → 90 s | Claimed as the product result (“46 minutes earlier”) | Vault: 15–25 min → 90 s defensible first escalation | North star only. Canonical run 7:12. Review can say “not issued.” |
| Override rate 15–40% | First instrument | Planned | Still first instrument. Not measured (no real operators). F4 would pollute it. |
| Gates | None | 7-gate suite, 25 flows, 23 routes, 20 scenes | 45 verify + 35 e2e. 0 console errors on the canonical sim. |
| Hash / crypto | Story | Hardcoded fakes | Real digest, refused as a signature |
| Draw calls / idle | — | ≤12–19 draws; 0 FPS idle claimed then made provable | ≤20 draws; motion off = 0 frames (verify) |
| Contrast | Unspecified | WCAG 2.2 AA target; 11px floor | AA measured (dark 5.36, day 5.99); 10.5px data-ink *ruled* |
| Fleet 1:N | — | Implied | Sheet 10 illustration 1:15–25 — business claim, not HF result |

### 6.7 What died, and the reason

| Killed | Version of death | Why it had to die |
|---|---|---|
| Escalation Slider | V0, in the first case study | A gesture is not a decision |
| Warm console | V1 2.4 | Owner rejected; High-Lux is lighting, not a revival |
| Hairline renderer | V1 4.2 | Parallel three.js, no gate, three self-contradicting docs |
| PNG basemap | V1 4.2d | Cannot carry live state |
| Four chrome generations | Rewrite | The most-polished surface was unreachable |
| Fake hashes | Rewrite / deep audit | Honesty boundary |
| Class-3 hold as the only friction | Rewrite | Two envelopes; replaced by tier + refusal, not by a hold |
| Persistent TALON panel | Surfaces v2 | Furniture; baseline load; Q6 |
| Process wizard / phase strip | Posture-pill ruling | Operator follows the incident |
| Voice-first | Kill-list #7 | Radio owns the channel |
| In-console duty view | Kill-list #1 | Different user |
| Operator scoring from dissent | TALON’s own refusal | The box becomes a performance review |
| Post-hoc dissent editing | Kill-list #11 | Verbatim means verbatim |
| Counterfactual what-if replay | Kill-list #5 | Hindsight-poisoned second record |
| Auto-execute on expiry | Kill-list #6, every version | The constitution |
| Rothermel cosplay | Kill-list #4 | Exercise frame; MOD tags already carry it |
| 2s hold (as shipped friction) | Rewrite | Lived only on legacy; the tier is the friction now |
| Team chips / free-text evac form | Rewrite | ICS-205 + @-path instead |
| IBM Plex / JetBrains | Design system v2 | Geist, self-hosted |
| Cyan = TALON | Design system v2 | Cyan = committed; violet = TALON |
| Red for mic/live/low-batt | Red discipline | Red = life safety only |
| Phones | HANDOFF 2026-10-21 | Out of scope; trailer is a different product |

---

## 7 · The PDF load — where the theory actually landed

The extracted playbook (`extracted_content.md`) was not decoration. These are the frames that survived contact.

| Frame | Source | Where it landed |
|---|---|---|
| Levels of Agency (0–5) | Agentic Design p.4 | Product lives at 3–4. Slider was a Level-5 fantasy. Panel was Level-2 chatter. “Never” column in the authority popover is the documented ceiling. |
| Consequence Ladder | Agentic Design p.11; also Conversational AI | Class 1/2/3 → standing / operator / life-safety. Chat cannot authorize. Hold died; the ladder didn’t. |
| Sense–Plan–Act–Observe–Learn | Agentic loop p.6 | TALON is a function of (situation, t, decisions) — *no learning between incidents* by design. Learn is ADR-2 (authored priors), not latent memory. |
| Intent Design | Agentic p.7; Ambient p.5 | Operator intent at 03:47 is “judge this, here,” not “see a new screen” and not “chat.” Cards + map-is-the-reply. |
| Glanceable UI / interface becomes less visible | Ambient p.6 | Crew deck L1. The 2026 AI-native move. |
| Bounded Autonomy | Responsible AI p.7 | Tool shelf with the dangerous tools missing. `message_unit` is the leak. |
| Designer’s 5 Questions (who acted / basis / saw / refused / reverse) | Responsible AI p.3 | Issued banner + ack + dissent + provenance + go-live. F1 breaks “what did they see” at the cut. |
| Design States, Not Screens | Systems Thinking p.9 | One map; posture pill; cards while open; deck states. The wizard died so this could live. |
| Consequence Rule | Systems Thinking p.7 | Dissent box warns the words go on the record. Free text cannot authorize. |
| JTBD | Systems Thinking p.4 | Written in the case-study kit: “when a heat tick lands at 03:47 and I am on another zone…” |
| Stop showing only the happy path | Hiring playbook p.5 | F1, contain, falsepos, the miss in the case study. |
| Double-diamond fails | Hiring playbook p.4 | “I stopped trying to write a double-diamond and started writing a constitution.” |
| Connect design to engineering reality | Hiring playbook p.8 | 45+35 gates. Red-discipline parser. Zero-raw-hex. |
| New UX metrics (2027) | Conversational playbook p.4 | Override rate, trust calibration, time-to-ack, reading floor — not DAU. |
| STAR stories, not 100 questions | Meta interview p.7 | The case study is one STAR: scene, task (constitution), action (four moves), result (honest numbers + open F1). |

---

## 8 · Every metric in this session, in one table

**Exercise / canonical (wui-breakout, 8 decisions, 0 console errors)**

| Metric | Value | Basis |
|---|---|---|
| Detection → confirmed | 2:00 | `talon.review()` |
| Detection → plan proposed | 6:00 | same |
| Detection → evacuation order | 7:12 | same; vs 38-min authored baseline |
| Median time to decide | 0:51 | 8 operator decisions |
| Projection error caught | 14 min | `correction.metric.errorMin` |
| Auto-executions on lapse | 0 | e2e W3, C1 |
| False dispatch on falsepos | 0 (trained) | G1 arc |
| ISA-18.2 budget | 2 / 10 scene-min | `talon.ts:41` |
| P0 exempt from budget | yes | ADR-1 partial |
| Statutory ack window | ~18 scene-s (0.05–0.3) | scripted `ack.after` |
| Reach on P-1 | 37+345 households · WEA ≈ 917 devices · reverse-911 ≈ 172 lines | authored |
| Geofence check | no spill beyond 150 m | authored check |
| TFR | UAS floor < 150′ | map label, not a hard layer |

**Gates (2026-11-05, this machine)**

| Suite | Result |
|---|---|
| `node tools/verify.mjs` | 45/45 |
| `node tools/e2e.mjs` | 35/35 |
| Independent T+116 probe | 0 page errors; F1 confirmed open |
| axe | 0 violations on standby / card / drawer / review (panel+wing not yet in battery) |
| Contrast dark / day | min 5.36 / 5.99 (AA 4.5) |
| Draw calls at rest | ≤20; motion off = 0 frames |
| Deck height | 58 px (was 204 px strip) |

**Historical gate counts (the climb)**

20 → 21 → 27 → 30 → 32 → 34 → 35 verify; e2e 31 → 32 → 34 → 35. Old repo: 25 flows, 23 routes, 20 scenes, 9/9 map.

**Sim findings (operator report)**

18 total; 6 fixed live (receipt, stale gate glance, feed host, buried structures, attention dilution, comms vanish); open: panel scrollbar, authority popover probe, T+ stamp wording, report-gate countdown, F1.

**Legal Top-10 (2026-11-04)** — all still open as *product* gaps; not closed by the deck.

1. Unnamed RPIC / BVLOS in a TFR  
2. Non-statutory operator authorizing evac/WEA  
3. WEA as banner, not origination  
4. `message_unit` unguarded  
5. Export is not a record  
6. Dissent-as-exhibit  
7. Speaker over public without § 107.39  
8. “Mandatory evacuation” + hardcoded A. Rao  
9. Live model never smoke-tested; key in localStorage  
10. Exercise vs live dual use  

**HF scorecard (2026-11-04, re-scored after deck)**

Pass 14 → 15 · At-Risk 15 · Fail 9 → 8. Still fail: F1 inattentional, circadian, vigilance, prospective memory (F2), interruption recovery for notes, team SA, SA L2 across agencies, multi-zone Miller.

---

## 9 · The document map (what to re-read, in order)

If you want to live the journey through the artifacts rather than this summary:

**V0 story**  
`portfolio final run/sentinel-case-study-v2 (1).html` — six decisions, chaos set, the close.

**V1 constitution before it drowned**  
`flytbase/PRODUCT.md` · `flytbase/DECISIONS.md` (the kill protocol) · `flytbase/docs/audit-2026-09/00-MASTER-AUDIT.md` (the first honest mirror) · `flytbase/HANDOFF-2026-10-07.md` (Rail v3 halt) · `flytbase/SPEC.md` §1.1 (map ruling) · vault `00` and `04`.

**V1 thinking that the rewrite refused to carry as code and kept as caution**  
`flytbase/docs/redesign-2026/00-validation-and-direction.md` · vault `01` fire science · vault `07` eval harness · `docs/decision-defense/PRODUCT-DECISION-DEFENSE.md`.

**Shipped constitution**  
`DESIGN.md` · `DIRECTION-2026-10-25.md` · `docs/HANDOFF.md` · `talon.ts` header comments · kill-list in `docs/DEEP-AUDIT-2026-10-27.md` §7.

**Shipped audits**  
`DEEP-AUDIT-2026-10-27.md` · `AUDIT-SIGN-OFF-2026-11-02.md` · `AUDIT-E2E-2026-10-26.md` · `docs/design-reviews/00-SYNTHESIS.md` · anatomy 01–10.

**This session**  
`DELIVERABLE-1` Legal · `DELIVERABLE-2` Stakeholders · `DELIVERABLE-3` HF scorecard · `DELIVERABLE-4` Blindspots · `SHIPPABILITY-AUDIT-2026-11-05.md` · `FOUNDER-LAUNCH-BRIEF-2026-11-05.md` · `PD-LAST-MILE-2026-11-05.md` · `CASE-STUDY-KIT-0YOE-2026-11-05.md` · `CASE-STUDY-SENTINEL-2026.md` · `SIM-REPORT-OPERATOR.md` · `SIM-REPORT-TALON.md` · `LIVE-API-READINESS.md` · `layout-explorations/DIRECTION.md`.

**Theory**  
`pdfs/extracted_content.md` — Agentic 7 pillars + 8-step framework; Ambient glanceable; Responsible AI 5 questions; Systems Thinking design-states; hiring playbook anti-double-diamond.

---

## 10 · Decision-by-decision: the long comparison

Every load-bearing decision, all generations, one table. **S** = survivor, **M** = mutated, **K** = killed.

| Decision | V0 HTML | V1 React | Shipped | Status |
|---|---|---|---|---|
| Open with the scene | 03:47 Altadena | Encinal | 03:47 Encinal, night epoch | S |
| 48 vs 90 | Claimed result | Vault 15–25 → 90 | Star vs 7:12 exercise | M |
| No slider / no macro | Rejected in the essay | State machine | `answer()` only | S |
| Name the copilot | TALON | TALON | TALON, five lamps, a mood | S |
| Provenance | “show the reasoning” | mea/mod/authored labelling | MEA/MOD/AUT + truth guard | S |
| Map does not reflow | Modal over map | Four chromes fought this | Constitutional | S |
| Density ∝ urgency | Phase density | Principle 4 | Deck + budget + posture | M |
| Hold-to-authorize | 2s hold | Legacy only | Killed; tier + refusal | K/M |
| Silence ≠ execution | Re-escalate as new event | Expiry to watch (late) | Lapse sends nothing | S |
| Dissent on the record | Override reason “so it can learn” | requiresDissent + disagreement.ts | Verbatim; no learning from it; F4 trigger | M |
| Battery autonomous handoff | Two-column card | — | SO-3 + priced ask | S |
| Degradation ladder | LiDAR + yellow/amber/red | Ruled, not built | Toast + feed note | Owed |
| Resident / public | “activate drone guidance” | — | 917 devices; no lock-screen | Gap |
| Field / ATAK | Team chips | Ground teams panel | One-way TAK + Hail | M |
| Crypto honesty | Story | Fake hashes | Real digest, refused | S |
| One world model | 3D+2D story | Ruled 4.1, three renderers still on disk | One engine | S |
| Hairline dies | — | Ruled dead | Never ported | S |
| Tokens rule | — | audit:tokens | Zero-raw-hex scanner | S |
| Gates before claims | — | Golden rule 4 | 45+35 before any “shippable” | S |
| No duty view in this console | — | 20-scene tour | Kill-list #1; registry refused as in-console | S |
| No voice-first | Voice Change Plan | Voice sims | `V` shortcut; radio owns | K→S |
| Phones deferred | Desktop only | Deferred | Out of scope 2026-10-21 | S |
| Encinal, not Altadena | Altadena then Encinal | Encinal | Encinal | S |
| Asha / A. Rao | Asha Rao | Asha | Hardcoded A. Rao (F6) | S as persona, gap as party |
| Supervisor exists | Implicit | Escalation packet | String `reraise.to` (F6) | M |
| ICS forms | — | ICS-209 debrief planned | ICS-205 bridge; ICS-201 narrative in export | M |
| Record loop / replay | Review tab imagined | Debrief replay `[NEXT]` | P1 record loop shipped | S |
| Map-is-the-reply | — | — | P4 shipped | New |
| Plan Drift | — | — | P5 shipped | New |
| Life-safety budget exempt | — | — | ADR-1 partial | New |
| OWNED / REQ | “authorities notified” flag | Packet send | Gate-face pills + ack | M |
| Crew deck | Phase density | Deck 88px | L1/L2/L3 58px | M |
| Tools never occluded | — | 6b fail | Parked left; collision class dead | New |
| 10.5px floor | — | 11px preferred | Ruled stay | M |
| Geist | — | IBM Plex open Q7 | Geist | Closed |
| Violet TALON | cyan | cyan | violet `#9B8AFF` | M |
| Red discipline | red for many | red = danger | constitutional + parser | S/M |
| No operator scoring | — | “learn which proposals operators correct” | TALON refuses | K |
| No Rothermel | — | vault 01 Rothermel | self-similar + MOD | K as model, S as humility |
| Live LLM | — | Gemini/Sonnet gateway + SQLite | Client adapter, no key = scripted | M |
| Key storage | — | server | localStorage (demo) | regression vs server, honest for prototype |
| Exercise watermark | “not a concept” | PRODUCT.md honest | every scenario disclaimer | S |

---

## 11 · What survived every generation (the actual product)

If you stripped every repo and kept only what all four eras agree on, you would keep this:

1. **Asha / the operator on authority** — a trained human, night shift, not a pilot.
2. **The 03:47 founding scene** and the 48-minute baseline as *contrast*, not as a result.
3. **TALON as a named, logged, non-executing partner.**
4. **A human gate on everything that leaves the building** (dispatch, notify, evac, amend).
5. **Expiry is never execution.**
6. **The map as the place the decision happens**, not a screen you leave.
7. **Uncertainty is operational data** (conflict, staleness, missing, model error).
8. **Failure is part of the product** (false positive, contain-without-evac, battery, correction).
9. **Encinal Canyon as the ground.**
10. **Honesty about the prototype** — labelling, not disclaiming; a digest that refuses to be a signature.
11. **Verification as the design system’s police.**
12. **The kill-list.** Knowing what not to build is the senior signal the hiring playbook said would get you hired.

Everything else — rails, panels, holds, hashes, 20 scenes, three renderers, the slider, the wizard, the sidebar — was scaffolding. Some of it was beautiful. None of it was the product.

---

## 12 · Open items carried from every era (the honest ledger)

**Owed to V1 (ruled, never fully built)**
- Degradation ladder as a designed state (EO → IR → world), not a toast.
- Cartographic furniture as authority (graticule, compass, live scale — partial in the new engine).
- Full ICS-209 debrief model (ADR-2).
- Party model for supervisor / relief (ADR-3) — ack loop is partial.
- Tablet / trailer recomposition.
- IR as a *world* (Ironbow), not only a feed.

**Owed to V0 (designed in the story, missing in the seat)**
- F1: the cut must reach a heads-down operator.
- Resident lock-screen (the fleeing public is not 917 devices).
- Full-screen radio protocol on total infra loss (V0 had it; V3 has a toast).
- Field two-way (team chips died; ATAK is one-way).

**Owed to this session (found in the shipped build)**
- F2 silent expiry of ungated asks.
- F3 `message_unit` gated or killed.
- F4 dissent trigger narrowed.
- F6 supervisor as a party; operator not hardcoded.
- F7 scene-min vs wall-min labelled.
- F9 boot in a11y tree; F10 keys 1–9; F11 evac chip; F12 dead `truncateThread`.
- RECEIPT PENDING forever on the T+93 WEA update.
- Egress glance cannot say “clear” at the cut.
- axe on deck panel + wing.
- Doc sync (HANDOFF/README 44 vs 45; anatomy still drawing the retired dock).
- `.seg` name collision.
- Real-key smoke test of the adapter.

**Owed to the legal/founder frame (if this ever leaves the exercise)**
- Named RPIC, authorization id, Remote ID, TFR as a hard layer.
- WEA never originated by the vendor; authorized official as a party.
- Authenticated operator; no key in localStorage; append-only record with custodian.
- Exercise/live interlock.
- Speaker-over-public never a standing order.

---

## 13 · The case-study through-line (how to tell this to a recruiter)

Do not tell them you shipped 90 seconds. Tell them this:

> I designed the same product four times. The first time I designed a slider that fired a macro, and I wrote the case study that killed it. The second time I designed a 20-scene React instrument with a real constitution and fake hashes, and an audit told me the trust narrative was partly fabricated. The third time I left that repo, took the constitution, and shipped a console where the AI cannot execute, silence cannot approve, and every number admits where it came from. The fourth time I audited that console as a lawyer, a human-factors scientist, and a product designer — and put the misses in the case study. The thing that survived every version was not a screen. It was a refusal: the AI prepares, the human authorizes, expiry never executes, and the record does not lie about who decided.

That is the journey. The crew deck is the latest furniture. The constitution is the product.

---

## 14 · Appendix — complete artifact index

**Shipped console (this repo), documents**

HANDOFF.md · DESIGN.md · DIRECTION-2026-10-25.md · README.md · CASE-STUDY-POINTERS.md · DEEP-AUDIT-2026-10-27.md · AUDIT-E2E-2026-10-26.md · AUDIT-SIGN-OFF-2026-11-02.md · anatomy 01–10 + index · design-reviews 00–10 · SIM-REPORT-OPERATOR.md · SIM-REPORT-TALON.md · LIVE-API-READINESS.md · layout-explorations/DIRECTION.md · DELIVERABLE-1–4 · PRODUCT-DESIGN-AUDIT-INDEX.md · SHIPPABILITY-AUDIT-2026-11-05.md · FOUNDER-LAUNCH-BRIEF-2026-11-05.md · PD-LAST-MILE-2026-11-05.md · CASE-STUDY-KIT-0YOE-2026-11-05.md · CASE-STUDY-SENTINEL-2026.md · this document.

**Shipped console, code (load-bearing)**

`terrainEngine.ts` · `scenarioPlayer.ts` · `talon.ts` · `talonAgent.ts` · `commandConsole.ts` · `console.css` · `data/scenarios/{standby,small-incident,contain,falsepos,wui-breakout}.json` · `tools/verify.mjs` · `tools/e2e.mjs` · `tools/encinal-scenario.mjs`.

**Old repo, the ones that still matter**

DECISIONS.md · PRODUCT.md · SPEC.md · MAP-BRIEF.md · PORTFOLIO-DIRECTION.md · HANDOFF-2026-10-07.md · `docs/audit-2026-09/00-MASTER-AUDIT.md` · vault 00, 01, 03, 04, 07, 09, 10, 12–14 · redesign-2026 00, 07, 14-rail-v3 · `docs/decision-defense/PRODUCT-DECISION-DEFENSE.md` · `docs/case-study-research/*` · `src/app/domain/stateMachine.ts` · `talonSurface.ts` · `attention.ts` · `disagreement.ts` (the ideas, not the LOC).

**V0 showcase**

`sentinel-case-study.html` · `sentinel-case-study-v2 (1).html` · `sentinel-overview-v7.html` · Feul / LokAI (the siblings that proved you can close a case study; Sentinel is the one that would not close).

**Theory**

`pdfs/extracted_content.md` (12 PDFs, 108 pages) — Agentic Design · AI Landscape · Ambient AI · Conversational patterns · Responsible AI · Systems Thinking · Meta interview · Hiring playbook.

---

*Written 2026-11-05, after the crew-deck sims, after the legal/HF/founder audits, after the T+116 probe. Verify 45/45. e2e 35/35. F1 open. The constitution holds. The road cut still cannot reach a heads-down operator. That is the next commit — and it is the same commit this product has been trying to ship since the slider died.*
