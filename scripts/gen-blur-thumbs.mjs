import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const INPUT_DIR = './public/images/series-1';
const OUTPUT_DIR = './public/images/blur-thumbs';

await mkdir(OUTPUT_DIR, { recursive: true });

const files = (await readdir(INPUT_DIR))
  .filter(f => ['.jpg', '.jpeg'].includes(extname(f).toLowerCase()));

console.log(`Generating ${files.length} blur thumbnails...\n`);

for (const file of files) {
  const input = join(INPUT_DIR, file);
  const output = join(OUTPUT_DIR, file);

  await sharp(input)
    .resize(80, 80, { fit: 'cover' })
    .jpeg({ quality: 40 })
    .toFile(output);

  console.log(`✓ ${basename(file)}`);
}

console.log(`\nDone. Thumbnails in ${OUTPUT_DIR}`);
