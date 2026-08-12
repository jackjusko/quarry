---
name: tailor-resume
description: Builds a job-targeted resume JSON from experience/pool.md and experience/tailor-policy.md using a job description and pipeline/config.md. Hybrid ATS keyword weave when policy allows. Validates and renders PDF. Use when optimizing a resume, tailoring bullets to a role, or preparing application materials in this repo.
---

# Tailor Resume

## Setup gate (refuse if incomplete)

Before tailoring, read:

1. [`experience/tailor-policy.md`](../../../experience/tailor-policy.md) — if `SETUP_INCOMPLETE` marker is present, **stop** and ask for setup.
2. [`pipeline/config.md`](../../../pipeline/config.md) — if `SETUP_INCOMPLETE` marker is present, **stop**.
3. [`pipeline/candidate-profile.md`](../../../pipeline/candidate-profile.md) — contact fields for resume header.

Do not assume a fixed employer list or mandatory sections — follow tailor-policy.

## Inputs

| Input | Source |
|-------|--------|
| Experience pool | [`experience/pool.md`](../../../experience/pool.md) — employers, dates, titles, outcomes |
| Tailor policy | [`experience/tailor-policy.md`](../../../experience/tailor-policy.md) — core vs optional roles, weave mode, must-include sections |
| Pipeline config | [`pipeline/config.md`](../../../pipeline/config.md) — occupation, location policy |
| Job description | User message, `input/job-description.txt`, or staged packet JD |
| Emphasis | User message (skills, themes, seniority angle) |
| Job listing (optional) | User message or `input/job-listing.txt` |
| Output target (optional) | Default `output/`; pipeline packets use `pipeline/packets/<id>/` |

## Prose standard (required)

Before writing **summary** or **bullets**, follow **write-well**:

1. Read [`../write-well/politics-and-the-english-language.md`](../write-well/politics-and-the-english-language.md) in full.
2. Read [`../write-well/signs-of-ai-writing.md`](../write-well/signs-of-ai-writing.md) in full.
3. Draft, then cut filler, AI vocabulary, and chatbot residue. Prefer short concrete verbs.

Resume tone: concise, impact-oriented, **no first person**.

## When a full job description is supplied

Treat the posting as the **scoring rubric**. Before writing JSON:

