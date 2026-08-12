#!/usr/bin/env node
/**
 * Prepare base64 chunk JS snippets for Cursor browser_cdp DataTransfer uploads.
 *
 * Usage:
 *   node scripts/prepare-upload-chunks.js path/to/resume.pdf path/to/cover.pdf [outdir] [resumeName] [coverName]
 *
 * Filename resolution (first match wins):
 *   1. 5th/6th CLI args (resumeName, coverName)
 *   2. RESUME_UPLOAD_NAME / COVER_UPLOAD_NAME env vars
 *   3. Basename of input PDFs (e.g. resume.pdf → resume.pdf)
 *   4. Defaults: Resume.pdf, Cover_Letter.pdf
 *
 * Writes outdir/r-NN.js and outdir/c-NN.js expressions that accumulate
 * window.__r / window.__c, plus apply.js that sets #resume and #cover_letter.
 * Agent runs each *.js via browser_cdp Runtime.evaluate in order, then apply.js.
 */
import fs from 'fs';
import path from 'path';

const resumePath = process.argv[2];
const coverPath = process.argv[3];
const outdir = process.argv[4] || path.join(process.cwd(), 'pipeline/prep/upload-chunks');
const resumeNameArg = process.argv[5];
const coverNameArg = process.argv[6];
const CHUNK = 1500;

if (!resumePath || !coverPath) {
  console.error(
    'Usage: prepare-upload-chunks.js <resume.pdf> <cover.pdf> [outdir] [resumeName] [coverName]'
  );
  process.exit(1);
}

function resolveUploadName(explicitArg, envVar, filePath, fallback) {
  if (explicitArg) return explicitArg;
  if (process.env[envVar]) return process.env[envVar];
  const base = path.basename(filePath);
  if (base) return base;
  return fallback;
}

const resumeName = resolveUploadName(
  resumeNameArg,
  'RESUME_UPLOAD_NAME',
  resumePath,
  'Resume.pdf'
);
const coverName = resolveUploadName(
  coverNameArg,
  'COVER_UPLOAD_NAME',
  coverPath,
  'Cover_Letter.pdf'
);

function chunksFor(label, filePath) {
  const b64 = fs.readFileSync(filePath).toString('base64');
  const parts = [];
  for (let i = 0; i < b64.length; i += CHUNK) parts.push(b64.slice(i, i + CHUNK));
  return { label, parts, bytes: fs.statSync(filePath).size, b64Len: b64.length };
}

fs.mkdirSync(outdir, { recursive: true });
const jobs = [
  chunksFor('r', resumePath),
  chunksFor('c', coverPath),
];

for (const { label, parts } of jobs) {
  parts.forEach((ch, i) => {
    const expr =
      i === 0
        ? `(() => { window.__${label} = ${JSON.stringify(ch)}; return window.__${label}.length; })()`
        : `(() => { window.__${label} += ${JSON.stringify(ch)}; return window.__${label}.length; })()`;
    fs.writeFileSync(path.join(outdir, `${label}-${String(i).padStart(2, '0')}.js`), expr);
  });
  fs.writeFileSync(path.join(outdir, `${label}-meta.txt`), String(parts.length));
}

const apply = `(() => {
  function b64ToFile(b64, name, type) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new File([bytes], name, { type });
  }
  function setFile(input, file) {
    if (!input) return { ok: false, err: 'missing ' + (input && input.id) };
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return { ok: true, name: file.name, size: file.size, files: input.files.length };
  }
  const resume = b64ToFile(window.__r, ${JSON.stringify(resumeName)}, 'application/pdf');
  const cover = b64ToFile(window.__c, ${JSON.stringify(coverName)}, 'application/pdf');
  const r = setFile(document.getElementById('resume') || document.querySelector('input[type=file][name=resume], input[type=file]#resume'), resume);
  const c = setFile(document.getElementById('cover_letter') || document.querySelector('input[type=file][name=cover_letter], input[type=file]#cover_letter'), cover);
  return JSON.stringify({ resume: r, cover: c, resumeName: ${JSON.stringify(resumeName)}, coverName: ${JSON.stringify(coverName)} }, null, 2);
})()`;
fs.writeFileSync(path.join(outdir, 'apply.js'), apply);

console.log('Wrote chunks to', outdir);
console.log(`  resume upload name: ${resumeName}`);
console.log(`  cover upload name: ${coverName}`);
for (const j of jobs) console.log(`  __${j.label}: ${j.parts.length} chunks, file ${j.bytes} bytes`);
console.log('Run each r-*.js then c-*.js via browser_cdp, then apply.js');
