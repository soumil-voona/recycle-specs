/**
 * One-time script: converts all JPEG/PNG images in public/imgs to WebP
 * using the sharp library. Original files are preserved.
 *
 * Usage: node scripts/convert-to-webp.mjs
 */
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMGS_DIR = join(__dirname, '../public/imgs');

async function getImageFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await getImageFiles(fullPath);
      files.push(...nested);
    } else {
      const ext = extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

async function convertToWebP(filePath) {
  const ext = extname(filePath);
  const webpPath = filePath.replace(ext, '.webp');

  try {
    await sharp(filePath)
      .webp({ quality: 82, effort: 6 })
      .toFile(webpPath);

    const origStat = await stat(filePath);
    const webpStat = await stat(webpPath);
    const savings = (((origStat.size - webpStat.size) / origStat.size) * 100).toFixed(1);
    console.log(`✓  ${basename(filePath)} → ${basename(webpPath)}  (${savings}% smaller)`);
  } catch (err) {
    console.error(`✗  Failed: ${filePath}`, err.message);
  }
}

async function main() {
  console.log('🖼  Converting images to WebP...\n');
  const files = await getImageFiles(IMGS_DIR);
  console.log(`Found ${files.length} image(s)\n`);
  await Promise.all(files.map(convertToWebP));
  console.log('\n✅  Done!');
}

main();
