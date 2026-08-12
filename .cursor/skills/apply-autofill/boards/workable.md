# Workable autofill

Hosts: `apply.workable.com`, `*.workable.com`

## Reach the form

1. Prefer direct apply URL: `https://apply.workable.com/<company>/j/<JOBID>/apply/`
2. Open with `newTab: true` → lock that `viewId`
3. Dismiss cookie banner (**Accept all**) early so it does not block clicks

## Contact + profile

| Field | Notes |
| --- | --- |
| First / Last / Email | `browser_fill` from candidate-profile |
| Phone country | Often already **+1**; combobox options may sit in a11y tree even when collapsed |
| Address | Optional typeahead-style text; typed city/region/country from profile location is enough when no listbox appears |
| LinkedIn | Custom question id — fill from candidate-profile |
| Summary / Education / Experience | Optional; resume PDF covers education/experience |

## Attachments

- **Resume** = required `input[type=file]` (dynamic id, not `#resume`)
- **Cover letter** = often a **textarea** (`#cover_letter`), not a file input

### Resume upload

1. `prepare-upload-chunks.js` as usual (cover PDF still generated for packet even if unused as file)
2. Eval `r-*.js` sequentially → custom apply that targets `document.querySelector('input[type=file]')` only
3. Verify UI shows filename + trash/remove (e.g. `Resume.pdf` or configured upload name)

### Cover letter

Paste `cover-letter.txt` body into the textarea via `browser_fill` (greeting through signature from profile).

## Screening

- Visa sponsorship combobox: click → profile `YOUR_SPONSORSHIP`
- Country working from: free text → from profile or **United States** when US role
- Essay textareas: use form-answers / packet narrative; keep 2–5 sentences when requested

## Finish

1. CDP verify: contact, visa/sponsorship, country, essays, resume `files: 1` / filename visible, cover textarea non-empty
2. Unlock; submit only per apply-autofill submit policy
3. Leftovers: optional Education/Experience blocks if not manually added (resume PDF is enough)

## Pitfalls

- Snapshot may be empty briefly while Workable hydrates — poll with CDP `document.body.innerText`
- Default address may autofill wrong city — clear and set profile location text
- Standard Greenhouse `apply.js` (`#resume` / `#cover_letter` file) will fail here; use resume-only selector + textarea cover

Full write-ups: [`../lessons.md`](../lessons.md) Workable section
