// compress-frames.mjs
// Converts all PNG frames to JPEG (quality 75) and the section images to WebP (quality 80)
// Run: node compress-frames.mjs

import sharp from 'sharp';
import { readdir, unlink, rename } from 'fs/promises';
import path from 'path';

const FRAMES_DIR = './public/frames';
const PUBLIC_DIR = './public';
const JPEG_QUALITY = 75;
const WEBP_QUALITY = 80;

async function compressFrames() {
  const files = await readdir(FRAMES_DIR);
  const pngs = files.filter(f => f.endsWith('.png'));

  console.log(`Converting ${pngs.length} frame PNGs → JPEG (q${JPEG_QUALITY})...`);
  let done = 0;

  await Promise.all(pngs.map(async (file) => {
    const src = path.join(FRAMES_DIR, file);
    const dest = path.join(FRAMES_DIR, file.replace('.png', '.jpg'));
    await sharp(src)
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(dest);
    await unlink(src); // remove original PNG
    done++;
    if (done % 20 === 0) console.log(`  ${done}/${pngs.length} done...`);
  }));

  console.log(`✓ All ${pngs.length} frames converted to JPEG.`);
}

async function compressSectionImages() {
  const sectionImgs = [
    'about-vision.png',
    'about-mission.png',
    'about-commit.png',
    'contact-image.png',
  ];

  console.log(`\nConverting ${sectionImgs.length} section images → WebP (q${WEBP_QUALITY})...`);

  for (const file of sectionImgs) {
    const src = path.join(PUBLIC_DIR, file);
    const dest = path.join(PUBLIC_DIR, file.replace('.png', '.webp'));
    await sharp(src)
      .webp({ quality: WEBP_QUALITY })
      .toFile(dest);
    await unlink(src);
    console.log(`  ✓ ${file} → ${path.basename(dest)}`);
  }
}

(async () => {
  try {
    await compressFrames();
    await compressSectionImages();
    console.log('\n✅ All done! Update your image references from .png → .jpg/.webp');
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
