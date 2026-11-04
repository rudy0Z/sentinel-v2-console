# The last mile — what a 2026–27 Staff PD is still expected to cover

**Date:** 2026-11-05 · **For:** Sentinel / FlytBase Design Fusion S3 · **Posture:** peer PD, not counsel.

The 2026–27 bar for a life-safety AI console is not “more screens.” It is: **systems thinking, AI-native honesty, designed refusal, and a case study that survives an interviewer who has read the brief.** You have already cleared most of that bar. This is the remaining sweep — what to fix this week, what to spec as an artifact, and what to **cover by deciding** (a ruling is coverage; silence is not).

---

## 1 · The bar, in one paragraph

A Staff/Lead PD in 2026 is expected to design the *system*, not the Figma file: the operator, the model, the field, the public, the failure, the record, and the thing you refused to build. Interviewers at FlytBase / Anduril / Palantir / Scale / ANA-grade civic tech will not ask about corner radius. They will ask: *what happens at 03:47 when the operator is on the radio, the model is down, the dock is BVLOS-illegal, the sheriff never acks, and the resident’s phone is in Spanish.* If your case study has a sentence for each of those, you pass. If it has a beautiful screenshot of the happy path, you do not.

You are closer than almost anyone. Here is the credit, then the remainder.

---

## 2 · Already cleared — do not reopen

| Cluster | What you shipped | Why it clears the 2026 bar |
|---|---|---|
| **Governance as interaction** | Two-tier authority, silence ≠ approval, dissent verbatim, new-evidence re-raise, ISA-18.2 budget, life-safety exemption, typed-approval refusal, STATUTORY GATE LOCKED | This is the differentiator. Most “AI command center” portfolios have a settings page called governance. Yours is load-bearing in `talon.ts`. |
| **Epistemic honesty** | MEA/MOD/AUT on every number; truth guard (“47” ≠ “247”); “I was wrong about Encinal Canyon Rd” with both projections kept; PLAN DRIFT; fragility lines | The 2026 AI-native expectation, actually met. |
| **Failure as a designed state** | Contain-without-evac (authorities still notified); falsepos save; registry-vs-IR conflict; battery handover + SO-3 failsafe; satellite loss with confidence dropping | Consequence chains, not error toasts. |
| **Attention as a budget** | Orb + deck segments + 2/10 cap + P0 chime-hold during PTT + red discipline | ISA-18.2 as a design system, not a blog post. |
| **Spatial contract** | Map never moves; cards exist only while open; deck L1/L2/L3; tools parked left; Field High-Lux; scrub determinism | The operator’s furniture is a ruling, not a preference. |
| **The record** | Scrub-replay, hindsight overlay, dissent receipts, evidence export that *refuses* to be a signature | Designed humility. Keep it. |
| **Craft floor** | 45 verify + 35 e2e; axe 0 on four states; WCAG AA; CVD geometry redundancy; reduced motion; 1–3 keys; 200% zoom battery | Table stakes, actually met. |
| **Scope discipline** | Kill-list: no duty view, no wizard, no auto-execute, no voice-first, no operator scoring | Covering a problem by refusing it is Staff-level. |

If an interviewer says “this is too polished, where is the product thinking,” point at this table, not at more UI.

---

## 3 · What is actually left — three buckets

### A · Fix this week (in the product; small; high interview-leverage)

These are the ones a sharp interviewer will find in a 20-minute walkthrough.

1. **The road cut must reach a heads-down operator (F1).** At T+116 the screen says `EGRESS · clear · no active plan`. No card, no pulse, no DOM text. This is the flagship arc’s climax. *Fix:* transient awareness card (or Egress `attn` + `route cut · 19 above`) that closes on ack, never on timeout. One of two conditions the 2026-10-27 operator diary already named.
2. **Egress glance cannot say “clear” while the route is cut.** Threat-aware glance: fold life-safety egress notes into the segment.
3. **Dissent trigger (F4).** Every tactical alternate becomes a named dissent. A seasoned operator will feel the chilling effect in one shift; an interviewer who has read the operator diary will ask. *Fix:* verbatim ritual only on gated / life-safety conflict; else “Alternate taken.”
4. **Ungated asks expire with no receipt (F2).** The detection card vanishing silently is the other diary condition. One log line.
5. **`message_unit` contradicts the constitution (F3).** The model has a send button its rulebook says it does not have. Disable or cite SO-4. This is also the one live-model leak.
6. **`RECEIPT PENDING` forever** on the T+93 WEA update — add the ack or label “no receipt in script.”
7. **Keyboard 1–9 vs documented 1–3 (F10)**; boot overlay in the a11y tree (F9); axe on an open panel + wing; `.seg` name collision.
8. **Doc sync.** HANDOFF/README still say 44 checks; anatomy 01/03/08 still draw the retired dock. An interviewer who opens HANDOFF first will think the deck is undocumented.

