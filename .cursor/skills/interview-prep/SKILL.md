---
name: interview-prep
description: On-demand interview prep for staged or upcoming interviews — behavioral stories from experience/pool.md and optional skills prep when config interview loops include coding/DSA. Use when the user asks to prep for an interview, practice stories, or study for this job search.
---

# Interview Prep

Separate from job-hunt. Run when the user asks to prepare for interviews.

## Setup gate (refuse if incomplete)

If [`pipeline/config.md`](../../../pipeline/config.md) has `SETUP_INCOMPLETE` or [`pipeline/candidate-profile.md`](../../../pipeline/candidate-profile.md) has unresolved `YOUR_*` placeholders, **stop** and ask for setup.

## Inputs

- Target company/role (or packet id under `pipeline/packets/`)
- [`experience/pool.md`](../../../experience/pool.md)
- [`pipeline/config.md`](../../../pipeline/config.md) — **Interview loops** section
- Packet `handoff.md` if present (woven tech talking points)
- Packet **`essay-answers.md`** if present — submitted application essays (prompt + answer); rehearse these stories first
- User’s current skills level (default: ask once if unclear)

## Prose

Explanations and story scripts follow **write-well** — read companions under [`../write-well/`](../write-well/) before drafting long prose.

## Workflow

### 1. Clarify the loop

Ask only if missing: company, interview stage (screen / skills / onsite), known format.

Cross-check expected loop types against `config.md` **Interview loops** — do not assume coding/DSA unless listed there (or user explicitly requests it).

### 2. Build a prep brief

Write or update `pipeline/prep/<company-slug>.md` (create `pipeline/prep/` if needed) with:

1. **Role snapshot** — what they care about (from JD + handoff)
2. **Story bank** — 4–6 STAR-ready stories from the pool (concrete outcomes; no employer-name gossip beyond what’s in the pool). Keep concrete; no fluff.
3. **Woven-tech lines** — from packet handoff when present; rehearse honest softer wording
4. **Skills block (only if config includes coding/DSA or user asks):**
   - Arrays/hash maps, two pointers, BFS/DFS, heaps, basic DP (adjust to occupation)
   - Timed practice plan + review misses
5. **Domain exercise (if loop includes case/portfolio/demo)** — one practice prompt tied to pool work
6. **Questions to ask them** — 3 specific, non-generic

### 3. Drill mode (optional)

If the user wants practice now: ask one behavioral or one skills-style question at a time; give terse feedback; next question.

## Hard rules

- Do not invent employers, metrics, or technologies beyond pool + documented weave notes
- Prefer honesty over “perfect” answers for woven items
- Keep briefs usable in one sitting — no novel-length guides
- No DSA grind plan unless config interview loops include coding or user requests it
