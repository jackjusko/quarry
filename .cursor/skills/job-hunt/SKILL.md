---
name: job-hunt
description: On-demand job hunt orchestrator. Discovers and scores roles from enabled sources in pipeline/config.md, then stages apply packets with tailored resume, cover letter, and form-answer drafts. Human submits — never auto-apply during hunt. Use when the user says run job hunt, find jobs, stage applications, or similar.
---

# Job Hunt

On-demand pipeline for this repo. **You stage; the human submits.**

## Setup gate (refuse if incomplete)

Before discovery or staging, verify setup:

1. [`pipeline/candidate-profile.md`](../../../pipeline/candidate-profile.md) — if `YOUR_NAME` (or critical `YOUR_*` placeholders) remain, **stop** and tell the user to run setup.
2. [`pipeline/.setup-complete`](../../../pipeline/.setup-complete) — if missing, **stop** and ask for setup.
3. [`pipeline/config.md`](../../../pipeline/config.md) — if `SETUP_INCOMPLETE` marker is present, **stop**.
4. [`experience/tailor-policy.md`](../../../experience/tailor-policy.md) — if `SETUP_INCOMPLETE` marker is present, **stop**.

Do not assume occupation, location, or title defaults — read config.

## Read first

1. [`pipeline/config.md`](../../../pipeline/config.md) — occupation, filters, scoring weights, enabled sources, submit mode
2. [`pipeline/tracker.md`](../../../pipeline/tracker.md) — dedupe + status
3. [`pipeline/browser-auth.md`](../../../pipeline/browser-auth.md) — before LinkedIn or YC: if board is under **Boards needing login**, restore cookies (`python3 scripts/browser-auth.py restore <board>`) or ask human to sign in
4. [`pipeline/playbooks/linkedin.md`](../../../pipeline/playbooks/linkedin.md) — when `linkedin` source is enabled
5. Child skills for materials:
   - [`../tailor-resume/SKILL.md`](../tailor-resume/SKILL.md)
   - [`../cover-letter/SKILL.md`](../cover-letter/SKILL.md)
6. When filling a live application (separate from hunt): [`../apply-autofill/SKILL.md`](../apply-autofill/SKILL.md)
7. After any hard fill/skip fix: append to [`../apply-autofill/lessons.md`](../apply-autofill/lessons.md)

## Kickoff parameters

From the user message (defaults from config):

| Param | Default |
| --- | --- |
| N (packets to stage) | `config.md` volume (default 15) |
| Focus | Title allow-list from `config.md` |
| Stretch | false unless user enables senior/stretch titles |
| Sources | **Only** rows marked enabled in `config.md` Discovery sources |

## Workflow

### 1. Discover

- Search **only enabled sources** from `config.md` (e.g. `public_ats_urls`, `linkedin`, `ycombinator`, `custom`)
- Before LinkedIn or YC: check [`browser-auth.md`](../../../pipeline/browser-auth.md); restore cookies if needed
- Use browser tools per linkedin playbook when LinkedIn is enabled
- Collect more candidates than N when possible
- Skip tracker duplicates (same URL or company+title recently applied/staged)
- Apply location hard filter from config — skip blocked locations

### 2. Score

- Apply scoring heuristic from [`pipeline/config.md`](../../../pipeline/config.md) (edit weights there)
- Rank descending; keep a maybe list for `discovered` rows that were not staged

### 3. Stage top N

For each selected role, create `pipeline/packets/<id>/` where  
`id = YYYYMMDD-<company-slug>-<role-slug>`:

1. Write `job-description.md` (full text)
2. Write `meta.json`:

```json
{
  "id": "20260811-acme-role-title",
  "company": "Acme",
  "title": "Role Title",
  "location": "Remote",
  "url": "https://...",
  "score": 84,
  "status": "staged",
  "comp": "unknown",
  "created": "2026-08-11"
}
```

3. **Resume:** follow tailor-resume → write `resume.json` → validate → render `resume.pdf`
4. **Cover letter:** follow cover-letter skill → `cover-letter.txt` + render PDF
5. **Form answers:** write `form-answers.md` (see template below)
6. **Handoff:** `handoff.md` with score rationale, weave notes, interview one-liners

### 4. Update tracker

Append/update rows in `pipeline/tracker.md` for staged and notable discovered/skipped roles.

### 5. Stop and report

Tell the user:

- How many packets staged and their folder paths
- Top titles/companies
- Anything blocked (login needed, thin JD, below-floor pay, location skip)
- Reminder: **open packets and submit manually** (or use apply-autofill); mark `applied` when done

## Form answers template (`form-answers.md`)

Draft short, honest answers (write-well). Adjust per JD; values from profile + config:

```markdown
# Form answer drafts

- **Years of experience:** …
- **Work authorization:** … (from candidate-profile)
- **Salary expectation:** … (from config floor or posted band)
- **Remote/onsite preference:** … (from config location policy)
- **Earliest start date:** … (from profile YOUR_START_WINDOW)
- **Why this company/role:** (2–3 sentences; reuse cover research)
- **Current employment:** … (from pool/profile)
- **Require sponsorship:** … (from candidate-profile)
```

Do not invent work-authorization or sponsorship answers if unknown — ask once, then cache in profile or config.

## Hard rules

- **Never** click Apply / Submit / Easy Apply during job-hunt staging
- **Never** search disabled sources
- **Never** build a separate LinkedIn scraper product; browser playbook only when enabled
- Resume prose and cover letters must follow **write-well** (via child skills)
- Experience on resumes: per `experience/tailor-policy.md`
- If discovery yields fewer than N good roles, stage what clears the bar — do not pad with junk

## Related skills

- [`../interview-prep/SKILL.md`](../interview-prep/SKILL.md) — separate on-demand
- [`../follow-up/SKILL.md`](../follow-up/SKILL.md) — separate on-demand
