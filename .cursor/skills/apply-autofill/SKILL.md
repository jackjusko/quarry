---
name: apply-autofill
description: Fills staged job-application forms in the Cursor browser from pipeline packets and candidate-profile.md. Generates/uses resume.pdf + cover-letter.pdf and uploads them via DataTransfer. Board playbooks for Greenhouse, Lever, Ashby, Simplify. Use when opening/filling an application, autofilling a packet, or uploading resume/cover.
disable-model-invocation: true
---

# Apply Autofill

Fill application forms for staged packets — **including resume + cover letter upload**. Default: **you fill; the human submits.**

## Setup gate (refuse if incomplete)

Before filling, read:

1. [`pipeline/candidate-profile.md`](../../../pipeline/candidate-profile.md) — if `YOUR_NAME` (or other `YOUR_*` placeholders) remain, **stop** and tell the user to run setup or finish the profile.
2. [`pipeline/config.md`](../../../pipeline/config.md) — if `SETUP_INCOMPLETE` marker is present, **stop** and ask for setup.

## Location policy (from config — never invent)

Read [`pipeline/config.md`](../../../pipeline/config.md) **Location hard filter** and [`pipeline/candidate-profile.md`](../../../pipeline/candidate-profile.md) location fields.

- Resume header location, form typeahead answers, and “live local / in-office” screeners must follow **config + profile** — not a universal default city.
- Do **not** skip a staged role for location unless config says to; do **not** answer “already local” unless the user set that policy in setup.
- Mailing street/zip from candidate-profile apply only when the form asks for home/mailing address — not for commute/local screeners.

## Submit policy

| Condition | Submit? |
| --- | --- |
| `pipeline/config.md` submit mode = `review` (default) | **No** — fill only |
| User explicitly asks to submit **this session/packet** | **Yes**, after verification gate |
| Submit mode = `when-verified` **and** verification gate passed | **Yes** for this session until user says turn submit off |

Leftovers (captcha, login, missing profile data) always block submit, even when `when-verified`.

## Read first

