import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

async function renderCoverLetter(text, outputPath) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  
  let page = doc.addPage([612, 792]);
  const margin = 72;
  const width = 612 - margin * 2;
  let y = 792 - margin;

  const lines = text.split("\n");

  for (const line of lines) {
    if (y < margin + 20) {
      page = doc.addPage([612, 792]);
      y = 792 - margin;
    }

    if (!line.trim()) {
      y -= 12;
      continue;
    }

    // Simple wrap
    const words = line.split(" ");
    let currentLine = "";
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (font.widthOfTextAtSize(testLine, 11) < width) {
        currentLine = testLine;
      } else {
        page.drawText(currentLine, { x: margin, y, size: 11, font });
        y -= 14;
        currentLine = word;
        if (y < margin) {
          page = doc.addPage([612, 792]);
          y = 792 - margin;
        }
      }
    }
    page.drawText(currentLine, { x: margin, y, size: 11, font });
    y -= 14;
  }

  const pdfBytes = await doc.save();
  await fs.writeFile(outputPath, pdfBytes);
}

const text = await fs.readFile(process.argv[2], "utf8");
const output = process.argv[3] || "output/cover-letter.pdf";
await renderCoverLetter(text, output);
console.log(`Wrote ${output}`);
