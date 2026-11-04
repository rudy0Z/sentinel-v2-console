# Sentinel Deep-Tier Product Design Audit — Index

**Date:** 2026-11-04
**Object:** Sentinel Command Console & TALON Copilot (this repository)
**Four deliverables:**

1. Legal & Regulatory Exposure Matrix — `docs/DELIVERABLE-1-LEGAL-EXPOSURE-MATRIX.md`
2. Stakeholder Friction Analysis — `docs/DELIVERABLE-2-STAKEHOLDER-FRICTION.md`
3. Human Factors & UX Laws Scorecard — `docs/DELIVERABLE-3-HUMAN-FACTORS-SCORECARD.md`
4. Strategic Product Designer’s Blindspot Register — `docs/DELIVERABLE-4-BLINDSPOT-REGISTER.md`

## The one-paragraph verdict

This is the most disciplined command-console prototype I have audited. The governance is load-bearing in code. The honesty extends to the product’s own export format. And it is not deployable in an active Emergency Operations Center. The 90-second brief is unmet and, in the form shipped, unmeetable: the statutory, aviation, evidentiary, and federated-command reality of a California WUI fire at 03:47 is absent from the model. The operator who would be sued is not a user. The drone that would be cited is not an aircraft. The public that would die is a device count. Polish is not the audit.

## What was evaluated

Mandatory assets: `docs/brief/FlytBase-Problem-Statement-Design-Fusion-S3-PD-and-Branding.md` (90-second paradox, 3:47 AM, PD vs UX); `docs/anatomy/` 01–10 + index; `DESIGN.md`; `DIRECTION-2026-10-25.md`; `docs/HANDOFF.md`. Plus first-hand read of `talon.ts`, `talonAgent.ts`, `commandConsole.ts`, `scenarioPlayer.ts`, `docs/DEEP-AUDIT-2026-10-27.md`, `docs/AUDIT-SIGN-OFF-2026-11-02.md`, and `data/scenarios/*.json`.

## Framing rules (do not inherit the wrong facts)

- DEEP-AUDIT findings are **F1–F13**. F1 (note-kind interrupts have no card) is **not** closed by the 2026-10-27 issued-banner/ack-loop fix.
- The export is an **integrity digest**. The copy that refuses legal attestation is correct. Do not inflate it.
- Dir. E. Lin’s “statutory issuer” label is a roster string, not a statute.
- ISA-18.2 is a 2-per-10-**scene**-minutes cap. The exercise clock runs ~130× wall clock.
- 90-second NSM and the 38-minute “Old Way” baseline are different numbers. Do not average.
- Every scenario is exercise data. This audit evaluates the design as if an agency were about to put it next to a radio.

## Scorecard of the four deliverables

| Deliverable | Headline | Deploy-blocking count |
|---|---|---|
| Legal matrix | Unnamed RPIC, fictional operator, banner WEA, unguarded send, non-record export | 7 Critical / 3 High in the Top-10 |
| Stakeholder friction | Unified Command is a popover; the public is a device count; the field cannot talk back | The endangered list starts with the public |
| HF scorecard | Pass 14 · At-Risk 15 · Fail 9 | Fails cluster on F1 visibility, circadian unreality, team SA |
| Blindspot register | 6 P0 · 10 P1 · 14 P2 | P0s are statutory actor, aircraft, WEA, F1, record, degradation |

## Deployment answer

**Training console, exercise frame unmistakable, `message_unit` gated:** yes, with F1, F4, and the party model closed first.

**Live WEA / dock-launched sortie in a 91.137 TFR at 03:47:** no. Not this build. Not without the P0 register closed.
