# Pipeline config

<!-- TEMPLATE: run setup or edit. Marker: SETUP_INCOMPLETE -->

Source of truth for on-demand job-hunt scoring and staging. Agents read this before discovery.

## Occupation

YOUR_OCCUPATION — any field (nursing, trades, PM, design, research, ops, software, …). Do not assume engineering.

## Goal

- Land a role matching your title allow-list and location filter
- Comp floor: YOUR_SALARY_FLOOR (or `unspecified` to keep unknown-comp roles)
- Timeline / start: YOUR_START_WINDOW
- Narrative: see `experience/pool.md`

## Submit mode

| Mode | Meaning |
| --- | --- |
| `review` (default) | Fill forms; **do not** click Submit / Apply / Easy Apply |
| `when-verified` | After the completeness check passes, agent may submit for this session until you say `turn submit off` |

Current: **review**

Leftovers, captcha, and login walls always stop the run, even when `when-verified`.

## Location hard filter

**Only** stage or fill roles that match your allow-list (edit these):

1. YOUR_LOCATION_OPTION_1 (e.g. fully remote US)
2. YOUR_LOCATION_OPTION_2 (e.g. preferred metro onsite/hybrid)
3. YOUR_LOCATION_OPTION_3 (optional)

**Hard skip:** locations you listed as blocked (e.g. cities you will not relocate to).

Resume header and “live local” screener answers: follow `candidate-profile.md` + this allow-list. Do not invent “already local” unless the user set that policy in setup.

## Discovery sources (enabled)

Edit during setup. Job-hunt searches **only** what is enabled here.

| Source | Enabled | Needs login | Notes |
| --- | --- | --- | --- |
| public_ats_urls | yes | no | Greenhouse, Lever, Ashby, pasted career URLs |
| linkedin | no | yes | Enable after login + `browser-auth.py save linkedin` |
| ycombinator | no | yes | Work at a Startup |
| custom | no | maybe | Add rows in `browser-auth.md` |

## Volume

- Default packets per “run job hunt”: **15** (override with N in chat)
- Discover more candidates than N; stage only the top scored

## Title allow (examples — replace)

YOUR_TITLE_1, YOUR_TITLE_2, Junior / Associate variants as you prefer

## Title block

Roles you will not take (edit): e.g. unpaid, commission-only, unrelated title spam

## Comp

- Include if parseable total cash ≥ YOUR_SALARY_FLOOR
- Keep **unknown** comp unless you set otherwise
- Drop if clearly below floor

## Scoring heuristic (0–100) — edit weights for your field

| Signal | Points (guide) |
| --- | --- |
| Title match | +25 |
| Skill / keyword overlap with pool | +20 |
| Location match | +15 |
| Comp ≥ floor known | +15 |
| Comp unknown | +5 |
| Seniority fit | +10 |
| Domain / product fit to pool | +10 |
| Blocklist hit | score = 0 |

Stage packets for highest scores until N. Put the rest in tracker as `discovered` (maybe).

## Interview loops (for interview-prep)

List what you expect: screen, skills test, portfolio, case, coding/DSA, teaching demo, etc.
Until set: behavioral stories from pool only.

## Autonomy

- **Discover → score → tailor → cover → form answers → stage packet**
- **Fill via apply-autofill; submit only if submit mode allows**
- Discovery: only enabled sources; restore cookies before searching logged-in boards

## Packet contents

Each `pipeline/packets/<id>/` should contain:

- `meta.json` — id, company, title, url, score, status, dates
- `job-description.md` — full JD text
- `resume.json` / `resume.pdf`
- `cover-letter.txt` / `cover-letter.pdf`
- `form-answers.md` — common ATS field drafts
- `handoff.md` — weave report + interview notes
