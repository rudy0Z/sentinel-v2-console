# DIRECTION.md · Sentinel layout exploration (2026-11-04)

Process: the web-designer skill (brief → traps → three directions → render the real first screen → choose). The app-designer skill was read too — it targets iPhone screens with an iOS-26 renderer on a Mac, out of its element for a 1920 command console; its process rules (three real directions, defended decisions, slop scan) are applied through web-designer here.

## Brief

- **What:** layout exploration for the Sentinel wildfire command console. Same product, same identity — different *shells*. The question: is there a layout that embraces TALON more fully while reading even more like a high-stakes emergency response panel?
- **The one job:** an operator with seconds, not minutes, must (1) see the situation, (2) read what TALON proposes and WHY, (3) authorize or refuse — with every basis on the record.
- **Feel:** avionics calm · crew authority · zero decoration. References from outside the web: an airline operations center cab at night; a legal transcript feed; a helmet-mounted display.
- **What exists:** everything — live WebGL terrain, the 10-sheet dimensional drawing set, a locked three-tier token system (EOC Darkroom), Geist/Geist Mono, violet=TALON, amber=waiting-on-human, red=life-safety-only, the 45+35 gate suites.
- Brief is **user-authored** (the brief conversation). No paid credits used; imagery is the product's own live map frame, captured from the real console at phase D.

## Current (the incumbent shell — the history row)

- **Shell:** `canvas` — full-bleed map, every region floats on it as dark glass (topbar, right decision lane, bottom dock, edge rail). Documented in docs/anatomy 01–10; guarded by V1–V4.
- **Audit:** wears none of the four 2026 slop faces (it is an Instrument-direction app with an owned identity), but the 2026-11-02 user critique stands: five regions share one rounded dark-glass box treatment → "a clean Linear/Vercel app floating over a map", and TALON reads as a 2D sidebar bolted onto a 3D map.
- **What works and must survive (keep list):**
  - [x] The map is the ground and the reply surface (map-is-the-reply)
  - [x] The decision lane: cards with gate + COA + keyboard [1][2][3], right-anchored
  - [x] Provenance chips (mea/mod/aut) on every number; gate law visible (lapse copy)
  - [x] The dock widgets (weather, fleet, evacuation, growth, structures) — live, provenanced
  - [x] TALON thread with working-memory anchor ("Δ since your last decision")
  - [x] Violet=TALON, amber=needs-human, red=life-safety; EOC Darkroom ground; Geist/Mono
  - [x] Edge-rail tri-state mic / authority / settings presence
- **Decisions for the user (listed, not made):** which shell becomes the product; whether TALON's presence moves from the edge rail to a full seat/column; whether the dock stays floating or docks into a bezel.

## Category default being refused

The category default for "AI + map + emergency" is the copilot sidebar: chat panel docked right of the map, chat bubbles, a sparkline strip — precisely the "2D sidebar bolted onto a 3D map" the user rejected. Also refused: the transit/departure-board rut (slop.md §8 second rut) and sci-fi HUD cosplay (glows, scanlines, fake cyan) — directions.md C's own slop. Real instruments are calm.

## The evolution declaration (redesign.md §6)

This is an **evolution**, not a re-skin: the exploration varies the axes the user asked about — **shell, TALON's materialization, the decision surface, and the signature motion** — while keeping the owned identity columns (dark ground, Geist/Mono, violet/amber/red discipline, live-data richness). The incumbent `canvas` shell is the baseline; the three explorations are `split`, `inbox`, and `command`.

## Three concept sentences (different source families, first ideas discarded)

1. **A · Crewed Deck (split)** — source *Places → an airline operations center cab at night* (first idea "NASA mission control" discarded: the average association). *"Sentinel is the second chair in an operations center cab — the crew member who has already read everything, seated at your left, facing the same wall."* TALON holds a permanent instrument seat; the map gets a hard bezel instead of floating glass; the decision docks as a stroke row.
2. **B · Wire Room (inbox)** — source *Media → the live caption feed of a courtroom / ATC readout* (first idea "telegraph wire" discarded: board-adjacent). *"Sentinel is the record — everything TALON says, every basis, lands in one legal transcript, and the map is the reply column that answers it."* The thread is the spine; the decision is the newest transcript entry; the map answers on the right.
3. **C · Command Bar (command)** — source *Objects → a helmet-mounted display* (first idea "Iron-Man HUD" discarded: slop). *"Sentinel is a heads-up display — TALON has no panel at all; it speaks through the terrain, and the only chrome is one command bar that carries the decision."* Map full-bleed; one bottom command bar; everything else rises on demand.

All three: ground dark (owned), type Geist/Geist Mono (owned), accents violet/amber/red (owned), richness = the live map + live data (owned), shells `split` / `inbox` / `command` (varied), TALON grammar: seated colleague / transcript spine / dissolved-into-terrain (varied), decision surface: bezel-docked stroke row / in-thread document / single command bar (varied), motion signatures: seat-stroke slide / teletype + stamp / bar-breathe + rising sheet (varied).

## States shown (app.md §3, mid-use)

Each exploration renders the same realistic mid-use beat: LIVE T+0:06 on wui-breakout, Plan P-1 gate open (10:00 left), TALON "3 need you", budget 1/2, the four thread entries, the six fleet rows, the weather/growth/structures numbers — all real from the scenario. Deliberately shot at 1920 (+1440) only: the product's viewport contract floors at 1920×1080 16:9 (DESIGN.md §8); phone/tablet passes are out of contract for this artifact and marked as such rather than silently skipped.

## Verdict (2026-11-04, after the shoot)

All three render clean at 1920 and 1440; the only scan FAIL left in each is the owned 10.5px data-ink floor (answered: DESIGN.md §2, deliberate). History checks clear for all three.

- **A · Crewed Deck — the pick.** It is the only direction that fully answers BOTH brief criteria at once: TALON is embraced *structurally* (a seated colleague with a lit edge — not a sidebar, not a chat drawer), and the panel reads high-stakes (hard bezels instead of floating glass, the decision docked as a stroke row with the COA table and gate law always on screen, the instruments in a single bezel strip). The map actually gains area versus the incumbent, because the seat replaces both the right lane and the floating dock. The operator's eye walks left→right exactly as the job orders it: what TALON knows → the world → what needs my hand.
- **B · Wire Room — lost on map primacy.** The transcript-spine is the strongest expression of "governance is the interaction model" (the decision IS a record entry), but it demotes the map to a reply column and leaves the lower reply surface empty; an operator's eye lives on the terrain during a run. Its working-item-in-thread idea survives as a merge candidate into A's seat queue.
- **C · Command Bar — lost on statutory anatomy, kept as a mode.** The most cinematic and the truest "map is the face", but the gate/COA anatomy the case study calls the hero compresses to one bar line; the full decision lives a keystroke away instead of on screen. It is the right **presentation mode** for the 90-second video's wide shots.

Recommended path: adopt A as the product shell (merge B's working-item framing into the seat queue; keep the incumbent's avionics instruments — tether, reticle, probe — which A already carries), keep C's grammar as a replay/presentation mode. The production rebuild is its own engagement: it touches the guarded layout contract (V1–V4), the dimensional drawing set, and the case-study mockups, so it starts after the owner signs the direction.
