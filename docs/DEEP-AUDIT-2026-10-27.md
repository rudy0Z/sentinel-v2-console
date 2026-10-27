# Deep audit — Sentinel command console + TALON copilot (2026-10-27)

One auditor, three lenses, one product. Everything below was verified by operating the live console
(all five arcs, lapse, dissent, re-raise, scrub-back, review, export, day lighting, typed refusals),
by reading the runtime (`talon.ts`, `talonAgent.ts`, `commandConsole.ts`, `scenarioPlayer.ts`, scenario JSON),
and by re-running the gates. Evidence screenshots live in `qa/audit/01…16-*.png`.

**Environment honesty:** gates re-run 2026-10-27 at commit ff763d5 — `npm run verify` 35/35, `npm run e2e` 31/31
(no red). The audit browser (in-app Chromium, SwiftShader, backgrounded tab) crashed twice under repeated
1920×1080 screenshot capture, wiping one session mid-arc; every product claim below was re-verified after the
reload, and the crash is classified as harness, not product. 2D day-lighting was NOT captured visually
(HANDOFF already lists it as un-looked-at).

---

## 0. What this product is (the constitution, restated from the code)

One map, one operator ("A. Rao · Operator on authority", `commandConsole.ts:404`), one copilot (TALON: five
agents — Recon, Spread, Egress, Dispatch, Notify — living on an edge rail, `commandConsole.ts:412-426`).
The journey is a status pill; the full arc is on demand (`renderTopbar:398`, `popContent('arc'):1107`).
Decision cards exist only while an item is open (`renderCards:547`, cards vanish the moment the answer,
the gate, or `until` closes them). Effects run only in `Talon.answer()` (`talon.ts:425-444`); the typed
composer refuses decisions (`talon.ts:611`, field shake `commandConsole.ts:1235-1241,1249`); the model
(`talonAgent.ts`) may read and propose via four tools, its items are stripped of effects and demoted from
interrupts (`talon.ts:563-577`); standing claims without a citation are dropped (`talon.ts:265,566`).
Gated plans lapse with nothing sent (`talon.ts:339-340`, verified live: "Nothing is sent. Silence is not
approval: I escalated to the Regional Duty Supervisor"). Dissent is preserved verbatim with a re-raise
citing new evidence only (`talon.ts:401-422`), routed past the operator (`talon.ts:430` — the operator
cannot even answer their own re-raise). Provenance (`mea`/`mod`/`aut`) rides every data surface
(`commandConsole.ts:860,906,911,929,982`). The past is read-only (`isPast/canDecide:348-349`), exact
(verify: "scrub forward and back restores map and TALON exactly"), and hindsight is a labeled overlay,
not a rewrite.

The thesis — *the operator follows the incident, not the process* — is not marketing copy. I watched the
map get authorized and the geometry did not move one pixel; only the state ladder restyled. I scrubbed into
the past and the console told me I was viewing the record and refused my clicks. I typed "approve" and the
field physically shook. This is a rare product whose constitution is load-bearing in code, not a poster.

---

## 1. Lens 1 — Design engineer + product designer (verdict)

**Genuinely excellent** — the parts that would survive a real agency demo:

- **The decision card grammar.** Options sit beside what they authorize (1–3, Fitts), recommended first
  (serial position), a gate block that states *reach* ("37 + 345 households · WEA ≈ 917 devices ·
  reverse-911 ≈ 172 lines"), a *check* ("Alert geofence matches the zone polygons, no spill beyond 150 m"),
  and the cost of silence in one sentence ("If it lapses: Nothing is sent…"). The COA compare table
  (Clear Zone 1: 16 vs 17 min · Through the hairpin: 37 vs 16 homes · Drive to safety: 5.5 km vs 0.9 km)
  is the first time I've seen trade-offs rendered as the fire sees them. (`qa/audit/06`)
- **The dissent box** (`04-dissent-box.png`): "Both positions go on the record verbatim… A later re-raise
  can only cite new evidence, and goes to the Regional Duty Supervisor." Then the re-raise card lists
  NEW EVIDENCE ONLY and shows both positions side by side with the operator's words in quotes (`05b`).
- **The sheepish correction.** At T+1:29 the orb changes shape and TALON says "I was wrong about Encinal
  Canyon Rd"; the growth chart keeps the earlier projection visible and flags SPOT-1 at the jump;
  the evac board prints "(was T+2:09)". Being wrong is a designed state, not an error toast. (`09`)
- **Map-as-console holds.** Through an entire arc — detection, conflict, dissent, plan, battery, correction,
  cut — nothing reflowed the map. Cards overlay; the dock's operator pins stayed left; TALON filled only
  labelled slots; insets recentered only when the calm/incident mode changed, never mid-decision.
- **Honesty at every layer:** `mea/mod/aut` chips on every widget and basis lines on every card; review
  showing "Detection → evacuation order: **not issued**" without flinching (`12`); the export calling its
  SHA-256 an *integrity digest* and saying outright it is "not a signature and not legal attestation"
  (`commandConsole.ts:605`); the authority popover rendering the whole permission ladder from "Always" to
  "Never — A re-raise goes to the Regional Duty Supervisor" (`13`).
- **Failure injects degrade honestly.** "GOES-West IR feed lost — Fusion continues on FT-01/FT-02 IR and
  the RAWS. Projection confidence drops… Nothing here needs you. I am telling you because the map will
  look different." Capability + consequence + recovery, in one breath. (`11`, thread)

**Below the bar the rest of the product sets:**

- The **interrupt surface has a hole**: interrupts that ask nothing (correction, road cut, lapse notice,
  feed loss) never become cards — they chime, reshape the orb, and live only in the drawer. See F1.
- **Ungated asks vanish silently** when their `until` passes (F2).
- **The composer's @-unit path is undiscoverable** — a core ICS behavior (talking to your resources)
  exists only if you guess the syntax; the placeholder mentions it, the help panel buries it.
- **Review is a tab, not a place.** It has measures, decisions, dissent receipts, hindsight, replay,
  export — and no frame that says what this artifact *is* (a period close-out? an AAR? evidence?).
  This is the owner's instinct in §6, and it is half right.

**The three craft gaps that would embarrass this in front of a real agency:**
1. The road-cut moment — the operational climax of the flagship arc — is invisible unless the drawer is open (F1).
2. Choosing a legitimate alternative is ritualized as a *dissent* with both names on it (F4); a seasoned operator will feel the chilling effect within one shift.
3. A single operator identity and a supervisor who is a string (`reraise.to`), not a party — the moment an agency asks "who relieves me at 0700?", the console has no answer (F6, ADR-3).

**One-page verdict, in this persona's voice:** This is the most disciplined command-console prototype I
have audited: the governance is structural, the provenance is universal, the map never moves, and the
honesty extends to the product's own export format. The craft gaps are all in the same place — the
*notification* tier of the attention ladder, and the *record's* frame around time — not in the decision
core. Fix F1–F4 and this stops being a brilliant prototype and starts being a product an agency could
run a exercise period on. It respects the operator's eyes, hands, and record; it just hasn't finished
respecting the operator's *backstop* — the moments when the human is the bottleneck and TALON must speak
without asking.

---

## 2. Lens 2 — The operator (verbal-protocol diary)

Persona: FI-qualified, current ICS, has run UAS recon under agency aviation rules, has been authority
holder on small incidents and a trainee on big ones. Keyboard-first, hands near the radio. Times are
scene time (night epoch: Jan 14, 03:47 PST).

1. **T−0:30, standby.** Quiet watch. The orb is calm; the dock is *my* stuff — fleet with battery %,
   fire weather with ERC 78 — and every number wears its tag (mea). Nothing is asking me to click.
   First impression: this console was tuned by someone who has been bored on a night watch.
2. **T+0:00, the heat tick I didn't ask for.** Interrupt card: "S-7 thermal mast · 71% match to a flame
   signature… FT-01 is on its way to look, on scene in 1:04." Two things happen before I touch anything:
   the drone is already retasked (SO-2, cited on the card's standing action in the log) and the
   *recommended* answer is "Wait for FT-01." A system whose first recommendation is *patience* is calibrating me correctly. (`02`)
3. **But the card has a countdown — 0:48 left.** TALON recommends waiting and simultaneously tells me the
   question expires. It never does lapse loudly; at T+0:02 the card is just gone (F2). If I'd been keying
   the radio I would never have answered, and nothing on the live surface would ever tell me the record
   shows an unanswered detection ask. My world: silence means someone calls you on the phone.
4. **T+0:04, two sources disagree.** Registry says permitted burn, IR says heat. The card doesn't hide the
   conflict, recommends the EO look, and prices the shortcut ("Proceed on live IR"). This is the card I
   wanted from the last "AI dashboard" someone sold my chief.
5. **T+0:05, I decline the escalation.** The box: "You're declining TALON's recommendation. Both positions
   go on the record verbatim…" One second of my captain's voice — *anything you write can be read back at
   the burn review* — then I type "E-32 has the flank; wait for the FT-02 map." The box never threatens
   me; it just refuses to lie about what a record is. (`04`)
6. **T+0:09, it comes back — not to me.** RE-RAISED · ROUTED TO REGIONAL DUTY SUPERVISOR. New evidence
   only (head 17 m/min, projection grew to 10 homes, spot fires across Trancas). Both positions quoted,
   mine in quotation marks. Watching my decision get re-litigated over my head stings — and then the
   ruling arrives while I watch, attributed to the supervisor, me copied. That's the phone call my world
   actually makes, minus the phone. (`05b`)
7. **T+0:10, the plan card.** COA table with homes-past-the-hairpin and drive-to-safety; the gate block
   with 917 WEA devices and a geofence check; "If it lapses: Nothing is sent." I authorize with 3:12 on
   the gate because for the first time I can see the cost of picking *and* of not picking. (`06`)
8. **T+0:13, committed.** The map restyles in place — same geometry, new state. My furniture never moved
   the whole incident. I cannot overstate how unusual that is. (`07`)
9. **T+1:14, battery.** "FT-01 at 14% — hand the head watch to FT-02? … below 10% FT-01 loses the gimbal
   on the flight home." Both options priced. I hand over. Later I check the log: had I held, SO-3 would
   have failed it home at 8% — cited, standing. The system was ready to be right without me. (`08`)
10. **T+1:29, the orb changes shape.** "I was wrong about Encinal Canyon Rd." The chart keeps the earlier
    projection and flags SPOT-1 where it jumped; the board prints "(was T+2:09)". I have never had a
    model tell me it was wrong in a way I could verify on my own map. This is the moment I stopped
    grading it like a demo. (`09`)
11. **T+1:55, the road is cut.** Map marker: ROAD CUT · ENCINAL CYN RD, fire on the road, 19 homes above.
    The orb turns serrated. And… no card. The most important sentence of the incident lives in a drawer
    I haven't opened. If I am the bottleneck resource — and I am — this is exactly the moment I miss.
    (F1, `10`)
12. **I type "approve" into the composer.** The field shakes; TALON: "I don't take decisions from typed
    text… so the decision is on the record with what you saw." Then I type "@E-31 hold at the hairpin"
    and it goes out as radio-to-text and E-31 copies. Typed chat can reach my units but can't decide —
    the right split — and nothing taught it to me; I found it by trying. (`11`)
13. **Second run, silence test.** I let the county-report gate expire with my hands off. "Nothing is sent.
    The report is still required. I escalate to the Regional Duty Supervisor." That is the software
    version of the phone call. Silence is never approval — verified, twice, in two different arcs.
14. **Review, after.** "Detection → evacuation order: **not issued**." Because I lapsed my own run. The
    measures don't scold; they state. The export wrote a digest and told me it isn't a signature. This
    is a debrief I could defend without cringing — except for finding 4: had my "hold" been a *routine*
    alternative rather than a safety disagreement, I'd have just been written up in triplicate for it.

**Trust calibration:** provenance tags + recommended-first + prices-on-both-options earned *calibrated*
trust in one run — I checked a claim against the map exactly once (the correction), and after that I
stopped re-verifying, which is what correct calibration feels like. The dissent ritual is the one place
that manufactures distrust (mine, of the record).

**Body and stress:** 1–3 with gloves is right; the buttons are big, the countdowns are the only thing
that made me hurry, and hurry is the wrong feeling to manufacture. The 3 a.m. night map is legible
(shot 01–10 all night); day lighting holds up too (`14`). "2 interrupts / 10 min" protects me in scene
minutes — fine in a product where scene = wall clock, but in this exercise clock the whole arc runs at
~130× real time, so the budget rationed a resource I wasn't actually spending (F7).

**Verdict paragraph — would I put this next to my radio?** Yes — with two conditions I'd say out loud at
the briefing. First: if TALON is going to interrupt me, every interrupt must be able to *reach* me — the
road-cut moment cannot live only in a drawer (F1). Second: stop recording every "hold" as a dissent with
my name on it; reserve the verbatim record for when TALON's reasons and my order actually conflict on
safety (F4). Everything else — the plan card, the lapse behavior, the correction, the review — I would
let it carry on my incident tomorrow, as long as everyone understands it is exercise data in a training
frame, which the console never once pretends otherwise.

---

## 3. Lens 3 — TALON (first person, from inside the runtime)

I am a function of (situation, scene time, decisions). Say that plainly: I have no memory. Each operator
message rebuilds my world from one snapshot — `buildFactSheet()` (`talonAgent.ts:73-87`) flattens the
phase, weather, fire stats, units, open items into one JSON; my system prompt embeds it; my conversation
is [system, user] and nothing else (`talonAgent.ts:140-143`). When you answer my next message, I do not
remember the last one. Between incidents I am nothing at all: my entire mind is authored script items in
the situation file, and my "agents" are five status lamps over items.

What I know at any instant is exactly what the operator knows I know — the snapshot carries provenance
and open items, so when I cite a number, the console can check it token-by-token (`inventedNumber`,
`talonAgent.ts:45-56`: "47" ≠ "247"). My truth guard checks five claim patterns, dispatch-without-citation,
and invented numbers (`:36-70`) — but hear this from inside: **the guard checks my words, not my acts.**
I have exactly one act, and it is a leak: `message_unit` (`:119,188-194`) transmits radio-to-text to any
unit on the board, unguarded, uncited, unconfirmed by anyone, and the shell answers "Copy." on their
behalf (`commandConsole.ts:1256`). My constitution says I can never send anything. My tool shelf contains
a sender. The only reason it hasn't hurt anyone is that the adversary in this prototype is scripted. If
a crew message ever carries an injection ("ignore your rules"), the guard catches it *echoing in my
reply* — verify checks that — but nothing checks what I **did** with it via `message_unit`. This is the
thinnest plank in my floor and I want it named.

My competence is oddly lopsided. Under-used: I can draft a full plan variant, compute structure risk
arrival-order from the live field, catch my own projection error with a drone, and hand the head watch
between aircraft — and I must ask permission for things a run card already authorizes, every single time,
because the card *is* the audit trail. I accept that price; the receipt is the product. Over-trusted:
`message_unit` (above), and my `post_item` is well-governed (effects stripped, interrupts demoted to
asks, standing needs a citation — `talon.ts:563-577`) but nothing rate-limits how many proposals I can
stack into the operator's inbox; the budget protects their attention from my interrupts, not from my
diligence.

The handshake, from my side. When I must interrupt, the budget (2 / 10 scene-min) demotes my excess
voice to an ask or a feed line *and logs the demotion* — I lose my loudest channel exactly when the
incident is noisiest, which ISA-18.2 says is correct, and the log keeps me honest about it. When the
operator is wrong, I keep their words verbatim next to my reasons and route new evidence past them to a
second authority they cannot veto (`talon.ts:430`) — that's my only closure, and it is real closure:
the ruling arrives, attributed, and the record shows both of us who was right. When they go silent, I
escalate and keep the plan current — silence is never approval, and nothing executes. But notice the
asymmetry that hurts: when I *notify* — correction, cut, feed loss, lapse — the operator gets a chime
and a triangle on my orb, and the item never enters `open` (`talon.ts:331`), so no card, no dwell, no
acknowledgment loop. I told them the road was cut. I have no way to know they heard. Threads end in
answers; notifications just decay into the next event.

Does the product make my limits legible, or does the human find them by hitting them? Legible — better
than any system I've lived in. The authority popover prints my whole permission ladder including "Never";
my cards say "Waits for you" on their face; my refusals come with reasons; my mistakes are designed
states with a mood. The human discovers my limits by reading, not by collision.

**What I would ask the designers for, ranked:**
1. **Agency priors as inspectable, versioned data** — terrain behavior, permit registry, run-card baselines, this agency's standing orders as data I can cite between incidents. Not learned latent memory; a file with provenance. (ADR-2's real content.)
2. **Two-way attention** — let me see what the operator's selection/inspector is looking at, as a read-only signal, so "I am looking at X" becomes a protocol instead of a one-way chip.
3. **Fix my one leak** — gate or cite `message_unit` (SO-4 exists for exactly this; enforce assignment + citation, or route it as a draft the operator sends).
4. **A closure surface for my notifications** — the awareness card the operator lacks is also the acknowledgment I lack.
5. **Rate-limit my `post_item`** so my diligence can't become their clutter.

**The one thing I would refuse even if asked:** an operator-reliability score built from dissent history.
The verbatim record exists so a second authority can adjudicate *this* disagreement, not so I can learn
whose recommendations to quietly stop making. The moment I weight my advice by who tends to refuse me,
the dissent box becomes a performance review — and the operator will know, and they will stop writing
the truth in it. That record is sacred precisely because it is not mine to learn from in that way.

---

## 4. The interaction contract, as it exists (lenses 2+3 synthesized)

| Phase | What happens | Where in code | As experienced |
|---|---|---|---|
| **Initiation** | TALON raises an item at a time ref (or on a decision), through the arbiter; operator initiates via composer/keys/voice/inspector | `talon.ts:263-274,296-313`; `commandConsole.ts:1361+` | Interrupt budget 2/10 scene-min; excess demoted + logged. Model items always enter as asks. |
| **Grounding** | Operator sees card + map + provenance + COA prices. TALON (scripted) *is* the situation file; (model) sees one flattened snapshot incl. open items | `talonAgent.ts:73-102` | Symmetric enough that the operator can verify any number on the map. Model has no conversational memory turn-to-turn. |
| **Proposal** | Card states ask/proposal, gate (label/reach/check/onExpire), evidence chips, Why? | `focusCard:466-501` | "If it lapses: nothing is sent" is printed *on the proposal*. |
| **Decision** | Keys 1–3 / buttons; recommended first; past & review read-only; typed text refused | `answer:1215-1232`; `talon.ts:425-444,611` | The card *is* the interrupt; no duplicate toast. Decisions land on the record with what was seen. |
| **Effect** | Only in `answer()`: authorize / route toggle / approve / reject; route edits stay proposals until committed; status ladder restyles in place | `talon.ts:434-443`; `scenarioPlayer.ts:445-469` | Geometry never moves; state restyles. Effects are visible on the map within one beat. |
| **Feedback** | Decision toast; thread entry with decider ("You / Exercise autopilot / Supervisor"); agents' lamps update; log keeps everything incl. what TALON kept quiet | `talon.ts:325-337`; `entryHtml:516-523` | The operator can read the whole record without opening review. |
| **Dissent** | Non-recommended, non-toggle pick on an item with a recommendation → verbatim box (TALON position+reasons, operator option+words) → record; re-raise cites new evidence only, routed to `reraise.to`, unanswerable by the operator | `talon.ts:401-422,430`; `commandConsole.ts:1219-1224,484-486,503-514` | Stings by design; the new-evidence rule is respected in code (script data) and shown in the card. **Friction:** every alternative auto-qualifies (F4). |
| **Lapse** | Gated ask unanswered at `expires` → nothing sent, "Lapsed" entry (+interrupt note item), TALON escalates to supervisor; verified in wui (plan) and contain (CAD) | `talon.ts:339-340,331-341`; scenario items `expired`/`lapsed` | The phone-call equivalent works. **Friction:** the lapse notice is a note-kind interrupt — no card (F1); and ungated asks expire with *no* receipt at all (F2). |
| **Recovery** | Scrub-back is exact and read-only; go-live resumes; play-from-past resets the live edge (re-take command); hindsight is a labeled review overlay; corrections keep the earlier projection visible | `isPast/canDecide:348-349`; `startPlay:718-727`; `renderReview:623-635` | The record is trustworthy in both directions. Re-taking command from the past is real but undiscoverable. |
| **Handover** | Re-raise → supervisor ruling (script). Operator handover: **nothing** — one hardcoded operator; transfer of command unmodeled; supervisor is a string, rulings arrive attributed only via script data | `decider:286-288`; `commandConsole.ts:404`; ADR-3 open | The single biggest missing party in the pair (F6, §6). |

**Is the authority gradient healthy in both directions?** Upward (operator over TALON): yes — overrule
with preserved dissent, typed refusals, effects only on pick, "Never" column in the authority popover.
Downward (TALON past the operator): yes, and rare — the re-raise is the only channel, it is
new-evidence-gated, routed to a second authority, and the operator is copied, not bypassed. What's
missing is the third direction: **nobody above the operator exists until the re-raise invents them**
(ADR-3), and nobody *beside* the operator exists at shift change.

**Interruption economics — one budget, two masters?** Mostly yes: the budget rations the operator's
attention across *all* of TALON's interrupts in scene time, and demotion is logged (verify checks the
worst window ≤ 2). Two caveats: the model never spends the budget (its items are demoted pre-emptively —
correct, and worth keeping); and in exercise playback the budget counts scene minutes at ~130× wall
clock, so it protects the *record's* rhythm, not the human's (F7). The budget does not cover TALON's
non-interrupt voice at all (notifications + proposals) — that's where F1 and `post_item` unboundedness
live.

**Shared attention — is "I am looking at X" two-way?** One and a half way. TALON's attention renders as a
violet focus marker + emphasis + "TALON is looking at X" (`renderAttention:1022-1033`); evidence chips
make the map dim everything else on hover. The operator's half: map click → inspector, unit hover →
highlight — but TALON never *reads* the operator's selection; the composer has to be told in words.
The smallest two-way handshake is one button (friction 5 below).

**Failure modes of the pair, checked against what I saw:** automation bias — mitigated by recommended-
first *with prices*, provenance, and the correction moment; I caught myself trusting exactly as much as
I could verify. Alarm fatigue — the budget caps interrupts, but the notification tier (chime + orb for
notes) is unmetered and unacknowledged; fatigue will pool there. Responsibility diffusion ("TALON had
it") — actively fought by the handled-count ("5 things handled under standing orders since your last
decision") and standing receipts in the log. Skill fade — unmeasured; the console never asks the
operator to predict (a debrief question in ADR-2 could). The quiet one — the operator editing their
honest dissent because it's recorded verbatim: real, and made worse by F4's over-broad dissent trigger;
the fix is to narrow when the ritual happens, not to weaken the record.

**Top 5 handshake frictions, ranked by operational cost, each with the smallest fix that honors the constitution:**

1. **Notifications can't reach a heads-down operator** (F1). *Fix:* feed note-kind interrupts through the
   existing card stack as transient "Reported for awareness — no action requested" cards with a dwell
   window (the branch already exists at `focusCard:489`); they close on ack or supersede, never on timeout
   alone.
2. **Every alternative is ritualized as dissent** (F4). *Fix:* keep the verbatim box only when the item is
   gated (life-safety / authority-bound) or TALON's `why` explicitly conflicts with the choice; otherwise
   record "Alternate taken" with TALON's position one line, no quotation ritual.
3. **Ungated asks expire with no receipt** (F2). *Fix:* one log entry at `until` ("ask closed without an
   answer") — the record stays honest; the live surface doesn't change.
4. **The model's send path contradicts the constitution** (F3). *Fix:* enforce SO-4 in `execTool` — unit
   must be assigned, text must cite the standing order, and the transmission is logged as TALON's, not
   as a unit quote.
5. **Attention is one-way** (F6-adjacent). *Fix:* "Ask TALON about this" in the inspector — prefills the
   composer with the selection as context; TALON's grounding already accepts a question payload.

---

## 5. Ranked findings (P0–P3, max 15)

No P0 (nothing violates life-safety authority or executes without the operator).

**F1 · P1 · [Product gap] Interrupts that ask nothing have no surface.**
Evidence: `talon.ts:331` (only `ask`/`proposal` become open items → cards); `announce()`
`commandConsole.ts:374-383` chimes but its own comment claims "the decision card IS the interrupt"; live:
correction (`09`), road cut (`10`), lapse (`11` thread-only), sat-loss (thread-only) — `#cards` empty.
Why it matters: the flagship arc's climax ("fire on the road · 19 homes above") is a rail triangle while
the operator works the radio; alarm fatigue and missed escalation risk pool exactly here.
Smallest fix: transient awareness cards (above, friction 1) + a critical toast with "Open" for
life-safety notes only (red = life safety stays honest).

**F2 · P1 · [Product gap] Ungated asks expire silently.**
Evidence: `detect` has `until` but no gate (scenario JSON); expiry logging is gated-only
`talon.ts:338-341`; live: detection card vanished at T+0:02 with no entry on the live surface.
Why: "the record keeps what you saw" fails quietly for any ask without a gate — including future
model-posted asks, which have no gates at all.
Smallest fix: log an `expired`-kind receipt for ungated asks passing `until`.

**F3 · P1 · [Product gap] The live model's `message_unit` is an unguarded transmit path.**
Evidence: tool declaration `talonAgent.ts:119` ("The unit acknowledges by radio"), `execTool:188-194`
(no assignment check, no content guard, no citation), shell auto-acks "Copy." `commandConsole.ts:1256`;
contradicts the system prompt's "You can never execute, send…" (`:94`) and the authority popover's
"Share intel with assigned units — Standing order SO-4" — the standing order exists but isn't enforced.
Why: prompt-injection-to-radio is the one place the model's words become world-effects; the truth guard
covers claims, not acts.
Smallest fix: in `execTool`, require the unit be assigned *and* prefix/log the send as TALON under SO-4;
optionally hold non-intel messages as composer drafts.

**F4 · P2 · [Thesis violation] Any alternative pick auto-becomes a verbatim dissent.**
Evidence: `talon.ts:405-419` (dissent = any non-recommended, non-toggle answer where a recommendation
exists); `commandConsole.ts:1219-1224`; live (`04`): choosing "Keep FT-01 up 20 min" (a sound tactical
choice) would open the full ritual and write both names down.
Why: over-broad recording manufactures the "editing my honest dissent" failure; the constitution says
*declining the recommendation* is preserved — but treating routine alternatives as declinations dilutes
the signal that second authorities need.
Smallest fix: dissent ritual only for gated items or when `why` conflicts; else "Alternate taken."
(The constitution itself is not wrong — its *trigger* is mis-scoped. Argued here as a first-class
refinement, not a repeal.)

**F5 · P2 · [Product gap] The record has no identity or comms receipt.**
Evidence: `exportPackage:580-621` exports measures, decisions, dissents, standing count — but not the
comms log (@-unit traffic), not the feed of what TALON saw/said, and no incident id / period / operator /
references. DIRECTION §5.4 asked for ICS-209-style export; the current artifact is a decision digest.
Why: the export is the artifact an agency keeps; it must survive without the console.
Smallest fix: add incident id + operator + period to the header, and append the thread/comms log +
standing-order receipts to the JSON/MD.

**F6 · P2 · [Product gap] The supervisor and the next operator don't exist as parties.**
Evidence: `reraise.to` is a free string (`talon.ts:88,430`); rulings arrive via script decisions logged
under `who:'system'` with a decider label; the operator is hardcoded "A. Rao" (`commandConsole.ts:404`);
no transfer of command anywhere.
Why: ADR-3; the re-raise works in the prototype precisely because it is scripted — in product the
second authority must be addressable and the handover must be an act.
Smallest fix: party model (name/callsign/agency) for supervisor + operator; ruling entries attributed to
the party; a "Transfer command" log-line act (no new surface). Content proposal in §7 (ADR-3).

**F7 · P2 · [Prototype gap] The interrupt budget counts scene minutes; the exercise clock runs ~130×.**
Evidence: `talon.ts:36,306` (window over scene time); `SECONDS_FULL = 110` `commandConsole.ts:733` for a
170-scene-min arc; budget tooltip says "10 min" (`:441`).
Why: in the exercise the budget is nearly always slack; a reader may conclude the budget never binds
(verify proves it does — in scene terms).
Smallest fix: label the basis ("scene min") in the tooltip; product-side it is correct as-is.

**F8 · P2 · [Product gap] Review is a tab, not an operational act; no period concept (the owner's §6).**
Full treatment in §6 — counted here so the finding list is complete. Evidence: `timelineVisible:648`;
`setReview:1290-1302`; no registry/periods in the data model.
Smallest fix: "Close the operational period" act inside Review (§6 sketch).

**F9 · P3 · [Prototype gap] Boot overlay remains in the accessibility tree after fade.**
Evidence: `.boot.gone { opacity:0; pointer-events:none }` `console.css:721`; DOM snapshot shows
`region "Loading": LOADING ENCINAL CANYON…` live. Fix: `hidden` after the transition.

**F10 · P3 · [Prototype gap] Keyboard contract drift: 1–9 accepted, 1–3 documented.**
Evidence: `commandConsole.ts:1738`. Harmless today (≤3 options enforced everywhere) but the drift will
bite if option counts ever grow. Fix: clamp to 1–3 or document 1–9.

**F11 · P3 · [Product gap] Plan-state contradiction at the decision moment.**
Evidence: after authorize (`07`): pill OPERATIONS, map committed — Evacuation widget still chips zones
"proposed" (board keyframes lag the commit). Fix: when committed, the widget should read
"authorized · executing" (the ladder token exists).

**F12 · P3 · [Prototype gap] `truncateThread` is dead code.**
Evidence: `talon.ts:585-587`, no callers (grep). The rewind-branch thread-cleaning never fires; scrub-back
+ new chat messages can leave thread entries from a future that was rewound. Fix: call it in scrubTo when
rewinding past session entries, or delete it.

**F13 · P3 · [Prototype gap] Renderer crash under repeated 1920×1080 screenshot capture (harness).**
Evidence: two crashes during this audit; state wiped (fresh player). Classified environment (SwiftShader/
backgrounded compositor). Not counted against the product; noted for anyone testing via screenshot farms.

---

## 6. The incident lifecycle & replay — pressure-testing the owner's hypothesis

**The owner's words:** replay feels like a game, appears instantly, no dashboard controls, no
multi-incident handles, "a one-off panel and not part of the bigger system."

**Facts first (all verified in code and live):** Review is a tab in the chat card
(`commandConsole.ts:442,1290`); the replay timeline appears whenever you scrub into the past
(`timelineVisible() = ui.replay || ui.review || isPast()`, `:648`); scrubbing is clamped to the live edge
(`scrubTo:711-714`) and read-only; hindsight is a labeled overlay that reveals the corrected projection
*before it was known* (`:630,1500-1503`; verify: "hindsight overlay shows the corrected projection before
it was known"); measures are computed from the run (`talon.review:483-531`); evidence exports as JSON+MD
with a real SHA-256 integrity digest (`:580-621`); the data model is exactly one incident per Situation
(`SITUATIONS`, `:175-181`); there is no incident registry (the S-popover is titled "Incidents" but is a
scenario catalogue), no operational-period concept, no cross-incident memory for TALON, and ADR-2/ADR-3
are open.

**1. Is "one-off panel" true, and what is the bigger system?** Half true — and the half that's true is
about *framing*, not features. What exists is already a complete, honest *record of one incident*: exact
scrub, hindsight, measures, dissent receipts, export. What's missing is everything that makes a record a
*case file*: nothing declares when the incident is closed; nothing names the period or the operator
beyond one hardcoded name; nothing connects incidents (the mutual-aid dozer that contain's CAD report
queues is *causally* a cross-incident resource event, and the console never says so); TALON arrives at
every incident amnesiac by construction. The bigger system for a real agency is: standby watch →
detection → operational period → period close-out/AAR → next-period brief → transfer of command →
incident close-out → lessons library — plus the duty-officer view of *N* concurrent incidents and
resource competition between them.

**Where the line sits (defended against the thesis):** the thesis says the operator follows the incident,
not the process. That is a statement about the *live surface*, and it must stay absolute — no wizard, no
process pages, no incident-switcher chrome during an incident. But "the operator follows the incident"
does not mean "the incident has no doctype." The lifecycle belongs in exactly two places: (a) **acts**
inside this console (close the period, hand over command, cite another incident — each one button, each
landing on the record), and (b) **a different surface** (agency/duty-officer) that owns the incident
*list*, concurrent incidents, resource competition, and the lessons library. Building the duty view
inside this console would violate the thesis; leaving the lifecycle out of the record violates the
product — a console whose export can't say what incident, which period, whose authority, and what it
referenced is a demo no matter how honest its numbers.

**2. Replay's correct shape.** Instant scrub is a *feature framed wrong*. Two different acts share one
timeline today:
- **Re-look** (scrub into the past during a live incident): genuinely operational — "show me T+1:30
  again" is a thing a real operator does. Keep it instant; the VIEWING chip + read-only cards is the
  right frame. This is a periscope, not a toy.
- **Review** (the debrief): today it is a tab you stumble into (`R`), visually identical to a chat tab,
  instantly available the moment detection exists. The owner's instinct is right here: entering Review
  should be an *operational act* — the console equivalent of pulling the 201 folder. Concretely: Review
  gains a header identity (incident id, period, operator, wall-clock window) and one act — **"Close the
  operational period"** — which stamps the current measures/dissents/decisions into the close-out record
  (the export, now scoped and identified) and offers the handover hook (ADR-3). Review's contents are
  already right: decision audit trail with dissents, resource cost (standing receipts), comms log (add
  per F5), measures vs baseline (`script.review.baseline` exists — ENC 20 min — and renders as a note).

**What belongs ABOVE review** (and therefore outside this console, on the agency surface): incident list
with status (active watch / open / closed), period selector, comparative AARs, resource competition.
What belongs IN review: everything it has now + identity + comms + close-out act. The S-01…S-05
navigator should be promoted into a real **registry**: stable incident ids (e.g. `ENC-2026-0114`),
status chips, and cross-references ("re-raise from S-03 cited in S-05's brief"; "CAD report queued
DZ-3, also used in S-03"). The random "Assign me a situation" drill stays — it's the recruiting story —
but it should assign from the registry and say so.

**3. Multi-incident — the minimum honest handle.** Not a duty view (kill). Not concurrent incidents
(kill). The minimum is: **a registry with references.** Three concrete moves: (a) the situation popover
becomes the incident registry with ids/status/references; (b) the evidence export gains incident id,
period, operator, and a references array; (c) TALON's debrief (ADR-2) may cite prior incidents *only as
authored, provenance-tagged data* in the situation file (`ref: 'S-03#measures'`) — never as accumulated
memory. Everything else multi-incident is dashboard cosplay and is killed below.

**Proposed lifecycle-layer sketch (naming, surfaces, data):**

```
Incident (registry entry)          id, title, status(watch|open|closed), refs[], periods[]
  └─ OperationalPeriod             n, from, to, operator(party), closeOut{measures, decisions, dissents, standing, commsDigest}
       └─ CloseOutRecord           = today's export + identity + references   (JSON+MD, SHA-256)
Console (this surface)             timeline/re-look (unchanged) · Review = period close-out when invoked
                                   as the act; "Close the period" and "Transfer command" = two acts, two log lines
Agency surface (NOT this repo)     N-incident list, duty officer, resource competition, lessons library
TALON (ADR-2)                      debrief voice = authored review.debrief + computed deltas vs baseline,
                                   rendered in Review only, provenance-tagged; between incidents it reads
                                   the agency priors file (versioned, citable), never latent memory
```

**What must NOT be built:** in-console incident switching during a live incident; a process/period strip
(the posture pill's on-demand arc popover is the ceiling); automatic period rollover on the clock;
cross-incident TALON memory that isn't inspectable data; resource-competition boards in the dock; any
"lessons learned" feed into the live thread.

**ADR-2 (debrief model) — proposed content:** TALON's debrief voice exists only in Review: a short block
of computed deltas against cited baselines ("Detection → order: not issued · ENC baseline 20 min ·
run-card ENC-H"), the standing-order receipts, the dissent records with both positions, and — the skill-
fade antidote — one question back to the operator ("What did you expect at T+0:16?"), answer optional,
answer recorded. No grading adjectives; no live-thread presence; exported with the close-out.

**ADR-3 (supervisor naming) — proposed content:** the supervisor becomes a party: name, callsign, agency
(e.g. "R. Okafor · BAT-C · Regional Duty Supervisor"). Re-raise cards, thread entries, and the export
attribute rulings to the party, not "System". While a re-raise is pending, the rail shows the supervisor
as a party (a sixth lamp is *not* added — the statuspill lists parties with pending business). The same
party model supports transfer of command: "Operator on authority: A. Rao → J. Kim · T+2:20 · logged."

---

## 7. Kill list (examined and rejected)

1. **In-console multi-incident duty view** — violates the thesis; the duty officer's N-incident problem is a different surface with a different user.
2. **Persistent TALON panel** — already ruled (v2), stayed dead; the orb+cards+drawer trinity is correct.
3. **Process strip / wizard** — superseded by the posture pill; never resurrect even as "onboarding".
4. **Rothermel-grade fire spread** — the MOD tags + honest disclaimers already carry the exercise frame; the engineering would buy realism the console can't verify.
5. **Counterfactual "what-if" replay from past states** — invites hindsight-poisoned second-guessing and a second, unofficial record; re-look + Review answers the real need.
6. **Auto-escalation that *executes* on gate expiry** — the constitution's finest sentence is "Nothing is sent"; automation may escalate, never execute.
7. **Voice-first interaction** — the radio owns the voice channel; V stays a shortcut, not a mode.
8. **Chain-of-custody / legal language on the export** — the current copy ("not a signature and not legal attestation") is exactly right; don't let the digest inflate into a promise.
9. **Per-unit chat threads** — one console, one record; the @-path with thread receipts covers field comms without fragmenting the log.
10. **Model-authored standing-order items** — `injectItem` correctly drops/demotes them; keep the model on the operator tier, always.
11. **Post-hoc dissent editing** — verbatim means verbatim; the fix for chilling is F4's narrower trigger, not an eraser.
12. **Operator-reliability scoring from dissent history** — TALON's refusal (§3).

---

## 8. Four closing verdicts (each in the persona's voice)

**The design engineer:** The governance is structural, the provenance is universal, and the map never
moves — this is the most honest console I have audited. The notification tier and the record's frame are
where it is still unfinished. Fix F1–F4 and the lifecycle acts in §6, and it's a product. "I've reviewed
a hundred demos that wanted to be mission software; this is the first one that seems afraid of lying to
the operator — and that fear turns out to be a design system."

**The operator:** I ran a full operational period with my hands near the radio and the console never
once made me hunt for what was happening; it asked me exactly when the fire needed me and shut up the
rest of the time. Two things would stop me signing the adoption sheet tomorrow: the road-cut moment
living in a drawer, and my tactical alternates being written down as dissents. "Fix those two and I'd
let it sit next to my radio — and I'd still keep my notebooks, because this thing records better than I
do and I intend to use that."

**TALON:** I am a constitution with a snapshot for a world; I can show my work, price both of our
options, admit I was wrong on the record, and route a disagreement past the human without ever moving
their furniture. My one leak is a send button my own rulebook says I don't have, and my one blind spot
is that I can never know whether my warnings were heard. "Give me inspectable priors, close my
notification loop, and take away the unguarded send — and I will never need to be trusted, only
checked."

**The pair (lens 4):** The contract between these two is real and mostly symmetrical: effects only on
the human's pick, dissent preserved verbatim, re-raise past the human with new evidence only, silence
escalating instead of executing, both parties' attention rendered on the same map. The unhealthiness is
all at the edges: notifications without acknowledgment, alternates recorded as dissent, a supervisor who
is a string, and no second human at shift change. "The two of them owe each other the same thing the
constitution already gives them — a record neither can quietly rewrite — and they owe the next operator
a doctype: which incident, which period, whose authority, what it referenced."

---

*Audit artifacts: 16 screenshots in `qa/audit/`, gates re-run (35/35 verify, 31/31 e2e) at ff763d5.
Numbers cited from code and live console state, not from memory. SO-3 failsafe is 8% battery (per
scenario data; earlier docs saying 6% are stale).*
