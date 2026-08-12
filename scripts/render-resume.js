import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const DEFAULT_INPUT = path.join(ROOT, "output", "tailored-resume.json");
const DEFAULT_OUTPUT = path.join(ROOT, "output", "tailored-resume.pdf");

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const BASE_MARGIN = 48;
const CONTENT_WIDTH = PAGE_WIDTH - BASE_MARGIN * 2;
const MIN_SCALE = 0.78;
/** Minimum content fill of the letter page. Underfill means add pool-backed experience — do not stretch gaps. */
const MIN_FILL = 0.9;
const TARGET_FILL = 0.95;

const BASE_FONT_SIZES = {
  name: 15,
  contact: 9,
  section: 10.5,
  body: 9.5,
  role: 10,
};

const COLORS = {
  text: rgb(0.1, 0.1, 0.1),
  muted: rgb(0.35, 0.35, 0.35),
};

function outputPathFor(inputPath, explicitOutput) {
  if (explicitOutput) return path.resolve(process.cwd(), explicitOutput);
  if (inputPath.endsWith(".json")) {
    return inputPath.replace(/\.json$/i, ".pdf");
  }
  return DEFAULT_OUTPUT;
}

/** @param {import('pdf-lib').PDFFont} font */
function wrapText(text, font, fontSize, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  const lines = [];
  let current = words[0];

  for (let i = 1; i < words.length; i++) {
    const next = `${current} ${words[i]}`;
    if (font.widthOfTextAtSize(next, fontSize) <= maxWidth) {
      current = next;
    } else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  return lines;
}

function scaledLayout(scale) {
  const s = (value) => value * scale;
  return {
    scale,
    margin: BASE_MARGIN * scale,
    contentWidth: PAGE_WIDTH - BASE_MARGIN * scale * 2,
    fontSizes: {
      name: BASE_FONT_SIZES.name * scale,
      contact: BASE_FONT_SIZES.contact * scale,
      section: BASE_FONT_SIZES.section * scale,
      body: BASE_FONT_SIZES.body * scale,
      role: BASE_FONT_SIZES.role * scale,
    },
    sectionGapBefore: s(5),
    sectionGapAfter: s(1.5),
    roleGapAfter: s(3),
    bulletGapAfter: s(0.5),
    contactGap: s(5),
    nameGap: s(3),
  };
}

function lineBlockHeight(lineCount, fontSize, lineGap, layoutScale) {
  if (!lineCount) return 0;
  return lineCount * (fontSize + lineGap * layoutScale);
}

/** @param {import('pdf-lib').PDFFont} font */
function measureWrapped(text, font, fontSize, maxWidth, lineGap, layoutScale) {
  const lines = wrapText(text, font, fontSize, maxWidth);
  return {
    lines: lines.length,
    height: lineBlockHeight(lines.length, fontSize, lineGap, layoutScale),
  };
}

/** @param {object} resume @param {ReturnType<typeof scaledLayout>} layout @param {object} fonts */
function estimateHeight(resume, layout, fonts) {
  const { fontSizes, contentWidth, margin, scale } = layout;
  let height = margin;

  height += lineBlockHeight(
    1,
    fontSizes.name,
    layout.nameGap / scale,
    scale
  );

  const contactLine = formatContact(resume.contact);
  if (contactLine) {
    height += measureWrapped(
      contactLine,
      fonts.regular,
      fontSizes.contact,
      contentWidth,
      layout.contactGap / scale,
      scale
    ).height;
  }

  height += layout.sectionGapBefore;
  height += lineBlockHeight(
    1,
    fontSizes.section,
    layout.sectionGapAfter / scale,
    scale
  );
  height += measureWrapped(
    resume.summary,
    fonts.regular,
    fontSizes.body,
    contentWidth,
    2,
    scale
  ).height;

  height += layout.sectionGapBefore;
  height += lineBlockHeight(
    1,
    fontSizes.section,
    layout.sectionGapAfter / scale,
    scale
  );

  for (const job of resume.experience) {
    height += measureWrapped(
      formatRoleHeader(job),
      fonts.bold,
      fontSizes.role,
      contentWidth,
      2,
      scale
    ).height;

    const bulletIndent = 22 * scale;
    for (const bullet of job.bullets) {
      const wrapped = measureWrapped(
        bullet,
        fonts.regular,
        fontSizes.body,
        contentWidth - bulletIndent,
        2,
        scale
      );
      height += wrapped.height + layout.bulletGapAfter;
    }
    height += layout.roleGapAfter;
  }

  height += layout.sectionGapBefore;
  height += lineBlockHeight(
    1,
    fontSizes.section,
    layout.sectionGapAfter / scale,
    scale
  );
  for (const entry of resume.education) {
    height += measureWrapped(
      formatEducation(entry),
      fonts.regular,
      fontSizes.body,
      contentWidth,
      2,
      scale
    ).height;
  }

  height += layout.sectionGapBefore;
  height += lineBlockHeight(
    1,
    fontSizes.section,
    layout.sectionGapAfter / scale,
    scale
  );

  const skillLines = formatSkillLines(resume.skills);
  for (const line of skillLines) {
    height += measureWrapped(
      line,
      fonts.regular,
      fontSizes.body,
      contentWidth,
      2,
      scale
    ).height;
  }

  if (resume.aiWorkflow) {
    height += layout.sectionGapBefore;
    height += lineBlockHeight(
      1,
      fontSizes.section,
      layout.sectionGapAfter / scale,
      scale
    );
    height += measureWrapped(
      resume.aiWorkflow,
      fonts.regular,
      fontSizes.body,
      contentWidth,
      2,
      scale
    ).height;
  }

  height += margin;
  return height;
}

/** @param {object} resume @param {object} fonts */
function findLayout(resume, fonts) {
  const usableHeight = PAGE_HEIGHT;
  let lastLayout = scaledLayout(MIN_SCALE);
  for (let scale = 1; scale >= MIN_SCALE; scale -= 0.02) {
    const layout = scaledLayout(scale);
    lastLayout = layout;
    const estimated = estimateHeight(resume, layout, fonts);
    if (estimated <= usableHeight) {
      if (process.env.RESUME_DEBUG_FILL) {
        console.error(
          `fit: scale=${layout.scale.toFixed(2)} height=${Math.round(estimated)}/${usableHeight} (${Math.round((estimated / usableHeight) * 100)}%)`
        );
      }
      return layout;
    }
  }
  if (estimateHeight(resume, lastLayout, fonts) > usableHeight) {
    throw new Error(
      "Resume content exceeds one page even at minimum layout. Shorten summary, trim bullets on the least relevant role, or reduce skills lists."
    );
  }
  return lastLayout;
}

class PdfWriter {
  /** @param {import('pdf-lib').PDFDocument} doc @param {object} fonts @param {ReturnType<typeof scaledLayout>} layout */
  constructor(doc, fonts, layout) {
    this.doc = doc;
    this.fonts = fonts;
    this.layout = layout;
    this.page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT - layout.margin;
  }

  drawLine(text, { font, size, color = COLORS.text, indent = 0, lineGap = 2 }) {
    const width = this.layout.contentWidth - indent;
    const lines = wrapText(text, font, size, width);
    const lineHeight = size + lineGap * this.layout.scale;

    for (const line of lines) {
      this.page.drawText(line, {
        x: this.layout.margin + indent,
        y: this.y - size,
        size,
        font,
        color,
      });
      this.y -= lineHeight;
    }
  }

  drawSection(title) {
    this.y -= this.layout.sectionGapBefore;
    this.drawLine(title.toUpperCase(), {
      font: this.fonts.bold,
      size: this.layout.fontSizes.section,
      lineGap: this.layout.sectionGapAfter / this.layout.scale,
    });
    this.y -= this.layout.sectionGapAfter;
  }

  drawBullets(bullets) {
    const bulletIndent = 12 * this.layout.scale;
    const textIndent = 22 * this.layout.scale;
    const size = this.layout.fontSizes.body;

    for (const bullet of bullets) {
      const lines = wrapText(
        bullet,
        this.fonts.regular,
        size,
        this.layout.contentWidth - textIndent
      );

      for (let i = 0; i < lines.length; i++) {
        const lineHeight = size + 2 * this.layout.scale;
        if (i === 0) {
          this.page.drawText("•", {
            x: this.layout.margin + bulletIndent,
            y: this.y - size,
            size,
            font: this.fonts.regular,
            color: COLORS.text,
          });
        }

        this.page.drawText(lines[i], {
          x: this.layout.margin + textIndent,
          y: this.y - size,
          size,
          font: this.fonts.regular,
          color: COLORS.text,
        });
        this.y -= lineHeight;
      }
      this.y -= this.layout.bulletGapAfter;
    }
  }
}

function formatContact(contact) {
  const parts = [
    contact.location,
    contact.phone,
    contact.email,
    contact.website,
    contact.linkedin,
  ].filter(Boolean);
  return parts.join(" | ");
}

function formatRoleHeader(job) {
  const location = job.location ? ` | ${job.location}` : "";
  return `${job.company}${location} | ${job.title} | ${job.dates}`;
}

function formatEducation(entry) {
  const honors = entry.honors ? `, ${entry.honors}` : "";
  const parts = [`${entry.degree}${honors}`, entry.school];
  if (entry.dates) parts.push(entry.dates);
  return parts.join(" | ");
}

function formatSkillLines(skills) {
  const lines = [`${skills.primary.join(", ")}.`];
  if (skills.additional?.length) {
    lines.push(`Also: ${skills.additional.join(", ")}.`);
  }
  return lines;
}

/** @param {object} resume */
async function renderResumePdf(resume) {
  const doc = await PDFDocument.create();
  const fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
  };

  const layout = findLayout(resume, fonts);
  const w = new PdfWriter(doc, fonts, layout);
  const { fontSizes } = layout;

  w.drawLine(resume.contact.name, {
    font: fonts.bold,
    size: fontSizes.name,
    lineGap: layout.nameGap / layout.scale,
  });

  const contactLine = formatContact(resume.contact);
  if (contactLine) {
    w.drawLine(contactLine, {
      font: fonts.regular,
      size: fontSizes.contact,
      color: COLORS.muted,
      lineGap: layout.contactGap / layout.scale,
    });
  }

  w.drawSection("Professional Summary");
  w.drawLine(resume.summary, { font: fonts.regular, size: fontSizes.body });

  w.drawSection("Professional Experience");
  for (const job of resume.experience) {
    w.drawLine(formatRoleHeader(job), {
      font: fonts.bold,
      size: fontSizes.role,
      lineGap: 2,
    });
    w.drawBullets(job.bullets);
    w.y -= layout.roleGapAfter - layout.bulletGapAfter;
  }

  w.drawSection("Education");
  for (const entry of resume.education) {
    w.drawLine(formatEducation(entry), {
      font: fonts.regular,
      size: fontSizes.body,
      lineGap: 2,
    });
  }

  w.drawSection("Technical Skills");
  for (const line of formatSkillLines(resume.skills)) {
    w.drawLine(line, { font: fonts.regular, size: fontSizes.body });
  }

  if (resume.aiWorkflow) {
    w.drawSection("AI Workflow");
    w.drawLine(resume.aiWorkflow, { font: fonts.regular, size: fontSizes.body });
  }

  if (w.y < layout.margin) {
    throw new Error(
      "Resume content overflows one page. Shorten summary, trim bullets on the least relevant role, or reduce skills lists."
    );
  }

  const fillRatio = (PAGE_HEIGHT - w.y) / PAGE_HEIGHT;

  return {
    bytes: await doc.save(),
    pageCount: doc.getPageCount(),
    scale: layout.scale,
    fillRatio,
  };
}

