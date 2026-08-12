import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const EXTRACTED_PATH = path.join(ROOT, "experience", "extracted-from-resume.txt");
const POOL_PATH = path.join(ROOT, "experience", "pool.md");

const START_MARKERS = [
  /professional\s+experience/i,
  /work\s+experience/i,
  /employment\s+history/i,
  /relevant\s+experience/i,
  /experience\b/i,
];
const END_MARKERS = [
  /^education\b/i,
  /^technical\s+skills\b/i,
  /^skills\b/i,
  /^projects\b/i,
  /^certifications\b/i,
  /^licenses\b/i,
];

function findSectionBounds(text) {
  const normalized = text.replace(/\r\n/g, "\n");

  let startIndex = -1;
  for (const marker of START_MARKERS) {
    const match = normalized.match(marker);
    if (match?.index !== undefined) {
      startIndex = match.index + match[0].length;
      break;
    }
  }

  if (startIndex < 0) {
    throw new Error(
      "Could not find an Experience section in the PDF text. Paste the resume into chat for setup instead."
    );
  }

  const remainder = normalized.slice(startIndex);
  let endOffset = remainder.length;

  for (const line of remainder.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (END_MARKERS.some((m) => m.test(trimmed))) {
      endOffset = remainder.indexOf(line);
      break;
    }
  }

  return normalized.slice(startIndex, startIndex + endOffset).trim();
}

function normalizeExperienceText(raw) {
  const lines = raw.split("\n");
  const out = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (out.length && out[out.length - 1] !== "") out.push("");
      continue;
    }

    const isBullet = /^[●•\-*]\s/.test(trimmed) || /^[●•\-*]/.test(trimmed);
    const isRoleHeader =
      /\|\s*\d{4}\s*[–—-]/.test(trimmed) ||
      (trimmed.includes("|") && /\d{4}/.test(trimmed));

    if (isBullet || isRoleHeader) {
      out.push(trimmed);
      continue;
    }

    if (out.length === 0) {
      out.push(trimmed);
      continue;
    }

    const prev = out[out.length - 1];
    if (prev === "" || /^[●•\-*]/.test(prev) || /\|\s*\d{4}/.test(prev)) {
      out.push(trimmed);
    } else {
      out[out.length - 1] = `${prev} ${trimmed}`;
    }
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

async function main() {
  const argPath = process.argv[2];
  const pdfPath = argPath
    ? path.resolve(process.cwd(), argPath)
    : path.join(ROOT, "current-resume.pdf");

  const pdfBuffer = await fs.readFile(pdfPath);
  const { text } = await pdfParse(pdfBuffer);
  const section = normalizeExperienceText(findSectionBounds(text));

  await fs.mkdir(path.dirname(EXTRACTED_PATH), { recursive: true });
  await fs.writeFile(EXTRACTED_PATH, `${section}\n`, "utf8");
  console.log(`Wrote ${path.relative(ROOT, EXTRACTED_PATH)} from ${pdfPath}`);

  try {
    await fs.access(POOL_PATH);
    console.log(
      `${path.relative(ROOT, POOL_PATH)} already exists — left unchanged. Merge into pool via setup.`
    );
  } catch {
    const poolBody = `# Work experience pool

Add roles and bullets below. This file is the source of truth for tailoring resumes.

---

${section}
`;
    await fs.writeFile(POOL_PATH, poolBody, "utf8");
    console.log(`Created ${path.relative(ROOT, POOL_PATH)}`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
