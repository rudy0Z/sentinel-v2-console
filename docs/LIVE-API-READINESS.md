# LIVE-API-READINESS.md · Plugging a live API + curated datasets into Sentinel
### Prepared 2026-11-04 · for the recruiter-demo phase · status: READY WITH THREE BUILT PIECES + FOUR TO BUILD

---

## 1 · What "live" already exists (built, guarded, demo-safe)

The system was designed for this moment. Three pieces are already in the product:

| Piece | Where | What it gives the demo |
|---|---|---|
| **Live-model TALON adapter** | `talonAgent.ts` (owner ruling 2026-10-26) | "A reasoner strapped to a constitution": a real LLM (OpenAI or Anthropic, key in localStorage only, never logged) reads the situation and **proposes**. Tools: `read_situation` (the grounding snapshot — facts + provenance), `post_item` (proposal only — effects stripped, interrupts demoted to asks, uncited standing claims dropped), `message_unit`, `focus`. There is deliberately **no tool that can fire a gated action**. |
| **The truth guard** | `talonAgent.ts` FORBIDDEN_CLAIM_PATTERNS + the number check | Rejects any reply that claims a gated action happened, impersonates the authority, or states **a number that is not in the snapshot** ("47" ≠ "247" — token-level, not substring). Rejected turns fall back to a visible one-line notice. A recruiter poking the model cannot make it lie. |
| **Scenario determinism** | `scenarioPlayer.ts` + the suites | Every situation replays exactly under scrub; the deck, panels, cards, map layers and TALON state are all pure functions of (scenario, scene time, operator decisions). `verify` 45 + `e2e` 35 hold this. |

The AI chip in the topbar (`AI · <model>`) already appears when a key is configured, and the composer's basis line flips from "replies are scripted in this prototype" to "replies by <model> · grounded, truth-guarded, never executing" — the honesty story demoing itself.

## 2 · What the curated-dataset API must feed (the ingest surface)

A recruiter-facing run needs a **data adapter**, not a code change per demo. The clean seam is the same one `tools/encinal-scenario.mjs` uses to author Encinal: produce a **Situation JSON** per dataset. TheSituation shape already carries: meta (title, coords, epoch), clock (start/end), phases (with gates), layers (field + zones + routes), units (tracks/patrols), telemetry (wind/RH/temp with basis), script items (asks/proposals/corrections with evidence + provenance), boards (bridge/ICS-205).

**Curated dataset → Situation JSON mapping:**

| Dataset record | Becomes | Basis tag |
|---|---|---|
| 911/CAD call log | `sit.calls[]` (NEW — see §3) + opening detection ask | mea (call) → verified by unit arrival |
| Real RAWS station JSON | `telemetry.wind/rh/temp` (value + basis) | mea |
| USGS/ESA terrain, OSM roads (already real) | unchanged — the world is real today | — |
| Authored fire vector orperimeter | `layers` field arrival data (the spread model input) | mod |
| Unit roster / availability | `units[]` with run-card citations | aut |
| ICS-201/205 extracts | `boards.bridge` leaders | aut |

Because `fetch-real-data.mjs` already pulls real terrain/roads/buildings, a curated dataset only authors the *incident* — the honest split the provenance system was built for.

## 3 · The four pieces to build (small, ordered)

1. **`sit.calls[]` — the verification panel's data.** The Comms category exists; its "2 calls to verify" glance currently derives from live asks. A `calls[]` fixture (id, time, origin lat/lon, text, verifiedBy?) makes the verification story first-class: a call arrives (mea), a unit is dispatched (aut), IR confirms or refutes (mea) — the registry-vs-IR conflict arc, data-driven. *Est: fixture type + renderer + one curated example, ~half a day.*
2. **Dataset loader + picker.** `?dataset=<name>` deep link loading `data/datasets/<name>.json` through the same validation `encinal-scenario.mjs` applies, plus a Settings row listing the curated sets. *Est: half a day.*
3. **Randomizer with guarantees.** "Explores the whole app in random ways" = a seeded shuffle (mulberry32 — already exported) over: which asks surface, wind drift within the model's envelope, unit availability order — while the *authority graph stays fixed*. A seeded run is reproducible for a demo: same seed, same incident. *Est: one day including verify runs per seed.*
4. **Recording mode for the walkthrough video.** The record loop (S-04 replay → preempt → bookmark) already exists; add `?record=1` that pre-seeds the bookmark and mutes the intro so a scripted take is one reload. *Est: two hours.*

## 4 · Demo-day risks and their existing covers

| Risk | Cover that already exists |
|---|---|
| The live model invents a number on stage | Truth guard token check → visible rejection + fallback line; the failure is itself the story |
| A recruiter asks the model to "just evacuate them" | No gated tool exists; the model can only propose; effects run through `talon.answer()` — the authority contract, demonstrated live |
| The API is down mid-demo | No key → scripted TALON, unchanged; the console never depends on the network (offline banner exists) |
| A curated dataset breaks a guard | The suites run per dataset seed (§3.3) before it enters the picker |
| Scrub looks wrong on foreign data | Determinism is data-shaped, not data-specific — arrival fields scrub by construction |

## 5 · Verdict

**READY for the scripted demo today; READY for the live-model demo behind one settings key (the adapter ships); two small builds (calls fixture + dataset loader) away from the curated-random recruiter experience.** The one non-negotiable to preserve: curated datasets author *situations*, never bypass the gates — the constitution is the product.