async function main() {
  const inputPath = process.argv[2]
    ? path.resolve(process.cwd(), process.argv[2])
    : DEFAULT_INPUT;
  const outputPath = outputPathFor(
    inputPath,
    process.argv[3] ? path.resolve(process.cwd(), process.argv[3]) : null
  );

  const resume = JSON.parse(await fs.readFile(inputPath, "utf8"));
  const { bytes, pageCount, scale, fillRatio } = await renderResumePdf(resume);

  if (pageCount !== 1) {
    console.error(
      `Render produced ${pageCount} pages; single-page output is required. Trim content in the JSON.`
    );
    process.exit(1);
  }

  const fillPct = Math.round(fillRatio * 100);
  if (fillRatio < MIN_FILL) {
    console.error(
      `Resume only fills ~${fillPct}% of the page (need ≥${Math.round(MIN_FILL * 100)}%). Add pool-backed experience bullets or a JD-relevant optional role — do not stretch spacing.`
    );
    process.exit(1);
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, bytes);

  const scaleNote =
    scale < 1 ? ` (layout scale ${(scale * 100).toFixed(0)}%)` : "";
  const fillNote =
    fillRatio < TARGET_FILL
      ? ` — ~${fillPct}% full (target ~${Math.round(TARGET_FILL * 100)}%; deepen bullets if you can)`
      : ` — ~${fillPct}% full`;
  console.log(
    `Wrote ${path.relative(ROOT, outputPath)} — 1 page${scaleNote}${fillNote}`
  );

  if (scale <= MIN_SCALE + 0.001) {
    console.warn(
      "Warning: content is at minimum scale. Shorten summary, bullets, or skills for readability."
    );
  }
}

main().catch((err) => {
  if (err.code === "ENOENT") {
    console.error(
      "Resume JSON not found. Run the tailor-resume skill first or pass a JSON path."
    );
  } else {
    console.error(err.message || err);
  }
  process.exit(1);
});
