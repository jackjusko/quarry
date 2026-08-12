# Greenhouse autofill

Hosts: `job-boards.greenhouse.io`, `boards.greenhouse.io`, `*.greenhouse.io`

## Efficient procedure (recorded)

Goal: fill a Greenhouse job application. React-select comboboxes **require** `browser_click` (DOM `mousedown` alone often fails).

### A. Reach the form

1. If starting from Simplify: Apply → **I'll Apply Manually** (opens Greenhouse in a new tab)
2. `browser_tabs` → select Greenhouse tab → `browser_lock`
3. Skip **Quick Apply with MyGreenhouse** unless already logged in and user wants it

### B. Contact block (top)

| Step | Action |
| --- | --- |
| 1 | `browser_fill` First / Last / Email from `candidate-profile.md` |
| 2 | Country* (phone): open combobox → click profile `YOUR_PHONE_COUNTRY` (often **United States +1**) |
| 3 | `browser_fill` Phone digits; Greenhouse may reformat after country is set |
| 4 | Location: `browser_type` slowly (`slowly: true`) → type profile/config location city → click exact typeahead option |
| 5 | LinkedIn + Website: `browser_fill` from candidate-profile |

### C. Attachments (required — agent uploads)

1. Ensure packet has `resume.pdf` + `cover-letter.pdf` (generate via tailor-resume / cover-letter + render scripts if needed).
2. Prepare chunks:
   ```bash
   node .cursor/skills/apply-autofill/scripts/prepare-upload-chunks.js \
     pipeline/packets/<id>/resume.pdf \
     pipeline/packets/<id>/cover-letter.pdf \
     pipeline/prep/upload-chunks
   ```
   Upload filenames default to PDF basenames or `Resume.pdf` / `Cover_Letter.pdf`.
3. `browser_tabs` list must show this Greenhouse URL on the locked `viewId` **before** any upload `Runtime.evaluate`. If the viewId is missing (`No browser tab available`), abort — do not eval `__r`/`__c` onto another tab.
4. `browser_cdp` Runtime.evaluate each `r-*.js`, then `c-*.js`, then `apply.js` (or `oneshot-set.js` then `apply.js`). Sequential only.
5. Confirm UI shows filenames / **Remove file** on both Resume/CV and Cover Letter.

Greenhouse file inputs: `#resume`, `#cover_letter` (often `visually-hidden`). DataTransfer + `change` event works; native CDP file picker is blocked.

### D. React-select pattern (all Yes/No / EEO)

For each combobox:

1. `browser_snapshot` (`interactive: true`) → get `ref`
2. `browser_scroll` `scrollIntoView: true` if needed
3. `browser_click` combobox
4. Fresh snapshot → click matching `role: option` by exact label
5. Confirm via `.select__single-value` or “Clear selections” button appearing next to field

**Do not** rely on `Runtime.evaluate` click alone for react-select — menus often stay empty (`available: []`).

### E. Auth + screening defaults

From `candidate-profile.md` + packet `form-answers.md`:

- Work authorization / sponsorship / non-compete → profile values
- Prior company employment / related to employee → **No** unless form-answers says otherwise
- Local / in-office screeners → per `pipeline/config.md` location policy + profile

Referral: prefer closest listed source; else **Other** + short explain (e.g. `Found via job board`).

### F. EEO (voluntary)

Order matters on some boards: Hispanic first, then Race appears.

Use profile EEO fields (or Decline). Match option text loosely if wording differs (`includes` is OK).

After disability status, fill CC-305 **Name** + **Date** from profile when the form shows public-burden fields.

### G. Consents + max fill

- Required processing consent → check
- Optional retention / future opportunities consent → check when present (max fill)
- Fill **all** remaining selects/text from profile before finishing — do not leave EEO or screening blank when answers exist

### H. Finish — pre-report verification gate (mandatory)

Do **not** report filled until tools confirm. Run before unlock:

1. **`browser_snapshot`** after scrolling the full form (top → bottom)
2. **CDP read-back:** contact fields; all `.select__single-value` values; upload proof via **Remove file** / filenames in DOM (not `#resume.files`)
3. Cross-check against packet `form-answers.md`
4. If anything missing → re-fill → re-verify

Then unlock; tell user to review with **verification summary**; submit only per apply-autofill submit policy.

## Pitfalls

- **Stale refs**: re-snapshot after every dropdown selection
- **Location**: typed text alone may not count — wait past Loading… then pick listbox option
- **Country vs location**: Country* is phone dial code, not city
- **Race field** may be absent until Hispanic is answered
- **reCAPTCHA**: human only
- New tab from Simplify: always re-lock the Greenhouse `viewId`
- **Always `newTab: true`** for the application URL; do not navigate over an unrelated/shared tab
- **No parallel browser agents** on the same form — concurrent CDP/autofill can wipe fields
- **Completion gate**: CDP must show zero empty screening selects + uploads visible before unlock (see [`../lessons.md`](../lessons.md))

## Variants (see lessons)

- **Embedded careers site** (company domain, not boards host): custom radios — CDP `label.click()`; resume-only upload common
- **Extra demographic blocks**: employer-specific survey before/after OFCCP EEO
- **Tab loss mid-chunk**: re-open `newTab`, refill contact, re-run exact on-disk chunks
- **React controlled contact fields**: native value setter + events when `browser_fill` fails

Full write-ups: [`../lessons.md`](../lessons.md) Greenhouse section
