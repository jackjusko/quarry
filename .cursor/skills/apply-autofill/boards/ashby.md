# Ashby autofill

Host: `jobs.ashbyhq.com`

## Procedure

1. Open job URL with `newTab: true` → lock viewId
2. Confirm the exact req still exists (Overview tab). If gone → skip packet; log in [`../lessons.md`](../lessons.md)
3. Click **Application** tab (`…/application`)
4. Fill from `candidate-profile.md` + packet form-answers (name/email/LinkedIn/phone/GitHub → location typeahead → auth Yes/No → essays)
5. **Resume upload:** DataTransfer onto `#_systemfield_resume` (see below). Cover letter often **absent** — keep packet PDF for reference only
6. Re-verify after Ashby “Parsing your resume…” autofill settles (it usually preserves filled fields)
7. Before unlock: confirm no “Your form needs corrections” banner — Ashby Yes/No can look `_active` in DOM while still flagged missing; re-click via `browser_click` if needed. For custom essay textareas, run React sync (below) if the banner still says Missing entry while text is visible. Yes/No pairs are **toggles** — do not double-click.
8. If essays were filled: write packet `essay-answers.md` (see apply-autofill Essay archive).
9. Unlock; submit only per apply-autofill submit policy

## Resume upload

Selector: `input#\_systemfield_resume` (not Greenhouse `#resume`).

```bash
node .cursor/skills/apply-autofill/scripts/prepare-upload-chunks.js \
  pipeline/packets/<id>/resume.pdf \
  pipeline/packets/<id>/cover-letter.pdf \
  pipeline/prep/upload-chunks-<short>
```

Then via `browser_cdp` `Runtime.evaluate` (sequential chunks **or** oneshot `__r` base64):

```js
// after window.__r is full base64; resume name from prepare-upload-chunks (default Resume.pdf):
(() => {
  function b64ToFile(b64, name, type) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new File([bytes], name, { type });
  }
  const resumeName = 'Resume.pdf';
  const resume = b64ToFile(window.__r, resumeName, 'application/pdf');
  const input = document.getElementById('_systemfield_resume');
  const dt = new DataTransfer();
  dt.items.add(resume);
  input.files = dt.files;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  return { ok: true, files: input.files.length, name: input.files[0]?.name };
})()
```

**Verify:** UI shows upload filename + **Delete file** / **Replace** (not empty “Upload File”).

Optional top **Autofill from resume** file input is separate — uploading to `#_systemfield_resume` is enough; autofill may briefly show “Parsing…”.

## Location typeahead

Type city from profile/config → wait past **Loading…** → click exact option.

**Order tip:** clicking sponsorship / years Yes/No buttons can clear an in-progress location typeahead — set location **after** those screeners, or re-set if cleared.

## Auth Yes/No

Ashby uses button pairs with `_active_*` class + hidden checkboxes. Work auth and sponsorship from profile. Confirm `_active` on the intended buttons after click.

## Custom radio groups

Some reqs use **opacity-0** radio inputs — `browser_click` on the radio ref fails. Click the visible **label text** via CDP or snapshot-named element. Verify with `input[type=radio]:checked` count before unlock.

## Custom essays (React state)

**Critical:** bulk CDP `.value=` (or fill that only sets the DOM) on Ashby custom essay textareas can show text while React state stays empty → submit banner “Missing entry for required field” even though the textarea looks filled.

**Fix:**

1. `browser_type` each required essay with `clear: true` (prefer over raw `.value=`).
2. Eval [`scripts/ashby-react-sync.js`](../scripts/ashby-react-sync.js) via `browser_cdp` `Runtime.evaluate` — walks `__reactFiber*`, calls `onChange` with the current value.
3. Re-check: no “Your form needs corrections” / “Missing entry…” banner.

Follow **write-well** for essay prose (brevity vs adequate length; application-essay theater bans). Use the form’s paragraph budget with substance, not telegrams.

Some reqs show **three product-choice essays and say answer only one** — leave the other two blank.

## Custom diversity survey

Some reqs replace standard EEO with age/gender/ethnicity/community checkboxes — use label/radio CDP clicks; answer from profile or Decline.

## Listing gone

If Overview/Application tab missing or req removed → skip packet; do not substitute another title silently.

Full write-ups: [`../lessons.md`](../lessons.md) Ashby section
