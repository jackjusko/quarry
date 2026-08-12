---
name: setup
description: First-run installer for Quarry. Interviews for occupation, discovery boards (login + cookie save), candidate profile, experience pool, and resume tailor policy. Runs npm install if needed. Use when the user says run setup, onboard, fill my profile, or when placeholders (YOUR_NAME / SETUP_INCOMPLETE) remain.
---

# Setup (Quarry)

First-run installer. **You write the corpus; the human answers one section at a time.**

## When to run

- User says `run setup`, `onboard`, `fill my profile`
- `pipeline/candidate-profile.md` still contains `YOUR_NAME`
- `pipeline/config.md` or `experience/tailor-policy.md` contains `SETUP_INCOMPLETE`
- `pipeline/.setup-complete` is missing

## Refuse / gate for other skills

After setup succeeds: create empty file `pipeline/.setup-complete` (gitignored). Strip `SETUP_INCOMPLETE` markers from config and tailor-policy. Replace `EXAMPLE_ORG_STUB` in the pool with real roles (or delete the stub once real roles exist).

## Install step

1. If `node_modules` is missing, run `npm install` from the repo root.
2. Confirm Node and Python 3 are available (`node -v`, `python3 --version`).

## Interview order (one section at a time)

Do **not** dump 40 questions. Finish each section, write files, then ask the next.

### 1. Occupation and hunt config → `pipeline/config.md`

Ask:

- What kind of work (any field — do not assume software)?
- Target titles / seniority?
- Location allow-list and hard skips?
- Comp floor (or unspecified)?
- Default N packets per hunt?
- Stretch titles (Staff/Principal) yes/no?
- Scoring: which signals matter (title, skills, location, comp, domain)?
- Interview loops expected (screen, portfolio, case, coding, teaching demo, …)?
- Narrative notes (leaving a role, career change, parked side work)?
- Submit mode: default **review** (fill, do not submit). Offer **when-verified** only if they ask.

Write `pipeline/config.md`. Remove `SETUP_INCOMPLETE`.

### 2. Discovery sources and login → config + `pipeline/browser-auth.md`

Ask which sites to search:

- **public ATS / pasted URLs** (always offer; no login)
- LinkedIn (login)
- Y Combinator / Work at a Startup (login)
- Other (custom host)

For each selected site that needs a session:

1. Open the site in the Cursor browser (`newTab: true`).
2. Human signs in. **LinkedIn: email + password** (Google OAuth often hangs).
3. Verify feed/account page (not a login wall).
4. `python3 scripts/browser-auth.py save <id>` (for custom: `save <id> --host '%domain%' --verify-url …` or `register` first).
5. Update `browser-auth.md` registry row (board, domains, verified date, saved file). **Never write passwords or commit cookie JSON.**

Re-run can add/remove boards and re-save cookies.

### 3. Identity / autofill → `pipeline/candidate-profile.md`

Required: name, email, phone, links, work auth / sponsorship.

Optional last: street, zip, DOB, EEO. If skipped, note that apply-autofill will leave those blank.

Replace every `YOUR_*` placeholder you collected. Leave skipped fields clearly blank or marked skipped.

### 4. Experience corpus → `experience/pool.md`

1. Offer resume ingest: paste text, or drop a PDF and run `node scripts/extract-experience.js` (if the script needs `current-resume.pdf`, copy/rename as needed or paste extract).
2. Role-by-role pass: employer, title, dates, location, 3–6 outcome bullets, skills.
3. Education + certs/licenses.
4. Application narrative.

**Do not invent** employers, dates, or outcomes. If extract is messy, ask.

Remove `EXAMPLE_ORG_STUB` when real roles are written. Use **write-well** (`.cursor/skills/write-well/`) when drafting bullets from a messy resume.

### 5. Resume tailor policy → `experience/tailor-policy.md` (+ config pointers)

Ask:

- Core vs optional roles (from the pool)
- Weave: pool-only vs hybrid ATS keyword weave (caps)
- Must-include sections (certs, licenses, publications, projects, tools) — default off
- Page length, summary tone, ATS vs human vs both
- Location/header rule (from hunt location policy)

Remove `SETUP_INCOMPLETE` from tailor-policy.

### 6. Confirm

Show checklist: files written, skipped fields, enabled discovery sources, saved sessions, submit mode, tailor summary.

Tell them next: `run job hunt` (or offer to start if they want).

Remind: filled profile/pool is personal — fine in a private clone; do not push a public fork of a live hunt.

## Re-run

If files are already filled (no `YOUR_NAME` / no `SETUP_INCOMPLETE`):

- Ask merge vs replace **per section**. Never silently wipe.

## Hard rules

- One section at a time
- No invented experience
- No passwords in git
- Do not block setup on PDF render
- Do not stage packets or open ATS apply forms during setup (login pages for discovery boards only)
