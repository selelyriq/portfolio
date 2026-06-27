import sharp from 'sharp';
import { readdir, mkdir, copyFile } from 'fs/promises';
import { join, extname, basename } from 'path';

const SOURCE_DIR = './public/images/series-1';
const LANDING_DIR = './public/images/landing';
const BLUR_DIR = './public/images/landing-blur';

await mkdir(LANDING_DIR, { recursive: true });
await mkdir(BLUR_DIR, { recursive: true });

const files = (await readdir(SOURCE_DIR))
  .filter(f => ['.jpg', '.jpeg'].includes(extname(f).toLowerCase()));

console.log(`Processing ${files.length} images...\n`);

for (const file of files) {
  const input = join(SOURCE_DIR, file);
  const landingOut = join(LANDING_DIR, file);
  const blurOut = join(BLUR_DIR, file);

  // Main landing grid: 400px wide (covers retina 135px cells), quality 82
  await sharp(input)
    .resize(400, undefined, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(landingOut);

  // Blur layer: 80px square crop, quality 40
  await sharp(input)
    .resize(80, 80, { fit: 'cover' })
    .jpeg({ quality: 40, mozjpeg: true })
    .toFile(blurOut);

  console.log(`✓ ${basename(file)}`);
}

console.log(`\nDone.`);
console.log(`  Landing images → ${LANDING_DIR}`);
console.log(`  Blur thumbs   → ${BLUR_DIR}`);