### B · Spec as an artifact (do not build the whole other product; draw the decision)

2026 coverage of a system problem is a designed artifact, not always a coded feature.

9. **The other end of the radio — field / ATAK companion, 3 frames.** The brief’s ground teams exist. Push-to-TAK is one-way. Spec: what SH-12’s tablet receives, how they mark “route blocked,” how that returns as MEA. Phone out of scope is a ruling you can keep — *if you show the ruggedized 8" tablet as the field surface and say so.*
10. **What the resident sees.** One artifact: the WEA/Zone-2 warning as a phone lock screen, English + Spanish, with the console’s geofence check as the reason it does not spill. You do not need a resident app. You need to prove you thought about the public as a party, not 917 devices. This is the brief’s “fleeing public,” and it is the most common 2026 interview poke on a public-safety piece.
11. **Degradation state machine.** DIRECTION §3 designed network loss and route-blocked partial evac; they are not authored. Draw the four states (live / stale / shed / blind) as a matrix with capability + consequence + recovery — the pattern you already use for satellite loss. Authoring one (network) in the wui arc would be enough.
12. **Shift change / transfer of command.** One act: “Operator on authority: A. Rao → J. Kim · T+2:20 · logged,” plus an open-item brief the relief accepts. ADR-3. Do not build a second operator’s UI. Build the handover object.
13. **Agency priors as inspectable data.** SO-2/SO-3/SO-4 and run cards as a versioned file the operator can open, not as TALON’s invisible memory. This is TALON’s own ask #1 and ADR-2’s real content. A Figma of the popover is enough.
14. **Live-model degraded states.** What the operator sees when the key is missing (already honest: “Scripted”), when the model is slow, when the truth guard rejects, when tokens/cost matter. You have the chip (`AI · <model>` / `Scripted`). Add: refused-turn counter, latency, and “the model did not look at X.” Never smoke-tested with a real key — say that in the case study as an open item, or run the smoke test.
15. **03:47 dual-control.** A night gate that requires a second-party confirm inside the circadian trough. Even a spec: “life-safety authorize between 02:00–05:00 local requires a second authenticated human or an explicit solo-watch override that is logged.” You do not have to implement fatigue science. You have to show you know the brief’s 3:47 is a human-factors condition, not a wallpaper.
16. **Multi-zone / concurrent incident — the minimum honest handle.** Registry + refs + “close the operational period” act (ADR-2/F8). The brief’s operator manages multiple zones. Your thesis (no in-console duty view) is correct — *cover it by drawing the duty-officer surface as a different product, one frame, with a “this is not this console” label.* Interviewers will ask “what about three fires.” Your answer is a designed refusal plus a registry, not a tab.

### C · Cover by ruling (a sentence in DESIGN.md / the case study; no code)

17. **Legal vocabulary.** California uses Evacuation Order vs Warning; PC 409.5 closure is law enforcement; a vendor cannot originate WEA. A PD in 2026 is expected to catch the word “MANDATORY.” Ruling: “The console recommends and requisitions. Issuer vocabulary is Order/Warning. WEA is never originated here.” You do not need to implement IPAWS.
18. **RPIC / airspace.** Ruling: “No sortie without a named RPIC and an authorization id. TFR is a received hard layer. Speaker-over-people is never standing.” Drawing the sortie chip is optional; the sentence is mandatory.
19. **Record ≠ evidence.** Already written. Do not inflate. Repeat it in the case study (CASE-STUDY-POINTERS already does).
20. **Phones.** Keep out of scope. Show the 8" ruggedized tablet as the field artifact (item 9) so the refusal is not “we ignored mobile.”
21. **Unit systems.** You mix acres, mph, m/min, °C, feet. Ruling: “US customary for operational surfaces; metric in parentheses on model outputs only” — or pick one and be boring. Silence looks like an oversight.
22. **Agency theming / white-label / SO numbers as data.** Every county will ask. Ruling: tokens stay; agency pack is a data file (priors), not a theme scramble.
23. **Print / airgap / generator / kiosk.** One sentence: the export is the offline artifact; the live console assumes power and a GPU. Do not design a paper ICS-209 inside the app.
24. **Sound.** Chime exists; voice unverified. Ruling: radio owns the channel; TALON is not a mode (already in the kill-list). Add one line on alarm audio vs radio discipline.
25. **Operator-pattern memory / pre-opening panels.** TALON asked for it. Refuse, or confine to session-only (no cross-shift model of the human). You already refused reliability scoring. Extend the refusal.
26. **Metric vs reality of the 90-second NSM.** Sheet 10 sells 48m→90s. Review measures scene-minutes. Cover: “NSM is a design star; the shipped measure is detection→order in scene time; we do not average them.” CASE-STUDY-POINTERS already has the numbers discipline — put it in the product’s about/help so an interviewer does not catch you in the marketing.