1. [`pipeline/candidate-profile.md`](../../../pipeline/candidate-profile.md) — contact, auth, EEO
2. [`pipeline/config.md`](../../../pipeline/config.md) — location allow-list, submit mode
3. Packet: `pipeline/packets/<id>/` — `meta.json`, `form-answers.md`, `resume.pdf`, `cover-letter.pdf`, **`essay-answers.md`** (when the form has essay prompts — see [Essay archive](#essay-archive-required-when-form-has-essays))
4. Board playbook under [boards/](boards/) matching the ATS URL

## Hard rules

- **Never** click Submit / final Apply unless [Submit policy](#submit-policy) allows it
- Prefer Cursor `cursor-ide-browser`; lock → interact → unlock
- **Always** ensure packet `resume.pdf` + `cover-letter.pdf` exist, then **upload both** when the form has fields (see Attachments)
- **Max fill:** fill every field you can from candidate-profile + form-answers + packet — screening Qs, full EEO when present, education, LinkedIn/website/certs, optional consents, and Yes/No defaults. Do **not** stop after contact + uploads.
- Skip EEO only if the form has no such section; otherwise use candidate-profile (or Decline where offered)
- Never invent street/zip/SSN/DOB/etc. not in candidate-profile — leave blank and list them as leftovers
- After fill: **run the Pre-report verification gate below** — do not tell the user the packet is filled until tools confirm it; then report leftovers

## Pre-report verification gate (mandatory — every packet)

**Do not report "filled" until you have tool evidence.** Chat intent is not completion.

Before unlock + user report, run **all** of these:

1. **`browser_snapshot`** (full page) — scroll top → bottom once so off-screen sections appear in the tree.
2. **CDP read-back** (`Runtime.evaluate`, `returnByValue`) — at minimum:
   - Contact text fields match `candidate-profile.md` + packet `form-answers.md`
   - Every `.select__single-value` / multi-value tag for required screening + EEO (react-select `combobox.textContent` alone is unreliable)
   - Upload proof: **Remove file** / filename in snapshot **or** attachment text in DOM — do not trust `#resume.files` after GH ingest
   - `requiredEmpty` / visible error banners — must be empty or explained as true leftovers
3. **Cross-check** snapshot + CDP against packet `form-answers.md` — every known answer accounted for; list anything still blank that the packet specifies.
4. **If verification fails** — re-fill the gaps, re-run the gate, then report. Never report "filled" from fill intent alone.

Only after the gate passes: unlock browser → update packet `handoff.md` / `meta.json` → **write `essay-answers.md` if essays were filled** → append `lessons.md` if non-trivial → report to user with verification summary.

## Workflow

1. Confirm packet id; run [Setup gate](#setup-gate-refuse-if-incomplete)
2. **Materials** (if missing or user asks to generate):
   - Resume: follow tailor-resume → `resume.json` → validate → render `resume.pdf`
   - Cover: follow cover-letter → `cover-letter.txt` → `node scripts/render-cover-letter.js …/cover-letter.pdf`
3. Open listing URL → detect board → playbook
4. Fill **all** fields from candidate-profile + form-answers (contact → education → address → screening → EEO → consents)
5. **Upload** resume + cover (Attachments below)
6. **Pre-report verification gate** (above) — must pass before unlock/report
7. **Essay archive** — if the form had essay textareas, write `essay-answers.md` (see [Essay archive](#essay-archive-required-when-form-has-essays))
8. Unlock; report leftovers + verification summary; submit only per [Submit policy](#submit-policy)

## Attachments (required when fields exist)

Cursor CDP denies `Page.setFileInputFiles`. **Do not** ask the human to Attach when the DataTransfer method works.

### Upload method (Greenhouse and similar)

1. From repo root:
   ```bash
   node .cursor/skills/apply-autofill/scripts/prepare-upload-chunks.js \
     pipeline/packets/<id>/resume.pdf \
     pipeline/packets/<id>/cover-letter.pdf \
     pipeline/prep/upload-chunks
   ```
   Optional 5th/6th args or `RESUME_UPLOAD_NAME` / `COVER_UPLOAD_NAME` env vars override upload filenames (default: basenames or `Resume.pdf` / `Cover_Letter.pdf`).
2. Via `browser_cdp` `Runtime.evaluate` (returnByValue), run in order:
   - all `r-00.js` … `r-NN.js` (builds `window.__r`)
   - all `c-00.js` … `c-NN.js` (builds `window.__c`)
   - `apply.js` (DataTransfer → `#resume` + `#cover_letter`, dispatch change)
3. Verify: snapshot shows **Remove file** (or filename) for both; or CDP reports `files: 1`

**Do not** fetch `http://127.0.0.1` from an https ATS page (mixed content fails).

Fallback only: **Enter manually** for cover text from `cover-letter.txt`; resume PDF still needs DataTransfer or human Attach.

Selectors vary — if `#resume` / `#cover_letter` missing, find `input[type=file]` via CDP and adjust `apply.js`.

### Ashby essays (React state)

Ashby custom textareas often keep React state empty after CDP `.value=` even when text is visible → “Missing entry for required field”. Prefer `browser_type` (`clear: true`), then eval [`scripts/ashby-react-sync.js`](scripts/ashby-react-sync.js). Full order/quirks: [`boards/ashby.md`](boards/ashby.md). Essay prose: write-well (adequate length + application-essay theater bans).

## Field mapping

| Form asks | Use |
| --- | --- |
| Name / email / phone | `candidate-profile.md` |
| Location typeahead / “live local” / in-office | `config.md` location policy + `candidate-profile.md` (`YOUR_LOCATION_CITY`, resume header rules) |
| Street / Zip | `candidate-profile.md` mailing fields only — skip if not in profile |
| Resume PDF header | Per tailor-resume + config (match role work mode) |
| LinkedIn / website / GitHub | `candidate-profile.md` |
| Work auth without sponsorship | `YOUR_WORK_AUTH` |
| Need sponsorship | `YOUR_SPONSORSHIP` |
| Non-compete | `YOUR_NONCOMPETE` |
| Gender / Hispanic / Race / Veteran / Disability | Profile EEO fields (or Decline) |
| Disability CC-305 name + date | Profile: **Name** + **Date** from disability/CC-305 row — required after disability status select when the form shows CC-305 |
| Salary | form-answers or `YOUR_SALARY_FLOOR` from config/profile |
| Essays | form-answers drafts → **`essay-answers.md`** after fill (prompt + submitted text) |

## Essay archive (required when form has essays)

When the application includes **essay / long-answer textareas** (not one-line screening fields):

1. After fill + any ATS React sync, **CDP read-back** each filled essay (`textarea.value` + nearest prompt label from DOM).
2. Write or update **`pipeline/packets/<id>/essay-answers.md`** — template: [`pipeline/packets/_template/essay-answers.md`](../../../pipeline/packets/_template/essay-answers.md).
3. For each answered prompt: **Prompt** (full question text) + **Answer** (exact final text on the form).
4. List **Skipped** prompts if the form says “answer only one of N” or optional essays left blank.
5. Point `form-answers.md` at `essay-answers.md` (do not maintain two copies of long essay text).
6. Mention `essay-answers.md` in packet `handoff.md` under autofill notes.

**Purpose:** interview prep — same artifact tier as `cover-letter.txt` / `resume.pdf`. [`interview-prep`](../interview-prep/SKILL.md) reads this file from the packet.

**When to skip:** no essay fields on the form (cover-only, yes/no screening only).

## Reach-out messages (required)

Some boards (e.g. **Work at a Startup** Apply modal, LinkedIn notes) use a short message instead of a cover PDF.

- **Always** end with interest in talking — e.g. “Looking forward to talking” / “I look forward to discussing…” (same intent as cover-letter close).
- Pull proof from packet `cover-letter.txt` / `form-answers.md`; keep human-written tone; min length if the UI requires it (WaaS: 50+ chars).
- **Onsite/hybrid at preferred city:** follow profile prose preferences + config location policy (e.g. based locally and open to meet in person).
- **Fully remote:** no local coffee line unless profile says so.
- Sign with full name from `candidate-profile.md`.
- If the human edits the message in-browser, do not overwrite — verify their close is present before Send.

## Years-of-experience answers (required)

When a form asks **years of experience** (overall or per skill):

1. Read the JD’s minimum / preferred bar for that skill (or overall seniority for “years of professional experience”).
2. Prefer the **lowest band that still meets or exceeds that bar**, stretching calendar time when pool history can support it (adjacent years, same product family, related frameworks, overlapping roles).
3. Stretch only when the experience pool + handoff can support an interview defense — e.g. overlapping roles on the same stack → higher band; adjacent SQL dialects → moderate band when the JD expects database experience.
4. Do **not** pick a band with no reasonable interview defense. If the pool cannot support the JD minimum, pick the highest defensible band and note it in the handoff leftovers.
5. Never under-answer a required stack skill with **0–1** / “less than 1” when a higher defensible band exists — that screens you out.

Apply this on every packet fill.

## Failure modes / lessons

Canonical log: [`lessons.md`](lessons.md). Hard rules:

1. **Completion gate** — uploads visible (filename / Remove file); screening/EEO set; **run Pre-report verification gate** before unlock/report. Greenhouse may clear `input.files` after ingest.
2. **Abort ≠ done** — re-snapshot and resume; never mark filled from intent.
3. **`newTab: true` + one browser worker** — concurrent agents / MyGreenhouse can wipe the form; don't stomp tabs.
4. **Upload chunks sequential** (or one oneshot) — parallel CDP races `window.__r` / `__c`.
5. **Location typeahead** — click exact option after Loading….
6. **Years bands** — meet/beat JD bar when pool-justifiable.
7. **Location hard rule** — follow `config.md`; never invent local presence.
8. **Always append** new fixes to `lessons.md` before ending the turn.

## After fill — document lessons (always)

Before ending the turn on any non-trivial fill (or hard skip):

1. Append a dated **Problem / Fix / Verify / Do not** entry to [`lessons.md`](lessons.md)
2. Update the board playbook under [`boards/`](boards/) if the fix is ATS-wide
3. Note role-specific quirks in packet `handoff.md` / `meta.json`

This is mandatory (see `.cursor/rules/document-application-fills.mdc`). Chat memory is not enough.

## After human submits

Update `pipeline/tracker.md` → `applied`.

## Additional resources

- [lessons.md](lessons.md) — living log of solved fill challenges
- [boards/greenhouse.md](boards/greenhouse.md)
- [boards/simplify.md](boards/simplify.md)
- [boards/lever.md](boards/lever.md)
- [boards/ashby.md](boards/ashby.md)
- [boards/workable.md](boards/workable.md)
- [boards/jobvite.md](boards/jobvite.md)
- [boards/teamtailor.md](boards/teamtailor.md)
- [boards/workatastartup.md](boards/workatastartup.md)
- [scripts/prepare-upload-chunks.js](scripts/prepare-upload-chunks.js)
