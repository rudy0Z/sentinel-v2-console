# Last Visual Craft Audit — Sentinel crew-deck build

**Date:** 2026-11-05 · **Object:** working tree on `0bdfc4c` + uncommitted F1–F4 / F9 / `.toolseg` / wea-ack fixes · **Gates on this tree:** verify **45/45** · e2e **35/35** · typecheck clean · T+116 probe 0 page errors.
**Posture:** last craft pass before the case study ships. Not a redesign. What is closed, what is still ugly, what a 2026–27 Staff reviewer will screenshot.

---

## 0 · Verdict

The ten-lens review (2026-11-01) scored this console 6.0–8.0 with two Blocks. Every convergent P0/P1 from that review is now closed in code: the 1280 topbar overprint, the both-open tool kill, constitutional red on `.live`, zero-raw-hex, the 4px optical floor, `::selection`/`caret`, theme-swap smear, `prefers-contrast`, the growth-axis slice, F9 boot a11y, and the `.seg` name collision.

The uncommitted F1–F4 pass also closed the *operational* craft holes the lenses could not see: the road cut now reaches a heads-down operator (card + threat glance + `attn` pulse, live-verified at T+116), ungated asks leave a receipt, `message_unit` is gone, dissent is no longer a performance review for logistics, and the WEA update acknowledges instead of pending forever.

**Remaining craft debt is real and screenshotable.** None of it is a Block. Five items will be the thing a “most exacting designer screenshots the one wrong thing” reviewer catches: 9px dissent kbds, a 10px caret, keys 1–9 vs 1–3, High-Lux plan-state split-brain, and the issued-banner countdown reading `163s` twenty minutes after the ack.

**Craft score on this tree: 8.5/10.** The constitution is still the product. The deck is the best shell this console has had. The remaining work is a half-day of floors, labels, and one countdown.

---

## 1 · Closed since the ten-lens review (do not reopen)

| Finding | Was | Now |
|---|---|---|
| C1 · 1280 topbar overprint (8 lenses) | `.sitbtn` inner span had no `min-width:0` | `console.css:457` `.sitbtn > span { min-width:0; overflow:hidden }` + ellipsis on `b`/`small`. e2e V1/V2: 0 topbar intersections. |
| C3 · tools click-dead under cards (4 lenses) | Shared right anchor, z10 under z30 | Tools parked **left** (`console.css:481`). V3 both-open: 0 covered, `toolsTx: 0` both viewports. Collision class structurally dead. |
| C4 · growth x-axis sliced (3 lenses) | 32px `.fade-y` + 204px clip | `console.css:899` growth `.wbody` mask **none**. Axis labels survive. |
| C5 · concentric-radius conflict (6 lenses) | Comment said `max(2, 10−12)` | Ruling: `clamp(4, R−pad, 8)` — the 4px Optical Floor. Anatomy CONFLICT note replaced. |
| C6 · raw hex outside tokens (3 lenses) | 9 lines in the daylight block | Verify **zero-raw-hex: clean**. Component adjustments promoted to named Tier-3 tokens. |
| `.live` burned constitutional red (lens 08 Block) | `--critical` + blink every ops beat | `.live` is `--working` blue. Verify red-discipline: `live: []`. |
| No `::selection` / `caret-color` | grep 0 | `console.css:379–380` violet selection, violet caret. |
| Theme swap smeared 35 transitions | No suppression | `html.theme-swapping` kills transitions for 420 ms (`:368`). |
| No `prefers-contrast` | — | `prefers-contrast: more` + `prefers-reduced-transparency` both present (`:357–362`). |
| Focus ring faded in | Hallmark floor 15 | `:focus-visible` ring appears instantly (`:378`). |
| Hallmark boot blank-page risk | Script behind static markup | Unchanged pattern, but F9 now `visibility:hidden` so the faded boot is out of the a11y tree. |
| Dock overflow at 1440/1680 (C2) | Guard only 1280/1920 | Dock **retired**. Deck is 58 px, 6 segments, verify fits 1280 and 1920 with no dock-more. C2’s surface no longer exists. |
| `.bar i` width transition | Banned | scaleX contract live (`:944`). Timeline fill is scaleX. Residual `style.left` on playhead/scrubtip is positional (a head), not a fill — accepted. |

**Also closed in this uncommitted pass (operational craft, not in the ten-lens set):**

