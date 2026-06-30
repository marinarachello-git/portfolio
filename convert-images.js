import fs from "fs";
import path from "path";
import sharp from "sharp";

const assetsDir = path.resolve("assets");
const skipFiles = new Set(["favicon.png"]);

async function convertFile(inputPath) {
  const ext = path.extname(inputPath);
  const outputPath = inputPath.replace(/\.(png|jpe?g)$/i, ".webp");

  if (fs.existsSync(outputPath)) {
    const inputStat = fs.statSync(inputPath);
    const outputStat = fs.statSync(outputPath);
    if (outputStat.mtimeMs >= inputStat.mtimeMs) {
      console.log("Skipped (up to date):", outputPath);
      return;
    }
  }

  const info = await sharp(inputPath).webp({ quality: 90 }).toFile(outputPath);
  console.log("Converted:", outputPath, `${info.width}x${info.height}`);
}

async function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await walk(fullPath);
      continue;
    }

    if (!/\.(png|jpe?g)$/i.test(entry.name)) continue;
    if (skipFiles.has(entry.name)) {
      console.log("Skipped favicon:", fullPath);
      continue;
    }

    await convertFile(fullPath);
  }
}

await walk(assetsDir);
