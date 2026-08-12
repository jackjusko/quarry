# Teamtailor (A-Players and company career sites)

Apply URL looks like `https://<company>.*.teamtailor.com/jobs/<id>-<slug>`. Form loads in a modal after **Apply now!**.

## Cookie wall

Accept cookies before **Apply now!** — the banner can sit over the apply button. One Apply now in the header is enabled; a floating one may stay disabled until the form loads.

## Form shape

- Screening questions first (text + Yes/No radios), then name/email.
- Resume: Dropzone on `#upload_resume_field` → hidden `candidate[resume_remote_url]` after S3 upload.
- Extra files: Dropzone on a `forms--inputs--upload` div (id like `id_<n>`) → `candidate[uploads_attributes][1][file_remote_url]`.
- Cover letter: **textarea** `#candidate_job_applications_attributes_0_cover_letter` (also upload cover PDF as additional file).
- Bot check: hidden `verify_token` (pre-filled). Hidden `ctoken` (`careersite--messenger-token`) often stays empty until submit — not a visible captcha. Do not block on empty `ctoken`.

## Uploads

`window.Dropzone` is usually undefined. The instance is on the Stimulus upload element (`element.dropzone`).

1. Prepare chunks as usual (`prepare-upload-chunks.js`).
2. Eval `r-*.js` then `c-*.js` sequentially.
3. `b64ToFile` → `document.getElementById('upload_resume_field').dropzone.addFile(resume)` and the extra-files field `.dropzone.addFile(cover)`.
4. Wait for `status: 'success'` and a `https://…s3…/tmpuploads/…` value on the remote_url inputs. UI shows filename + clear-file control.

Do **not** rely on Greenhouse `#resume` / `#cover_letter` apply.js.

## Submit

`data-remote` Turbo form POSTs to `/applications`. Success is a thanks URL:

`/jobs/<slug>/applications/<uuid>/thanks/<token>`

with body **Thanks for applying** / **We have received your application**. Optional **Connect** / reference prompts are post-submit talent-pool — skip unless asked.
