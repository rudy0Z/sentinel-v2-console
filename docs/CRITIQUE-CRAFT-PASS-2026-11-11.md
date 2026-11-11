# Critique & Craft Pass 2 — 2026-11-11 (overnight autonomous run)

**Scope:** pbakaus/impeccable `critique` (dual-agent, latest v4.8.2 definitions fetched from GitHub) → fixes via `polish` + `quieter` + `distill` lenses + emil-design-eng principles → verification → skill installation.

**Verdict before → after:** Design Health **30/40 (Good)** → all 2×P1 + 3×P2 findings fixed, zero test regressions. Full critique snapshot: `.impeccable/critique/2026-11-10T23-33-08Z__index-html.md`.

## Method
Dual-agent per the critique contract: Assessment A (design review, 9 live captures at 6 viewports + 4 states) and Assessment B (deterministic detector: static scan + injected browser overlay at 3 runtime views) ran as isolated parallel sub-agents; synthesized in the parent. Skill definitions were loaded fresh from `github.com/pbakaus/impeccable` (`.agents/skills/impeccable`) and `github.com/emilkowalski/skills` rather than the stale local install.

## Critique highlights
- **Specificity verdict: AUTHORED** — provenance (MEA/MOD/AUT), the authority ladder (OWNED vs REQ), issuer vocabulary and the MOD-vs-MEA correction ritual are load-bearing product language; one generic vessel (the TALON dock shell), contents fully domain-authored.
- **Strengths:** the correction ritual (an error turned into evidence); typographic urgency on the gate stake (red untouched); the dissent ritual; genuinely calm standby.
- **Deductions were discoverability and copy contradictions, not craft** — see fixes below.

## Fixes applied (Emil-format review table)

| Before | After | Why |
| --- | --- | --- |
| `.gate b` mono stakes clipped mid-word ("…reverse-911 → Sheriff / County C│") | `.gate > * { min-width: 0 }` + `.gate b { overflow-wrap: anywhere }` | Statutory text is the thing being authorized — clipping was content loss at max consequence [P1] |
| `.auth-pill { white-space: nowrap; padding: 1px 6px }` | `white-space: normal; overflow-wrap: anywhere; padding: 2px 7px` | Pills wrapped *out* of the card instead of wrapping *inside* themselves; cramped padding flagged ×6 by detector |
| Global `keydown`: Space branch exempted only inputs — Space on a focused `.opt` paused the exercise | Space branch now skips `button, [role="tab"], a[href]` so the browser activates the focused control | Keyboard/a11y defect on the decisive surface; options advertise keycap activation [P1] |
| Dock line "Watching · nothing needs you" under an unacked red cut card | Cut card counted: `waiting = mine + cutPending` in dock header, rail badge and statuspill; `.phead` dot follows | The two most-trusted status signals disagreed at peak stress [P2] |
| "Also waiting" label with no count, rows below the fold | `Also waiting · N` (total queued) | Workload estimate under stress is a safety question; rows stay secondary per one-card doctrine [P2] |
| `.measures` 2-col grid, 5th tile sliced at the fold | `.measures .measure:last-child:nth-child(odd) { grid-column: 1/-1 }` | An odd trailing measure spans the row; the after-action trust payoff no longer reads as a broken render [P2] |
| `.widget > header h3` at 11.5px caption (below body 12.5) | `font-size: var(--fs-body)` | flat-type-hierarchy (detector): a header must read above body, not below |
| Engine map chips: `.tte-pill i` #5B6878 (≈3.4:1), water label #4E6A86 | #8194A8 (≈5.6:1) and #6E8095 (≈4.5:1) | Detector low-contrast findings on functional map-chip text |
| Panel widget close button = second chevron (`up` icon next to the title's menu chevron) | `close` (X) icon — one chevron per meaning | Distill: two look-alike chevrons invited the wrong click |
| `.live::before` blink `steps(2)` (already smoothed) | — | carried from earlier pass; detector re-flags it by design, now in ignore.md |

## Accepted-by-design (documented in `.impeccable/critique/ignore.md`)
Brand wordmark gradient · LIVE liveness pulse · the one needs/critical state bloom · gate hazard band (side-tab was a signature-match/classification-mismatch) · track future-stripes · Geist as the committed system face · 10px engine map cartography labels.

## Verification
- `npm run typecheck` clean · `npm run build` · **verify 45/45** · **e2e 35/35**
- Visual review (`qa/cr-fix-*.png`): gate text wraps fully (all statutory lines + OWNED/REQ pills complete); dock reads "1 needs you" under the unacked cut card with badge 1; review 5th measure full-width; panel shows X vs menu chevron; instrument segments intact.
- Detector re-run on changed targets: exit 0 (intent-level findings advisory via ignore.md; TS scans recorded as regex-mode undercount, limitation noted).

## Deliberately not done (with reasons)
- **Composer/suggest-chips restructure** — belongs to the agreed voice-first phase (user's ruling); doing it now would be reworked twice.
- **Deck removal / queue-above-fold** — deck is the founder's concept (DESIGN.md §10); queue surfaced via count + existing rows without breaking one-card doctrine.
- **`~/.claude/settings.json` invalid JSON** — pre-existing on the machine; the impeccable updater needs it fixed to update the Claude-copy install; not modified silently.

## Skill installation (post-job, per instruction)
- `npx impeccable update` → project `.agents/skills/impeccable` **v4.8.2** + fresh engine binary v0.1.21; the update split the commands into standalone skills (`critique`, `distill`, `polish`, `quieter`, …) matching the marketplace listing.
- Synced v4.8.2 to `~/.zcode/skills/impeccable` and `~/.agents/skills/impeccable`.
- Emil skills (emil-design-eng, prototype, animate*, break-ui, review-animations, …) confirmed installed at user and project level.
- Pending on the user: fix `~/.claude/settings.json` JSON validity, then re-run `npx impeccable update --user` for the `.claude` copy.
