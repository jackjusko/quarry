# Jobvite autofill

Hosts: `jobs.jobvite.com`, `*.jobvite.com`

## Reach the form

1. Open listing URL with `newTab: true` → lock that `viewId`
2. Click **Apply** (may land on `/job/<id>/apply` or open a modal → **View Full Application Form**)
3. Confirm the req is still live. If gone → skip packet

Jobvite is a **multi-step Angular** wizard. **Next →** is not submit. Final button is **Send Application** — submit only per apply-autofill submit policy.

## Contact (step 1)

| Field | Notes |
| --- | --- |
| First / Last / Email / Phone / City | `browser_fill` from candidate-profile. City = `YOUR_MAILING_CITY` or profile location when form asks |
| State | Native `<select>` — `browser_select_option` from profile `YOUR_STATE` |
| SMS consent | Optional; profile default OK |
| Employee referral | Radios often have `pointer-events: none` — click the **label** or CDP `label.click()`. Default **No** |
| LinkedIn | **Apply With LinkedIn** OAuth widget (iframe), not a URL field — leave as leftover unless user signs in |

## Attachments

Hidden file inputs: `#file-input-0` (resume, required) and `#file-input-1` (cover / additional files).

Native `onchange` is `angular.element(this).scope().change()` — that **uploads to S3**. DataTransfer + a **single** change trigger is enough.

```bash
node .cursor/skills/apply-autofill/scripts/prepare-upload-chunks.js \
  pipeline/packets/<id>/resume.pdf \
  pipeline/packets/<id>/cover-letter.pdf \
  pipeline/prep/upload-chunks-<slug>
```

Oneshot `__r` + `__c` then apply targeting `#file-input-0` / `#file-input-1`. **Do not** both `dispatchEvent(change)` and `scope.change()` — double attach (duplicate cover rows). If duplicates appear, click one **remove**.

**Verify (step 1 UI):** resume and cover upload names + remove links (defaults `Resume.pdf` / `Cover_Letter.pdf` or basenames from chunk script). After Next, cover shows in Angular `resources[]` with `fileKind: CoverLetter` + S3 URL; resume stays on `#file-input-0` (`files: 1`) and `errors.resume === false`.

## Later steps

- **EEO (voluntary):** from profile EEO fields when present (Gender radios + Race `<select>`). Veteran/disability often absent — skip if missing.
- **Screening:** native selects (`browser_select_option` Yes/No) + essay fields from form-answers + years rule.
- Persistent DOM alerts (“Please fill the required fields”) can stay in the tree even when valid — trust field values / `errors.resume`, not the alert node.

## Finish

1. CDP: contact in `applyData.fieldMap`, EEO in `applyData.eeo`, screening in `applyData.preScreeningFormMap`, cover in `resources`, resume `files: 1` on `#file-input-0`
2. Unlock; **do not** click **Send Application** unless submit policy allows
3. Leftovers: LinkedIn OAuth, invisible reCAPTCHA (may challenge on human submit)

## Pitfalls

- Apply link click may not navigate until `/apply` URL is used directly
- Greenhouse `#resume` / `#cover_letter` apply.js will miss Jobvite inputs
- `browser_click` on Jobvite radios fails (`pointer-events: none`) — use labels
- Verify `window.__r.length` matches PDF base64 length — stale chunks cause `atob` errors

Full write-ups: [`../lessons.md`](../lessons.md) Jobvite section
