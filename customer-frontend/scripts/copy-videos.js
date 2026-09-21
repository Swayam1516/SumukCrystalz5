const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'Videos');
const destDir = path.join(__dirname, '..', 'public', 'videos');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Named alias mappings
const mappings = [
  { src: 'Video 1.mp4', dest: 'video1.mp4' },
  { src: 'Video 2.mp4', dest: 'video2.mp4' },
  { src: 'Video 3.mp4', dest: 'video3.mp4' },
  { src: 'Video 4.mp4', dest: 'video4.mp4' },
  { src: 'Video 5.mp4', dest: 'video5.mp4' },
  { src: 'Video 6.mp4', dest: 'video6.mp4' },
  { src: 'Video 1.mp4', dest: 'amethyst.mp4' },
  { src: 'Video 2.mp4', dest: 'tigers-eye.mp4' },
  { src: 'Video 3.mp4', dest: 'rose-quartz.mp4' },
  { src: 'Video 4.mp4', dest: 'pyrite.mp4' },
  { src: 'Video 5.mp4', dest: 'labradorite.mp4' },
  { src: 'Video 6.mp4', dest: 'emerald.mp4' },
  { src: 'Video 1.mp4', dest: 'intro.mp4' },
];

if (fs.existsSync(srcDir)) {
  mappings.forEach(({ src, dest }) => {
    const srcFile = path.join(srcDir, src);
    const destFile = path.join(destDir, dest);
    if (fs.existsSync(srcFile)) {
      try {
        fs.copyFileSync(srcFile, destFile);
        console.log(`Copied ${src} -> ${dest}`);
      } catch (e) {}
    }
  });

  // Also copy all original named files directly
  try {
    const files = fs.readdirSync(srcDir);
    files.forEach((f) => {
      const srcFile = path.join(srcDir, f);
      const destFile = path.join(destDir, f);
      fs.copyFileSync(srcFile, destFile);
      console.log(`Direct synced: ${f}`);
    });
  } catch (e) {}
}

console.log('Video sync complete.');
