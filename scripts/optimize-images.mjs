/**
 * Otimiza assets raster sem alterar dimensões de exibição no layout.
 * Uso: npx --yes -p sharp node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import { readFile, writeFile, unlink, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets');

const jobs = [
  {
    in: 'services/EsteticaIntima.webp',
    maxWidth: 600,
    quality: 82,
  },
  {
    in: 'services/UltrassonografiaParaGuiar.webp',
    maxWidth: 600,
    quality: 82,
  },
  {
    in: 'services/UltrassonografiaDomiciliar.webp',
    maxWidth: 600,
    quality: 82,
  },
  {
    in: 'about/Reconhecimento.png',
    out: 'about/Reconhecimento.webp',
    maxWidth: 304,
    quality: 85,
    removeInput: true,
  },
  {
    in: 'locations/Maps.png',
    out: 'locations/Maps.webp',
    maxWidth: 1200,
    quality: 82,
    removeInput: true,
  },
  {
    in: 'brand/LogoTextoClaro.webp',
    maxWidth: 400,
    quality: 80,
  },
];

async function optimizeJob(job) {
  const inputPath = path.join(root, job.in);
  const outputPath = path.join(root, job.out ?? job.in);

  if (!existsSync(inputPath)) {
    console.warn(`skip (missing): ${job.in}`);
    return null;
  }

  const before = (await readFile(inputPath)).length;
  let pipeline = sharp(inputPath).rotate();

  const meta = await pipeline.metadata();
  if (meta.width && meta.width > job.maxWidth) {
    pipeline = pipeline.resize({ width: job.maxWidth, withoutEnlargement: true });
  }

  const buffer = await pipeline.webp({ quality: job.quality, effort: 6 }).toBuffer();
  const tempPath = `${outputPath}.opt.tmp`;
  await writeFile(tempPath, buffer);
  if (job.removeInput && outputPath !== inputPath && existsSync(inputPath)) {
    await unlink(inputPath);
  }
  await rename(tempPath, outputPath);

  const after = buffer.length;
  return { file: job.out ?? job.in, before, after };
}

const results = [];
for (const job of jobs) {
  const result = await optimizeJob(job);
  if (result) results.push(result);
}

for (const { file, before, after } of results) {
  const saved = ((1 - after / before) * 100).toFixed(1);
  console.log(
    `${file}: ${(before / 1024).toFixed(1)} KB → ${(after / 1024).toFixed(1)} KB (−${saved}%)`,
  );
}
