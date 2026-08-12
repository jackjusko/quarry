# Candidate profile (application autofill)

<!-- TEMPLATE: replace every YOUR_* value. Run setup, or edit by hand. -->
<!-- Marker: YOUR_NAME — setup replaces this file when onboarding. -->

Source of truth for form fields across job boards. Agents read this before filling applications.

## Identity

| Field | Value |
| --- | --- |
| Full name | YOUR_NAME |
| First / Last | YOUR_FIRST / YOUR_LAST |
| Date of birth | YOUR_DOB (optional — skip if you prefer; leave blank on forms that ask) |
| Email | YOUR_EMAIL |
| Phone | YOUR_PHONE |
| Phone country | YOUR_PHONE_COUNTRY (e.g. United States (+1)) |
| Location city | YOUR_LOCATION_CITY (how you answer location typeaheads; set per role type in config if needed) |
| Resume header location | YOUR_RESUME_LOCATION |
| Mailing city | YOUR_MAILING_CITY (optional) |
| State | YOUR_STATE (optional) |
| Street address | YOUR_STREET (optional — leave blank if you skip mailing address) |
| Zip / postal | YOUR_ZIP (optional) |
| LinkedIn | YOUR_LINKEDIN_URL |
| Website | YOUR_WEBSITE_URL (optional) |

## Education (fill in)

| Field | Value |
| --- | --- |
| High school | YOUR_HIGH_SCHOOL (optional) |
| High school city / state | YOUR_HS_CITY_STATE (optional) |
| High school graduation year | YOUR_HS_YEAR (optional) |
| University / program | YOUR_SCHOOL |
| University degree | YOUR_DEGREE |
| University graduation year | YOUR_GRAD_YEAR |

## Work authorization (required for most US forms)

| Field | Value |
| --- | --- |
| Authorized to work in the US without sponsorship | YOUR_WORK_AUTH (Yes / No) |
| Require sponsorship now or in the future | YOUR_SPONSORSHIP (Yes / No) |
| Non-compete agreement | YOUR_NONCOMPETE (usually No, if none) |

## EEO / voluntary self-ID (optional — skip if you prefer)

| Field | Value |
| --- | --- |
| Gender | YOUR_GENDER (or Decline) |
| Hispanic/Latino | YOUR_HISPANIC (or Decline) |
| Race | YOUR_RACE (or Decline) |
| Veteran status | YOUR_VETERAN (or Decline) |
| Disability | YOUR_DISABILITY (or Decline) |
| Disability form — public burden statement (CC-305) | **Name:** YOUR_NAME · **Date:** YOUR_DOB or today's date when the form asks |

## Defaults for common screening Qs

| Field | Value |
| --- | --- |
| Salary expectation | YOUR_SALARY_FLOOR (or use posted band when given) |
| Remote / location preference | See `pipeline/config.md` location allow-list |
| Earliest start | YOUR_START_WINDOW (e.g. 2 weeks after offer) |
| Current employment | YOUR_CURRENT_STATUS |
| Years of experience | Follow tailor policy + pool; meet JD bars when defensible |

## Prose preferences (cover letters + reach-outs)

| Context | Rule |
| --- | --- |
| **Close (all)** | Always include interest in talking — e.g. “looking forward to talking” |
| **Onsite / hybrid at preferred city** | Follow config location policy (e.g. based in YOUR_CITY and open to meet in person) |
| **Fully remote** | No local coffee line unless you want one |

See `.cursor/skills/cover-letter/SKILL.md` and apply-autofill **Reach-out messages**.

## Browser logins (Cursor embedded browser)

Account sessions are **not** stored in git. See [`browser-auth.md`](browser-auth.md).

After any login or cookie wipe: `python3 scripts/browser-auth.py list` · restore: `python3 scripts/browser-auth.py restore all`

## Artifacts

- Resume PDF: packet `resume.pdf` (or `output/` tailored PDF)
- Cover letter: packet `cover-letter.pdf` / `cover-letter.txt`
- Form drafts: packet `form-answers.md`
- Upload helper: `.cursor/skills/apply-autofill/scripts/prepare-upload-chunks.js`
- Board auth registry: [`browser-auth.md`](browser-auth.md)

## Rules

- Never invent conflicting auth/EEO answers — use this file.
- Never click **Submit** / **Apply** unless the user explicitly turns submit on for this session or packet.
- Agents **must upload** resume + cover via the apply-autofill DataTransfer chunk method (not human Attach), unless that method fails.
- Do not invent street/zip/SSN/DOB not present here — leave blank and list as leftovers.
