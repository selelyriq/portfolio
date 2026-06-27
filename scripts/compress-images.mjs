import sharp from 'sharp';
import { readdir, stat, rename } from 'fs/promises';
import { join, extname, basename } from 'path';

const IMAGE_DIR = './public/images';
const MAX_WIDTH = 2400;
const MAX_HEIGHT = 2400;
const JPEG_QUALITY = 85;

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getFiles(fullPath));
    } else if (['.jpg', '.jpeg'].includes(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

async function formatMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(1) + 'MB';
}

const files = await getFiles(IMAGE_DIR);
console.log(`Found ${files.length} JPEG files\n`);

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const { size: before } = await stat(file);
  totalBefore += before;

  const tmpFile = file + '.tmp';
  try {
    await sharp(file)
      .resize(MAX_WIDTH, MAX_HEIGHT, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(tmpFile);

    const { size: after } = await stat(tmpFile);
    totalAfter += after;

    await rename(tmpFile, file);

    const saved = (((before - after) / before) * 100).toFixed(0);
    console.log(`${basename(file)}: ${await formatMB(before)} → ${await formatMB(after)} (-${saved}%)`);
  } catch (err) {
    console.error(`Failed: ${file}: ${err.message}`);
    // clean up tmp if it exists
    try { await rename(tmpFile, file + '.err'); } catch {}
  }
}

console.log(`\nTotal: ${await formatMB(totalBefore)} → ${await formatMB(totalAfter)} (-${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0)}%)`);
