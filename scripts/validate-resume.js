import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const DEFAULT_INPUT = path.join(ROOT, "output", "tailored-resume.json");
const SCHEMA_PATH = path.join(ROOT, "schemas", "resume.schema.json");

async function main() {
  const inputPath = process.argv[2]
    ? path.resolve(process.cwd(), process.argv[2])
    : DEFAULT_INPUT;

  const [schemaRaw, resumeRaw] = await Promise.all([
    fs.readFile(SCHEMA_PATH, "utf8"),
    fs.readFile(inputPath, "utf8"),
  ]);

  const schema = JSON.parse(schemaRaw);
  const resume = JSON.parse(resumeRaw);

  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  if (!validate(resume)) {
    console.error(`Validation failed for ${path.relative(ROOT, inputPath)}:`);
    for (const err of validate.errors ?? []) {
      console.error(`  ${err.instancePath || "/"} ${err.message}`);
    }
    process.exit(1);
  }

  console.log(`Valid: ${path.relative(ROOT, inputPath)}`);
}

main().catch((err) => {
  if (err.code === "ENOENT") {
    console.error(
      "Resume JSON not found. Pass a path or write output/tailored-resume.json first."
    );
  } else {
    console.error(err.message || err);
  }
  process.exit(1);
});