| Item | Fix | Live evidence |
|---|---|---|
| **F1** road cut unreachable | Awareness card (ack-only, never timeout) + Egress glance `Route A cut · primary egress gone` + `seg attn` | T+116: `bodyHasCut: true`, `anyAttnSeg: true`, cards carry the threat. 0 errors. |
| **F2** ungated asks vanish | `talon.ts` logs `Closed without a decision` | In the runtime. |
| **F3** model send button | `message_unit` deleted from the tool shelf | `talonAgent.ts`. Constitution intact. |
| **F4** every alternate = dissent | Ritual only if `dissent===true` or gated or interrupt. Generator flags `escalate`, `conflict`, `battery`, `stall`. Pre-position / release / monitor record and move on. | Diary condition #2. |
| **RECEIPT PENDING forever** | `wea-ack` at `@approve+2.4` | T+116 cards: “Acknowledged · WEA update received by Sheriff / County OES.” |
| **`.seg` collision** | Control groups renamed `.toolseg` (2026-11-05). Deck owns `.seg`. | Probe no longer miscounts. |
| Egress said “clear” at the cut | Threat-aware glance | `EGRESS · MEA · Route A cut · primary egress gone` |

**Regression I introduced and fixed this session:** regenerating `wui-breakout.json` from the generator dropped `meta.bridge` (ICS-205). Bridge restored from HEAD into the JSON **and** patched into `tools/encinal-scenario.mjs` so the next `npm run data` cannot lose it. Verify command-bridge: 4 leaders, TAK sync, hail ducks — green.

---

## 2 · Remaining visual craft debt (ranked)

### V-1 · 9px dissent kbds — below the console’s own 10.5 px floor
`console.css:1122` `.dchip .kbd { font-size: 9px; }`. The floor is 10.5 px (`--fs-badge`); functional floor 11 px (`--fs-micro`). These are the Q/W/E keys on the dissent box — a life-safety writing surface. A 0-YoE reviewer with a screenshot will catch this first.
**Fix:** `font-size: var(--fs-badge)` (10.5 px). One line. If the chip then clips, raise `.dchip` height 24→26 px.

### V-2 · Deck caret at 10 px
`console.css:807` `.slots .seg .caret { font-size: 10px }`. Same floor. It is a glyph, not decoration — it tells the operator the segment opens.
**Fix:** `var(--fs-badge)` or an SVG chevron at 12 px. Do not leave a 10 px text glyph on the primary glance surface.

### V-3 · Issued-banner countdown reads `163s` at the cut
T+116 probe: the draft’s ORDER ISSUED banner still shows **ACK PENDING (163s)** *after* the WEA ack has landed in the same card stack (“Acknowledged · WEA update received”). Two problems:
1. The banner did not resolve when the ack landed (or a second issued-state is counting to the wrong `ackAt`).
2. 163 s is not a remaining time at T+116 for any ack in the script (wea-ack is `@approve+2.4`; approve was T+93).
This is the “most exacting designer screenshots the one wrong thing” class. The statutory receipt was the hero of the last pass. A countdown that lies about pending-ness is a trust leak on the same surface.
**Fix:** `issuedState()` must resolve on `wea-ack` the way it does on the P-1 order ack; the countdown clamps to 0 and flips to the ack chip. If a second requisition is intentionally still pending, name it — do not leave one banner doing two jobs.

### V-4 · Keys 1–9 accepted, 1–3 documented (F10, still open)
`commandConsole.ts` `/^[1-9]$/` twice. Six-option battery exists, so 4–6 would be reachable if a scenario ever grew. Today every live card is ≤3. The drift will bite the first time someone adds a fourth option.
**Fix:** clamp to `^[1-3]$` or document 1–9 in the `?` panel and the anatomy. One or the other. Silence is a mode error.

### V-5 · High-Lux plan-state split-brain (documented, still a daylight HF fail)
`DESIGN.md` §6: `--plan-*` deliberately stay dark-theme values so the WebGL bridge cannot disagree. Consequence, also in §6: the 2D swatch and the 3D line for the same zone **intentionally disagree** in Field High-Lux. A trailer operator in direct sun is the person High-Lux exists for, and they get the worse plan-state contract.
**Fix (when someone will fund it):** emit a daylight `--plan-*` set and feed `readDesignTokens()` the *live* theme, not the dark literals. Until then, print the limitation in the High-Lux toggle tooltip — the current copy does not.

