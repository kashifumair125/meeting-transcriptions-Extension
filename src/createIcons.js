import fs from 'fs';
import { createCanvas } from 'canvas';
import { icons } from 'lucide';

const sizes = [16, 48, 128];

function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = '#4F46E5'; // Indigo color
  ctx.fillRect(0, 0, size, size);

  // Draw microphone icon
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = size / 16;
  const icon = icons.mic;
  const scale = size / 24; // Lucide icons are 24x24 by default
  ctx.scale(scale, scale);
  new Path2D(icon.path).forEach((cmd) => ctx[cmd.type].apply(ctx, cmd.args));
  ctx.stroke();

  return canvas.toBuffer();
}

sizes.forEach((size) => {
  const iconBuffer = createIcon(size);
  fs.writeFileSync(`icon${size}.png`, iconBuffer);
  console.log(`Created icon${size}.png`);
});