---

## 4 · Edge-case sweep (the checklist an interviewer will run)

Run this against the build. ✅ = covered. 🟡 = partial. ❌ = open.

**Operator state**
✅ Startled from standby (record loop / P0 preempt)
✅ Hands on radio (PTT chime-hold; mic tri-state)
🟡 03:47 circadian / fatigue / solo vs dual (set dressing; no dual-control)
❌ Has been on watch 6 hours; relief at 0700 (no transfer act)
🟡 Managing another zone when this alert lands (record loop is one incident)
✅ Gloves / 1–3 keys / 40 px rows
🟡 Sunlight / trailer / dirty screen (High-Lux exists; plan colors stay dark; no glove/glare pass)
❌ Hearing protection / radio noise / voice UX unverified

**Incident state**
✅ False positive / permitted burn
✅ Containable without evac (authorities still notified)
✅ WUI breakout / road cut / spot fire / model error
✅ Source conflict (registry vs IR)
✅ Battery critical / handover / failsafe
✅ Satellite loss
❌ Network degradation / C2 drop / stale-as-live (designed, not authored)
❌ Route blocked → partial evac (designed, not authored)
❌ Crew comms loss
❌ Two concurrent incidents / resource competition
🟡 Mutual aid (script beat; no MEL/agreement)
❌ Private dozer / volunteer crew / adjacent-county engine as a data shape

**Model state**
✅ No key → scripted, unchanged
✅ Execution claim / impersonation / invented number → refused
🟡 Real provider never smoke-tested
❌ Slow / timeout / rate-limit / partial tool failure
❌ Prompt injection *through a crew message that the model then acts on* (`message_unit`)
🟡 Model floods `post_item` (unbounded diligence)
❌ Model down mid-incident (fallback is coded; is it a designed state or a console error?)
❌ Confidence on the deck
❌ Verified-absence (“I checked X and it is fine”)

**Public / field / other humans**
🟡 Bridge (ICS-205) as contact sheet; TAK one-way
❌ Resident as a party (language, AFN, WEA preview, 911 surge)
❌ Dispatcher as a seat / CAD as received state
❌ Safety Officer stop
❌ FBAN inspecting the model
❌ Media / JIC / rumor
✅ Field IC quote (scripted)
❌ Field unit contradicting on the record

**Record / time**
✅ Scrub determinism; hindsight labeled; past read-only
✅ Dissent verbatim; re-raise new-evidence only
🟡 Export identity (operator/period/refs in; comms counts only)
❌ Wall clock vs scene time labeled on the budget (F7)
❌ Period close-out as an act
❌ Live-model turns version-pinned

**Environment / system**
✅ Dark EOC / Field High-Lux contrast
🟡 1280 insurance vs 1920 floor
✅ 200% zoom; reduced motion; axe on 4 states
❌ axe on deck panel + wing
❌ Offline / generator / airgap beyond a toast
❌ i18n / Spanish / RTL (out of scope is fine if ruled)
🟡 Exercise vs live dual use (disclaimer only)

**New-deck edges (this build)**
✅ Issued receipt survives emptied stack
✅ Egress materializes at gate; no stale “0:00”
✅ Glance ties break by meaning
❌ Egress says “clear” at the cut
❌ F1 card
❌ RECEIPT PENDING forever
🟡 Panel overflow scrollbar; authority popover probe; T+ stamp wording; report-gate countdown after send

---

## 5 · What an interviewer will actually ask (and the answer you already have, or need)