### V-6 · Evac widget still chips “proposed” after commit (F11)
`commandConsole.ts:1595` zone rows still key off board `proposed` keyframes. After `[1] Authorize` the map restyles committed and the **deck** Egress glance is correct; the panel widget can still read “proposed.” Change blindness on the one board the operator opens to check zones.
**Fix:** when `committed`, the widget reads “authorized · executing” (the ladder token exists). DEEP-AUDIT F11, still open.

### V-7 · `deckpanel` scrollbar contract fights itself
`console.css:837` `scrollbar-width: none` then `:838` `scrollbar-width: thin`. Last-wins, so thin is live — but the pair reads as two authors. The SIM report already flagged hidden overflow on the Situation panel (#7).
**Fix:** keep `thin` + `scrollbar-color`, delete the `none` line, and add the fade/thin bar the sim asked for.

### V-8 · `widget-in` replay on layout change
Old lens 07, still structurally present: `slots.innerHTML` rebuild on any deck-key change replays the 200 ms entrance on every segment. After the F1 cut-glance the Egress key changes, so the deck *will* re-enter at the climax if the key includes glance text (it does: `glances.map(g => g.v + g.sub + g.st)`).
**Fix:** animate only newly added segment nodes, or drop the entrance on key-change and keep it on first mount. A 200 ms re-entrance of five segments at the road cut is the opposite of “the furniture never moves.”

### V-9 · Cut card is mixed-signal: `card needs` + `dot critical`
The new awareness card is `class="card needs"` (amber edge) with `dot critical` (red). Red discipline says the dot may be critical (life safety). The edge says “waiting on a human.” Both are true — but the focal card of the flagship arc should not wear two authorities. Pick one: `card critical` with a 2px red edge (life-safety note, ack-only), or `needs` with an amber dot. Do not mix.

### V-10 · Cut card hardcodes TALON’s sentence in the shell
`commandConsole.ts` template: “Anyone still south of the hairpin cannot use Route A.” That is TALON’s line, authored in the shell. The constitution says the situation file is TALON. Smell: a translator or a copy pass will miss it.
**Fix:** pull `cut.title` / a new `cut.awareness` from the item, the way every other card does.

### V-11 · `.seg.attn::after` radius 12 px vs the 4 px Optical Floor
`console.css:810` attention ring `border-radius: 12px` on an 11 px segment. The Optical Floor ruling was about inner wells; this is an outer halo. It is not a conflict — but it is a third radius on the focal attention surface (11 px segment, 12 px halo, 8 px icon well). Screenshot-honest? Yes. Optically busy next to the 4 px coa wells? A little.
**Fix (optional):** halo radius = segment radius + 1, not +1 and a different identity.

### V-12 · Timeline playhead still `style.left`
Old lens 03 / 06. Positional, not a fill. Accepted as a head, not a bar. **Record-only.** If a profiler ever cares, `translateX(calc(...))` on a full-width head.

### V-13 · `.dchip` focus / `.seg` keyboard
axe is clean on four states — none of them is an open deck panel, the feed wing, or the new cut card. Hallmark’s “clickable map chips have no keyboard focus” is un-rechecked on this tree.
**Fix:** add deck-panel + wing + cut-card to the axe battery. One session.

### V-14 · Map label collisions (C7) — unverified on the deck build
CHOKE over ZONE 3, wind chips under the card column. No lens re-ran this on the crew-deck shell. The map tools moved left, so the old “labels lose glyphs behind the toolgroup” may be gone; CHOKE/ZONE may not.
**Fix:** one 1920 phase-D still with labels on, or a keep-out in the placer. Do not ship the case study with a map-label overprint in the hero shot.

### V-15 · HANDOFF / README / anatomy still describe the retired dock
Not a pixel issue. It is a craft-contract issue (C8: “a contract that doesn’t match its source stops being enforceable”). HANDOFF/README still say 44 checks; anatomy 01/03/08 still draw the 204 px dock and tools-right.
**Fix:** one documentation pass, or banner the anatomy set superseded by DESIGN.md §8.

### V-16 · `truncateThread` still dead (F12)
`talon.ts` defines it; zero callers. Scrub-back + new chat can leave future thread entries. Prototype gap, not a pixel. Named so it does not become folklore.

---

## 3 · New-deck craft — what is genuinely good (keep)

Do not polish these into something else.

- **58 px deck with terrain between segments.** The 204 px strip is gone. The map got ~150 px back. This is the first shell that looks like a command instrument rather than a dashboard with a map screensaver.
- **One glance per category, provenance chip on the segment itself.** `SITUATION · MOD · 19 in +60` is a sentence. The old five-widget scan was a paragraph.
- **Attention is earned.** Pulse requires promotion *and* `needs`. After the F1 fix, the cut pulses Egress with a reason. A working drone does not.
- **Tools parked left.** The both-open collision class is dead. Left/right can never meet. This is the layout decision that made the rest of the craft possible.
- **Pressed sinks.** No lit top edge in a dark room. `.toolseg [aria-pressed]` inset well.
- **Tabular numerals everywhere numbers live.** Clock, COA, deck glances, budget.
- **Red discipline holds under a parser.** Mic, pips, LIVE, low-batt — none of them red. The cut card’s critical *dot* is the first constitutional red on a new surface, and it is allowed.
- **Film grain, 10 px blur, accent-bar cards, 4px optical floor.** The v2 polish survived the deck cutover.
- **Reduced motion keeps state legible** (opacity only, no travel).
- **Issued receipt survives the emptied stack.** Still the hero. Do not let V-3’s lying countdown undo it.

---

## 4 · Scorecard

| Cluster | 2026-11-01 ten-lens | This tree |
|---|---|---|
| Topbar / collision | 8 lenses P0/P1 | **Closed** (V1/V2/V3) |
| Tools vs cards | Block (lens 07/09) | **Closed** (parked left) |
| Red discipline | Block (lens 08) | **Closed** |
| Token hygiene | 3 lenses | **Closed** (zero-raw-hex clean) |
| Radius / focus / selection / theme-swap / contrast media | Open | **Closed** |
| Growth axis | 3 lenses | **Closed** |
| F1 road cut | Not in the lens set (product gap) | **Closed this pass** (live-verified) |
| Type floor (9/10 px) | 2 lenses | **Open** (V-1, V-2) |
| High-Lux plan colours | Documented ruling | **Open** (V-5) |
| F10 / F11 / F12 | Open | **Open** |
| Countdown honesty | New | **Open** (V-3) |
| Deck re-entrance | Old lens 07 | **Open** (V-8) |
| A11y battery breadth | 4 states | **Open** (V-13) |
| Doc/anatomy drift | C8 | **Open** (V-15) |

**Net:** the Blocks are gone. The remaining list is a polish pass, not a redesign. A recruiter who reads the case study will not see these unless they screenshot the dissent box, the High-Lux toggle, or the cut-frame countdown. A design-director interview will.

---

## 5 · The half-day punch list (do this, then stop)

1. `.dchip .kbd` → `--fs-badge`; `.caret` → `--fs-badge` or SVG. *(V-1, V-2)*
2. `issuedState` resolves on `wea-ack`; countdown cannot show 163 s after an ack. *(V-3)*
3. Clamp keys to 1–3, or document 1–9. *(V-4 / F10)*
4. Cut card: one authority (critical), copy from the item, not the shell. *(V-9, V-10)*
5. Evac widget “authorized · executing” on commit. *(V-6 / F11)*
6. Deck entrance on mount only. *(V-8)*
7. `deckpanel` one scrollbar rule + visible thin bar. *(V-7)*
8. axe battery: deck panel, feed wing, cut card. *(V-13)*
9. One still at 1920 phase D with map labels; fix any overprint. *(V-14)*
10. HANDOFF/README counts + anatomy banner. *(V-15)*

High-Lux plan tokens (V-5) and `truncateThread` (V-16) are the next session, not this one.

---

## 6 · What “last” means

This is the last craft audit that should find a Block. It did not. The next person who says “the console looks finished except…” should be handed this list, not a new lens.

The product’s craft voice is the one the hallmark lens wanted and the shipped console now mostly speaks: tracked caps that carry a value, a 10.5 px floor that is a ruling rather than an accident, red that means life safety, a map that never moves, a receipt that does not lie. The nine items above are the difference between *mostly* that voice and *entirely* that voice.

Close them. Then write the case study against this tree, not against `0bdfc4c`.

---

*Evidence: `qa/audit-f1-out2.json` (T+116 with the cut card + threat glance + wea-ack, 0 page errors) · verify 45/45 · e2e 35/35 · typecheck clean · `console.css` / `commandConsole.ts` / `talon.ts` / `talonAgent.ts` working-tree diffs vs `0bdfc4c`.*