1. **Extract** must-haves, preferred/nice-to-haves, responsibilities, tech stack, domain, seniority, and location constraints.
2. **Inventory technologies** — every tool, language, framework, platform, protocol, and methodology named or strongly implied (see [Tech inventory](#build-the-tech-inventory)).
3. **Map** each inventoried item to a pool role under [Weave policy](#weave-policy) and [Anachronism gate](#anachronism-gate) — only when occupation is technical per tailor-policy.
4. **Place keywords** — must-haves go in bullets only when era-plausible and within weave caps; put overflow in `skills`. Do **not** aim for ≥90% of JD tech in bullets.
5. **Rewrite bullets** for overlap with the posting; keep [core roles](#core-vs-optional-roles) per tailor-policy unless the user opts out.
6. **Mirror** posting language for ATS where claims are defensible.
7. **Report** in the handoff: pool-backed vs woven vs skills-only; skips with reason; interview talking points for woven items.

## Build the tech inventory

| Source in posting | Examples to capture |
| --- | --- |
| Explicit stack lists | Languages, frameworks, platforms named in JD |
| Responsibilities / requirements | Implied skills from duties |
| Nice-to-haves and “bonus” lines | Still inventory; often skills-only |
| Ecosystem synonyms | Prefer the posting’s exact names for ATS |
| Methodologies & practices | Agile, CI/CD, compliance workflows, etc. |

De-duplicate unless the posting uses both forms for ATS.

## Weave policy

Read weave settings from [`experience/tailor-policy.md`](../../../experience/tailor-policy.md).

**Goal:** Keep ATS coverage without unbelievable stuffing.

### Caps and tone

- Prefer **pool-backed** tech in bullets.
- May add **adjacent** JD tech only if: (a) [era/product plausible](#anachronism-gate), and (b) the candidate can defend it in ~30 seconds.
- **Cap:** per tailor-policy (default ~2 non-pool technologies per role when mode = hybrid).
- **Softer ownership** when tech is not pool-explicit: prefer “integrated / deployed with / used for …” over “owned the entire X platform” unless the pool supports ownership.
- **No keyword salad** — one bullet may name a few related tools; do not list every JD keyword in a single line.
- **Overflow** posting tech → `skills.primary` or `skills.additional` (often with **(familiar)**). Do not force every must-have into a bullet.

### Placement priority

1. **Experience bullets** — pool outcomes first; selective weave for high-signal must-haves.
2. **`skills.primary`** — technologies in bullets or clearly pool-backed.
3. **`skills.additional`** — overflow; **(familiar)** allowed only here.
4. **`summary`** — 2–4 highest-signal terms; not a keyword dump.

When tailor-policy mode = **pool-only**, do not weave — skills mirror pool only.

### Keep fixed vs rewrite

| **Keep fixed (pool wins)** | **Rewrite with care** |
| --- | --- |
| Company names | Bullet wording |
| Employment dates | Selective technologies (within caps + anachronism) |
| Whether a role existed | Framing within truth |
| Job titles (minor retitle OK) | |
| General outcome type | |

| Do | Don't |
| --- | --- |
| Write past-tense duties; softer verbs for woven tech | Invent employers, dates, degrees, promotions, or unsupported titles |
| Cap woven tech; put overflow in skills | Fabricate metrics, user counts, award names |
| Keep claims interview-defensible | Claim expert tenure without support |
| Note every woven item in the handoff | Stuff ≥90% of JD tech into bullets |

**Interview prep (handoff):** For each woven item, one line: role + how you’d explain it.

## Anachronism gate

**Never** put a technology on a role if it did not exist yet, was not in common use in that date range, or would not have belonged on **that product**.

Stricter standard: **era + product plausibility**, not merely “the tool existed that year.”

Skip or skills-only when domain mismatch is obvious.

## Assumed general skills (no pool entry required)

List common workplace tools in `skills` when the posting asks: office suites, email, chat, ticketing, OS familiarity.

Prefer `additional` unless the posting stresses one. Do not invent concrete stories unless the pool supports them.

## Optional sections (from tailor-policy)

Include certifications, publications, projects, tools/AI sections **only** when `experience/tailor-policy.md` marks them must-include. Never invent mandatory AI-workflow blocks unless policy requires.

## Skills proficiency labels

| Label | When to use |
| --- | --- |
| *(none)* | In bullets or pool-backed; `primary` when the posting cares |
| **(familiar)** | Only in `skills.additional` for overflow |

**Never** use in bullets, summary, or `primary`: `learning`, `beginner`, `novice`, `exposure`, `familiar with`, `basic`.

## Core vs optional roles

Read the core/optional table in [`experience/tailor-policy.md`](../../../experience/tailor-policy.md).

### Selection rules

1. **Default** = all **core** roles + **at most one** optional role when clearly useful.
2. **Ordering: always chronological** — most recent first by role end date (Present first). **Do not** reorder by JD relevance.
3. **Page length** per tailor-policy (default 1 page). Target strong fill with **content**, not spacing tricks.
4. **Density:** Summary concise. Bullets: default **3–4 per core role**; optional role **2–4** when included. Skills lists: reasonable caps — do not pad to fill space.
5. **Fill order (when short):** deepen core-role bullets from the pool → add one JD-useful optional role → slightly relax skills list if still short. **Never invent** employers, metrics, duties, or tools just to fill space.
6. **Trim order (when over one page):** shorten summary → trim least relevant role → consolidate skills → drop optional role.
7. **Only omit a core role** if the user asks—and say so in the handoff.

## Contact location (every resume)

`contact.location` follows **role work mode** + [`pipeline/config.md`](../../../pipeline/config.md) location policy + [`candidate-profile.md`](../../../pipeline/candidate-profile.md) (`YOUR_RESUME_LOCATION`):

- Onsite/hybrid at allowed metro → use configured resume header location for that mode.
- Fully remote (when allowed) → use remote-appropriate header from profile/config.

Do **not** invent street addresses on the resume — city/region only unless policy says otherwise.

Form location screeners during apply-autofill must match the same policy.

## Workflow

1. Run [Setup gate](#setup-gate-refuse-if-incomplete); read pool, tailor-policy, config, inputs. Follow **write-well** before drafting prose.
2. If a **full JD** is present:
   - Build tech inventory and requirement map.
   - Set `contact.location` per [Contact location](#contact-location-every-resume).
   - Select roles per tailor-policy core/optional table.
   - Rewrite bullets under weave policy + anachronism gate (if technical occupation).
   - Mirror strong claims in `skills`; coverage pass without ≥90% bullet mandate.
3. If no full JD, select roles and tailor from user emphasis; still chronological; still write-well.
4. Enforce density + page length per tailor-policy. Add optional sections only if policy requires.
5. Write JSON (default [`output/tailored-resume.json`](../../../output/tailored-resume.json), or packet path when hunting).
6. From repo root:
   ```bash
   npm run validate
   npm run render
   ```
   For custom paths:
   ```bash
   node scripts/validate-resume.js path/to/resume.json
   node scripts/render-resume.js path/to/resume.json path/to/output.pdf
   ```
   Fix until validate passes and render meets policy page/fill targets.
7. Handoff: PDF path; optional roles included/skipped; requirements targeted; tech report (pool-backed / woven / skills-only / skipped); interview prep lines for woven items.

## JSON shape (required)

```json
{
  "contact": { "name", "location?", "phone?", "email?", "linkedin?", "website?" },
  "summary": "string",
  "experience": [{ "company", "location?", "title", "dates", "bullets": ["..."] }],
  "education": [{ "degree", "school", "dates?", "honors?" }],
  "skills": { "primary": ["..."], "additional?": ["..."] }
}
```

Optional top-level keys when tailor-policy requires: `certifications`, `projects`, `aiWorkflow`, etc.

Use contact details from the pool/profile. Do not invent fake street addresses.

## Rules

- **Employers and dates:** Match the pool. Never fabricate organizations or timelines.
- **Chronological experience only.**
- **Weave + anachronism** per tailor-policy — not aggressive ≥90% bullet coverage.
- **Core roles** per tailor-policy unless the user opts out.
- **write-well** for all resume prose.
- **Single page** (or policy length) filled with pool-backed detail; produce JSON and PDF before finishing.

## Additional resources

- Example flow: [examples.md](examples.md)
- Pipeline orchestrator: [`../job-hunt/SKILL.md`](../job-hunt/SKILL.md)
- Cover letters: [`../cover-letter/SKILL.md`](../cover-letter/SKILL.md)
