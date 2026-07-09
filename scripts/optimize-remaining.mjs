import sharp from 'sharp';
import { unlink, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets');

async function toWebp(inputRel, outputRel, maxWidth, quality, removeInput) {
  const inputPath = path.join(root, inputRel);
  const outputPath = path.join(root, outputRel);
  const tmp = `${outputPath}.opt.tmp`;
  let pipeline = sharp(inputPath).rotate();
  const meta = await pipeline.metadata();
  if (meta.width && meta.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }
  await pipeline.webp({ quality, effort: 6 }).toFile(tmp);
  if (removeInput && existsSync(inputPath)) await unlink(inputPath);
  if (existsSync(outputPath)) await unlink(outputPath);
  await rename(tmp, outputPath);
  console.log('wrote', outputRel);
}

await toWebp('about/Reconhecimento.png', 'about/Reconhecimento.webp', 304, 85, true);
await toWebp('locations/Maps.png', 'locations/Maps.webp', 1200, 82, true);
