---
name: cover-letter
description: Writes medium cover letters in full sentences with concrete company research and a short fit upsell. Requires write-well. Renders PDF via scripts/render-cover-letter.js into output/ or a pipeline packet. Use when drafting application cover letters for this job hunt repo.
---

# Cover Letter

## Setup gate (refuse if incomplete)

If [`pipeline/candidate-profile.md`](../../../pipeline/candidate-profile.md) still has `YOUR_NAME` or [`pipeline/config.md`](../../../pipeline/config.md) has `SETUP_INCOMPLETE`, **stop** and ask for setup.

## When to use

- As part of **job-hunt** packet staging
- Standalone when the user asks for a cover letter for a JD

## Prose standard (required)

Follow **write-well** before drafting:

1. Read [`../write-well/politics-and-the-english-language.md`](../write-well/politics-and-the-english-language.md) in full.
2. Read [`../write-well/signs-of-ai-writing.md`](../write-well/signs-of-ai-writing.md) in full.
3. Draft → cut filler → ship plain specific prose.

Forbidden: “I am writing to apply,” mission-admiration fluff, buzzword salad, empty chatbot residue. Do **not** strip warmth from the close—see [Close tone](#close-tone). Follow **write-well** hollow-contrast and research-dump bans.

## Length and structure

- **Medium by default:** ~220–320 words unless a form forces shorter.
- Structure:
  1. **Greeting** — required salutation ([Greeting](#greeting))
  2. **Hook** — one concrete company-specific detail
  3. **Proof** — 1–2 outcomes from the pool mapped to the role
  4. **Upsell** — short why-you-fit
  5. **Close** — availability / next step, then formal sign-off ([Close tone](#close-tone))

## Greeting

**Required on every letter:** open the body with a salutation.

Default shapes:

- `Hi <Company> Team,`
- `Hi <Team or Hiring Team>,` when a named team is clearer
- `Dear <Name>,` only when a real recruiter/hiring-manager name is known

Put the greeting on its own line after the date / role subject line, before the first body paragraph.

## Prose density

Write in full, complete sentences. One idea per sentence is fine; several short complete sentences beat one overloaded line. Keep write-well: cut filler, not grammar.

## Research bar

Before writing, gather at least **one real detail** from the JD, company site, careers page, blog, or news.

Use research to understand the product — do not paste orphan metrics or stack restatements into the opening. If research fails, say so in the handoff and anchor on the JD only — do not invent company facts.

## Inputs

| Input | Source |
| --- | --- |
| JD | Packet `job-description.md` or user paste |
| Pool | [`experience/pool.md`](../../../experience/pool.md) |
| Occupation / voice | [`pipeline/config.md`](../../../pipeline/config.md) YOUR_OCCUPATION |
| Resume emphasis | Matching tailored resume if present |
| Contact + sign-off | [`pipeline/candidate-profile.md`](../../../pipeline/candidate-profile.md) |
| Location prose | Profile **Prose preferences** + config location policy |

## Output

1. Write plain text (header with name, phone, email, date, company from profile).
2. Save as `cover-letter.txt` (packet) or `input/cover-letter-<slug>.txt`.
3. Render:

```bash
node scripts/render-cover-letter.js path/to/cover-letter.txt path/to/cover-letter.pdf
```

4. Tell the user the PDF path.

## Voice

- First person is OK in cover letters (unlike resume bullets)
- Sound like a competent professional in the configured occupation — not a brochure
- Prefer specific verbs and named systems over soft claims
- Slightly warm and human; full sentences and natural paragraph flow

## Close tone

**Required on every letter:** after the body, end with a **formal business sign-off**.

**Must include (meaning, not exact wording):**

1. Interest in a conversation about the role / team — e.g. “looking forward to talking” / “I look forward to discussing…”
2. Thanks for the opportunity / for considering the application
3. How to reach you: email and phone from **candidate-profile**
4. Closing line **Best,** (or equivalent) then **full name from candidate-profile**

## Onsite / hybrid location (from config)

When the role matches config **preferred metro onsite/hybrid** (not fully remote), follow profile prose preferences — e.g. based locally and open to meet in person. Put in the last body paragraph or close block before **Best,**.

- **Fully remote roles:** do **not** add local coffee lines unless profile says so.
- Match resume header location per tailor-resume + config.

**Example shape (adapt):**

```
I look forward to discussing how I can contribute to <team or role>. Thank you for considering my application. You can email me at <YOUR_EMAIL> or reach me at <YOUR_PHONE>.

Best,

<YOUR_NAME>
```

**Avoid:**

- Bare fragment sign-offs with no thanks or reachability
- Ending on logistics alone with no signature
- Hardcoded names or emails not from profile

Rules:

- Use email and phone from candidate-profile for that application.
- Sign with **Full name** from profile.
