# Lever autofill

Host: `jobs.lever.co`

## Procedure

1. Open `<job-url>/apply` (or click Apply from posting).
2. Accept cookie banner if present.
3. **Resume upload:** DataTransfer on `input[type=file][name=resume]` (id often `resume-upload-input`). Cover prose in **Additional information** (`textarea[name=comments]`) when no cover file input exists.
   ```bash
   node .cursor/skills/apply-autofill/scripts/prepare-upload-chunks.js \
     pipeline/packets/<id>/resume.pdf \
     pipeline/packets/<id>/cover-letter.pdf \
     pipeline/prep/upload-chunks-<slug>
   ```
   Run `r-*.js` then `apply.js` via `browser_cdp` (or custom resume-only apply snippet). Verify snapshot shows filename link + **Success!**
4. Fill contact from `candidate-profile.md` + packet `form-answers.md`.
5. **Location / office preference:** typeahead and screeners per `pipeline/config.md` + profile.
6. Screening cards: radios/checkboxes via CDP label click or `input[name^=cards[...]]` selectors; `<select>` via `browser_select_option` or CDP `select.value` + change event.
7. EEO: `select[name="eeo[veteran]"]`, `select[name="eeo[disability]"]` from profile. After disability answer, fill CC-305 name/date from profile when shown.
8. Pre-report verification gate (snapshot scroll + CDP read-back) before unlock/report.
9. Unlock; submit only per apply-autofill submit policy.

## Long supplementary sections

Many Lever postings add card sections with `cards[uuid][fieldN]` names:

- Language, deadlines, preferred locations, education (HS/university when required)
- Essay textareas (~word limits vary)
- Role-specific confirmations (product pick, clearance, program type)
- AI notetaker / partner / residency acknowledgements

**Card UUIDs vary by posting** — inspect DOM (`textarea[name^=cards]`, radio groups) per req before bulk fill. Do not reuse UUIDs from a different posting.

### Common patterns

- University combobox: search/select from profile `YOUR_SCHOOL`; grad year from `YOUR_GRAD_YEAR`
- HS name + grad year on **early-talent** reqs — from profile when present; mid-level may omit
- Clearance cards when present: answer honestly from form-answers + profile
- Start-date fields may be `<input type=text>` — use native value setter, not textarea-only helpers

## Failure modes

### Listing 404

- Job URL and company Lever board can both 404 when the req is closed.
- Aggregators may still cache the JD — confirm in browser before filling.
- On 404 → skip packet; do not invent a substitute Lever posting.

### Resume only + essays

- **Problem:** Lever uses `name=resume`, not Greenhouse `#resume`; no cover PDF slot.
- **Fix:** DataTransfer on `input[name=resume]`; cover prose in `textarea[name=comments]`. Bulk-fill card fields via CDP from DOM inspection.
- **Verify:** Resume link + Success; contact + essays non-empty; EEO selects set; HS fields only blank if not in profile.
- **Do not:** use Greenhouse `#cover_letter` apply.js expecting a second upload.

Full write-ups: [`../lessons.md`](../lessons.md) Lever section
