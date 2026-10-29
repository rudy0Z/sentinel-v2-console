# DESIGN.md · Sentinel console design system (v2 polish pass 2026-10-28)

The complete visual + interaction contract for the console. Review the live system on `/tokens.html`.
Section names below refer to `console.css` headers (line numbers drift; section names don't).

## 1 · Three-tier tokens

`console.css` defines every colour, size, radius, duration and layer once. Components consume Tier 2/3 only.

| tier | holds | examples |
|---|---|---|
| 1 — primitives (`TIER 1`) | raw values, never used by components | `--p-slate-0..12` neutral ramp, chromatic primitives (`--p-cyan-500`), alpha ladder (`--p-alpha-w-04..60`) |
| 2 — semantic intent (`TIER 2`) | surfaces, borders, text, state, provenance, plan states | `--bg-surface-2`, `--text-3`, `--needs`, `--plan-committed`, `--prov-measured` |
| 3 — component & state (`TIER 3`) | buttons, cards, tints, wells, masks, focus, motion | `--btn-shadow-active`, `--tint-critical-bg`, `--rim-gradient`, `--ease-out-expo` |

- **Documented OKLCH deviation:** the spec asked for OKLCH primitives; they ship as exact hex by
  design — the WebGL bridge (`terrainEngine.ts` PALETTE, fed by `readDesignTokens()`) shares the
  same literal values, so cards and map can never disagree. The deviation note lives in the
  `TIER 1` header.
- **Zero-raw-hex enforcement:** no raw `#hex` or `rgba()` literal may appear in `console.css`
  outside the two token blocks (`:root` and `:root[data-theme="daylight"]`). Everything else —
  including tints, shadows, masks and the wordmark gradient — is a Tier 3 token. Scanned clean as
  of 2026-10-28; keep it that way.
- **Alias layer:** `--n-0..12`, `--state-*`, `--map-*`, `--red-5`-style hue steps are kept as
  aliases to Tier 1/2 because the TS bridge and older rules read them. New CSS must not add
  consumers of the legacy hues.

## 2 · Text contrast contract (WCAG AA)

Measured on the widget surface `#101218` and the raised surface `#0C0E13` (see `tokens.html` for the live table):

| token | value | ratio | role |
|---|---|---|---|
| `--text-1` | `#ECEEF2` | 16.1 · 16.6 | primary |
| `--text-2` | `#B6BDCB` | 9.9 · 10.2 | secondary |
| `--text-3` | `#8E96A9` | 6.3 · 6.5 | labels, muted |
| `--text-4` | `#7D86A0` | 5.2 · 5.3 | axis, timestamps, micro |

- Floor rule: **every text token ≥ 4.5:1**. `--text-4` was lifted from `#535A6C` (which failed) —
  one step past the spec value `#788195` so it also clears 4.5:1 on `--bg-raised` composites.
- `--fs-*` scale: data-ink floor **10.5px** (`--fs-badge`, `--fs-chart`, `--fs-harness` — mono data
  badges, chart axes, harness chrome), functional floor **11px** (`--fs-micro`) for interactive
  labels, then caption 11.5 · body 12.5 · title 13.5 · heading 17 · readout 18 · display 22.
- The verify guard computes the WCAG ratio live (see §7) — darkening `--text-4` again fails CI.

## 3 · Plan-state ladder — chrominance AND geometry, never colour alone

| state | colour | geometry (everywhere it appears) |
|---|---|---|
| proposed | `--plan-proposed` `#8FB8FF` periwinkle | dashed stroke (`stroke-dasharray`/`1px dashed`), hollow or translucent fill, hollow dashed 2D swatch |
| committed | `--plan-committed` `#00E5FF` cyan | solid 1.5–2px stroke, solid indicator dot, solid swatch |
| draft | `--plan-draft` `#FF8A4A` | TALON revision styling, rendered beside (never over) the committed plan |
| cut / compromised | `--plan-cut` `#E5533C` | P0 life-safety only |

- **Why proposed moved off cyan:** `#8FB8FF` is a deliberate cool ice-blue. The old proposed value
  sat equiluminant with committed cyan — an operator under stress or a washed-out projector could
  not tell drawn-not-authorized from in-force by colour. The remaining cyan is reserved for
  committed (solid geometry only).
- Map: `terrainEngine` `styleLine` states (`proposed` dashed / `committed` solid) mirror the same
  tokens via the palette bridge; the 2D board echoes them (`.zrow` swatches, evac routes).

## 4 · Authority contract (two tiers, no third)

1. **Two tiers only: `standing` and `operator`.** TALON acts alone only under a cited standing
   order or run card; uncited standing items are dropped — including model-posted ones. Option
   effects run only when the operator picks them; a TALON draft is a proposal, never an execution.
2. **ISA-18.2 interrupt budget:** `{ max: 2, windowMin: 10 }`. Excess interrupts are demoted to
   asks and the demotion is logged; the meter (pips) lives on the drawer. Life-safety items are
   exempt and always come through.
3. **Silence is never approval.** A gated plan or report with no decision lapses; nothing is sent;
   the lapse is escalated.
4. **Dissent is preserved.** Declining the recommendation keeps TALON's position and reasons plus
   the operator's words verbatim; a re-raise cites new evidence only and routes to the **Regional
   Duty Supervisor**.
5. **Typed approvals are refused.** "approve/yes/go" in the composer while a gate is open shakes
   the field and raises the `STATUTORY GATE LOCKED` callout — free text cannot authorize.
6. **Ack-pending issued state.** A statutory action renders the issued banner
   (`ORDER ISSUED · REQ → LASD/OES` + `ACK PENDING (Ns)` countdown) until the scripted receipt
   lands as `✓ acknowledged`. The state is **derived** by `talon.issuedState()` from the script and
   scene time only — no wall clock, no stored flag — so it is scrub-deterministic. The selected
   option gets a 180ms `.is-latching` confirm before the card resolves.

## 5 · Red discipline (constitutional)

**Red = life safety only.** Von Restorff / ISA-18.2: amber (`--needs`) means *waiting on a human*;
violet (`--talon`) means *TALON activity*. Three states were re-tokenized off red:

| state | was | now |
|---|---|---|
| mic recording / PTT active | red | `--talon` violet (`.rail .rbtn.mic[aria-pressed="true"]`) |
| interrupt-budget pips | red | `--needs` amber (`.pips i.on`) |
| drone battery < 25% | red | `--needs` amber (`.batt.low/.batt.warn`); red stays reserved for auto-land / link-lost failure states |

Enforced by the verify guard (§7): it parses the live stylesheet and fails if any `.mic`, `.pips`
or `.batt.low` rule applies `--critical` or any red alias/literal, and asserts the live DOM renders
a sub-25% battery in the resolved amber.

## 6 · Tactile motion grammar

- **Curve:** `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` — damped avionics release. The toy
  bounce (`cubic-bezier(.2, 1.4, .35, 1)`) is banned.
- **Dual press idiom:** wide switches and decision rows (`.btn`, `.opt`, `.rbtn`) travel
  `translateY(1px)` — 40ms in, 120ms `--ease-out-expo` release — while the top specular highlight
  collapses (`--btn-shadow-active`). Compact pills and chips (`.chip`) press with `scale(0.97)`.
  Never mix them.
- **Compositor-only fills:** bars animate `transform: scaleX(var(--fill))` (160ms, origin left) —
  never `width`. The width transition survives only for legacy width-set bars; new code sets
  `--fill`. The TALON drawer displaces `#cards` with `translateX`, never `right`.
- **Entrance/exit asymmetry:** entrances 120ms, exits 80ms — leaving is always faster than
  arriving. Popovers set `transform-origin` by anchor: rail popovers `top right`, topbar popovers
  `.from-top` → `top center`.
- **Scroll fades:** `.fade-y` (and `.wbody`, `.pbody`, `#cards`) and `.fade-x` (`.slots`) mask their
  overflow edges via registered `--fade-start/--fade-end` props animated on the element's own
  scroll timeline.
- **Reduced motion:** `prefers-reduced-motion` keeps state legible — opacity fades survive at
  80–120ms, continuous loops and keyframes stop, entrances collapse to opacity-only, presses and
  shakes don't travel.
- **CSS ↔ WebGL bridge:** `readDesignTokens()` reads the live computed custom properties on
  `<html>` and `applyTokens()` feeds them to `engine.setPalette()`. Palette changes are a pure
  function of the theme attribute — never of time — so scrub determinism is untouched. `<meta
  name="theme-color">` tracks the theme.
- **Field High-Lux (daylight) theme:** `:root[data-theme="daylight"]` overrides every semantic
  token — warm tactical alabaster surfaces (`#F2F0EA` / `#E6E3DA`), deep obsidian ink `#11141C`,
  bold 1.5px structural borders, zero reliance on outer glow. Toggle in Settings
  (`EOC Darkroom` / `Field High-Lux`). **Documented limitation:** the 3D terrain keeps its dark
  lighting in every theme — `--plan-*` deliberately stay the dark values so the bridge keeps
  feeding the dark map; only the CSS surface aliases (`--map-*`, `--state-*`, `--viz-*`,
  `--prov-*`) switch to darker map-ink variants.

## 7 · Verify / e2e as the enforcement layer

`node tools/verify.mjs` (38 checks) and `node tools/e2e.mjs` (31 checks) are the contract, not a
smoke test. The three design-system guards (verify, `design-system guards` section):

1. **Red discipline** — fetches `/console.css` in-page, strips comments, splits every innermost
   rule block, and fails if any rule whose selector matches `.mic`, `.pips` or `.batt.low` applies
   `--critical` / a red alias / a red literal (whitespace-tolerant); asserts the `.batt.low` rule
   uses `--needs`; then, live at T+76 where FT-01 is below the 25% handover floor, polls the fleet
   widget and asserts the low-battery readout's computed colour equals the resolved `--needs`.
2. **`--text-4` contrast** — resolves `--text-4` and the live `.widget` background in-page
   (alpha composited over `--bg-canvas`), computes the WCAG relative-luminance ratio, and requires
   ≥ 4.5:1 against both the widget surface and the documented token surface `#101218`.
3. **Dock overflow affordance** — at 1280×800 (`phase=D`) asserts `.slots` clips, that
   `.dock-more` then exists, is visible, counts the clipped widgets (`+2 widgets ▸`) and scrolling
   on click advances `.slots.scrollLeft`; at 1920 asserts no overflow and no pill.

Everything else the suites hold the line on: two-tier authority with citations, the 2-per-10-min
budget over a whole run, lapse-on-silence, dissent records, ack loops, scrub determinism (map +
TALON restore exactly), ≤ 20 draw calls per beat, axe-core 0 violations, and the adversarial
battery (worst-case items, six options, time edges, 200% zoom) in e2e. Do not weaken a check to
make a change pass — change the change.