| Question | Your answer today |
|---|---|
| “The operator manages dozens of sensors. Show me.” | Record loop + multi-zone is the weak one. Answer: thesis (follow the incident) + registry sketch + refuse the duty view. Need the one-frame duty-officer artifact. |
| “How do you prevent automation bias?” | Provenance, prices on both options, correction moment, budget, handled-count. Strong. Add: G2 reading floor is a drawing note, not live. |
| “What if TALON is wrong?” | Correction + PLAN DRIFT + dissent + re-raise. Strong. Add: the road cut is the case where *you* are the one who has to notice. |
| “Show me the resident’s experience.” | You don’t have it. Draw one lock-screen. |
| “Show me the field.” | Bridge + TAK chip. Draw two ATAK frames. |
| “What did you refuse to build?” | Kill-list. Strongest answer in the portfolio. Lead with it. |
| “Is this legal to fly?” | Be honest: exercise. Then the sortie-object ruling. Do not perform aviation law. |
| “Why should FlytBase hire you off this?” | Because you designed the constitution, the failure states, and the refusals — not a dashboard. Then show the deck (ambient SA) as the 2026 AI-native move. |

---

## 6 · The one-page coverage map (put this in the case-study appendix)

| Layer | Covered | Remaining |
|---|---|---|
| Decision core (authority, lapse, dissent, provenance) | ✅✅ | F4 trigger, F2 receipt |
| Attention (budget, deck, red, PTT) | ✅ | F1 road cut; unmetered notes |
| Map / space | ✅✅ | High-Lux plan colors; glare pass |
| Failure design | ✅ | Network, route-blocked, comms loss |
| Model honesty | ✅ | Real-key smoke; degraded states; confidence; verified-absence |
| Record | ✅ | Comms log; period close-out; wall/scene label |
| Field | 🟡 | 2-way ATAK; unit contradicting; dispatcher |
| Public | ❌→spec | Resident artifact; language; WEA preview |
| Command | 🟡 | Party model; Safety stop; transfer act; UC identity |
| Aviation envelope | ❌→rule | RPIC/waiver/Remote ID/TFR as designed constraints |
| Multi-incident | ❌→rule | Registry + duty-officer frame (refusal drawn) |
| 03:47 human | ❌→rule | Dual-control / solo-watch override |
| Docs / craft debt | 🟡 | HANDOFF/README/anatomy sync; F9/F10; axe panel; `.seg` |

---

## 7 · How to “cover” the legal/founder pile without becoming a lawyer

You do not need the Legal Matrix in the portfolio. You need **five designed constraints**, each one sentence and one UI receipt:

1. The console **recommends**; it never issues. (Already built. Fix the “MANDATORY” / “order issued” copy to match.)
2. Public warning is a **requisition** to a named authorized official. (Already built as REQ. Give Lin a party chip.)
3. No sortie without a **named RPIC and an authorization id**. (Not built. Spec the chip; refuse speaker-as-standing.)
4. The export is an **integrity digest, not evidence**. (Already written. Keep.)
5. Exercise watermark unless an agency has contracted a live program. (Already on every scenario. Add the live-mode interlock as a spec.)

That is the legal stack, translated into PD. The rest of the founder brief is for the board, not for Figma.

---

## 8 · If you only have one more day

Ship, in this order:

1. F1 awareness card + threat-aware Egress glance (the cut).
2. F4 narrow dissent; F2 expiry receipt; gate `message_unit`.
3. RECEIPT PENDING resolution.
4. HANDOFF/README/anatomy sync (or banner anatomy superseded).
5. Two artifacts, not features: resident lock-screen (EN/ES) and ATAK two-frame. One page each.
6. One ruling page in DESIGN.md: RPIC/airspace, phones, multi-incident refusal, 03:47 dual-control, unit systems, live-model untested.
7. Case study: lead with the constitution, the correction, the kill-list, and the deck; put the coverage map in the appendix; do not lead with the 90-second fantasy.

That is the last mile. You are not far. The remaining work is the work that makes a 2026 interviewer stop looking for the hole.

---

*Cross-refs: Shippability Audit 2026-11-05 (gate list + live probe), SIM-REPORT-OPERATOR (18 findings), SIM-REPORT-TALON (the five asks), DIRECTION §3 (unauthored injects), CASE-STUDY-POINTERS (numbers discipline), DESIGN.md §8 (layered deck ruling).*
